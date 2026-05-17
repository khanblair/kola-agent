import type { ToolCall, ToolResult } from './types';
import { searchMarketRatesTool } from '@/lib/tools/search-market-rates';
import { structureBriefTool } from '@/lib/tools/structure-brief';
import { fetchMatchedFreelancersTool } from '@/lib/tools/fetch-matched-freelancers';
import { scoreCandidateTool } from '@/lib/tools/score-candidate';
import { writeProposalTool } from '@/lib/tools/write-proposal';
import { notifyStakeholderTool } from '@/lib/tools/notify-stakeholder';
import { exportPdfTool } from '@/lib/tools/export-pdf';
import * as mutations from '@/lib/convex/mutations';
import { convex, api } from '@/lib/convex/client';

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

      case 'structure_brief': {
        output = await structureBriefTool(ctx.briefText);
        ctx.structuredScope = output;
        try {
          const parsed = JSON.parse(output);
          let parsedRates: any = undefined;
          if (ctx.marketRateData) {
            try {
              parsedRates = JSON.parse(ctx.marketRateData);
            } catch {
              parsedRates = { raw: ctx.marketRateData };
            }
          }
          await mutations.updateJobScope({
            jobId: ctx.jobId,
            structuredScope: parsed,
            marketRateData: parsedRates,
          });
        } catch {
          await mutations.updateJobScope({
            jobId: ctx.jobId,
            structuredScope: { raw: output },
          });
        }
        break;
      }

      case 'fetch_matched_freelancers':
        output = await fetchMatchedFreelancersTool(
          String(toolCall.arguments.job_description ?? ctx.briefText),
          String(toolCall.arguments.region ?? ctx.region ?? ''),
          toolCall.arguments.seniority as 'junior' | 'mid' | 'senior' | undefined,
        );
        break;

      case 'score_candidate': {
        const scoreJson = await scoreCandidateTool(
          String(toolCall.arguments.freelancer_id),
          String(
            toolCall.arguments.job_requirements ?? ctx.structuredScope ?? ctx.briefText,
          ),
          String(toolCall.arguments.market_rate_data ?? ctx.marketRateData ?? ''),
        );

        try {
          const parsed = JSON.parse(scoreJson);
          if (parsed.score !== undefined) {
            // Save match to database
            const matchId = await mutations.createMatch({
              jobId: ctx.jobId,
              freelancerId: String(toolCall.arguments.freelancer_id),
              score: Number(parsed.score),
              explanation: String(parsed.explanation ?? ''),
              skillGaps: Array.isArray(parsed.skillGaps) ? parsed.skillGaps : [],
              suggestedRateMin: Number(parsed.suggestedRateMin ?? 0),
              suggestedRateMax: Number(parsed.suggestedRateMax ?? 0),
            });

            // Update executor context
            if (!ctx.matchIds) ctx.matchIds = [];
            ctx.matchIds.push(matchId);

            // Track best match
            if (!ctx.bestMatchId) {
              ctx.bestMatchId = matchId;
            } else {
              const bestMatch = await convex.query(api.functions.matches.getById, { matchId: ctx.bestMatchId as any });
              if (bestMatch && Number(parsed.score) > bestMatch.score) {
                ctx.bestMatchId = matchId;
              }
            }

            parsed.matchId = matchId;
            output = JSON.stringify(parsed);
          } else {
            output = scoreJson;
          }
        } catch {
          output = scoreJson;
        }
        break;
      }

      case 'write_proposal': {
        const passedMatchId = String(toolCall.arguments.match_id ?? '');
        const targetMatchId = passedMatchId && passedMatchId.startsWith('j') && !passedMatchId.includes('job')
          ? passedMatchId
          : (ctx.bestMatchId ?? '');
        output = await writeProposalTool(
          targetMatchId,
          (toolCall.arguments.tone as 'professional' | 'confident' | 'friendly') ??
            'professional',
        );
        break;
      }

      case 'notify_stakeholder':
        output = await notifyStakeholderTool(
          toolCall.arguments.recipient_type as 'freelancer' | 'client',
          String(toolCall.arguments.message),
          (toolCall.arguments.channel as 'telegram' | 'whatsapp') ?? 'telegram',
          ctx.jobId,
          ctx.bestMatchId,
        );
        break;

      case 'export_pdf': {
        const passedMatchId = String(toolCall.arguments.match_id ?? '');
        const targetMatchId = passedMatchId && passedMatchId.startsWith('j') && !passedMatchId.includes('job')
          ? passedMatchId
          : (ctx.bestMatchId ?? '');
        output = await exportPdfTool(
          String(toolCall.arguments.job_id ?? ctx.jobId),
          targetMatchId,
        );
        break;
      }

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
