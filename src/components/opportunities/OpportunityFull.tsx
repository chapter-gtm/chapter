"use client";
import { useEffect, useState } from "react";
import { Icon } from "@radix-ui/react-select";
import { Building2 } from "lucide-react";

import { Opportunity } from "@/types/opportunity";
import { getOpportunity } from "@/utils/chapter/opportunity";
import { OpportunityPropList } from "./OpportunityPropList";
import { OpportunityBrand } from "./OpportunityBrand";
import { OpportunityJobPost } from "./OpportunityJobPost";
import { OpportunityContacts } from "./OpportunityContacts";

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

  return (
    <>
      <Toaster theme="light" />
      {opportunity !== null && (
        <div className="bg-background gap-x-2 p-6 flex flex-col flex-1">
          <div className="flex flex-row flex-1 bg-card rounded-lg overflow-hidden">
            <div className="basis-[520px] overflow-y-scroll p-6 border-e border-border">
              <div className="flex flex-col">
                <OpportunityBrand opportunity={opportunity} />
                <OpportunityJobPost opportunity={opportunity} />
                <OpportunityPropList opportunity={opportunity} />
                <OpportunityContacts opportunity={opportunity} />
              </div>
            </div>

            <Tabs defaultValue="opNotes" className="flex-1">
              <TabsList className="h-14 bg-transparent w-full justify-start border-b border-border rounded-none px-3 space-x-3">
                <TabsTrigger
                  value="opNotes"
                  className="bg-transparent data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-700/20"
                >
                  Notes{" "}
                  <Badge variant="outline" className="dark:bg-zinc-600/20">
                    8
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="opTasks"
                  className="bg-transparent data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-700/20 py-2"
                >
                  Tasks{" "}
                  <Badge
                    variant="outline"
                    className="bg-zinc-200/70 dark:bg-zinc-600/20"
                  >
                    12
                  </Badge>
                </TabsTrigger>
              </TabsList>
              <div className="flex h-full justify-center items-center">
                <TabsContent value="opTasks">
                  <div className="flex flex-col text-center">
                    <div className="text-xl font-semibold text-zinc-700 dark:text-white">
                      Tasks
                    </div>
                    <div className="">Coming soon...</div>
                  </div>
                </TabsContent>
                <TabsContent value="opNotes">
                  <div className="flex flex-col text-center">
                    <div className="text-xl font-semibold text-zinc-700 dark:text-white">
                      Notes
                    </div>
                    <div className="">Coming soon...</div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}
