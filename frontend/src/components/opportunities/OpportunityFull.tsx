"use client"
import { useEffect, useState } from "react"
import TextEditor from "@/components/editor/editor"
import { type Icp } from "@/types/icp"
import { type Opportunity } from "@/types/opportunity"
import { getOpportunity } from "@/utils/chapter/opportunity"
import { OpportunityBrand } from "./OpportunityBrand"
import { getIcps } from "@/utils/chapter/icp"
import {
  getUserProfile,
  addOpportunityToRecentlyViewed,
} from "@/utils/chapter/users"
import { updateOpportunityNotes } from "@/utils/chapter/opportunity"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  NavTabsTrigger,
} from "@/components/ui/tabs"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import { Separator } from "@/components/ui/separator"

import { NotebookPen } from "lucide-react"

import { OpportunityStageList } from "./OpportunityStageList"
import { OpportunityTabs } from "./OpportunityTabs"
import { OpportunityOwner } from "./OpportunityOwner"
import { OpportunityHighlights } from "./OpportunityHighlight"
import { OpportunityMentions } from "./OpportunityMentions"

interface OpportunityFullProps {
  opportunityId: string
}

export function OpportunityFull({ opportunityId }: OpportunityFullProps) {
  const [icp, setIcp] = useState<Icp | null>(null)
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [endType, setEndType] = useState<Boolean | null>(null)

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const currentUserIcps = await getIcps()
        if (currentUserIcps === null || currentUserIcps.length <= 0) {
          throw new Error("Failed to fetch ICP")
        }
        setIcp(currentUserIcps[0])

        const opp = await getOpportunity(opportunityId)
        setOpportunity(opp)

        // Add opportunity to recently viewed list for user
        const user = await getUserProfile()
        await addOpportunityToRecentlyViewed(user, opp.id)
      } catch (error: any) {
        toast.error("Failed to fetch opportunity", {
          description: error.toString(),
        })
      }
    }
    fetchOpportunity()
  }, [opportunityId])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env
          .NEXT_PUBLIC_OPPORTUNITY_APP_URL!}/opportunitys/${opportunityId}`
      )
      toast.success("Opportunity link copied!")
    } catch (error: any) {
      toast.error("Copy opportunity link to clipboard failed", {
        description: error.toString(),
      })
    }
  }

  const updateOpportunity = (updatedOpportunity: Opportunity) => {
    setOpportunity(updatedOpportunity)
  }

  const onEditorContentChange = async (richText: string) => {
    if (opportunity === null) return
    const op = await updateOpportunityNotes(opportunity.id, richText)
    setOpportunity(op)

    const newContentLength = richText.length - (opportunity.notes?.length || 0)
    if (newContentLength >= 6) {
      setEndType(true)
      setTimeout(() => {
        setEndType(false)
      }, 3000)
    }
  }

  return (
    <>
      <Toaster theme="light" />
      {opportunity !== null && (
        <div className="bg-background pt-24 p-6 flex flex-1 overflow-hidden">
          <div className="flex flex-col flex-1 bg-card rounded-lg border border-border overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sticky top-0 z-20 w-full border-b border-border">
              <div className="flex flex-row justify-between items-center px-4 py-3">
                <OpportunityBrand opportunity={opportunity} />

                <div className="flex flex-row gap-x-1 items-center">
                  <OpportunityOwner
                    opportunity={opportunity}
                    updateOpportunity={updateOpportunity}
                  />
                  <OpportunityStageList
                    opportunity={opportunity}
                    updateOpportunity={updateOpportunity}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start border-t border-border bg-popover/30 dark:bg-popover">
                <OpportunityHighlights opportunity={opportunity} />

                <OpportunityMentions opportunity={opportunity} size={"large"} />
              </div>
            </div>

            <div className="flex flex-1 flex-row overflow-hidden ">
              {/* Left side */}
              <div className="basis-1/2 border-e border-border">
                <OpportunityTabs opportunity={opportunity} icp={icp} />
              </div>

              {/* Right side */}
              <div className="flex-1 overflow-hidden">
                <div className="flex flex-row justify-between items-center border-b border-border px-4 h-14">
                  <div className="border-b border-primary rounded-none h-14 py-2.5">
                    <div className="text-sm font-normal px-2.5 py-1.5 items-center flex flex-inline gap-1.5 dark:bg-popover border border-border rounded-xl">
                      <NotebookPen size={"13"} />
                      Notes
                    </div>
                  </div>
                  {endType && (
                    <>
                      <div className="px-2 py-1.5 bg-popover text-sm rounded-lg">
                        Auto saved..
                      </div>
                    </>
                  )}
                </div>
                <div className="h-full w-full">
                  {/* <TabsContent value="opNotes"> */}
                  <TextEditor
                    content={opportunity.notes}
                    onChange={onEditorContentChange}
                  />
                  {/* </TabsContent> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
