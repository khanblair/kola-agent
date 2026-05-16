export const routes = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: '/dashboard',
  onboarding: '/onboarding',
  jobs: {
    new: '/jobs/new',
    detail: (jobId: string) => `/jobs/${jobId}`,
  },
  freelancer: {
    profile: '/freelancer/profile',
    uploadCv: '/freelancer/upload-cv',
  },
  matches: {
    detail: (matchId: string) => `/matches/${matchId}`,
  },
  proposals: {
    detail: (proposalId: string) => `/proposals/${proposalId}`,
  },
  api: {
    agentRun: '/api/agent/run',
    cvUpload: '/api/cv/upload',
    cvParse: '/api/cv/parse',
    jobsCreate: '/api/jobs/create',
    jobsPublish: '/api/jobs/publish',
    notifyTelegram: '/api/notify/telegram',
    notifyWhatsapp: '/api/notify/whatsapp',
    pdfExport: '/api/pdf/export',
    webhooksClerk: '/api/webhooks/clerk',
    embeddingsGenerate: '/api/embeddings/generate',
  },
} as const;
