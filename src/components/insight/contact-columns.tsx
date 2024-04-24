"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const ContactRecord = z.record(z.any());
export type ContactSchema = z.infer<typeof ContactRecord>;

// TODO: Add score filters dynamically based on score definitions from the survey
export const contactFilters = [];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// TODO: Add scores dynamically based on score definitions from the survey
export const fixedContactColumns: ColumnDef<ContactSchema>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("country")}</div>,
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("company")}</div>,
  },
];
