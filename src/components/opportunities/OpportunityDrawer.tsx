import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, Maximize2 } from "lucide-react";
import Link from "next/link";

import { Opportunity } from "@/types/opportunity";
import { OpportunityPropList } from "./OpportunityPropList";

interface OpportunityDrawerProps {
  opportunity: Opportunity;
}

export function OpportunityDrawer({ opportunity }: OpportunityDrawerProps) {
  return (
    <>
      <div className="flex flex-col px-6 py-4">
        <OpportunityPropList opportunity={opportunity} />
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl m-5 border border-slate-200 bg-zinc-100/50">
        <b>{`${opportunity.name} <- >Oppoerunity object, hurray!`}</b>
      </div>
    </>
  );
}
