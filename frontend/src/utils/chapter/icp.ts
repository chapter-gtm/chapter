"use server"

import { getUserToken } from "@/utils/auth"
import { Icp } from "@/types/icp"

export async function getIcps(
  pageSize: number = 20,
  currentPage: number = 1,
  orderBy: string = "created_at",
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
      "/icps?" +
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
    throw new Error(msg?.detail)
  }
  const data = await response.json()
  const icps = "items" in data ? (data["items"] as Icp[]) : []
  return icps
}

export async function getIcp(id: string) {
  const token = await getUserToken()
  const response = await fetch(
    process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/icps" + id,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  )
  if (!response.ok) {
    const msg = await response.json()
    throw new Error(msg?.detail)
  }
  const data = await response.json()
  return data as Icp
}

export async function updateIcp(id: string, icp: Icp) {
  const token = await getUserToken()
  const response = await fetch(
    process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/icps/" + id,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(icp),
    }
  )
  if (!response.ok) {
    const msg = await response.json()
    throw new Error(msg?.detail)
  }
  const data = await response.json()
  const updatedIcp = data as Icp
  return updatedIcp
}
