"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { handleLogin, handleLogout } from "@/utils/auth";
import { type User } from "@/types/user";

export async function login(username: string, password: string) {
    try {
        const creds = new URLSearchParams();
        creds.append("username", username);
        creds.append("password", password);

        const response = await fetch(
            process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/access/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: creds.toString(),
            }
        );
        if (!response.ok) {
            const msg = await response.json();
            throw new Error(msg?.detail);
        }

        const data = await response.json();
        if (data) {
            await handleLogin(data.access_token);
        }
    } catch (error) {
        throw error;
    }
}

export async function logout() {
    try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/access/logout",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
    } catch (error) {
        throw error;
    } finally {
        handleLogout();
        revalidatePath("/", "layout");
        redirect("/login");
    }
}
