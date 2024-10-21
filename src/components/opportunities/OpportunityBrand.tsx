import Image from "next/image";
import { type Person } from "@/types/person";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Divide,
  ExternalLink,
  Maximize2,
  Users,
  Factory,
  MapPin,
  Landmark,
  Banknote,
  Target,
  Loader,
  StickyNote,
  ChevronRight,
  CircleUserIcon,
  Linkedin,
  Mail,
  Globe,
  Twitter,
} from "lucide-react";
import { SiCrunchbase } from "react-icons/si";

import Link from "next/link";
import { timeAgo } from "@/utils/misc";

import { Opportunity } from "@/types/opportunity";

interface OpportunityDrawerProps {
  opportunity: Opportunity;
}

export function OpportunityBrand({ opportunity }: OpportunityDrawerProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto rounded-xl m-5">
        <div className="flex flex-col px-4 gap-y-1 py-4 ">
          <div className="flex flex-col gap-y-2 items-center justify-center">
            {opportunity.company?.profilePicUrl && opportunity.company?.url ? (
              <a
                href={`https://${opportunity.company.url.replace(
                  /^https?:\/\//,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[72px] min-h-[72px] max-w-[72px] max-h-[72px]"
              >
                <Image
                  src={opportunity.company?.profilePicUrl}
                  width={72}
                  height={72}
                  alt="Company Profile Picture"
                  className="rounded-xl border border-border"
                />
              </a>
            ) : (
              <></>
            )}
            <div className="bg-background dark:bg-popover border border-border px-1 py-0.5 rounded-lg drop-shadow-lg">
              <div className="flex flex-inline max-h-7 gap-x-1.5 items-center justify-center text-xs text-zinc-700 dark:text-zinc-200">
                {opportunity.company?.url ? (
                  <a
                    href={`https://${opportunity.company?.url.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center text-center rounded-md dark:hover:bg-card flex items-center"
                  >
                    <span className="">
                      <Globe className="w-3" />
                    </span>
                  </a>
                ) : (
                  <p className="font-medium">{opportunity.company?.url}</p>
                )}
                {opportunity.company?.linkedinProfileUrl ? (
                  <a
                    href={`https://${opportunity.company?.linkedinProfileUrl.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-x-2 bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center rounded-md dark:hover:bg-card flex items-center"
                  >
                    <span>
                      <Linkedin className="w-3" />
                    </span>
                  </a>
                ) : null}
                {opportunity.company?.twitterProfileUrl ? (
                  <a
                    href={`https://${opportunity.company?.twitterProfileUrl.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-x-2 bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center rounded-md dark:hover:bg-card flex items-center"
                  >
                    <span>
                      <Twitter className="w-3" />
                    </span>
                  </a>
                ) : null}
                {opportunity.company?.crunchbaseProfileUrl ? (
                  <a
                    href={`https://${opportunity.company?.crunchbaseProfileUrl.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-x-2 bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center rounded-md dark:hover:bg-card flex items-center"
                  >
                    <span>
                      <SiCrunchbase className="w-3" />
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-base text-center">
            <h2 className="font-semibold text-3xl text-zinc-700 dark:text-zinc-200 mt-3">
              {opportunity.company?.name}
            </h2>
            <div className="flex flex-col">
              <p className="text-zinc-600 dark:text-zinc-300 mt-3">
                {opportunity.company?.description}
              </p>
              <div className="my-1 text-zinc-400 font-light text-sm">
                Added about {timeAgo(new Date(opportunity.createdAt))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
