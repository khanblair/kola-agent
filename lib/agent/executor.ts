import type { ToolCall, ToolResult } from './types';
import { searchMarketRatesTool } from '@/lib/tools/search-market-rates';
import { structureBriefTool } from '@/lib/tools/structure-brief';
import { fetchMatchedFreelancersTool } from '@/lib/tools/fetch-matched-freelancers';
import { scoreCandidateTool } from '@/lib/tools/score-candidate';
import { writeProposalTool } from '@/lib/tools/write-proposal';
import { notifyStakeholderTool } from '@/lib/tools/notify-stakeholder';
import { exportPdfTool } from '@/lib/tools/export-pdf';

// Context passed between tool calls during a run
export interface ExecutorContext {
  jobId: string;
  clientId: string;
  briefText: string;
  region?: string;
  marketRateData?: string;
  structuredScope?: string;
  matchIds?: string[];
  bestMatchId?: string;
}

export async function executeTool(
  toolCall: ToolCall,
  ctx: ExecutorContext,
): Promise<ToolResult> {
  const startTime = Date.now();

  try {
    let output: string;

    switch (toolCall.name) {
      case 'search_market_rates':
        output = await searchMarketRatesTool(
          String(toolCall.arguments.project_type ?? ''),
          String(toolCall.arguments.skills ?? ''),
          String(toolCall.arguments.region ?? ctx.region),
        );
        ctx.marketRateData = output;
        break;

      case 'structure_brief':
        output = await structureBriefTool(ctx.briefText);
        ctx.structuredScope = output;
        break;

      case 'fetch_matched_freelancers':
        output = await fetchMatchedFreelancersTool(
          String(toolCall.arguments.job_description ?? ctx.briefText),
          String(toolCall.arguments.region ?? ctx.region ?? ''),
          toolCall.arguments.seniority as 'junior' | 'mid' | 'senior' | undefined,
        );
        break;

      case 'score_candidate':
        output = await scoreCandidateTool(
          String(toolCall.arguments.freelancer_id),
          String(
            toolCall.arguments.job_requirements ?? ctx.structuredScope ?? ctx.briefText,
          ),
          String(toolCall.arguments.market_rate_data ?? ctx.marketRateData ?? ''),
        );
        break;

      case 'write_proposal':
        output = await writeProposalTool(
          String(toolCall.arguments.match_id ?? ctx.bestMatchId ?? ''),
          (toolCall.arguments.tone as 'professional' | 'confident' | 'friendly') ??
            'professional',
        );
        break;

      case 'notify_stakeholder':
        output = await notifyStakeholderTool(
          toolCall.arguments.recipient_type as 'freelancer' | 'client',
          String(toolCall.arguments.message),
          (toolCall.arguments.channel as 'telegram' | 'whatsapp') ?? 'telegram',
          ctx.jobId,
          ctx.bestMatchId,
        );
        break;

      case 'export_pdf':
        output = await exportPdfTool(
          String(toolCall.arguments.job_id ?? ctx.jobId),
          String(toolCall.arguments.match_id ?? ctx.bestMatchId ?? ''),
        );
        break;

      default:
        output = `Unknown tool: ${toolCall.name}`;
    }

    return {
      toolCallId: toolCall.id,
      output,
      success: true,
    };
  } catch (error) {
    return {
      toolCallId: toolCall.id,
      output: error instanceof Error ? error.message : 'Tool execution failed',
      success: false,
    };
  }
}
