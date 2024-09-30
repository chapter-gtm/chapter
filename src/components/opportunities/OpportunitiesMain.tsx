"use client";

import { type Icp } from "@/types/icp";
import { type Opportunity } from "@/types/opportunity";
import { FundingRound } from "@/types/company";
import { type Location } from "@/types/location";
import { getIcp } from "@/utils/chapter/icp";
import { getOpportunities } from "@/utils/chapter/opportunity";
import {
  RecordSchema,
  TableRecord,
  getFilters,
  getRecordColumns,
  defaultColumnVisibility,
} from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { OpportunityDrawer } from "./OpportunityDrawer";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ChevronsRight, ExternalLink, LinkIcon, Building2 } from "lucide-react";

import { ColumnFiltersState, ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@radix-ui/react-select";

export function OpportunitiesMain() {
  const [isPopulated, setIsPopulated] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [icp, setIcp] = useState<Icp | null>(null);
  const icpRef = useRef(icp);
  const [records, setRecords] = useState<RecordSchema[]>([]);
  const [recordColumns, setRecordColumns] = useState<ColumnDef<RecordSchema>[]>(
    []
  );
  const [opportunityMap, setOpportunityMap] = useState<
    Map<string, Opportunity>
  >(new Map());
  const opportunityMapRef = useRef(opportunityMap);

  const [selectedRow, setSelectedRow] = useState<Opportunity | null>(null);
  const [selectedRows, setSelectedRows] = useState<Opportunity[]>([]);
  const [preSelectedFilters, setPreSelectedFilters] =
    useState<ColumnFiltersState>([]);

  useEffect(() => {
    const fetchIcpAndOpportunities = async () => {
      try {
        const currentUserIcp = await getIcp();
        const opportunities = await getOpportunities(
          1000,
          1,
          "created_at",
          "desc",
          "",
          "",
          true
        );

        const oppMap = new Map<string, Opportunity>();
        opportunities.forEach((r) => oppMap.set(r.id, r));

        const tableRecords = z.array(TableRecord).parse(
          opportunities.map((rec: Opportunity) => {
            const record: Record<string, any> = {
              id: rec.id,
              date: new Date(rec.createdAt), // TODO: handle in getOpportunities method
              stage: rec.stage,
              companyName: rec.company?.name,
              companySize: rec.company?.headcount,
              orgSize: rec.company?.orgSize,
              fundingRound: rec.company?.lastFunding?.roundName,
              companyLocation: rec.company?.hqLocation,
              industry: rec.company?.industry,
              tools: rec.jobPosts?.flatMap((jobPost) => jobPost.tools),
              investors: rec.company?.lastFunding?.investors,
            };
            return record;
          })
        );
        setIcp(currentUserIcp);
        setOpportunityMap(oppMap);
        setRecords(tableRecords);
        setIsPopulated(true);

        // Populate columns
        setRecordColumns(
          getRecordColumns(
            currentUserIcp,
            updateOpportunityCallback,
            handleOpenDrawerCallback
          )
        );
      } catch (error: any) {
        toast.error("Failed to load data.", { description: error.toString() });
      }
    };
    fetchIcpAndOpportunities();
  }, []);

  useEffect(() => {
    opportunityMapRef.current = opportunityMap;
  }, [opportunityMap]);

  useEffect(() => {
    icpRef.current = icp;
  }, [icp]);

  const handleRowClick = function <TData>(data: TData) {
    const record: RecordSchema = data as RecordSchema;
    const opportunity: Opportunity | undefined = opportunityMap.get(record.id);
    if (opportunity === undefined) {
      return;
    }
    setSelectedRow(opportunity);
  };

  const handleRowSelection = function <TData>(selectedTableRows: TData[]) {
    const rows: RecordSchema[] = selectedTableRows as RecordSchema[];
    const opportunities: Opportunity[] = [];
    for (let i = 0; i < rows.length; i++) {
      const opportunity: Opportunity | undefined = opportunityMap.get(
        rows[i].id
      );
      if (opportunity === undefined) {
        continue;
      }
      opportunities.push(opportunity);
    }
    setSelectedRows(opportunities);
  };

  const handleCopyRecordLink = async (recordId: string | undefined) => {
    try {
      const currentDomain = window.location.host;
      await navigator.clipboard.writeText(
        `https://${currentDomain}/opportunities/${recordId}`
      );
      toast.success("Opportunity link copied!");
    } catch (error: any) {
      toast.error("Failed to copy opportunity link.", {
        description: error.toString(),
      });
    }
  };

  const handleOpenSheetCallback = function <TData>(data: TData) {
    const record: RecordSchema = data as RecordSchema;
    const opportunity: Opportunity | undefined = opportunityMapRef.current.get(
      record.id
    );
    if (opportunity !== undefined) {
      setSelectedRow(opportunity);
    }
    if (!sheetOpen) {
      setSheetOpen(true);
    }
  };

  const handleOpenDrawerCallback = useCallback(async (id: string) => {
    const opportunity: Opportunity | undefined =
      opportunityMapRef.current.get(id);
    if (!opportunity) {
      toast.error("Failed to load opportunity");
      return;
    }
    setSelectedRow(opportunity);
    if (!sheetOpen) {
      setSheetOpen(true);
    }
  }, []);

  const handleCloseSheet = function () {
    setSheetOpen(false);
  };

  const updateOpportunityCallback = useCallback(
    async (updatedOpportunity: Opportunity) => {
      // Update records
      setRecords((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedOpportunity.id
            ? { ...item, ...updatedOpportunity }
            : item
        )
      );

      // Update selected row
      setSelectedRow(updatedOpportunity);

      // Update map (which will be used to set selectedRow on the next row click)
      const updatedOpportunityMap = new Map<string, Opportunity>(
        opportunityMapRef.current
      );
      updatedOpportunityMap.set(updatedOpportunity.id, updatedOpportunity);
      setOpportunityMap(updatedOpportunityMap);

      // Repopulate columns
      if (icpRef.current) {
        setRecordColumns(
          getRecordColumns(
            icpRef.current,
            updateOpportunityCallback,
            handleOpenDrawerCallback
          )
        );
      } else {
        toast.error("Failed to refresh table, please reload.");
      }
    },
    []
  );

  return (
    <>
      <div className="w-full mt-2 ">
        <Toaster theme="light" />
        <div className="flex flex-row justify-start space-y-1 gap-x-2 center h-[60px] items-center ps-2">
          <Building2 width={18} />
          <h2 className="text-base font-medium tracking-normal text-color-header">
            All opportunities ({records.length})
          </h2>
        </div>

        <div className="h-full bg-card rounded-lg overflow-hidden border border-border">
          {isPopulated && icp ? (
            <div>
              <Sheet modal={false} open={sheetOpen}>
                <div>
                  <div className="pb-4 w-full">
                    <DataTable
                      columns={recordColumns}
                      data={records}
                      filters={getFilters(icp)}
                      preSelectedFilters={preSelectedFilters}
                      defaultColumnVisibility={defaultColumnVisibility}
                      enableRowSelection={true}
                      onSelectedRowsChange={handleRowSelection}
                      stickyColumnCount={1}
                      nonClickableColumns={["select", "stage"]}
                    />
                  </div>
                </div>

                <SheetContent className="sm:max-w-[700px] p-0 h-dvh max-h-dvh flex flex-col overflow-hidden gap-y-0 bg-card dark:bg-background border-border">
                  <TooltipProvider delayDuration={0}>
                    <div className="flex flex-row justify-start h-14 w-full px-3 py-2">
                      <SheetClose
                        onClick={handleCloseSheet}
                        className="relative h-10 w-10 justify-center items-center rounded-lg transition-opacity hover:bg-accent focus:outline-none"
                      >
                        <ChevronsRight className="h-4 w-4 mx-auto" />
                        <span className="sr-only">Close</span>
                      </SheetClose>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            target="_blank"
                            href={`/opportunities/${selectedRow?.id}`}
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

                  <div className="flex-1 overflow-y-auto card">
                    {selectedRow !== null && (
                      <OpportunityDrawer
                        opportunity={selectedRow}
                        updateOpportunity={updateOpportunityCallback}
                      />
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex flex-col flex-1 pb-12 border-e border-border bg-card"></div>
          )}
        </div>
      </div>
    </>
  );
}
