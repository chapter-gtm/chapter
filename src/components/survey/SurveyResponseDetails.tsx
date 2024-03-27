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
          <div className="flex flex-col px-6 ">
            <div className="flex flex-row justify-between py-2 items-center">
              <TooltipProvider delayDuration={0}>
                <div className="flex flex-row items-center gap-x-2 ">
                  <p className="text-sm text-slate-700 font-medium">#312</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/surveys/${surveyResponse.surveyId}/responses/${surveyResponse.id}`}
                      >
                        <Button variant="ghost" size="icon" disabled={false}>
                          <Maximize2 className="h-4 w-4" />
                          <span className="sr-only">Share profile</span>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>View fullscreen</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={false}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Share profile</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share link</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
            <SurveyResponsePropList surveyResponse={surveyResponse} />
          </div>

          <div className="flex-1 overflow-y-auto rounded-xl m-5 border border-slate-200 bg-slate-100/50">
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
