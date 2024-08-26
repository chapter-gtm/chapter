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

import { Opportunity } from "@/types/opportunity";

interface OpportunityDrawerProps {
  opportunity: Opportunity;
}

export function OpportunityJobPost({ opportunity }: OpportunityDrawerProps) {
  return (
    <>
      <Link href={""}>
        <div className="mt-4 flex flex-row justify-between rounded-lg h-24 p-4 items-center gap-x-3 border border-border-light bg-popover hover:bg-accent-hover">
          <div className="flex gap-x-4">
            <div className="w-9 items-center justify-center flex flex-col text-zinc-500">
              <StickyNote width={20} />
            </div>
            <div className="flex flex-col justify-center gap-y-1 text-base">
              <p className="font-medium dark:text-zinc-200">JobPost.pdf</p>
              <p className="text-zinc-400">12 days ago</p>
            </div>
          </div>
          <div>
            <ChevronRight width={20} />
          </div>
        </div>
      </Link>
    </>
  );
}
