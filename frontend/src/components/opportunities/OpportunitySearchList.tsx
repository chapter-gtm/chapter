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

import { getFundingRoundColor } from "@/utils/chapter/funding"

import { BadgeColor } from "@/components/ui/badge-color"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { TabContentHeader } from "./TabContentHeader"

import { humanDate } from "@/utils/misc"
import { getIcps } from "@/utils/chapter/icp"

import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { Opportunity } from "@/types/opportunity"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "../ui/button-link"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { OpportunityStage } from "@/types/opportunity"
import { type Icp } from "@/types/icp"
import { FundingRound } from "@/types/company"

interface OpportunityPropListProps {
  opportunity: Opportunity
}

export function OpportunitySearchList({
  opportunity,
}: OpportunityPropListProps) {
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
      <div className="flex flex-col gap-y-4 pb-6 ps-2">
        <TabContentHeader>ICP Matches</TabContentHeader>
        <div className="flex flex-col gap-y-4">
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
              <span>
                <FileText width={18} />
              </span>
              <p>Docs / API</p>
            </div>

            <div className="flex flex-1 flex-wrap gap-x-2">
              {opportunity.company?.docsUrl !== undefined &&
              opportunity.company?.docsUrl !== null ? (
                <ButtonLink
                  onClick={() => handleDocLink(opportunity.company?.docsUrl)}
                >
                  Link
                </ButtonLink>
              ) : (
                <span className="font-medium">n/a</span>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
              <span>
                <Newspaper width={18} />
              </span>
              <p>Blog</p>
            </div>

            <div className="flex flex-1 flex-wrap gap-x-2">
              {opportunity.company?.blogUrl !== undefined &&
              opportunity.company?.blogUrl !== null ? (
                <ButtonLink
                  onClick={() => handleDocLink(opportunity.company?.blogUrl)}
                >
                  Link
                </ButtonLink>
              ) : (
                <span className="font-medium">n/a</span>
              )}
            </div>
          </div>

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
                    <ButtonLink
                      onClick={() =>
                        handleDocLink(opportunity.company?.changelogUrl)
                      }
                    >
                      {opportunity.company?.productLastReleasedAt &&
                        "Last Release: " +
                          humanDate(
                            new Date(opportunity.company?.productLastReleasedAt)
                          )}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </ButtonLink>
                    <p></p>
                  </div>
                </div>
              </>
            )}
          <Separator />
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
              <Layers width={18} />
              <p>Relevant Stack</p>
            </div>
            <div className="flex flex-row gap-x-2">
              {icp && icp.tool.include.length > 0 ? (
                opportunity.jobPosts
                  ?.flatMap((jobPost) => jobPost.tools)
                  .filter(
                    (tool) => tool && icp.tool.include.includes(tool.name)
                  )
                  .map((tool, index) => (
                    <div
                      key={index}
                      className="bg-popover dark:bg-muted text-primary font-medium px-2 py-1 text-xs rounded-md"
                    >
                      {tool && <div>{tool.name}</div>}
                    </div>
                  ))
              ) : (
                <p className="font-medium">n/a</p>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <Accordion type="single" collapsible className="w-full border-none">
              <AccordionItem value="stack">
                <AccordionTrigger className="pt-2 pb-4 flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400 self-start">
                  See full stack
                </AccordionTrigger>
                <AccordionContent className="flex flex-wrap gap-x-1 gap-y-1.5">
                  {opportunity.jobPosts
                    ?.flatMap((jobPost) => jobPost.tools)
                    .filter(
                      (tool) =>
                        tool && (!icp || !icp.tool.include.includes(tool.name))
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
                    ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Start of Relevant Process */}

          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
              <CircleCheckBig width={18} />
              <p>Relevant Workflow</p>
            </div>
            <div className="flex flex-row gap-x-2">
              {opportunity.jobPosts
                ?.flatMap((jobPost) => jobPost.processes)
                .filter(
                  (process) =>
                    icp && process && icp.process.include.includes(process.name)
                )
                .map((process) => process && process.name)
                .join(", ") ? (
                <div className="bg-popover dark:bg-muted text-primary font-medium px-2 py-1 text-xs rounded-md">
                  {opportunity.jobPosts
                    ?.flatMap((jobPost) => jobPost.processes)
                    .filter(
                      (process) =>
                        icp &&
                        process &&
                        icp.process.include.includes(process.name)
                    )
                    .map((process) => process?.name)
                    .join(", ")}
                </div>
              ) : (
                <p>n/a</p>
              )}
            </div>
          </div>

          {/* Start of additional Process */}
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400 self-start">
              <CircleCheckBig width={18} />
              <p>Mentioned processes</p>
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
        </div>
      </div>
    </>
  )
}
