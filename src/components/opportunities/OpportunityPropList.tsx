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
} from "lucide-react";

import { getIcp } from "@/utils/chapter/icp_criteria";

import { useState } from "react";
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

import { Investor } from "@/types/company";
import { OpportunityStage } from "@/types/opportunity";
import { updateOpportunityStage } from "@/utils/chapter/opportunity";

interface OpportunityPropListProps {
  opportunity: Opportunity;
  updateOpportunity: (updatedOpportunity: Opportunity) => void;
}

export function OpportunityPropList({
  opportunity,
  updateOpportunity,
}: OpportunityPropListProps) {
  const [currentStage, setCurrentStage] = useState<OpportunityStage>(
    opportunity.stage
  );
  const stages = Object.values(OpportunityStage);

  const icpTools: string[] = getIcp();

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

  return (
    <>
      <div className="flex flex-col gap-y-4 py-4 ps-2">
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Loader width={18} />
            <p>Stage</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="h-9 rounded-full border-b border-border bg-popover"
            >
              <Button variant="outline">{currentStage}</Button>
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
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Link width={18} />
            <p>Domain</p>
          </div>
          {opportunity.company?.url ? (
            <a
              href={`https://${opportunity.company?.url.replace(
                /^https?:\/\//,
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {opportunity.company?.url}
            </a>
          ) : (
            <p className="font-medium">{opportunity.company?.url}</p>
          )}
        </div>
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <LinkedinIcon width={16} />
            <p>LinkedIn</p>
          </div>
          <p className="flex-1 font-medium overflow-hidden truncate">
            {opportunity.company?.linkedinProfileUrl ? (
              <a
                href={`https://${opportunity.company?.linkedinProfileUrl.replace(
                  /^https?:\/\//,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {opportunity.company?.linkedinProfileUrl}
              </a>
            ) : null}
          </p>
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
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
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
        <Separator />
        <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
          <div className="flex gap-x-2 items-center w-52 text-zinc-500 dark:text-zinc-400">
            <Target width={18} />
            <p>Search criteria</p>
          </div>
          <div className="flex flex-row gap-x-2">
            {opportunity.jobPosts
              ?.flatMap((jobPost) => jobPost.tools)
              .filter((tool) => tool && icpTools.includes(tool.name))
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
            <p>Additional stack</p>
          </div>
          <div className="flex flex-1 flex-wrap gap-2">
            {opportunity.jobPosts
              ?.flatMap((jobPost) => jobPost.tools)
              .filter((tool) => tool && !icpTools.includes(tool.name))
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
