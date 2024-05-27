"use client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ColumnFiltersState } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SparklesIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { ChevronsRight, ExternalLink, LinkIcon } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { RecordDetails } from "@/components/record/RecordDetails";
import {
  RecordSchema,
  TableRecord,
  filters,
  getRecordColumns,
} from "@/components/record/columns";
import { type Company, type Contact } from "@/types/contact";
import { type DataRecord } from "@/types/record";
import { type Tag } from "@/types/score";
import { titleCaseToCamelCase } from "@/utils/misc";
import { generateInsights } from "@/utils/nectar/insights";
import { getRecords } from "@/utils/nectar/records";
import { getUserAccessToken } from "@/utils/supabase/client";

interface RecordsProps {}

export function Records({}: RecordsProps) {
  const [isPopulated, setIsPopulated] = useState(false);
  const [records, setRecords] = useState<Map<string, DataRecord>>(new Map());
  const [dataRecords, setDataRecords] = useState<RecordSchema[]>([]);
  const [selectedRow, setSelectedRow] = useState<DataRecord | null>(null);
  const [selectedRows, setSelectedRows] = useState<DataRecord[]>([]);
  const [draftingInsights, setDraftingInsights] = useState(false);
  const [preSelectedFilters, setPreSelectedFilters] =
    useState<ColumnFiltersState>([]);

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
              signedUpAt: null,
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
              record["signedUpAt"] =
                contact.signedUpAt !== null
                  ? new Date(contact.signedUpAt)
                  : null;
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
      setDraftingInsights(true);
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
      toast.success("Insight generated.", {
        action: {
          label: "Open",
          onClick: () => {
            window.open(`/insights/${insights[0].id}`, "_blank");
          },
        },
      });
    } catch (error: any) {
      toast.error("Failed to generate insight.", {
        description: error.toString(),
      });
    } finally {
      setDraftingInsights(false);
    }
  };

  const handleViewChange = async (value: string) => {
    if (value === "all") {
      setPreSelectedFilters([]);
    } else if (value === "sentimentNegative") {
    } else if (value === "highValueCustomers") {
      setPreSelectedFilters([{ id: "plan", value: ["Enterprise"] }]);
    }
    setIsPopulated(true);
  };

  return (
    <>
      <div className="bg-white rounded-md">
        <Toaster theme="light" />
        <div className="flex flex-row justify-between space-y-1 center h-[60px] items-center px-4 ">
          <h2 className="text-base font-medium tracking-normal text-zinc-700">
            Conversations
          </h2>
          <Button
            onClick={handleGenerateInsights}
            className="py-0 px-3 font-medium rounded-md"
            disabled={selectedRows.length <= 0}
          >
            <SparklesIcon className="mr-1 h-4 w-4" />
            {draftingInsights ? "Drafting insights..." : "Draft insights"}
          </Button>
        </div>

        <div className="flex flex-row h-full">
          {isPopulated ? (
            <div>
              <div className="flex px-3">
                <ToggleGroup
                  type="single"
                  onValueChange={handleViewChange}
                  defaultValue="all"
                >
                  <ToggleGroupItem
                    value="all"
                    aria-label="All conversations"
                    defaultChecked
                  >
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="sentimentNegative"
                    aria-label="Conversations with negative sentiment"
                  >
                    Sentiment: Negative
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="highValueCustomers"
                    aria-label="Conversations with High value customers"
                  >
                    Customer Value: High
                  </ToggleGroupItem>
                  <ToggleGroupItem value="add">
                    <PlusIcon className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <Sheet modal={false} open={sheetOpen}>
                <div className="flex flex-col flex-1">
                  <div className="flex flex-col pb-4">
                    <DataTable
                      columns={getRecordColumns()}
                      data={dataRecords}
                      filters={filters}
                      preSelectedFilters={preSelectedFilters}
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
                          <Link
                            target="blank"
                            href={`/records/${selectedRow?.id}`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={false}
                            >
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
                            onClick={() =>
                              handleCopyRecordLink(selectedRow?.id)
                            }
                          >
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Share link</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>

                  <div className="flex-1 overflow-y-auto">
                    {selectedRow !== null && (
                      <RecordDetails record={selectedRow} />
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex flex-col flex-1 pb-12 border-e border-slate-200 bg-white"></div>
          )}
        </div>
      </div>
    </>
  );
}
