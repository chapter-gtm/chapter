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
} from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/utils/misc";

import { Opportunity } from "@/types/opportunity";

interface OpportunityDrawerProps {
  opportunity: Opportunity;
}

export function OpportunityBrand({ opportunity }: OpportunityDrawerProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto rounded-xl m-5 ">
        <div className="flex flex-col px-4 gap-y-4 py-4 ">
          <div className="flex items-center justify-center">
            {opportunity.company?.profilePicUrl ? (
              <Image
                src={opportunity.company?.profilePicUrl}
                width={72}
                height={72}
                alt="Company Profile Picture"
              />
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col items-center justify-center text-base">
            <h2 className="font-semibold text-3xl text-zinc-700 dark:text-zinc-200 mt-3">
              {opportunity.company?.name}
            </h2>
            <p className="text-center text-zinc-600 dark:text-zinc-300 mt-3">
              {opportunity.company?.description}
            </p>
            <div className="flex items-center justify-between my-6 text-zinc-400 font-light text-sm">
              Added about {timeAgo(new Date(opportunity.createdAt))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
