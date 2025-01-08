"use server"

import { type RepoMetadata } from "@/types/repo"

export async function getGitHubRepoDetails(
  url: string
): Promise<RepoMetadata | null> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch repo details")
  }
  const data = await response.json()

  let lastReleasePublishDate: Date
  const releaseResponse = await fetch(url + "/releases")
  if (response.ok) {
    const releaseData = await releaseResponse.json()
    if (releaseData.length > 0 && releaseData[0].published_at) {
      lastReleasePublishDate = new Date(releaseData[0].published_at)
    }
  }

  const repo: RepoMetadata = {
    id: data.id.toString(),
    name: data.name,
    url: data.url,
    htmlUrl: data.html_url,
    description: data.description,
    language: data.language,
    stargazersCount: data.stargazers_count,
    watchersCount: data.watchers_count,
    forksCount: data.forks_count,
    topics: data.topics || null,
    createdAt: data.created_at ? new Date(data.created_at) : null,
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    pushedAt: data.pushed_at ? new Date(data.pushed_at) : null,
    lastReleasePublishDate: lastReleasePublishDate
      ? lastReleasePublishDate
      : null,
  }

  return repo
}
