"use client";
import { useEffect, useState } from "react";

import TextEditor from "@/components/editor/editor";
import { type Icp } from "@/types/icp";
import { type Opportunity } from "@/types/opportunity";
import { getOpportunity } from "@/utils/chapter/opportunity";
import { OpportunityBrand } from "./OpportunityBrand";
import { getIcps } from "@/utils/chapter/icp";
import {
  getUserProfile,
  addOpportunityToRecentlyViewed,
} from "@/utils/chapter/users";
import { updateOpportunityNotes } from "@/utils/chapter/opportunity";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";

import { OpportunityStageList } from "./OpportunityStageList";
import { OpportunityTabs } from "./OpportunityTabs";

interface OpportunityFullProps {
  opportunityId: string;
}

export function OpportunityFull({ opportunityId }: OpportunityFullProps) {
  const [icp, setIcp] = useState<Icp | null>(null);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [endType, setEndType] = useState<Boolean | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const currentUserIcps = await getIcps();
        if (currentUserIcps === null || currentUserIcps.length <= 0) {
          throw new Error("Failed to fetch ICP");
        }
        setIcp(currentUserIcps[0]);

        const opp = await getOpportunity(opportunityId);
        setOpportunity(opp);

        // Add opportunity to recently viewed list for user
        const user = await getUserProfile();
        await addOpportunityToRecentlyViewed(user, opp.id);
      } catch (error: any) {
        toast.error("Failed to fetch opportunity", {
          description: error.toString(),
        });
      }
    };
    fetchOpportunity();
  }, [opportunityId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env
          .NEXT_PUBLIC_OPPORTUNITY_APP_URL!}/opportunitys/${opportunityId}`
      );
      toast.success("Opportunity link copied!");
    } catch (error: any) {
      toast.error("Copy opportunity link to clipboard failed", {
        description: error.toString(),
      });
    }
  };

  const updateOpportunity = (updatedOpportunity: Opportunity) => {
    setOpportunity(updatedOpportunity);
  };

  const onEditorContentChange = async (richText: string) => {
    if (opportunity === null) return;
    const op = await updateOpportunityNotes(opportunity.id, richText);
    setOpportunity(op);

    const newContentLength = richText.length - (opportunity.notes?.length || 0);
    if (newContentLength >= 6) {
      setEndType(true);
      setTimeout(() => {
        setEndType(false);
      }, 3000);
    }
  };

  return (
    <>
      <Toaster theme="light" />
      {opportunity !== null && (
        <div className="bg-background pt-24 p-6 flex flex-1 overflow-hidden">
          <div className="flex flex-row flex-1 bg-card rounded-lg overflow-hidden border border-border">
            <div className="basis-[520px] overflow-y-scroll border-e border-border ">
              <div className="flex flex-col ">
                <div className="flex flex-row sticky top-0 bg-card justify-between items-center px-3 py-3.5">
                  <div className="text-sm text-zinc-400">
                    {opportunity.slug}
                  </div>
                  <OpportunityStageList
                    opportunity={opportunity}
                    updateOpportunity={updateOpportunity}
                  />
                </div>
                <Separator />
                <OpportunityBrand opportunity={opportunity} />
                <Separator />
                <OpportunityTabs
                  opportunity={opportunity}
                  updateOpportunity={updateOpportunity}
                  icp={icp}
                />
              </div>
            </div>

            <Tabs defaultValue="opNotes" className="flex-1 overflow-hidden">
              <TabsList className="h-14 bg-transparent w-full justify-between border-b border-border rounded-none px-3 space-x-3">
                <div className="flex">
                  <TabsTrigger
                    value="opNotes"
                    className="bg-transparent data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-700/20"
                  >
                    Notes{" "}
                  </TabsTrigger>
                </div>
                {endType && (
                  <>
                    <div className="px-2 py-1.5 bg-popover text-sm rounded-lg">
                      Auto saved..
                    </div>
                  </>
                )}
              </TabsList>
              <div className="h-full w-full">
                <TabsContent value="opTasks"></TabsContent>
                <TabsContent value="opNotes">
                  <TextEditor
                    content={opportunity.notes}
                    onChange={onEditorContentChange}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}
