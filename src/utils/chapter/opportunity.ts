import { type Opportunity } from "@/types/opportunity";

export async function getOpportunities(
    token: string,
    pageSize: number = 20,
    currentPage: number = 1,
    orderBy: string = "started_at",
    sortOrder: string = "desc"
) {
    const response = await fetch(
        process.env.NEXT_PUBLIC_CHAPTER_API_URL! +
            "/opportunities?" +
            new URLSearchParams({
                pageSize: pageSize.toString(),
                currentPage: currentPage.toString(),
                orderBy: orderBy,
                sortOrder: sortOrder,
            }),
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (!response.ok) {
        const msg = await response.json();
        throw new Error(msg?.detail);
    }
    const data = await response.json();
    const opportunities =
        "items" in data ? (data["items"] as DataRecord[]) : [];
    return opportunities;
}
