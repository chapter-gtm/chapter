import { type DataRecord } from "@/types/record";

const NECTAR_API_BASE = "https://api.nectar.run/api";

export async function getRecords(
  token: string,
  pageSize: number,
  currentPage: number,
) {
  const response = await fetch(
    NECTAR_API_BASE +
      "/records?" +
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
  const records = "items" in data ? (data["items"] as DataRecord[]) : [];
  return records;
}
