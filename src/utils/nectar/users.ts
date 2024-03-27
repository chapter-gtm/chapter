import { type User } from "@/types/user";

const NECTAR_API_BASE = "https://api.nectar.run/api";

export async function getUserProfile(token: string) {
  const response = await fetch(NECTAR_API_BASE + "/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const user = data as User;
  return user;
}
