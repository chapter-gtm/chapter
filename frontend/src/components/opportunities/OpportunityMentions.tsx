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
  size: String
}

export function OpportunityMentions({
  opportunity,
  size,
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
    return contact.skills?.filter((skill) =>
      icp.tool.include.some(
        (tool) => tool.toLowerCase() === skill.toLowerCase()
      )
    )
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-y-4 py-3 px-4">
        {icp && icp.tool.include.length > 0 ? (
          <div className="flex flex-row gap-5">
            {opportunity?.context !== null &&
              opportunity?.context.jobPost.length > 0 && (
                <div
                  className={`flex-1 border-secondary-foreground/40 rounded-2xl gap-4 grid ${
                    size === "large" ? "grid-cols-3" : "grid-cols-1"
                  }`}
                >
                  {opportunity?.context?.jobPost.map(
                    (
                      jobPostContext: OpportunityJobPostContext,
                      index: number
                    ) => (
                      <div key={index}>
                        <ul className="">
                          <li className="col-span-1 border-l-2 px-3 border-secondary-foreground/50">
                            {/* <span className="min-w-1 h-auto bg-primary rounded-lg"></span> */}
                            <p className="text-base dark:text-secondary font-light">
                              {jobPostContext.sentence}
                            </p>
                          </li>
                        </ul>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
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
