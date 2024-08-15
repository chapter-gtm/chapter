import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { type User } from "@/types/user";

export async function getUserToken() {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) {
        redirect("/login");
    }

    return token;
}

export async function handleLogout() {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (token) {
        try {
            cookieStore.delete("token");
        } catch (_) {}
    }

    const userData = cookieStore.get("userData");
    if (userData) {
        try {
            cookieStore.delete("userData");
            return true;
        } catch (_) {}
    }

    return null;
}

export async function handleLogin(token: string, user: User | null = null) {
    const cookieStore = cookies();

    if (user) {
        cookieStore.set({
            name: "userData",
            value: JSON.stringify(user),
            path: "/",
            maxAge: 86400, // 24 hours
            httpOnly: true, // This prevents scripts from accessing
            sameSite: "strict",
        });
    }

    cookieStore.set({
        name: "token",
        value: token,
        path: "/", // Accessible site-wide
        maxAge: 86400, // 24-hours or whatever you like
        httpOnly: true, // This prevents scripts from accessing
        sameSite: "strict", // This does not allow other sites to access
    });
}
