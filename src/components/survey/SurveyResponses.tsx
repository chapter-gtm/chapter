"use client";

import React, { ReactComponentElement, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ZodTypeAny, z } from "zod";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ChevronsRight, ExternalLink, Maximize2, LinkIcon } from "lucide-react";

import { type Survey, type SurveyResponse } from "@/types/survey";
import { DataTable } from "@/components/data-table/data-table";
import {
  resultColumns,
  SurveyResponseRecord,
  SurveyResponseRecordSchema,
  filters,
} from "@/components/survey/result-columns";
import { SurveyResponseDetails } from "@/components/survey/SurveyResponseDetails";
import { getSurveyResponses } from "@/utils/nectar/surveys";
import { getUserAccessToken } from "@/utils/supabase/client";

interface SurveyResponsesProps {
  survey: Survey;
}

function titleCaseToCamelCase(titleCaseString: string): string {
  return titleCaseString
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, "")
    .replace(/^(.)/, ($1) => $1.toLowerCase());
}

export function SurveyResponses({ survey }: SurveyResponsesProps) {
  const [isPopulated, setIsPopulated] = useState(false);
  const [responses, setResponses] = useState<Map<string, SurveyResponse>>(
    new Map()
  );
  const [responseRecords, setResponseRecords] = useState<
    SurveyResponseRecordSchema[]
  >([]);
  const [selectedRow, setSelectedRow] = useState<SurveyResponse | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        const surveyResponses = await getSurveyResponses(userToken, survey.id);

        const responseMap = new Map<string, SurveyResponse>();
        surveyResponses.forEach((resp) => responseMap.set(resp.id, resp));

        const responseRecords = z.array(SurveyResponseRecord).parse(
          surveyResponses.map((response: SurveyResponse) => {
            const record: Record<string, any> = {
              id: response.id,
              date: response.startedAt.toLocaleString(),
              utm: response.utm,
              participant: response.contactPseudoName,
              stage: response.state.stage,
            };
            response.scores.forEach((item) => {
              record[titleCaseToCamelCase(item.name)] = item.value;
            });
            return record;
          })
        );

        setResponses(responseMap);
        setResponseRecords(responseRecords);
        setIsPopulated(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSurvey();
  }, [survey]);

  const handleRowClick = function <TData>(data: TData) {
    const record: SurveyResponseRecordSchema =
      data as SurveyResponseRecordSchema;
    const resp: SurveyResponse | undefined = responses.get(record.id);
    if (resp !== undefined) {
      setSelectedRow(resp);
    }
  };

  const [sheetOpen, setSheetOpen] = useState(false);

  const handleOpenSheet = function <TData>(data: TData) {
    setSheetOpen(true);
    const record: SurveyResponseRecordSchema =
      data as SurveyResponseRecordSchema;
    const resp: SurveyResponse | undefined = responses.get(record.id);
    if (resp !== undefined) {
      setSelectedRow(resp);
    }
    console.log("Sheet opened");
  };

  const handleCloseSheet = function () {
    setSheetOpen(false);
    console.log("Sheet closed");
  };

  return (
    <>
      <div className="flex flex-row h-full">
        {isPopulated ? (
          <Sheet modal={false} open={sheetOpen}>
            <div className="flex flex-col flex-1 pb-12">
              <div className="flex flex-col pb-4 bg-white border border-zinc-200 rounded-lg">
                <DataTable
                  columns={resultColumns}
                  data={responseRecords}
                  filters={filters}
                  filterColumnName="participant"
                  onRowClick={handleOpenSheet}
                  responseRecords={responseRecords}
                />
              </div>
            </div>

            <SheetContent className="sm:max-w-[500px] p-0 h-dvh max-h-dvh flex flex-col overflow-hidden gap-y-0">
              <TooltipProvider delayDuration={0}>
                <div className="flex flex-row justify-start h-14 w-full px-3 py-2">
                  <SheetClose
                    onClick={handleCloseSheet}
                    className="relative h-10 w-10 justify-center items-center rounded-lg transition-opacity hover:bg-slate-100 focus:outline-none"
                  >
                    <ChevronsRight className="h-4 w-4 mx-auto" />
                    <span className="sr-only">Close</span>
                  </SheetClose>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/surveys/${selectedRow?.surveyId}/responses/${selectedRow?.id}`}
                      >
                        <Button variant="ghost" size="icon" disabled={false}>
                          <ExternalLink className="h-4 w-4" />

                          <span className="sr-only">Share profile</span>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>View fullscreen</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={false}>
                        <LinkIcon className="h-4 w-4" />
                        <span className="sr-only">Share profile</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share link</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <div className="flex-1 overflow-y-auto">
                {selectedRow !== null && (
                  <SurveyResponseDetails surveyResponse={selectedRow} />
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex flex-col flex-1 pb-12 border-e border-slate-200 bg-white"></div>
        )}
        ;
      </div>
    </>
  );
}
