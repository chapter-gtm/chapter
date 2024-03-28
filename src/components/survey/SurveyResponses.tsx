"use client";

import { useEffect, useState } from "react";
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
  const defaultCollapsed = false;
  const defaultLayout = [80, 20];
  const navCollapsedSize = 20;
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

  return (
    <>
      <div className="flex flex-row h-full">
        <Sheet onOpenChange={(open: boolean) => sheetOpen}>
          <div className="basis-3/4">
            <div className="flex flex-col flex-1 px-6 pb-12 border-e border-slate-200">
              <div className="items-center justify-between py-5 h-20 w-full">
                <h2 className="text-xl font-semibold">
                  {responseRecords.length}{" "}
                  {responseRecords.length === 1 ? "Response" : "Responses"}
                </h2>
              </div>
              <div className="flex flex-col pb-24">
                <DataTable
                  columns={resultColumns}
                  data={responseRecords}
                  filters={filters}
                  filterColumnName="participant"
                  // onRowClick={() => setSheetOpen(true)}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
          </div>

          {/* <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4 bg-orange-200">
                Something
              </div>
            </div>
          </SheetContent> */}
        </Sheet>

        <div className="basis-1/4 flex flex-col">
          {selectedRow !== null && (
            <SurveyResponseDetails surveyResponse={selectedRow} />
          )}
        </div>
      </div>
    </>
  );
}
