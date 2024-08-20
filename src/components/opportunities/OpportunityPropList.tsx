import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { toTitleCase } from "@/utils/misc";
import { Separator } from "@/components/ui/separator";
import { Investor } from "@/types/company";

import {
  Loader,
  Factory,
  Users,
  Banknote,
  Landmark,
  Target,
  CircleUserIcon,
} from "lucide-react";

import { Opportunity } from "@/types/opportunity";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface OpportunityPropListProps {
  opportunity: Opportunity;
}

export function OpportunityPropList({ opportunity }: OpportunityPropListProps) {
  return (
    <>
      <div className="flex flex-col gap-y-4 py-4 ps-2">
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Loader width={18} />
            <p>Stage</p>
          </div>
          <Badge variant={"outline"}>{opportunity.stage}</Badge>
        </div>
        <Separator />
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
          <p className="font-medium">{opportunity.company?.headcount}</p>
        </div>
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Users width={18} />
            <p>Eng size</p>
          </div>
          <p className="font-medium">{opportunity.company?.headcount}</p>
        </div>
        <Separator />
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Landmark width={18} />
            <p>Fundraising</p>
          </div>
          <p className="font-medium">
            {opportunity.company?.lastFunding?.roundName}
          </p>
        </div>
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Banknote width={18} />
            <p>Investors</p>
          </div>

          {opportunity.company?.lastFunding !== null &&
            opportunity.company?.lastFunding.investors.map(
              (investor: Investor, index) => <p key={index}>{investor.name}</p>
            )}
        </div>
        <Separator />
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 ">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Target width={18} />
            <p>Tool stack</p>
          </div>
          <div className="flex flex-row gap-x-2">
            {opportunity.jobPosts
              ?.flatMap((jobPost) => jobPost.tools)
              .map((tool, index) => (
                <>
                  {tool && (
                    <Badge key={index} variant={"outline"}>
                      {tool.name}
                    </Badge>
                  )}
                </>
              ))}
          </div>
        </div>
        <Separator />
      </div>
    </>
  );
}
