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

import { RecordParts } from "@/components/record/RecordParts";
import { DataRecord } from "@/types/record";
import { RecordPropList } from "@/components/record/RecordPropList";

interface RecordDetailsProps {
  record: DataRecord;
}

export function RecordDetails({ record }: RecordDetailsProps) {
  return (
    <>
      <>
        <div className="flex flex-col px-6 py-4">
          <RecordPropList record={record} />
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl m-5 border border-slate-200 bg-zinc-100/50">
          <RecordParts record={record} />
        </div>
      </>
    </>
  );
}
