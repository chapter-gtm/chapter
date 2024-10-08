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
} from "lucide-react";

import { getIcp } from "@/utils/chapter/icp";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Opportunity } from "@/types/opportunity";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Investor } from "@/types/company";
import { OpportunityStage } from "@/types/opportunity";
import { updateOpportunityStage } from "@/utils/chapter/opportunity";

import { stageColors } from "@/types/opportunity";
import { type Icp } from "@/types/icp";

interface OpportunityPropListProps {
  opportunity: Opportunity;
  updateOpportunity: (updatedOpportunity: Opportunity) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function OpportunityPropList({
  opportunity,
  updateOpportunity,
}: OpportunityPropListProps) {
  const [currentStage, setCurrentStage] = useState<OpportunityStage>(
    opportunity.stage
  );
  const [icp, setIcp] = useState<Icp | null>(null);
  const stages = Object.values(OpportunityStage);

  const handleStageChange = async (newStage: string) => {
    try {
      if (!stages.includes(newStage as OpportunityStage)) {
        toast.error("Failed to set stage.");
        return;
      }

      opportunity = await updateOpportunityStage(
        opportunity.id,
        newStage as OpportunityStage
      );
      setCurrentStage(opportunity.stage);
      updateOpportunity(opportunity);
    } catch (error: any) {
      toast.error("Failed to update stage.");
    }
  };

  useEffect(() => {
    setCurrentStage(opportunity.stage);
  }, [opportunity]);

  useEffect(() => {
    const fetchIcp = async () => {
      try {
        setIcp(await getIcp());
      } catch (error) {
        toast.error("Failed to get ICP.");
      }
    };

    fetchIcp();
  }, []);

  return (
    <>
      <Separator />
      <div className="text-base font-medium my-4 text-zinc-700 dark:text-zinc-200 ps-2">
        Properties
      </div>
      <div className="flex flex-col gap-y-4 py-4 ps-2">
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Loader width={18} />
            <p>Stage</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-popover flex-1 py-0.5 rounded-lg">
              <div className="cursor-pointer flex flex-row justify-between gap-x-2 items-center">
                <div
                  className={classNames(
                    stageColors[opportunity.stage]?.color,
                    "flex ps-0.5 py-0.5 rounded-md hover:none focus-visible:ring-0 pr-2 items-center "
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
        <Separator />
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Target width={18} />
            <p>Relevant tools</p>
          </div>
          <div className="flex flex-row gap-x-2">
            {icp &&
              opportunity.jobPosts
                ?.flatMap((jobPost) => jobPost.tools)
                .filter((tool) => tool && icp.tool.include.includes(tool.name))
                .map((tool, index) => (
                  <>
                    {tool && (
                      <Badge key={index} variant={"default"}>
                        {tool.name}
                      </Badge>
                    )}
                  </>
                ))}
          </div>
        </div>
        <Separator />
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400 self-start">
            <Target width={18} />
            {icp ? <p>Additional stack</p> : <p>Additional stack</p>}
          </div>
          <div className="flex flex-1 flex-wrap gap-2">
            {icp
              ? opportunity.jobPosts
                  ?.flatMap((jobPost) => jobPost.tools)
                  .filter(
                    (tool) => tool && !icp.tool.include.includes(tool.name)
                  )
                  .map((tool, index) => (
                    <>
                      {tool && (
                        <Badge key={index} variant={"outline"}>
                          {tool.name}
                        </Badge>
                      )}
                    </>
                  ))
              : opportunity.jobPosts
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
          <p className="font-medium">
            {opportunity.company?.orgSize?.engineering}
          </p>
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
      </div>
    </>
  );
}
