"use client";
import React from "react";

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

import { ProjectResponseStage, RatingLabel } from "@/types/project";

export const ProjectResponseRecord = z.record(z.any());
export type ProjectResponseRecordSchema = z.infer<typeof ProjectResponseRecord>;

// TODO: Add score filters dynamically based on score definitions from the project
export const filters = [
  {
    tableColumnName: "stage",
    label: "Filter",
    filterOptions: [
      {
        value: ProjectResponseStage.NOT_STARTED,
        label: "Not Started",
        icon: CircleIcon,
      },
      {
        value: ProjectResponseStage.IN_PROGRESS,
        label: "Incomplete",
        icon: StopwatchIcon,
      },
      {
        value: ProjectResponseStage.COMPLETED,
        label: "Completed",
        icon: CheckCircledIcon,
      },
      {
        value: ProjectResponseStage.ABORTED,
        label: "Aborted",
        icon: CrossCircledIcon,
      },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function toShortDate(currentDate: Date) {
  const options = { month: "short", day: "2-digit" } as const;
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  return formattedDate;
}

// TODO: Add scores dynamically based on score definitions from the project
export const resultColumns: ColumnDef<ProjectResponseRecordSchema>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "participant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Participant" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("participant")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "utm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UTM" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("utm")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stage" />
    ),
    cell: ({ row }) => {
      const stage = filters[0].filterOptions.find(
        (stage) => stage.value === row.getValue("stage")
      );

      if (!stage) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {stage.hasOwnProperty("icon") && stage.icon && (
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
    accessorKey: "inputQuality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Input Quality" />
    ),
    cell: ({ row }) => {
      const score: number = row.getValue("inputQuality");
      return (
        <div className="flex">
          <div
            className={classNames(RatingLabel[score]?.color, "p-1 rounded-lg")}
          >
            {RatingLabel[score]?.label}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "problemSeverity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Problem Severity" />
    ),
    cell: ({ row }) => {
      const score: number = row.getValue("problemSeverity");
      return (
        <div className="flex">
          <div
            className={classNames(RatingLabel[score]?.color, "p-1 rounded-lg")}
          >
            {RatingLabel[score]?.label}
          </div>
        </div>
      );
    },
  },
];
