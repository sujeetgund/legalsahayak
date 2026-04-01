"use server";

type Demographics = {
  age: number;
  gender: string;
  location: string;
  education_level: string;
  job_title: string;
};

type ActionPlanStep = {
  title: string;
  description: string;
};

type SourcePassage = {
  source: string;
  quote: string;
  section?: string | null;
  relevance_score: number;
};

export type AssistantApiResponse = {
  answer: string;
  confidence: number;
  legal_references: string[];
  action_plan: ActionPlanStep[];
  source_passages?: SourcePassage[];
};

type AskAssistantPayload = {
  question: string;
  demographics: Demographics;
  preferred_language: string;
};

export async function askLegalAssistant(
  payload: AskAssistantPayload,
): Promise<AssistantApiResponse> {
  const backendBaseUrl = process.env.BACKEND_SERVER_URL;

  if (!backendBaseUrl) {
    throw new Error("BACKEND_SERVER_URL is not set");
  }

  const response = await fetch(`${backendBaseUrl}/api/v1/qa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`QA service error: ${response.status}`);
  }

  return (await response.json()) as AssistantApiResponse;
}
