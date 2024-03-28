import { parseISO } from "date-fns";
import { type Survey, type SurveyResponse } from "@/types/survey";

const NECTAR_API_BASE = "https://api.nectar.run/api";

export async function getSurveys(token: string) {
  const response = await fetch(NECTAR_API_BASE + "/surveys", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const surveys = "items" in data ? (data["items"] as Survey[]) : [];
  return surveys;
}

export async function getSurvey(token: string, id: string) {
  const response = await fetch(NECTAR_API_BASE + "/surveys/" + id, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const survey = data as Survey;
  return survey;
}

export async function getSurveyResponses(token: string, id: string) {
  const response = await fetch(
    NECTAR_API_BASE + "/surveys/" + id + "/responses",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const surveyResponses: SurveyResponse[] =
    "items" in data
      ? data["items"].map((item: any) => ({
          ...item,
          startedAt: parseISO(item.startedAt),
        }))
      : [];

  return surveyResponses;
}

export async function createSurvey(token: string) {
  const response = await fetch(NECTAR_API_BASE + "/surveys/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: "{}",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const survey = data as Survey;
  return survey;
}

export async function publishSurvey(token: string, surveyId: string) {
  const response = await fetch(
    NECTAR_API_BASE + "/surveys/" + surveyId + "/publications",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: "{}",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
}

export async function updateSurvey(token: string, survey: Survey) {
  const response = await fetch(NECTAR_API_BASE + "/surveys/" + survey.id, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(survey),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
}

export async function getSurveyResponse(
  token: string,
  surveyId: string,
  surveyResponseId: string,
) {
  const response = await fetch(
    NECTAR_API_BASE +
      "/api/surveys/" +
      surveyId +
      "/responses/" +
      surveyResponseId,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const surveyResponse = data as SurveyResponse;
  return surveyResponse;
}
