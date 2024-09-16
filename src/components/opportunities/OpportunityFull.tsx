"use client";
import { useEffect, useState } from "react";
import { Icon } from "@radix-ui/react-select";
import { Building2 } from "lucide-react";

import TextEditor from "@/components/editor/editor";
import { Opportunity } from "@/types/opportunity";
import { getOpportunity } from "@/utils/chapter/opportunity";
import { OpportunityPropList } from "./OpportunityPropList";
import { OpportunityBrand } from "./OpportunityBrand";
import { OpportunityJobPost } from "./OpportunityJobPost";
import { OpportunityContacts } from "./OpportunityContacts";
import { updateOpportunityNotes } from "@/utils/chapter/opportunity";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Editor, FloatingMenu } from "@tiptap/react";

interface OpportunityFullProps {
  opportunityId: string;
}

export function OpportunityFull({ opportunityId }: OpportunityFullProps) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const opp = await getOpportunity(opportunityId);
        setOpportunity(opp);
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
    const op = await updateOpportunityNotes(opportunity.id, richText);
    setOpportunity(op);
  };

  return (
    <>
      <Toaster theme="light" />
      {opportunity !== null && (
        <div className="bg-background p-6 flex flex-1">
          <div className="flex flex-row flex-1 bg-card rounded-lg overflow">
            <div className="basis-[520px] overflow-y-scroll p-6 border-e border-border">
              <div className="flex flex-col">
                <OpportunityBrand opportunity={opportunity} />
                <OpportunityJobPost opportunity={opportunity} />
                <OpportunityPropList
                  opportunity={opportunity}
                  updateOpportunity={updateOpportunity}
                />
                <OpportunityContacts opportunity={opportunity} />
              </div>
            </div>

            <Tabs defaultValue="opNotes" className="flex-1 overflow-hidden">
              <TabsList className="h-14 bg-transparent w-full justify-start border-b border-border rounded-none px-3 space-x-3">
                <TabsTrigger
                  value="opNotes"
                  className="bg-transparent data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-700/20"
                >
                  Notes{" "}
                </TabsTrigger>
                <TabsTrigger
                  value="opTasks"
                  className="bg-transparent data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-700/20 py-2"
                >
                  Tasks{" "}
                </TabsTrigger>
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
