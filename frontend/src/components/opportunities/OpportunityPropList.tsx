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
  Info,
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

import { humanDate } from "@/utils/misc"
import { getIcps } from "@/utils/chapter/icp"

import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { Opportunity } from "@/types/opportunity"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "../ui/button-link"
import { Badge } from "@/components/ui/badge"
import { TabContentHeader } from "./TabContentHeader"

import { toast } from "sonner"
import { OpportunityStage } from "@/types/opportunity"
import { type Icp } from "@/types/icp"
import { FundingRound } from "@/types/company"

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
      <div className="flex flex-col gap-y-4 pb-6 ps-2">
        <TabContentHeader>Account Info</TabContentHeader>

        <div className="flex flex-row items-start justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Info width={18} />
            <p>Description</p>
          </div>
          <p className="flex-1 font-medium ">
            {opportunity.company?.description}
          </p>
        </div>
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
          <BadgeColor
            color={getFundingRoundColor(
              opportunity.company?.lastFunding?.roundName
            )}
          >
            {opportunity.company?.lastFunding?.roundName}
          </BadgeColor>
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
              ? (() => {
                  const monthsAgo = Math.floor(
                    (Date.now() -
                      new Date(
                        opportunity.company.lastFunding.announcedDate
                      ).getTime()) /
                      (1000 * 60 * 60 * 24 * 30)
                  )
                  return monthsAgo < 24
                    ? `${monthsAgo} months ago`
                    : `${Math.floor(monthsAgo / 12)} years ago`
                })()
              : ""}
          </p>
        </div>
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <DollarSign width={18} />
            <p>Amount Raised</p>
          </div>
          <p className="font-medium">
            {opportunity.company?.lastFunding?.moneyRaised != null
              ? opportunity.company.lastFunding.moneyRaised >= 1000000
                ? `$${Math.round(
                    opportunity.company.lastFunding.moneyRaised / 1000000
                  )}M`
                : `$${
                    Math.round(
                      opportunity.company.lastFunding.moneyRaised / 100000
                    ) * 100
                  }K`
              : ""}
          </p>
        </div>
      </div>
    </>
  )
}
