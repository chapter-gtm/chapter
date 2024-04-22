import { parseISO } from "date-fns";
import { type Insight } from "@/types/insight";

const NECTAR_API_BASE = "https://api.nectar.run/api";

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
  const insight = data as Insight;
  return insight;
}
