"use server"

import { getUserToken } from "@/utils/auth"
import { type User } from "@/types/user"

export async function getUsers(
  pageSize: number = 20,
  currentPage: number = 1,
  orderBy: string = "name",
  sortOrder: string = "asc",
  searchField: string = "",
  searchString: string = "",
  searchIgnoreCase: boolean = false
) {
  const token = await getUserToken()
  const searchParams: { [key: string]: any } = {
    pageSize: pageSize.toString(),
    currentPage: currentPage.toString(),
    orderBy: orderBy,
    sortOrder: sortOrder,
  }

  if (!!searchField && searchField.trim().length > 0) {
    searchParams["searchField"] = searchField
    searchParams["searchString"] = searchString
    searchParams["searchIgnoreCase"] = searchIgnoreCase ? "true" : "false"
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_CHAPTER_API_URL! +
      "/users?" +
      new URLSearchParams(searchParams),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  )
  if (!response.ok) {
    const msg = await response.json()
    return []
  }
  const data = await response.json()
  const users = "items" in data ? (data["items"] as User[]) : []
  return users
}

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
