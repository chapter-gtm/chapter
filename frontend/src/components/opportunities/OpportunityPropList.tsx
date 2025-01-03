import {
  Factory,
  Users,
  Banknote,
  Landmark,
  ExternalLink,
  DollarSign,
  Calendar,
  FileText,
  Newspaper,
  Triangle,
  Layers,
  CircleCheckBig,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { humanDate } from "@/utils/misc"
import { getIcps } from "@/utils/chapter/icp"

import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { Opportunity } from "@/types/opportunity"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { OpportunityStage } from "@/types/opportunity"
import { type Icp } from "@/types/icp"

interface OpportunityPropListProps {
  opportunity: Opportunity
}

export function OpportunityPropList({ opportunity }: OpportunityPropListProps) {
  const [icp, setIcp] = useState<Icp | null>(null)
  const stages = Object.values(OpportunityStage)

  const handleDocLink = async (url: string | undefined | null) => {
    if (url === undefined || url === null) {
      return
    }
    window.open(url)
  }

  useEffect(() => {
    const fetchIcp = async () => {
      try {
        const currentUserIcps = await getIcps()
        if (currentUserIcps === null || currentUserIcps.length <= 0) {
          throw new Error("Failed to fetch ICP")
        }
        setIcp(currentUserIcps[0])
      } catch (error) {
        toast.error("Failed to get ICP.")
      }
    }

    fetchIcp()
  }, [])

  return (
    <>
      <div className="flex flex-col gap-y-4 py-6 ps-2">
        {opportunity.company?.docsUrl !== undefined &&
          opportunity.company?.docsUrl !== null && (
            <>
              <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
                <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
                  <span>
                    <FileText width={18} />
                  </span>
                  <p>Docs / API</p>
                </div>

                <div className="flex flex-1 flex-wrap gap-x-2">
                  <Button
                    onClick={() => handleDocLink(opportunity.company?.docsUrl)}
                    variant={"outline"}
                    className="px-3 py-2 text-sm items-center bg-transparent font-medium h-auto hover:bg-card dark:hover:bg-popover gap-x-1"
                  >
                    Link
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        {opportunity.company?.blogUrl !== undefined &&
          opportunity.company?.blogUrl !== null && (
            <>
              <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
                <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
                  <span>
                    <Newspaper width={18} />
                  </span>
                  <p>Blog</p>
                </div>

                <div className="flex flex-1 flex-wrap gap-x-2">
                  <Button
                    onClick={() => handleDocLink(opportunity.company?.blogUrl)}
                    variant={"outline"}
                    className="px-3 py-2 text-sm items-center bg-transparent font-medium h-auto hover:bg-card dark:hover:bg-popover gap-x-1"
                  >
                    Link
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        {opportunity.company?.changelogUrl !== undefined &&
          opportunity.company?.changelogUrl !== null && (
            <>
              <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
                <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
                  <span>
                    <Triangle width={18} />
                  </span>
                  <p>Changelog</p>
                </div>

                <div className="flex flex-1 flex-wrap gap-x-2">
                  <Button
                    onClick={() =>
                      handleDocLink(opportunity.company?.changelogUrl)
                    }
                    variant={"outline"}
                    className="px-3 py-2 text-sm items-center bg-transparent font-medium h-auto hover:bg-card dark:hover:bg-popover gap-x-1"
                  >
                    {opportunity.company?.productLastReleasedAt &&
                      "Last Release: " +
                        humanDate(
                          new Date(opportunity.company?.productLastReleasedAt)
                        )}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                  <p></p>
                </div>
              </div>
            </>
          )}
        <Separator />

        {icp && icp.tool.include.length > 0 && (
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
              <Layers width={18} />
              <p>Relevant Stack</p>
            </div>
            <div className="flex flex-row gap-x-2">
              {icp &&
                opportunity.jobPosts
                  ?.flatMap((jobPost) => jobPost.tools)
                  .filter(
                    (tool) => tool && icp.tool.include.includes(tool.name)
                  )
                  .map((tool, index) => (
                    <>
                      {tool && (
                        <div
                          key={index}
                          className="bg-popover dark:bg-muted text-primary font-medium px-2 py-1 text-xs rounded-md"
                        >
                          {tool.name}
                        </div>
                      )}
                    </>
                  ))}
            </div>
          </div>
        )}

        {icp && icp.process.include.length > 0 && (
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
              <CircleCheckBig width={18} />
              <p>Relevant Processes</p>
            </div>
            <div className="flex flex-row gap-x-2">
              {opportunity.jobPosts
                ?.flatMap((jobPost) => jobPost.processes)
                .filter(
                  (process) =>
                    process && icp.process.include.includes(process.name)
                )
                .map((process, index) => (
                  <>
                    {process && (
                      <div
                        key={index}
                        className="bg-popover dark:bg-muted text-primary font-medium px-2 py-1 text-xs rounded-md"
                      >
                        {process.name}
                      </div>
                    )}
                  </>
                ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400 self-start">
            <Layers width={18} />
            <p>Additional stack</p>
          </div>

          {icp &&
            opportunity &&
            Array.isArray(opportunity.jobPosts) &&
            opportunity.jobPosts.length > 0 &&
            opportunity.jobPosts[0]?.tools &&
            opportunity.jobPosts[0]?.tools?.length > 0 && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex border border-border rounded-lg dark:text-zinc-100 cursor-default px-2 py-1.5 text-sm items-center font-medium h-auto hover:bg-popover ">
                      See all
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="flex w-64 py-3 flex-wrap gap-2 border-none">
                    {icp
                      ? opportunity.jobPosts
                          ?.flatMap((jobPost) => jobPost.tools)
                          .filter(
                            (tool) =>
                              tool && !icp.tool.include.includes(tool.name)
                          )
                          .map((tool, index) => (
                            <>
                              {tool && (
                                <Badge
                                  key={index}
                                  variant={"outline"}
                                  className="border-border"
                                >
                                  {tool.name}
                                </Badge>
                              )}
                            </>
                          ))
                      : opportunity.jobPosts
                          ?.flatMap((jobPost) => jobPost.tools)
                          .map((tool, index) => (
                            <>
                              {tool && (
                                <Badge key={index} variant={"outline"}>
                                  {tool.name}
                                </Badge>
                              )}
                            </>
                          ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
        </div>

        <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400 self-start">
            <CircleCheckBig width={18} />
            <p>Additional processes</p>
          </div>

          {icp &&
            opportunity &&
            Array.isArray(opportunity.jobPosts) &&
            opportunity.jobPosts.length > 0 &&
            opportunity.jobPosts[0]?.processes &&
            opportunity.jobPosts[0]?.processes?.length > 0 && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex border border-border rounded-lg dark:text-zinc-100 cursor-default px-2 py-1.5 text-sm items-center font-medium h-auto hover:bg-popover ">
                      See all
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="flex w-64 py-3 flex-wrap gap-2 border-none">
                    {icp
                      ? opportunity.jobPosts
                          ?.flatMap((jobPost) => jobPost.processes)
                          .filter(
                            (process) =>
                              process &&
                              !icp.process.include.includes(process.name)
                          )
                          .map((process, index) => (
                            <>
                              {process && (
                                <Badge
                                  key={index}
                                  variant={"outline"}
                                  className="border-border"
                                >
                                  {process.name}
                                </Badge>
                              )}
                            </>
                          ))
                      : opportunity.jobPosts
                          ?.flatMap((jobPost) => jobPost.processes)
                          .map((process, index) => (
                            <>
                              {process && (
                                <Badge key={index} variant={"outline"}>
                                  {process.name}
                                </Badge>
                              )}
                            </>
                          ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
        </div>

        <Separator />
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Factory width={18} />
            <p>Industry</p>
          </div>
          <p className="font-medium">{opportunity.company?.industry}</p>
        </div>
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Users width={18} />
            <p>Headcount</p>
          </div>
          <p className="font-medium">
            {opportunity.company?.headcount?.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Users width={18} />
            <p>Eng size</p>
          </div>
          <p className="font-medium">
            {opportunity.company?.orgSize?.engineering?.toLocaleString()}
          </p>
        </div>
        <Separator />
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Landmark width={18} />
            <p>Funding</p>
          </div>
          <p className="font-medium">
            {opportunity.company?.lastFunding?.roundName}
          </p>
        </div>
        <div className="flex flex-row items-start justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Banknote width={18} />
            <p>Investors</p>
          </div>
          <div className="flex flex-1 flex-wrap gap-x-2">
            {opportunity.company?.lastFunding?.investors &&
              opportunity.company?.lastFunding.investors.length > 0 && (
                <p>{opportunity.company.lastFunding.investors.join(" · ")}</p>
              )}
          </div>
        </div>
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Calendar width={18} />
            <p>Last Funding Date</p>
          </div>
          <p className="font-medium">
            {opportunity.company?.lastFunding?.announcedDate
              ? humanDate(
                  new Date(opportunity.company?.lastFunding?.announcedDate),
                  false,
                  false,
                  true
                )
              : ""}
          </p>
        </div>
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <DollarSign width={18} />
            <p>Amount Raised</p>
          </div>
          <p className="font-medium">
            {opportunity.company?.lastFunding?.moneyRaised !== null
              ? opportunity.company?.lastFunding?.moneyRaised.toLocaleString()
              : ""}
          </p>
        </div>
      </div>
    </>
  )
}
