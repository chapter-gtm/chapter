import {
  Loader,
  InfoIcon,
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
  CalendarFold,
  Hash,
  Star,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AppleLogo } from "../icons";
import { GooglePlayLogo } from "../icons";

import { getIcps } from "@/utils/chapter/icp";

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

import Image from "next/image";

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

  const handleDocLink = async (url: string | undefined | null) => {
    if (url === undefined || url === null) {
      return;
    }
    window.open(url);
  };

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
        const currentUserIcps = await getIcps();
        if (currentUserIcps === null || currentUserIcps.length <= 0) {
          throw new Error("Failed to fetch ICP");
        }
        setIcp(currentUserIcps[0]);
      } catch (error) {
        toast.error("Failed to get ICP.");
      }
    };

    fetchIcp();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-y-4 py-6 ps-2">
        {opportunity.company?.docsUrl !== undefined &&
          opportunity.company?.docsUrl !== null && (
            <>
              <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
                <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
                  <span>
                    <InfoIcon width={18} />
                  </span>
                  <p>Docs / API</p>
                </div>

                <div className="flex flex-1 flex-wrap gap-x-2">
                  <Button
                    onClick={() => handleDocLink(opportunity.company?.docsUrl)}
                    variant={"outline"}
                    className="px-3 py-2 text-sm items-center bg-transparent font-medium h-auto hover:bg-card dark:hover:bg-popover gap-x-1"
                  >
                    Link
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
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
                      <div
                        key={index}
                        className="bg-popover dark:bg-muted text-primary font-medium px-2 py-1 text-xs rounded-md"
                      >
                        {tool.name}
                      </div>
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
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex border border-border rounded-lg dark:text-zinc-100 cursor-default px-2 py-1.5 text-sm items-center font-medium h-auto hover:bg-popover ">
                  See all
                </div>
              </TooltipTrigger>
              <TooltipContent className="flex w-64 py-3 flex-wrap gap-2 border-none">
                {icp
                  ? opportunity.jobPosts
                      ?.flatMap((jobPost) => jobPost.tools)
                      .filter(
                        (tool) => tool && !icp.tool.include.includes(tool.name)
                      )
                      .map((tool, index) => (
                        <>
                          {tool && (
                            <Badge
                              key={index}
                              variant={"outline"}
                              className="border-border"
                            >
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
