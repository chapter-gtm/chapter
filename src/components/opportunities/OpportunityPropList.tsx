import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { toTitleCase } from "@/utils/misc";

import { Opportunity } from "@/types/opportunity";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface OpportunityPropListProps {
  opportunity: Opportunity;
}

export function OpportunityPropList({ opportunity }: OpportunityPropListProps) {
  return (
    <>
      <b>{`${opportunity.name} <- Oppoerunity object, hurray!`}</b>
    </>
  );
}
