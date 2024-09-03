"use server";

import { getUserToken } from "@/utils/auth";
import { type User } from "@/types/user";

export async function getUserProfile() {
    const token = await getUserToken();
    const response = await fetch(
        process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/me",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        }
    );
    if (!response.ok) {
        console.log("Failed to get user profile");
        throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    const user = data as User;
    return user;
}

export async function getUserJWTToken() {
    return await getUserToken();
}
