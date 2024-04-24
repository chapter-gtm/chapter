"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const CompanyRecord = z.record(z.any());
export type CompanySchema = z.infer<typeof CompanyRecord>;

// TODO: Add score filters dynamically based on score definitions from the survey
export const companyFilters = [];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// TODO: Add scores dynamically based on score definitions from the survey
export const fixedCompanyColumns: ColumnDef<CompanySchema>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("size")}</div>,
  },
  {
    accessorKey: "industry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("industry")}</div>,
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("country")}</div>,
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("plan")}</div>,
  },
  {
    accessorKey: "arr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ARR" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("arr")}</div>,
  },
  {
    accessorKey: "userCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Count" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("userCount")}</div>,
  },
];
