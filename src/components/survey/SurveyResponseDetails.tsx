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

import { SurveyResponseTranscript } from "@/components/survey/SurveyResponseTranscript";
import { SurveyResponse } from "@/types/survey";
import { SurveyResponseIdentity } from "@/components/survey/SurveyResponseIdentity";
import { SurveyResponsePropList } from "@/components/survey/SurveyResponsePropList";

import { EmptySelectionCard } from "./EmptySelectionCard";
import { Separator } from "@/components/ui/separator";

interface SurveyResponseDetailsProps {
  surveyResponse?: SurveyResponse;
}

export function SurveyResponseDetails({
  surveyResponse,
}: SurveyResponseDetailsProps) {
  return (
    <>
      {surveyResponse !== undefined ? (
        <>
          <div className="flex flex-col px-6 py-4">
            <SurveyResponsePropList surveyResponse={surveyResponse} />
          </div>

          <div className="flex-1 overflow-y-auto rounded-xl m-5 border border-slate-200 bg-zinc-100/50">
            <SurveyResponseTranscript surveyResponse={surveyResponse} />
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col py-8">
          <EmptySelectionCard
            title="Nothing selected"
            description="Choose an item from the list to view it's details"
          />
        </div>
      )}
    </>
  );
}
