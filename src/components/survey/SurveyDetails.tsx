"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, LinkIcon } from "lucide-react";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SurveyDefinition } from "@/components/survey/SurveyDefinition";
import { SurveyResponses } from "@/components/survey/SurveyResponses";
import { type Survey, SurveyState } from "@/types/survey";
import { getSurvey } from "@/utils/nectar/surveys";
import { getUserAccessToken } from "@/utils/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface SurveyDetailsProps {
  surveyId: string;
}

export function SurveyDetails({ surveyId }: SurveyDetailsProps) {
  const [survey, setSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        const proj = await getSurvey(userToken, surveyId);
        setSurvey(proj);
      } catch (error) {}
    };
    fetchSurvey();
  }, [surveyId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.SURVEY_APP_URL!}/surveys/${surveyId}`,
      );
      toast.success("Survey link copied!");
    } catch (error: any) {
      toast.error("Copy survey link to clipboard failed", {
        description: error.toString(),
      });
    }
  };

  return (
    <>
      <Toaster richColors />
      {survey !== null ? (
        <Tabs defaultValue="definition" className="h-dvh flex flex-col ">
          <div className="flex flex-row items-center justify-between py-4 border-b border-slate-100 h-16 px-6">
            <div className="basis-1/3 flex-1 flex-shrink-0 overflow-hidden me-8">
              <div className="flex inline-block items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-200 flex justify-center items-center text-xl group-hover:border border-slate-200">
                  {survey.emoji}
                </div>
                <p className="text-sm font-medium truncate text-ellipsis">
                  {survey.name}
                </p>
              </div>
            </div>

            <div className="space-between basis-1/3 ">
              <div className="flex items-center justify-center">
                <TabsList className="bg-zinc-200 font-normal">
                  <TabsTrigger value="definition" className="relative">
                    Create
                  </TabsTrigger>
                  <TabsTrigger value="results">Responses</TabsTrigger>
                  <TabsTrigger value="insights" disabled>
                    Insights
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            <div className="basis-1/3 flex overflow-hidden justify-end">
              {survey.state === SurveyState.LIVE && (
                <Button variant="outline" onClick={handleShare}>
                  <LinkIcon className="h-4 w-4" />
                  Survey Link
                </Button>
              )}
            </div>
          </div>

          <TabsContent
            value="definition"
            className="mt-0 data-[state=active]:flex flex-col h-full pb-32 px-6"
          >
            {/* <div className="bg-green-300 flex-1"></div> */}
            <SurveyDefinition survey={survey} setSurvey={setSurvey} />
          </TabsContent>

          <TabsContent
            value="results"
            className="mt-0 data-[state=active]:flex flex-col h-full pb-32 px-6"
          >
            <SurveyResponses survey={survey} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col h-full pb-32 animate-pulse">
          <div className="flex flex-row justify-between items-center h-16 py-4 px-6">
            <div className="h-8 w-24 bg-zinc-200/60 rounded-lg"></div>
            <div className="h-8 w-52 bg-zinc-200/60 rounded-lg"></div>
            <div className="h-8 w-14 bg-zinc-200/60 rounded-lg"></div>
          </div>
          <div className="flex flex-1 bg-white rounded-lg mx-6"></div>
        </div>
      )}
    </>
  );
}
