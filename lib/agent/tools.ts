export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

export const toolDefinitions: ToolDefinition[] = [
  {
    name: 'search_market_rates',
    description:
      'Search the web for real-time freelance market rates for a specific project type and region using Tavily. Returns current rate ranges from freelance platforms and industry reports. Use this BEFORE making any financial estimates.',
    parameters: {
      type: 'object',
      properties: {
        project_type: {
          type: 'string',
          description:
            'The type of project (e.g., "mobile app development", "UI/UX design", "full-stack web")',
        },
        skills: {
          type: 'string',
          description: 'Comma-separated list of key skills required',
        },
        region: {
          type: 'string',
          description:
            'Target region for rate lookup (e.g., "Uganda", "Kenya", "East Africa")',
        },
      },
      required: ['project_type', 'skills'],
    },
  },
  {
    name: 'structure_brief',
    description:
      'Parse a raw job brief into a structured scope document with deliverables, phases, timeline, required skills, and a scope clarity score from 0-100. Also identifies any red flags in the brief.',
    parameters: {
      type: 'object',
      properties: {
        brief_text: {
          type: 'string',
          description: 'The raw job brief text to structure',
        },
      },
      required: ['brief_text'],
    },
  },
  {
    name: 'fetch_matched_freelancers',
    description:
      'Search the freelancer database for candidates matching a job description using semantic vector similarity. Returns the top 3 matches with their full profiles, skills, and experience.',
    parameters: {
      type: 'object',
      properties: {
        job_description: {
          type: 'string',
          description:
            'The job description text to match against freelancer profiles',
        },
        region: {
          type: 'string',
          description: 'Optional region filter (uganda, kenya, nigeria, south-africa)',
        },
        seniority: {
          type: 'string',
          enum: ['junior', 'mid', 'senior'],
          description: 'Optional seniority level filter',
        },
      },
      required: ['job_description'],
    },
  },
  {
    name: 'score_candidate',
    description:
      'Score a single freelancer candidate against structured job requirements. Returns a numerical score (0-100), a plain-English explanation of fit, identified skill gaps, and a suggested rate range.',
    parameters: {
      type: 'object',
      properties: {
        freelancer_id: {
          type: 'string',
          description: 'The ID of the freelancer to score',
        },
        job_requirements: {
          type: 'string',
          description: 'Structured job requirements including skills, deliverables, and timeline',
        },
        market_rate_data: {
          type: 'string',
          description: 'The market rate data previously retrieved to ground the rate suggestion',
        },
      },
      required: ['freelancer_id', 'job_requirements'],
    },
  },
  {
    name: 'write_proposal',
    description:
      'Generate a tailored proposal for a matched freelancer. The proposal references the freelancer\'s specific past projects, addresses the exact deliverables, and uses the specified tone. Banned openers: generic "I am writing to express my interest" type phrases.',
    parameters: {
      type: 'object',
      properties: {
        match_id: {
          type: 'string',
          description: 'The ID of the match record',
        },
        tone: {
          type: 'string',
          enum: ['professional', 'confident', 'friendly'],
          description: 'The tone for the proposal (default: professional)',
        },
      },
      required: ['match_id'],
    },
  },
  {
    name: 'notify_stakeholder',
    description:
      'Send a notification message to either the matched freelancer or the client via their preferred channel (Telegram or WhatsApp). Logs the notification regardless of delivery success.',
    parameters: {
      type: 'object',
      properties: {
        recipient_type: {
          type: 'string',
          enum: ['freelancer', 'client'],
          description: 'Who to notify',
        },
        message: {
          type: 'string',
          description: 'The notification message to send',
        },
        channel: {
          type: 'string',
          enum: ['telegram', 'whatsapp'],
          description: 'Which channel to use (default: telegram)',
        },
      },
      required: ['recipient_type', 'message'],
    },
  },
  {
    name: 'export_pdf',
    description:
      'Package the complete agent output — scope report and proposal — into downloadable PDF documents. Returns download confirmation for both documents.',
    parameters: {
      type: 'object',
      properties: {
        job_id: {
          type: 'string',
          description: 'The job ID to export documents for',
        },
        match_id: {
          type: 'string',
          description: 'The match ID containing the proposal to export',
        },
      },
      required: ['job_id', 'match_id'],
    },
  },
];

export const toolNameMap = Object.fromEntries(
  toolDefinitions.map((t) => [t.name, t]),
) as Record<string, ToolDefinition>;
