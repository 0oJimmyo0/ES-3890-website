import Groq from "groq-sdk";

export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

export class GroqConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroqConfigurationError";
  }
}

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new GroqConfigurationError("GROQ_API_KEY is not configured.");
  }

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;

  return {
    client: new Groq({ apiKey }),
    model,
  };
}

