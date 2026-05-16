declare namespace NodeJS {
  interface ProcessEnv {
    DEEPSEEK_API_KEY: string;
    NEXT_PUBLIC_CONVEX_URL: string;
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    CLERK_WEBHOOK_SECRET?: string;
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string;
    TAVILY_API_KEY?: string;
    TELEGRAM_BOT_TOKEN?: string;
    TELEGRAM_TEST_CHAT_ID?: string;
    WPPCONNECT_SESSION_NAME?: string;
    WPPCONNECT_PORT?: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
  }
}
