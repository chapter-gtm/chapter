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
import { Separator } from "@/components/ui/separator";

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
            surveyResponseId
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
        <div className="flex flex-col h-screen overflow-hidden px-7 pb-16">
          {/* <div className="flex flex-row justify-between w-full py-3">
            <div className="flex gap-4 items-center">
              <ToggleGroup type="single">
                <ToggleGroupItem
                  value="a"
                  className="border-zinc-200 border hover:bg-white"
                >
                  <Cross1Icon className="w-3 h-3" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="a"
                  className="border-zinc-200 border hover:bg-white"
                >
                  <ChevronDownIcon className="w-3 h-3" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="b"
                  className="border-zinc-200 border hover:bg-white"
                >
                  <ChevronUpIcon className="w-3 h-3" />
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-sm font-medium text-slate-600">
                {response !== null && <>{response?.contactPseudoName}</>}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <button className="border-slate-200 border p-2 rounded-lg hover:bg-white">
                <Link2Icon className="w-4 h-4" />
              </button>
            </div>
          </div> */}
          <div className="flex flex-row border border-zinc-200 rounded-lg h-full overflow-hidden mt-3">
            <div className="basis-1/5 pt-2 space-y-5 border-r border-zinc-200 h-full bg-zinc-50">
              <SurveyResponseIdentity surveyResponse={response} />
              <Separator className="w-full bg-zinc-200 my-3" />

              {response !== null && (
                <div className="px-7">
                  <p className="font-medium my-3 text-sm">Properties</p>
                  <SurveyResponsePropList surveyResponse={response} />
                </div>
              )}
              <Separator className="w-full bg-zinc-200 my-3" />

              {response !== null && (
                <div className="px-7">
                  <p className="font-medium my-3 text-sm">Insights</p>
                </div>
              )}
            </div>
            <div className="basis-4/5 bg-white">
              <Tabs defaultValue="transcript" className="w-full">
                <div className="w-full flex px-6 flex-row border-b border-slate-100 justify-between py-3 items-center">
                  <TabsList className="grid w-full grid-cols-2 w-[200px]">
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    <TabsTrigger value="password">Activity</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="transcript">
                  <div className="w-2/3">
                    {response !== null && (
                      <SurveyResponseTranscript surveyResponse={response} />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <ErrorMessage />
      )}
    </>
  );
}
