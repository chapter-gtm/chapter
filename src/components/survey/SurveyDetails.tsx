"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ErrorMessage } from "@/components/ErrorMessage";
import { SurveyDefinition } from "@/components/survey/SurveyDefinition";
import { SurveyResponses } from "@/components/survey/SurveyResponses";
import { type Survey } from "@/types/survey";
import { getSurvey } from "@/utils/nectar/surveys";
import { getUserAccessToken } from "@/utils/supabase/client";

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

  return (
    <>
      {survey !== null ? (
        <Tabs defaultValue="definition" className="h-dvh">
          <div className="flex flex-col flex-1 h-full ">
            <div className="flex flex-row items-center justify-between py-4 border-b border-slate-100 h-16 px-6 ">
              <div className="basis-1/3 flex-1 flex-shrink-0 overflow-hidden   me-8">
                <p className="text-slate-700 text-base font-medium truncate text-ellipsis">
                  {survey.name}
                </p>
              </div>

              <div className="space-between basis-1/3 items-center justify-center">
                <TabsList>
                  <TabsTrigger value="definition" className="relative">
                    Create
                  </TabsTrigger>
                  <TabsTrigger value="results">Responses</TabsTrigger>
                  <TabsTrigger value="insights" disabled>
                    Insights
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="basis-1/3 flex overflow-hidden justify-end">
                <Button variant="outline">Preview</Button>
              </div>
            </div>

            <TabsContent
              value="definition"
              className="mt-0 data-[state=active]:flex flex-col h-full"
            >
              <SurveyDefinition survey={survey} setSurvey={setSurvey} />
            </TabsContent>

            <TabsContent
              value="results"
              className="mt-0 data-[state=active]:flex flex-col flex-1 h-full"
            >
              <SurveyResponses survey={survey} />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <ErrorMessage />
      )}
    </>
  );
}
