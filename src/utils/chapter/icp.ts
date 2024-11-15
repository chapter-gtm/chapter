"use server";

import { getUserToken } from "@/utils/auth";
import { Icp } from "@/types/icp";

export async function getIcp() {
    const token = await getUserToken();

    const response = await fetch(
        process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/icps",
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
    return data as Icp;
}

export async function updateIcp(icp: Icp) {
    const token = await getUserToken();
    const response = await fetch(
        process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/icps/",
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify(icp),
        }
    );
    if (!response.ok) {
        const msg = await response.json();
        throw new Error(msg?.detail);
    }
    const data = await response.json();
    const updatedIcp = data as Icp;
    return updatedIcp;
}
