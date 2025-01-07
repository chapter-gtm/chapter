"use client"

import React from "react"

import { Cross2Icon, ChevronRightIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import {
  DataTableFacetedFilter,
  FilterOptions,
} from "@/components/data-table/data-table-faceted-filter"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
} from "@/components/ui/dialog"
import { Overlay } from "@radix-ui/react-dialog"
import { Label } from "@radix-ui/react-label"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ToolbarFilter {
  tableColumnName: string
  label: string
  filterOptions: FilterOptions[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters: ToolbarFilter[]
}

export function DataTableToolbar<TData>({
  table,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between relative space-x-3 px-4 h-14">
      <div className="flex items-center space-x-2 relative">
        <Input
          placeholder="Search..."
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {filters
          .filter((item) => item.filterOptions.length > 0)
          .map((item, index) => (
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
            className="h-8 px-2 lg:px-3 "
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
