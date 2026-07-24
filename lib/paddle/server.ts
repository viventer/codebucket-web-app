import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { getPaddleApiKey, getPaddleEnvironment } from "@/lib/paddle/config";

let paddleClient: Paddle | null = null;

export function getPaddleServer(): Paddle {
  if (paddleClient) {
    return paddleClient;
  }

  const environment =
    getPaddleEnvironment() === "production"
      ? Environment.production
      : Environment.sandbox;

  paddleClient = new Paddle(getPaddleApiKey(), { environment });
  return paddleClient;
}
