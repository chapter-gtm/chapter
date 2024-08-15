import { Button } from "@/components/ui/button";
import Image from "next/image";
import { timeAgo } from "@/utils/misc";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import Link from "next/link";

import { Opportunity } from "@/types/opportunity";
import { OpportunityPropList } from "./OpportunityPropList";

import { Separator } from "@/components/ui/separator";
interface OpportunityDrawerProps {
  opportunity: Opportunity;
}

export function OpportunityDrawer({ opportunity }: OpportunityDrawerProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto rounded-xl m-5 ">
        <div className="flex flex-col px-6 gap-y-4 py-4 ">
          <div className="flex items-center justify-center">
            <Image
              src={opportunity.company?.profilePicUrl}
              width={80}
              height={80}
              alt="Company Profile Picture"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="font-semibold text-3xl">
              {opportunity.company?.name}
            </h2>
            <p className="text-center text-zinc-500">
              {opportunity.company?.description}
            </p>
          </div>

          <div className="mt-12 flex flex-row justify-between items-center gap-x-3 border border-zinc-200/60 bg-zinc-100/50 rounded-lg h-24 p-4">
            <div className="flex gap-x-4">
              <div className="w-9 items-center justify-center flex flex-col text-zinc-500">
                <StickyNote width={20} />
              </div>
              <div className="flex flex-col justify-center gap-y-1">
                <p className="font-medium">JobPost.pdf</p>
                <p className="text-xs text-zinc-400">12 days ago</p>
              </div>
            </div>
            <div>
              <ChevronRight width={20} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* {timeAgo(opportunity.createdAt)} */}
          </div>
        </div>
        <div className="flex flex-col gap-y-4 px-6 py-4 bg-white">
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500">
              <Loader width={18} />
              <p>Stage</p>
            </div>
            <p className="font-medium">{opportunity.stage}</p>
          </div>
          <Separator />
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500">
              <Factory width={18} />
              <p>Industry</p>
            </div>
            <p className="font-medium">{opportunity.company?.industry}</p>
          </div>
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500">
              <Users width={18} />
              <p>Headcount</p>
            </div>
            <p className="font-medium">{opportunity.company?.headcount}</p>
          </div>
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500">
              <Users width={18} />
              <p>Eng size</p>
            </div>
            <p className="font-medium">{opportunity.company?.headcount}</p>
          </div>
          <Separator />
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500">
              <Landmark width={18} />
              <p>Fundraising</p>
            </div>
            <p className="font-medium">{opportunity.company?.headcount}</p>
          </div>
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500">
              <Banknote width={18} />
              <p>Investors</p>
            </div>
            <p className="font-medium">{opportunity.company?.headcount}</p>
          </div>
          <Separator />
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700">
            <div className="flex gap-x-2 items-center w-52 text-zinc-500">
              <Target width={18} />
              <p>Search criteria</p>
            </div>
            <p className="font-medium">{opportunity.company?.headcount}</p>
          </div>
          <Separator />
          <h3 className="font-medium">Contacts</h3>
          <div className="flex flex-row items-center justify-start text-sm text-zinc-700"></div>
        </div>
      </div>
    </>
  );
}
