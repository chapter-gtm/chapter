"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";

import { SparklesIcon } from "lucide-react";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { ChevronsRight, ExternalLink, LinkIcon } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { RecordDetails } from "@/components/record/RecordDetails";
import {
  TableRecord,
  RecordSchema,
  filters,
  getRecordColumns,
} from "@/components/record/columns";
import { type Contact, type Company } from "@/types/contact";
import { type DataRecord } from "@/types/record";
import { type Tag } from "@/types/score";
import { getRecords } from "@/utils/nectar/records";
import { generateInsights } from "@/utils/nectar/insights";
import { getUserAccessToken } from "@/utils/supabase/client";
import { titleCaseToCamelCase } from "@/utils/misc";

interface RecordsProps {}

export function Records({}: RecordsProps) {
  const [isPopulated, setIsPopulated] = useState(false);
  const [records, setRecords] = useState<Map<string, DataRecord>>(new Map());
  const [dataRecords, setDataRecords] = useState<RecordSchema[]>([]);
  const [selectedRow, setSelectedRow] = useState<DataRecord | null>(null);
  const [selectedRows, setSelectedRows] = useState<DataRecord[]>([]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        const recs = await getRecords(userToken, 1000, 1);

        const recordMap = new Map<string, DataRecord>();
        recs.forEach((r) => recordMap.set(r.id, r));

        const tableRecs = z.array(TableRecord).parse(
          recs.map((rec: DataRecord) => {
            // TODO: Handle more than one contacts per record
            const contact: Contact | null =
              rec.contacts.length > 0 ? rec.contacts[0] : null;
            const company: Company | null =
              rec.contacts.length > 0 && rec.contacts[0].companies.length > 0
                ? rec.contacts[0].companies[0]
                : null;
            const record: Record<string, any> = {
              id: rec.id,
              date: new Date(rec.startedAt),
              dataSourceName: rec.dataSource.name,
              utm: rec.utm.toString(),
              topic: rec.externalName,
              type: rec.type,
              tags: rec.tags.map((tag: Tag) => tag.value),
              contactName: "Unknown",
              companyName: "Unknown",
              contactLocation: "Unknown",
              companyLocation: "Unknown",
              plan: "Unknown",
              arr: 0,
            };

            if (contact !== null) {
              record["contactName"] = contact.name;
              record["contactLocation"] = contact.location.country;
              record["plan"] = contact.plan?.name;
            }
            if (company !== null) {
              record["companyName"] = company.name;
              record["companyLocation"] = company?.location.country;
              record["plan"] = company.plan?.name;
              record["arr"] = company.monthlySpend * 12;
            }

            rec.scores.forEach((item) => {
              record[titleCaseToCamelCase(item.name)] = item.value;
            });
            return record;
          }),
        );

        setRecords(recordMap);
        setDataRecords(tableRecs);
        setIsPopulated(true);
      } catch (error: any) {
        toast.error("Failed to load data.", { description: error.toString() });
      }
    };
    fetchSurvey();
  }, []);

  const handleRowClick = function <TData>(data: TData) {
    const record: RecordSchema = data as RecordSchema;
    const resp: DataRecord | undefined = records.get(record.id);
    if (resp === undefined) {
      return;
    }
    setSelectedRow(resp);
  };

  const handleRowSelection = function <TData>(selectedTableRows: TData[]) {
    const rows: RecordSchema[] = selectedTableRows as RecordSchema[];
    const dataRecords: DataRecord[] = [];
    for (let i = 0; i < rows.length; i++) {
      const item: DataRecord | undefined = records.get(rows[i].id);
      if (item === undefined) {
        continue;
      }
      dataRecords.push(item);
    }
    setSelectedRows(dataRecords);
  };

  const handleCopyRecordLink = async (recordId: string | undefined) => {
    try {
      const currentDomain = window.location.host;
      await navigator.clipboard.writeText(
        `https://${currentDomain}/records/${recordId}`,
      );
      toast.success("Record link copied!");
    } catch (error: any) {
      toast.error("Failed to copy record link.", {
        description: error.toString(),
      });
    }
  };

  const [sheetOpen, setSheetOpen] = useState(false);

  const handleOpenSheet = function <TData>(data: TData) {
    setSheetOpen(true);
    const record: RecordSchema = data as RecordSchema;
    const resp: DataRecord | undefined = records.get(record.id);
    if (resp !== undefined) {
      setSelectedRow(resp);
    }
  };

  const handleCloseSheet = function () {
    setSheetOpen(false);
  };

  const handleGenerateInsights = async () => {
    try {
      const userToken = await getUserAccessToken();
      if (userToken === undefined) {
        throw Error("User needs to login!");
      }
      toast.success("Insight generation started.");
      const recordIds: string[] = selectedRows.map((record) => record.id);
      if (recordIds.length <= 0) {
        toast.error("Failed to generate insight.", {
          description: "Please select one or more records to generate insights",
        });
        return;
      }
      const insights = await generateInsights(userToken, recordIds);
      toast.success("Insight generation completed.");
    } catch (error: any) {
      toast.error("Failed to generate insight.", {
        description: error.toString(),
      });
    }
  };

  return (
    <>
      <Toaster theme="light" />
      <Button
        onClick={handleGenerateInsights}
        disabled={selectedRows.length <= 0}
      >
        <SparklesIcon className="mr-2 h-4 w-4" />
        Generate insights
      </Button>
      <div className="flex flex-row h-full">
        {isPopulated ? (
          <Sheet modal={false} open={sheetOpen}>
            <div className="flex flex-col flex-1 pb-12">
              <div className="flex flex-col pb-4 bg-white border border-zinc-200 rounded-lg">
                <DataTable
                  columns={getRecordColumns()}
                  data={dataRecords}
                  filters={filters}
                  onRowClick={handleOpenSheet}
                  records={dataRecords}
                  enableRowSelection={true}
                  onSelectedRowsChange={handleRowSelection}
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
                      <Link target="blank" href={`/records/${selectedRow?.id}`}>
                        <Button variant="ghost" size="icon" disabled={false}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>View fullscreen</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={false}
                        onClick={() => handleCopyRecordLink(selectedRow?.id)}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share link</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <div className="flex-1 overflow-y-auto">
                {selectedRow !== null && <RecordDetails record={selectedRow} />}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex flex-col flex-1 pb-12 border-e border-slate-200 bg-white"></div>
        )}
      </div>
    </>
  );
}
