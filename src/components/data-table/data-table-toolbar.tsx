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
  records: TData[];
}

export function DataTableToolbar<TData>({
  table,
  filters,
  records,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between relative space-x-3 px-4 h-14">
      <h2 className="flex text-sm font-medium text-zinc-600">
        {records.length} {records.length === 1 ? "Item" : "Items"}
      </h2>
      <div className="flex items-center space-x-2 relative">
        <h2 className="font-medium text-sm text-zinc-600 me-2">Filters</h2>
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
      </div>
    </div>
  );
}
