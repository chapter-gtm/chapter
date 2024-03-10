import { type User } from "@/types/user";

export async function getUserProfile(token: string) {
  const response = await fetch("http://localhost:8000/api/me", {
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
