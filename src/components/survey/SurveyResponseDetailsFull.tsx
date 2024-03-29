"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { SurveyResponseIdentity } from "@/components/survey/SurveyResponseIdentity";

import { Maximize2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SurveyResponse } from "@/types/survey";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Link2Icon,
  Cross1Icon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ErrorMessage } from "@/components/ErrorMessage";
import { SurveyResponseTranscript } from "@/components/survey/SurveyResponseTranscript";
import { SurveyResponsePropList } from "@/components/survey/SurveyResponsePropList";
import { getSurveyResponse } from "@/utils/nectar/surveys";
import { getUserAccessToken } from "@/utils/supabase/client";

interface SurveyResponseDetailsFullProps {
  surveyId?: string;
  surveyResponseId?: string;
}

export function SurveyResponseDetailsFull({
  surveyId,
  surveyResponseId,
}: SurveyResponseDetailsFullProps) {
  const [response, setResponse] = useState<SurveyResponse | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        if (surveyId !== undefined && surveyResponseId !== undefined) {
          const userToken = await getUserAccessToken();
          if (userToken === undefined) {
            throw Error("User needs to login!");
          }
          const resp = await getSurveyResponse(
            userToken,
            surveyId,
            surveyResponseId,
          );
          setResponse(resp);
        }
      } catch (error) {}
    };
    fetchSurvey();
  }, [surveyId, surveyResponseId]);

  return (
    <>
      {response !== null ? (
        <div className="grid grid-cols-4 justify-start content-start">
          <div className="col-span-3 border-e border-slate-100 h-dvh">
            <div className="flex-1 border-b border-slate-100 pb-3 ">
              <div className="flex flex-row justify-between w-full py-3 px-7 justify-start">
                <div className="flex gap-4 items-center">
                  <ToggleGroup type="single">
                    <ToggleGroupItem
                      value="a"
                      className="border-slate-200 border"
                    >
                      <Cross1Icon className="w-3 h-3" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="a"
                      className="border-slate-200 border"
                    >
                      <ChevronDownIcon className="w-3 h-3" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="b"
                      className="border-slate-200 border"
                    >
                      <ChevronUpIcon className="w-3 h-3" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <p className="text-sm font-medium text-slate-600">
                    Respondant #312
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <button className="border-slate-200 border p-2 rounded-lg hover:bg-slate-100">
                    <Link2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="w-2/3 mx-auto py-3 px-7 mt-12">
                <h1 className="text-3xl font-semibold text-slate-600">
                  Unknown
                </h1>
              </div>
            </div>
            <div className="flex w-full">
              <Tabs defaultValue="transcript" className="w-full ">
                <div className="w-full flex flex-row border-b border-slate-100 justify-between py-3 items-center">
                  <div className="w-2/3 mx-auto">
                    <TabsList className="grid w-full grid-cols-2 w-[200px]">
                      <TabsTrigger value="transcript">Transcript</TabsTrigger>
                      <TabsTrigger value="password">Activity</TabsTrigger>
                    </TabsList>
                  </div>
                </div>
                <TabsContent value="transcript">
                  <div className="w-2/3 mx-auto">
                    {response !== null && (
                      <SurveyResponseTranscript surveyResponse={response} />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="col-span-1 pt-2 px-6 space-y-5">
            <SurveyResponseIdentity surveyResponse={response} />
            {response !== null && (
              <SurveyResponsePropList surveyResponse={response} />
            )}
          </div>
        </div>
      ) : (
        <ErrorMessage />
      )}
    </>
  );
}
