import { parseISO } from "date-fns";
import { type Insight, type InsightMetadata } from "@/types/insight";

const NECTAR_API_BASE = "https://api.nectar.run/api";

export async function getInsights(
  token: string,
  pageSize: number,
  currentPage: number,
) {
  const response = await fetch(
    NECTAR_API_BASE +
      "/insights?" +
      new URLSearchParams({
        pageSize: pageSize.toString(),
        currentPage: currentPage.toString(),
      }),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const msg = await response.json();
    throw new Error(msg?.detail);
  }
  const data = await response.json();
  const insights = "items" in data ? (data["items"] as InsightMetadata[]) : [];
  return insights;
}

export async function getInsight(token: string, id: string) {
  const response = await fetch(NECTAR_API_BASE + "/insights/" + id, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const msg = await response.json();
    throw new Error(msg?.detail);
  }
  const data = await response.json();
  const insight = data as Insight;
  return insight;
}

export async function generateInsights(token: string, recordIds: string[]) {
  const response = await fetch(NECTAR_API_BASE + "/insights/generate/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recordIds: recordIds }),
  });
  if (!response.ok) {
    const msg = await response.json();
    throw new Error(msg?.detail);
  }
  const data = await response.json();
  const insights = data.items as Insight[];
  return insights;
}
