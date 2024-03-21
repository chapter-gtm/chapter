import { type User } from "@/types/user";

const NECTAR_API_BASE = "http://api.nectar.run";

export async function getUserProfile(token: string) {
  const response = await fetch(NECTAR_API_BASE + "/api/me", {
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
