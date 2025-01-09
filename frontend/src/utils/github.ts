"use server"

import { type RepoMetadata } from "@/types/repo"
import { parseISO, differenceInWeeks } from "date-fns"

export async function getGitHubRepoDetails(url: string): Promise<RepoMetadata> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(await response.text())
  }
  const data = await response.json()

  // Fetch releases
  let lastReleasePublishDate: Date | null = null
  let releasesPerWeek: number = 0

  const releaseResponse = await fetch(url + "/releases")
  if (response.ok) {
    const releaseData = await releaseResponse.json()
    if (releaseData.length > 0 && releaseData[0].published_at) {
      lastReleasePublishDate = new Date(releaseData[0].published_at)
    }

    if (releaseData) {
      const releaseDates = releaseData.map((release: any) =>
        parseISO(release.published_at)
      )

      // Calculate release frequency per week
      const firstReleaseDate = releaseDates[0]
      const lastReleaseDate = releaseDates[releaseDates.length - 1]
      const totalWeeks = differenceInWeeks(firstReleaseDate, lastReleaseDate)

      if (totalWeeks === 0) {
        releasesPerWeek = releaseData.length
      } else {
        releasesPerWeek = releaseData.length / totalWeeks
      }
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
    lastReleasePublishedAt: lastReleasePublishDate,
    releasePublishAverageFrequencyPerWeek: Math.round(releasesPerWeek),
  }

  return repo
}
