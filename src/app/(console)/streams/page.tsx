"use client";

import React, { ReactComponentElement, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ZodTypeAny, z } from "zod";

import { ChevronsRight, ExternalLink, LinkIcon } from "lucide-react";
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
import { PageHeaderRow } from "@/components/survey/PageHeaderRow";

import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import {
  resultColumns,
  SurveyResponseRecord,
  SurveyResponseRecordSchema,
  filters,
} from "@/components/survey/result-columns";

import { type Survey, type SurveyResponse } from "@/types/survey";

export default function Streams() {
  const [responseRecords, setResponseRecords] = useState<
    SurveyResponseRecordSchema[]
  >([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SurveyResponse | null>(null);

  const [responses, setResponses] = useState<Map<string, SurveyResponse>>(
    new Map()
  );

  const handleRowClick = function <TData>(data: TData) {
    const record: SurveyResponseRecordSchema =
      data as SurveyResponseRecordSchema;
    const resp: SurveyResponse | undefined = responses.get(record.id);
    if (resp !== undefined) {
      setSelectedRow(resp);
    }
  };

  return (
    <>
      <div className="flex h-full">
        <Sheet modal={false} open={sheetOpen}>
          <div className="flex flex-col flex-1 mt-2">
            <PageHeaderRow title="Insights" />
            <div className="flex flex-col pb-4 bg-white border border-zinc-200 rounded-lg">
              <DataTable
                columns={resultColumns}
                data={responseRecords}
                filters={filters}
                filterColumnName=""
                onRowClick={handleRowClick}
                responseRecords={responseRecords}
                canCreateInsight={true}
              />
            </div>
          </div>

          <SheetContent className="sm:max-w-[500px] p-0 h-dvh max-h-dvh flex flex-col overflow-hidden gap-y-0">
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-row justify-start h-14 w-full px-3 py-2">
                {/* <SheetClose
                  onClick={}
                  className="relative h-10 w-10 justify-center items-center rounded-lg transition-opacity hover:bg-slate-100 focus:outline-none"
                >
                  <ChevronsRight className="h-4 w-4 mx-auto" />
                  <span className="sr-only">Close</span>
                </SheetClose> */}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      target="blank"
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
                <></>
                // <SurveyResponseDetails surveyResponse={selectedRow} />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
