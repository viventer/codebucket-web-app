export type PaddleEnvironment = "sandbox" | "production";

const COURSE_PRICE_IDS: Record<string, string | undefined> = {
  "css-basics": process.env.NEXT_PUBLIC_PADDLE_CSS_BASICS_PRICE_ID,
};

export function getPaddleEnvironment(): PaddleEnvironment {
  const env = process.env.NEXT_PUBLIC_PADDLE_ENV;
  if (env === "production") {
    return "production";
  }
  return "sandbox";
}

export function getPaddleClientToken(): string {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    throw new Error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not configured");
  }
  return token;
}

export function getPaddleApiKey(): string {
  const apiKey = process.env.PADDLE_API_KEY;

  if (!apiKey) {
    throw new Error("PADDLE_API_KEY is not configured");
  }

  return apiKey;
}

export function getPaddleWebhookSecret(): string {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("PADDLE_WEBHOOK_SECRET is not configured");
  }
  return secret;
}

export function getPriceIdForCourse(courseId: string): string | null {
  const priceId = COURSE_PRICE_IDS[courseId];
  if (!priceId) {
    return null;
  }
  return priceId;
}

export function isPurchasableCourse(courseId: string): boolean {
  return getPriceIdForCourse(courseId) !== null;
}
