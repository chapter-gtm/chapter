import {
  Loader,
  Factory,
  Users,
  Banknote,
  Landmark,
  Target,
  CircleUserIcon,
  Link,
  LinkedinIcon,
  Dot,
  Map,
  ExternalLink,
  Heart,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

import { AppleLogo } from "../icons"
import { GooglePlayLogo } from "../icons"

import { getIcp } from "@/utils/chapter/icp"

import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Opportunity } from "@/types/opportunity"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

import { OpportunityStage } from "@/types/opportunity"
import { updateOpportunityStage } from "@/utils/chapter/opportunity"

import { stageColors } from "@/types/opportunity"

import Image from "next/image"

interface OpportunityStageProps {
  opportunity: Opportunity
  updateOpportunity: (updatedOpportunity: Opportunity) => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function OpportunityStageList({
  opportunity,
  updateOpportunity,
}: OpportunityStageProps) {
  const [currentStage, setCurrentStage] = useState<OpportunityStage>(
    opportunity.stage
  )
  const stages = Object.values(OpportunityStage)

  const handleStageChange = async (newStage: string) => {
    try {
      if (!stages.includes(newStage as OpportunityStage)) {
        toast.error("Failed to set stage.")
        return
      }

      opportunity = await updateOpportunityStage(
        opportunity.id,
        newStage as OpportunityStage
      )
      setCurrentStage(opportunity.stage)
      updateOpportunity(opportunity)
    } catch (error: any) {
      toast.error("Failed to update stage.")
    }
  }

  useEffect(() => {
    setCurrentStage(opportunity.stage)
  }, [opportunity])

  useEffect(() => {
    const fetchIcp = async () => {
      try {
      } catch (error) {
        toast.error("Failed to get ICP.")
      }
    }

    fetchIcp()
  }, [])

  return (
    <>
      <div className="flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-200">
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-popover py-0.5 rounded-lg">
            <div className="cursor-pointer flex flex-row justify-start gap-x-2 items-center">
              <div
                className={classNames(
                  stageColors[opportunity.stage]?.color,
                  "flex ps-0.5 py-0.5 rounded-full hover:none focus-visible:ring-0 pr-2 items-center "
                )}
              >
                <span
                  className={classNames(
                    stageColors[opportunity.stage]?.highlight,
                    "h-1.5 w-1.5 rounded-full ms-1.5 me-1"
                  )}
                ></span>
                {currentStage}
              </div>
              <ChevronDown className="w-4 h-4 me-2" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover border-border">
            <DropdownMenuLabel>Set stage</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuRadioGroup
              value={currentStage}
              onValueChange={handleStageChange}
            >
              {stages.map((stage, index) => (
                <DropdownMenuRadioItem key={index} value={stage}>
                  {stage}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
