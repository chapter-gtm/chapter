"use server"

import { getUserToken } from "@/utils/auth"
import { type User } from "@/types/user"

export async function getUserProfile() {
  const token = await getUserToken()
  const response = await fetch(
    process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  )
  if (!response.ok) {
    throw new Error("Failed to fetch data")
  }
  const data = await response.json()
  const user = data as User
  return user
}

export async function getUserJWTToken() {
  return await getUserToken()
}

export async function addOpportunityToRecentlyViewed(
  user: User,
  opportunityId: string
) {
  if (user.recentlyViewedOpportunityIds.includes(opportunityId)) {
    return
  }

  const updatedIds = [opportunityId, ...user.recentlyViewedOpportunityIds]
  const token = await getUserToken()
  const response = await fetch(
    process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/me",
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        recentlyViewedOpportunityIds: updatedIds.slice(0, 10),
      }),
    }
  )
  if (!response.ok) {
    const msg = await response.json()
    throw new Error(msg?.detail)
  }
}
