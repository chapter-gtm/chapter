"use client";

import React from "react";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import {
  DataTableFacetedFilter,
  FilterOptions,
} from "@/components/data-table/data-table-faceted-filter";

export interface ToolbarFilter {
  tableColumnName: string;
  label: string;
  filterOptions: FilterOptions[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: ToolbarFilter[];
  filterColumnName: string;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  filterColumnName,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter ${filterColumnName}s...`}
          value={
            (table.getColumn(filterColumnName)?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn(filterColumnName)
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
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
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
