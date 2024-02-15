"use client";

import { z } from "zod";
import {
  CircleIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { SurveyStage } from "@/types/survey";

export const submissionSchema = z.object({
  id: z.string(),
  date: z.string(),
  email: z.string(),
  stage: z.string(),
  sentiment: z.number(),
});

type Submission = z.infer<typeof submissionSchema>;

export const filters = [
  {
    tableColumnName: "stage",
    label: "Stage",
    filterOptions: [
      {
        value: "Not Started",
        label: "Not Started",
        icon: CircleIcon,
      },
      {
        value: "Started",
        label: "Started",
        icon: StopwatchIcon,
      },
      {
        value: "Completed",
        label: "Completed",
        icon: CheckCircledIcon,
      },
      {
        value: "Aborted",
        label: "Aborted",
        icon: CrossCircledIcon,
      },
    ],
  },
];

export const resultColumns: ColumnDef<Submission>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("date")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("email")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stage" />
    ),
    cell: ({ row }) => {
      const stage = filters[0].filterOptions.find(
        (stage) => stage.value === row.getValue("stage"),
      );

      if (!stage) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {stage.icon && (
            <stage.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{stage.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "sentiment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sentiment" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("sentiment")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
