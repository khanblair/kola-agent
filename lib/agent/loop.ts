import { getDeepSeekClient } from '@/lib/deepseek/client';
import { buildSystemPrompt } from './prompt';
import { toolDefinitions } from './tools';
import { executeTool, type ExecutorContext } from './executor';
import { createSSEStream, type AgentStream } from './stream';
import type { AgentTool, AgentStep, ToolCall, AgentRunResult } from './types';
import { agentConfig } from '@/config/agent';

export async function runAgentLoop(
  ctx: ExecutorContext,
): Promise<{ result: AgentRunResult; stream: ReadableStream }> {
  const sse = createSSEStream();
  const steps: AgentStep[] = [];
  const matchIds: string[] = [];

  const client = getDeepSeekClient();
  const systemPrompt = buildSystemPrompt({
    jobId: ctx.jobId,
    clientId: ctx.clientId,
    briefText: ctx.briefText,
    region: ctx.region,
  });

  const messages: { role: 'system' | 'user' | 'assistant' | 'tool'; content: string; tool_call_id?: string; name?: string }[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Run the full proposal workflow for this job brief:\n\n${ctx.briefText}` },
  ];

  const openaiTools = toolDefinitions.map((t) => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));

  let stepCount = 0;
  const maxSteps = agentConfig.maxSteps;
  const timeoutMs = agentConfig.timeoutMs;
  const startTime = Date.now();

  // Run in background so we can return the stream immediately
  const runPromise = (async () => {
    try {
      while (stepCount < maxSteps && Date.now() - startTime < timeoutMs) {
        stepCount++;

        const response = await client.chat.completions.create({
          model: 'deepseek-chat',
          messages: messages as any,
          tools: openaiTools as any,
          tool_choice: 'auto',
          temperature: 0.3,
        });

        const choice = response.choices[0];
        if (!choice) break;

        const assistantMessage = choice.message;

        // Add assistant message to history
        messages.push({
          role: 'assistant',
          content: assistantMessage.content ?? '',
          ...(assistantMessage.tool_calls
            ? {
                tool_calls: assistantMessage.tool_calls
                  .filter((tc): tc is Extract<typeof tc, { type: 'function' }> => tc.type === 'function')
                  .map((tc) => ({
                    id: tc.id,
                    type: 'function' as const,
                    function: {
                      name: tc.function.name,
                      arguments: tc.function.arguments,
                    },
                  })),
              }
            : {}),
        } as any);

        // If no tool calls, the agent is done
        if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
          break;
        }

        // Execute each tool call (filter to function-type only)
        const functionCalls = assistantMessage.tool_calls.filter(
          (tc): tc is Extract<typeof tc, { type: 'function' }> => tc.type === 'function',
        );

        for (const toolCall of functionCalls) {
          const toolName = toolCall.function.name as AgentTool;
          let toolArgs: Record<string, unknown>;
          try {
            toolArgs = JSON.parse(toolCall.function.arguments);
          } catch {
            toolArgs = {};
          }

          const toolCallObj: ToolCall = {
            id: toolCall.id,
            name: toolName,
            arguments: toolArgs,
          };

          sse.sendStepStart(toolName);
          const stepStart = Date.now();

          const result = await executeTool(toolCallObj, ctx);
          const duration = Date.now() - stepStart;

          // Track match IDs
          if (toolName === 'score_candidate' && result.success) {
            try {
              const parsed = JSON.parse(result.output);
              if (parsed.score !== undefined) {
                // Track candidates being scored
              }
            } catch {}
          }

          const step: AgentStep = {
            tool: toolName,
            status: result.success ? 'complete' : 'error',
            summary: extractSummary(toolName, result.output, result.success),
            duration,
            error: result.success ? undefined : result.output,
            timestamp: Date.now(),
          };
          steps.push(step);

          if (result.success) {
            sse.sendStepComplete(step);
          } else {
            sse.sendStepError(toolName, result.output);
          }

          // Add tool result to conversation
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: result.output,
          } as any);
        }
      }

      // Update job status
      sse.sendAgentComplete({
        jobId: ctx.jobId,
        matchIds,
        totalSteps: steps.length,
        totalDuration: Date.now() - startTime,
      });

      return {
        status: 'complete' as const,
        steps,
        jobId: ctx.jobId,
        matchIds,
      };
    } catch (error) {
      sse.sendAgentError(
        error instanceof Error ? error.message : 'Agent loop failed',
      );

      return {
        status: 'error' as const,
        steps,
        jobId: ctx.jobId,
        matchIds,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  })();

  const result = await runPromise;

  return { result, stream: sse.stream };
}

function extractSummary(
  tool: AgentTool,
  output: string,
  success: boolean,
): string {
  if (!success) return `Failed: ${output.slice(0, 100)}`;

  try {
    const parsed = JSON.parse(output);

    switch (tool) {
      case 'search_market_rates':
        return 'Market rate data retrieved';
      case 'structure_brief':
        return `Scope structured — ${parsed.deliverables?.length ?? 0} deliverables, score: ${parsed.scopeClarityScore ?? 'N/A'}`;
      case 'fetch_matched_freelancers':
        return 'Candidates retrieved via similarity search';
      case 'score_candidate':
        return `Scored ${parsed.score ?? 'N/A'}/100`;
      case 'write_proposal':
        return `Proposal generated — ${parsed.wordCount ?? 0} words`;
      case 'notify_stakeholder':
        return parsed.delivered ? 'Notification sent' : 'Notification logged (delivery pending)';
      case 'export_pdf':
        return 'PDF data packaged for export';
      default:
        return 'Tool completed';
    }
  } catch {
    return output.slice(0, 100);
  }
}
