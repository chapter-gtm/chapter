export type Repo = {
  id: string
  name: string
  url: string
  htmlUrl: string
  description: string | null
  language: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type RepoMetadata = {
  id: string
  name: string
  url: string
  htmlUrl: string
  description: string | null
  language: string | null
  stargazersCount: number | null
  watchersCount: number | null
  forksCount: number | null
  topics: string[] | null
  createdAt: Date | null
  updatedAt: Date | null
  pushedAt: Date | null
}
