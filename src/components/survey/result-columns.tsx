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

import { SurveyResponseStage, RatingLabel } from "@/types/survey";

export const SurveyResponseRecord = z.record(z.any());
export type SurveyResponseRecordSchema = z.infer<typeof SurveyResponseRecord>;

// TODO: Add score filters dynamically based on score definitions from the survey
export const filters = [
  {
    tableColumnName: "stage",
    label: "Filter",
    filterOptions: [
      {
        value: SurveyResponseStage.NOT_STARTED,
        label: "Not Started",
        icon: CircleIcon,
      },
      {
        value: SurveyResponseStage.IN_PROGRESS,
        label: "Incomplete",
        icon: StopwatchIcon,
      },
      {
        value: SurveyResponseStage.COMPLETED,
        label: "Completed",
        icon: CheckCircledIcon,
      },
      {
        value: SurveyResponseStage.ABORTED,
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

// TODO: Add scores dynamically based on score definitions from the survey
export const resultColumns: ColumnDef<SurveyResponseRecordSchema>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "participant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Participant" />
    ),
    cell: ({ row }) => (
      <div className="flex">{row.getValue("participant")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "utm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UTM" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("utm")}</div>,
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
        <div className="flex items-center">
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
];
