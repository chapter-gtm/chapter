"use client"
import * as React from "react"

import { type User } from "@/types/user"
import { type Icp } from "@/types/icp"
import { type Opportunity } from "@/types/opportunity"
import { Score } from "@/types/scale"
import { getUsers } from "@/utils/chapter/users"
import { getIcps } from "@/utils/chapter/icp"
import { getOpportunities } from "@/utils/chapter/opportunity"
import {
  getUserProfile,
  addOpportunityToRecentlyViewed,
} from "@/utils/chapter/users"
import { findIcpMatches } from "@/utils/misc"
import {
  RecordSchema,
  TableRecord,
  getFilters,
  getRecordColumns,
  getDefaultColumnVisibility,
} from "./columns"
import { DataTable } from "@/components/data-table/data-table"
import { OpportunityDrawer } from "./OpportunityDrawer"

import { Progress } from "@/components/ui/progress"

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { ChevronsRight, ExternalLink, LinkIcon, Building2 } from "lucide-react"

import { ColumnFiltersState, ColumnDef } from "@tanstack/react-table"
import { z } from "zod"
import { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"

import { OpportunityStageList } from "./OpportunityStageList"
import { OpportunityOwner } from "./OpportunityOwner"
export function OpportunitiesMain() {
  const [isPopulated, setIsPopulated] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [icp, setIcp] = useState<Icp | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const icpRef = useRef(icp)
  const [records, setRecords] = useState<RecordSchema[]>([])
  const [recordColumns, setRecordColumns] = useState<ColumnDef<RecordSchema>[]>(
    []
  )
  const [opportunityMap, setOpportunityMap] = useState<
    Map<string, Opportunity>
  >(new Map())
  const opportunityMapRef = useRef(opportunityMap)

  const [selectedRow, setSelectedRow] = useState<Opportunity | null>(null)
  const [preSelectedFilters, setPreSelectedFilters] =
    useState<ColumnFiltersState>([])

  useEffect(() => {
    const fetchIcpAndOpportunities = async () => {
      try {
        const users = await getUsers()

        const currentUserIcps = await getIcps()
        if (currentUserIcps === null || currentUserIcps.length <= 0) {
          throw new Error("Failed to fetch ICP")
        }

        const opportunities = await getOpportunities(
          1000,
          1,
          "created_at",
          "desc",
          "",
          "",
          true
        )

        const oppMap = new Map<string, Opportunity>()
        opportunities.forEach((r) => oppMap.set(r.id, r))

        const tableRecords = z.array(TableRecord).parse(
          opportunities.map((rec: Opportunity) => {
            const record: Record<string, any> = {
              id: rec.id,
              date: new Date(rec.createdAt), // TODO: handle in getOpportunities method
              score: (() => {
                const icpMatches =
                  rec.contacts &&
                  rec.contacts.some((contact) =>
                    findIcpMatches(contact, currentUserIcps[0])
                  )
                return icpMatches ? Score.EXCELLENT : Score.GREAT
              })(),
              stage: rec.stage,
              companyName: rec.company?.name,
              profilePicUrl: rec.company?.profilePicUrl,
              companySize: rec.company?.headcount,
              orgSize: rec.company?.orgSize,
              fundingRound: rec.company?.lastFunding?.roundName,
              companyLocation: rec.company?.hqLocation,
              industry: rec.company?.industry,
              tools:
                rec.jobPosts?.flatMap((jobPost) => jobPost.tools) ||
                rec.repos?.flatMap((repo) => repo.language),
              processes: rec.jobPosts?.flatMap((jobPost) => jobPost.processes),
              investors: rec.company?.lastFunding?.investors,
              owner: rec.owner,
            }
            return record
          })
        )
        setAllUsers(users)
        setIcp(currentUserIcps[0])
        setOpportunityMap(oppMap)
        setRecords(tableRecords)
        setIsPopulated(true)

        // Populate columns
        setRecordColumns(
          getRecordColumns(
            currentUserIcps[0],
            allUsers,
            updateOpportunityCallback,
            handleOpenDrawerCallback
          )
        )
      } catch (error: any) {
        toast.error("Failed to load data.", { description: error.toString() })
      }
    }
    fetchIcpAndOpportunities()
  }, [])

  useEffect(() => {
    opportunityMapRef.current = opportunityMap
  }, [opportunityMap])

  useEffect(() => {
    icpRef.current = icp
  }, [icp])

  const handleRowClick = function <TData>(data: TData) {
    const record: RecordSchema = data as RecordSchema
    const opportunity: Opportunity | undefined = opportunityMap.get(record.id)
    if (opportunity === undefined) {
      return
    }
    setSelectedRow(opportunity)
  }

  const handleRowSelection = function <TData>(selectedTableRows: TData[]) {
    const rows: RecordSchema[] = selectedTableRows as RecordSchema[]
    const opportunities: Opportunity[] = []
    for (let i = 0; i < rows.length; i++) {
      const opportunity: Opportunity | undefined = opportunityMap.get(
        rows[i].id
      )
      if (opportunity === undefined) {
        continue
      }
      opportunities.push(opportunity)
    }
  }

  const handleCopyRecordLink = async (recordId: string | undefined) => {
    try {
      const currentDomain = window.location.host
      await navigator.clipboard.writeText(
        `https://${currentDomain}/opportunities/${recordId}`
      )
      toast.success("Opportunity link copied!")
    } catch (error: any) {
      toast.error("Failed to copy opportunity link.", {
        description: error.toString(),
      })
    }
  }

  const handleOpenSheetCallback = function <TData>(data: TData) {
    const record: RecordSchema = data as RecordSchema
    const opportunity: Opportunity | undefined = opportunityMapRef.current.get(
      record.id
    )
    if (opportunity !== undefined) {
      setSelectedRow(opportunity)
    }
    if (!sheetOpen) {
      setSheetOpen(true)
    }
  }

  const handleOpenDrawerCallback = useCallback(async (id: string) => {
    const opportunity: Opportunity | undefined =
      opportunityMapRef.current.get(id)
    if (!opportunity) {
      toast.error("Failed to load opportunity")
      return
    }
    setSelectedRow(opportunity)
    if (!sheetOpen) {
      setSheetOpen(true)
    }

    // Add opportunity to recently viewed list for user
    const user = await getUserProfile()
    await addOpportunityToRecentlyViewed(user, opportunity.id)
  }, [])

  const handleCloseSheet = function () {
    setSheetOpen(false)
  }

  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  const updateOpportunityCallback = useCallback(
    async (updatedOpportunity: Opportunity) => {
      // Update records
      setRecords((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedOpportunity.id
            ? { ...item, ...updatedOpportunity }
            : item
        )
      )

      // Update selected row
      setSelectedRow(updatedOpportunity)

      // Update map (which will be used to set selectedRow on the next row click)
      const updatedOpportunityMap = new Map<string, Opportunity>(
        opportunityMapRef.current
      )
      updatedOpportunityMap.set(updatedOpportunity.id, updatedOpportunity)
      setOpportunityMap(updatedOpportunityMap)

      // Repopulate columns
      if (icpRef.current) {
        setRecordColumns(
          getRecordColumns(
            icpRef.current,
            allUsers,
            updateOpportunityCallback,
            handleOpenDrawerCallback
          )
        )
      } else {
        toast.error("Failed to refresh table, please reload.")
      }
    },
    []
  )

  return (
    <>
      <div className="flex flex-col flex-1 h-full pt-20 p-6 bg-white dark:bg-background">
        <Toaster theme="light" />
        <div className="w-full">
          <div className="flex flex-row justify-start gap-x-2 center  items-center ps-2 py-5">
            <Building2 width={18} />
            <h2 className="text-base font-medium tracking-normal text-color-header">
              All opportunities ({records.length})
            </h2>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-card rounded-lg border border-border">
          {isPopulated && icp && allUsers ? (
            <>
              <Sheet modal={false} open={sheetOpen}>
                <DataTable
                  columns={recordColumns}
                  data={records}
                  filters={getFilters(icp, allUsers)}
                  preSelectedFilters={preSelectedFilters}
                  defaultColumnVisibility={getDefaultColumnVisibility(icp)}
                  enableRowSelection={true}
                  onSelectedRowsChange={handleRowSelection}
                  stickyColumnCount={1}
                  nonClickableColumns={["select", "stage"]}
                />

                <SheetContent className="sm:max-w-[575px] p-0 h-dvh max-h-dvh flex flex-col overflow-hidden gap-y-0 bg-white dark:bg-card border-border">
                  <TooltipProvider delayDuration={0}>
                    <div className="flex flex-row justify-between pt-2 w-full items-center text-zinc-500 dark:text-zinc-400 pe-3">
                      <div className="flex flex-row justify-start items-center px-3 py-2">
                        <SheetClose
                          onClick={handleCloseSheet}
                          className="relative h-7 w-7 justify-center items-center rounded-lg transition-opacity hover:bg-popover focus:outline-none"
                        >
                          <ChevronsRight className="h-4 w-4 mx-auto" />
                          <span className="sr-only">Close</span>
                        </SheetClose>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              target="_blank"
                              href={`/opportunities/${selectedRow?.id}`}
                              className="w-7 h-7 ps-1.5 content-center justify-center hover:bg-popover rounded-lg"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </TooltipTrigger>
                          {/* <TooltipContent>View fullscreen</TooltipContent> */}
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-7 h-7 p-0 text-zinc-600 dark:text-zinc-400 bg-transparent border-none"
                              onClick={() =>
                                handleCopyRecordLink(selectedRow?.id)
                              }
                            >
                              <LinkIcon className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                        </Tooltip>
                      </div>

                      {selectedRow !== null && (
                        <>
                          <div className="flex flex-row items-center gap-2">
                            <OpportunityOwner
                              opportunity={selectedRow}
                              updateOpportunity={updateOpportunityCallback}
                            />
                            <OpportunityStageList
                              opportunity={selectedRow}
                              updateOpportunity={updateOpportunityCallback}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </TooltipProvider>

                  <div className="flex-1 overflow-y-auto card">
                    {selectedRow !== null && (
                      <OpportunityDrawer opportunity={selectedRow} icp={icp} />
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center flex-1 pb-12 border-e border-border bg-card">
              <div className="flex flex-col justify-center items-center gap-4 max-w-72">
                <Progress value={progress} className="w-[60%] h-1" />
                <p className="text-lg text-center">
                  Crunching the latest data, just for you. Hang tight...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
