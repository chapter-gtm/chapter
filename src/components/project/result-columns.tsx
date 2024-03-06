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

import { ProjectResponseStage, RatingLabel } from "@/types/project";

export const projectResponseSchema = z.object({
  id: z.string(),
  date: z.string(),
  participant: z.string(),
  stage: z.nativeEnum(ProjectResponseStage),
});

export type ResponseZODType = z.infer<typeof projectResponseSchema>;

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

export const resultColumns: ColumnDef<ResponseZODType>[] = [
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
];
