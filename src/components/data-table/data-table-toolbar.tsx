"use client";

import React from "react";

import { Cross2Icon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import {
  DataTableFacetedFilter,
  FilterOptions,
} from "@/components/data-table/data-table-faceted-filter";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Overlay } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";

export interface ToolbarFilter {
  tableColumnName: string;
  label: string;
  filterOptions: FilterOptions[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: ToolbarFilter[];
  filterColumnName: string;
  responseRecords: TData[];
  canCreateInsight?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  filterColumnName,
  responseRecords,
  canCreateInsight,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between relative space-x-3 px-4 h-14">
      <h2 className="flex text-sm font-medium">
        {responseRecords.length}{" "}
        {responseRecords.length === 1 ? "Response" : "Responses"}
      </h2>
      <div className="flex items-center space-x-2 relative">
        {filters.map((item, index) => (
          <DataTableFacetedFilter
            key={index}
            column={table.getColumn(item.tableColumnName)}
            title={item.label}
            options={item.filterOptions}
          />
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DataTableViewOptions table={table} />
        {canCreateInsight && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-8 px-2">Create Insight</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[625px]">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-x-2 items-center">
                    <div className="flex text-sm">Insight</div>
                    <div className="flex">
                      <ChevronRightIcon />
                    </div>
                    <div className="flex text-sm px-2 py-1 bg-zinc-100 rounded-lg">
                      Creation
                    </div>
                  </div>
                  <Input placeholder="Name" className="text-xl" />
                  <Input placeholder="Goal" />
                  <Label className="text-sm">Method template</Label>
                  <div className="grid grid-rows-1 gap-4">
                    <div className="col-span-1 h-12 bg-zinc-200"></div>
                    <div className="col-span-1 h-12 bg-zinc-200"></div>
                    <div className="col-span-1 h-12 bg-zinc-200"></div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
