import { ExternalLink, Download, Github, UserRoundSearch } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { timeAgo } from "@/utils/misc"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { TabContentHeader } from "./TabContentHeader"
import { type Opportunity } from "@/types/opportunity"
import { type RepoMetadata } from "@/types/repo"
import { downloadJobPostPdf, getJobPostPdf } from "@/utils/chapter/job_post"
import { getGitHubRepoDetails } from "@/utils/github"

import Link from "next/link"
import { useState, useEffect } from "react"

interface OpportunityDrawerProps {
  opportunity: Opportunity
}

export function OpportunitySources({ opportunity }: OpportunityDrawerProps) {
  const [jobPostPdfUrl, setJobPostPdfUrl] = useState("")
  const [repo, setRepo] = useState<RepoMetadata | null>(null)

  const handleDownload = async () => {
    if (
      opportunity === null ||
      opportunity.jobPosts === null ||
      opportunity.jobPosts.length <= 0
    ) {
      toast.error("Failed to find job post")
      return
    }
    try {
      if (!opportunity?.jobPosts?.[0]?.id) {
        throw new Error("No job post found!")
      }
      await downloadJobPostPdf(opportunity.jobPosts[0].id)
    } catch (error: any) {
      toast.error("Failed to fetch job post pdf", {
        description: error.toString(),
      })
    }
  }

  const openJobPostModal = async () => {
    try {
      if (!opportunity?.jobPosts?.[0]?.id) {
        throw new Error("No job post found!")
      }
      const url = await getJobPostPdf(opportunity.jobPosts[0].id)
      setJobPostPdfUrl(url)
    } catch (error: any) {
      toast.error("Failed to fetch job post pdf", {
        description: error.toString(),
      })
    }
  }

  const closeJobPostModal = () => {
    // Cleanup URL when closing the modal
    URL.revokeObjectURL(jobPostPdfUrl)
    setJobPostPdfUrl("")
  }

  useEffect(() => {
    const fetchGitHubRepoDetails = async () => {
      try {
        if (opportunity.repos && opportunity.repos.length > 0) {
          const githubRepo = await getGitHubRepoDetails(
            opportunity.repos[0].url
          )
          if (githubRepo) {
            setRepo(githubRepo)
          }
        }
      } catch (error: any) {
        toast.error("Failed to fetch repo details", {
          description: error.toString(),
        })
      }
    }

    fetchGitHubRepoDetails()
  }, [opportunity])

  return (
    <>
      <div className="flex flex-col px-2">
        <TabContentHeader>Sources</TabContentHeader>

        {opportunity.jobPosts && opportunity.jobPosts?.length > 0 && (
          <Dialog open={!!jobPostPdfUrl} onOpenChange={closeJobPostModal}>
            <div className="flex flex-row justify-between rounded-lg p-4 items-center gap-x-3 border border-border bg-card dark:bg-popover w-full">
              <DialogContent className="h-[800px] min-w-[900px] min-h-[900px] p-0 flex flex-col space-y-0 gap-0">
                <DialogHeader className="p-5 justify-center h-16 align-center">
                  <DialogTitle>{opportunity?.jobPosts?.[0]?.title}</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                {jobPostPdfUrl && (
                  <iframe
                    src={jobPostPdfUrl}
                    height="100%"
                    className="border w-full [min-h-800px]"
                    title="Job Post PDF"
                  />
                )}
              </DialogContent>
              <div className="flex flex-row gap-3">
                <span className="w-6 rounded-lg h-6 bg-green-600 flex place-items-center justify-center">
                  <UserRoundSearch size={15} />
                </span>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <p className="text-base font-medium truncate text-ellipsis ">
                    {opportunity?.jobPosts?.[0]?.title}
                  </p>
                  <p className="flex text-sm text-muted-foreground text-zinc-500 dark:text-zinc-400">
                    Added{" "}
                    {opportunity?.jobPosts?.[0]?.createdAt &&
                      timeAgo(new Date(opportunity.jobPosts[0].createdAt))}{" "}
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-end gap-x-2 items-center min-w-48">
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={openJobPostModal}>
                    View
                  </Button>
                </DialogTrigger>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={opportunity.jobPosts?.[0]?.url || undefined}
                >
                  <Button variant={"outline"}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>

                <Link href={""} onClick={handleDownload}>
                  <Button variant={"outline"}>
                    <Download className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col py-6"></div>
          </Dialog>
        )}
        {opportunity.repos && opportunity.repos?.length > 0 && (
          <div className="flex flex-row justify-between rounded-lg p-6 items-start gap-x-3 border border-border bg-card dark:bg-popover w-full">
            <div className="flex flex-row gap-3 flex-1">
              <span className="w-6 rounded-lg h-6 bg-yellow-600 flex place-items-center justify-center">
                <Github size={15} />
              </span>
              <div className="flex flex-col flex-1 overflow-hidden gap-2">
                <p className="text-base font-medium truncate text-ellipsis ">
                  {opportunity.repos[0].name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {repo && repo.topics && (
                    <>
                      {repo.topics.map((topic, index) => (
                        <p
                          key={index}
                          className="flex text-sm rounded-lg bg-popover dark:bg-muted py-0.5 px-1.5"
                        >
                          {topic}{" "}
                        </p>
                      ))}
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 items-center">
                  {repo && repo.updatedAt && (
                    <>
                      <p className="flex text-xs text-muted-foreground text-zinc-500 dark:text-zinc-400">
                        Last updated {timeAgo(new Date(repo.updatedAt))}{" "}
                      </p>
                      <span className="dark:text-secondary-foreground text-muted text-xs">
                        |
                      </span>
                    </>
                  )}
                  {repo && repo.watchersCount && (
                    <>
                      <p className="flex text-xs text-muted-foreground text-zinc-500 dark:text-zinc-400">
                        watchers {repo.watchersCount}
                      </p>
                      <span className="dark:text-secondary-foreground text-muted text-xs">
                        |
                      </span>
                    </>
                  )}
                  {repo && repo.lastReleasePublishedAt && (
                    <>
                      <p className="flex text-xs text-muted-foreground text-zinc-500 dark:text-zinc-400">
                        Last release{" "}
                        {timeAgo(new Date(repo.lastReleasePublishedAt))}{" "}
                      </p>
                      <span className="dark:text-secondary-foreground text-muted text-xs">
                        |
                      </span>
                    </>
                  )}
                  {repo &&
                    repo.releasePublishAverageFrequencyPerWeek !== null && (
                      <>
                        <p className="flex text-xs text-muted-foreground text-zinc-500 dark:text-zinc-400">
                          Release frequency{" "}
                          {repo.releasePublishAverageFrequencyPerWeek}
                          {" per week"}
                        </p>
                      </>
                    )}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-end gap-x-2 items-center min-w-24">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={opportunity.repos[0].htmlUrl}
              >
                <Button variant={"outline"}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
