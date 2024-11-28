"use server";

import { getUserToken } from "@/utils/auth";
import { type Opportunity, OpportunityStage } from "@/types/opportunity";

export async function getOpportunities(
    pageSize: number = 20,
    currentPage: number = 1,
    orderBy: string = "created_at",
    sortOrder: string = "desc",
    searchField: string = "",
    searchString: string = "",
    searchIgnoreCase: boolean = false
) {
    const token = await getUserToken();
    const searchParams: { [key: string]: any } = {
        pageSize: pageSize.toString(),
        currentPage: currentPage.toString(),
        orderBy: orderBy,
        sortOrder: sortOrder,
    };

    if (!!searchField && searchField.trim().length > 0) {
        searchParams["searchField"] = searchField;
        searchParams["searchString"] = searchString;
        searchParams["searchIgnoreCase"] = searchIgnoreCase ? "true" : "false";
    }

    const response = await fetch(
        process.env.NEXT_PUBLIC_CHAPTER_API_URL! +
            "/opportunities?" +
            new URLSearchParams(searchParams),
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        }
    );
    if (!response.ok) {
        const msg = await response.json();
        return [];
    }
    const data = await response.json();
    const opportunities =
        "items" in data ? (data["items"] as Opportunity[]) : [];
    return opportunities;
}

export async function getOpportunity(id: string) {
    const token = await getUserToken();
    const response = await fetch(
        process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/opportunities/" + id,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        }
    );
    if (!response.ok) {
        const msg = await response.json();
        throw new Error(msg?.detail);
    }
    const data = await response.json();
    const opportunity = data as Opportunity;
    return opportunity;
}

export async function updateOpportunityStage(
    id: string,
    newStage: OpportunityStage
) {
    const token = await getUserToken();
    const response = await fetch(
        process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/opportunities/" + id,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify({
                stage: newStage,
            }),
        }
    );
    if (!response.ok) {
        const msg = await response.json();
        throw new Error(msg?.detail);
    }
    const data = await response.json();
    const opportunity = data as Opportunity;
    return opportunity;
}

export async function updateOpportunityNotes(id: string, notes: string) {
    const token = await getUserToken();
    const response = await fetch(
        process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/opportunities/" + id,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify({
                notes: notes,
            }),
        }
    );
    if (!response.ok) {
        const msg = await response.json();
        throw new Error(msg?.detail);
    }
    const data = await response.json();
    const opportunity = data as Opportunity;
    return opportunity;
}
