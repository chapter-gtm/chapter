import {
  ExternalLink,
  ChevronRight,
  Linkedin,
  Mail,
  Download,
  EyeIcon,
} from "lucide-react"
import { Separator } from "@radix-ui/react-select"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { timeAgo } from "@/utils/misc"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import { TabContentHeader } from "./TabContentHeader"
import {
  type Opportunity,
  type OpportunityJobPostContext,
  type OpportunityContext,
} from "@/types/opportunity"
import { type Repo, type RepoMetadata } from "@/types/repo"
import { downloadJobPostPdf, getJobPostPdf } from "@/utils/chapter/job_post"
import { getGitHubRepoDetails } from "@/utils/github"

import Link from "next/link"
import Image from "next/image"
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
      if (opportunity.repos && opportunity.repos.length > 0) {
        const githubRepo = await getGitHubRepoDetails(opportunity.repos[0].url)
        if (githubRepo) {
          setRepo(githubRepo)
        }
      }
    }

    fetchGitHubRepoDetails()
  }, [opportunity])

  return (
    <>
      <div className="flex flex-col px-2">
        <TabContentHeader>Sources</TabContentHeader>
        <Dialog open={!!jobPostPdfUrl} onOpenChange={closeJobPostModal}>
          <div className="flex flex-row justify-between rounded-lg p-6 items-center gap-x-3 border border-border bg-card dark:bg-popover w-full">
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
        {repo && (
          <div className="flex flex-row justify-between rounded-lg p-6 items-center gap-x-3 border border-border bg-card dark:bg-popover w-full">
            <div className="flex flex-col flex-1 overflow-hidden">
              <p className="text-base font-medium truncate text-ellipsis ">
                {repo.name}
              </p>
              <p className="flex text-sm text-muted-foreground text-zinc-500 dark:text-zinc-400">
                Last updated{" "}
                {repo.createdAt && timeAgo(new Date(repo.createdAt))}{" "}
              </p>
            </div>
            <div className="flex flex-row justify-end gap-x-2 items-center min-w-48">
              <DialogTrigger asChild>
                <Button variant="outline" onClick={openJobPostModal}>
                  View
                </Button>
              </DialogTrigger>
              <a target="_blank" rel="noopener noreferrer" href={repo.htmlUrl}>
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
