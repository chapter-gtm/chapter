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
  Star,
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

import {
  Opportunity,
  OpportunityJobPostContext,
  OpportunityContext,
} from "@/types/opportunity"

import { StrengthLabel } from "./OpportunityStrengthLabel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { OpportunityStage } from "@/types/opportunity"
import { type Icp } from "@/types/icp"
import { Person } from "@/types/person"

interface OpportunityHighlightsProps {
  opportunity: Opportunity
}

export function OpportunityHighlights({
  opportunity,
}: OpportunityHighlightsProps) {
  const [icp, setIcp] = useState<Icp | null>(null)
  const stages = Object.values(OpportunityStage)

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

  const getMatchedSkills = (contact: Person, icp: Icp) => {
    return (
      contact.skills?.filter((skill) =>
        icp.tool.include.some(
          (tool) => tool.toLowerCase() === skill.toLowerCase()
        )
      ) || []
    )
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-y-4 py-3 px-4 ">
        {icp && icp.tool.include.length > 0 ? (
          <>
            <div className="flex flex-row justify-start items-center text-zinc-700 gap-2">
              <StrengthLabel variant={"good"}>High Signal</StrengthLabel>
              {/* <span className="w-[2px] h-7 rounded-md bg-muted"></span> */}

              {/* toolstack */}
              <div className="flex items-center gap-2">
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
                            className="bg-popover gap-1 flex items-center dark:bg-muted text-primary font-normal px-2 py-1 text-xs rounded-md border-[0.5px] border-muted dark:border-secondary/30"
                          >
                            <span className="w-1.5 h-1.5 rounded-md bg-violet-400"></span>
                            {tool.name}
                          </div>
                        )}
                      </>
                    ))}

                {/* Team size */}
                <p className="bg-popover dark:bg-muted text-primary font-normal px-2 py-1 text-xs rounded-md border-[0.5px] border-muted dark:border-secondary/30">
                  Eng size{" "}
                  {opportunity.company?.orgSize?.engineering?.toLocaleString()}
                </p>

                {/* Public API/Docs */}
                {opportunity.company?.docsUrl && (
                  <p className="bg-popover dark:bg-muted text-primary font-normal px-2 py-1 text-xs rounded-md border-[0.5px] border-muted dark:border-secondary/30">
                    Public Docs
                  </p>
                )}

                {/* Public Changelog */}
                {opportunity.company?.changelogUrl && (
                  <p className="bg-popover dark:bg-muted text-primary font-normal px-2 py-1 text-xs rounded-md border-[0.5px] border-muted dark:border-secondary/30">
                    Public Changelog
                  </p>
                )}

                {/* unique person */}
                {opportunity.contacts !== null &&
                  opportunity.contacts.length > 0 &&
                  opportunity.contacts.map((contact: Person, index) =>
                    contact.skills &&
                    contact.skills.length > 0 &&
                    icp &&
                    getMatchedSkills(contact, icp).length > 0 ? ( // Use the new function here
                      <span key={index}>
                        <div className="flex flex-inline gap-1 items-center font-medium px-2 py-1 text-xs rounded-md bg-popover dark:bg-muted text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-3"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {contact.fullName} |
                          <span>
                            {getMatchedSkills(contact, icp).join(", ")}
                          </span>
                        </div>
                      </span>
                    ) : null
                  )}

                {/* Funding */}
                {/* If opportunity funding date is less than 6 months, render the date here */}
                {opportunity.company?.lastFunding?.announcedDate
                  ? (() => {
                      const monthsAgo = Math.floor(
                        (Date.now() -
                          new Date(
                            opportunity.company.lastFunding.announcedDate
                          ).getTime()) /
                          (1000 * 60 * 60 * 24 * 30)
                      )
                      return monthsAgo < 7 ? (
                        <div className="flex flex-inline gap-1 items-center bg-yellow-400/50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 font-normal px-2 py-1 text-xs rounded-md border-[0.5px] border-yellow-400 dark:border-yellow-400">
                          <Star size={"13"} />
                          Just raised
                        </div>
                      ) : null
                    })()
                  : ""}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-row gap-2 animate-pulse">
            <div className="bg-popover dark:bg-muted w-20 h-[21px] rounded-md"></div>
            <div className="bg-popover dark:bg-muted w-1 h-[21px] rounded-md"></div>
            <div className="bg-popover dark:bg-muted w-20 h-[21px] rounded-md"></div>
            <div className="bg-popover dark:bg-muted w-20 h-[21px] rounded-md"></div>
          </div>
        )}
      </div>
    </>
  )
}
