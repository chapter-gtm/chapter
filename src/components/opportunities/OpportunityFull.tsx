"use client";
import { useEffect, useState } from "react";

import { Opportunity } from "@/types/opportunity";
import { getOpportunity } from "@/utils/chapter/opportunity";

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
        <b>{`${opportunity.name} <- Oppoerunity object, hurray!`}</b>
      )}
    </>
  );
}
