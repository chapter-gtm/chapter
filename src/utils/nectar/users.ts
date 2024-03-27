import { type User } from "@/types/user";

// TODO: Enable HTTPS and get a wildcard cert for nectar.run
const NECTAR_API_BASE = "http://api.nectar.run/api";

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
