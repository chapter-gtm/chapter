"use client";

import { PhoneCall, StarHalf, StickyNote } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ChatBubbleIcon, FileTextIcon, StackIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import { RecordType } from "@/types/record";
import { humanDate, titleCaseToCamelCase } from "@/utils/misc";

import { RatingLabel } from "@/types/survey";

export const TableRecord = z.record(z.any());
export type RecordSchema = z.infer<typeof TableRecord>;

// TODO: Add score filters dynamically based on score definitions from the survey
export const recordFilters = [
  {
    tableColumnName: "type",
    label: "Type",
    filterOptions: [
      {
        value: RecordType.SURVEY_RESPONSE,
        label: "Survey Response",
        icon: StackIcon,
      },
      {
        value: RecordType.NOTES,
        label: "Notes",
        icon: FileTextIcon,
      },
      {
        value: RecordType.CHAT_TRANSCRIPT,
        label: "Chat Transcript",
        icon: ChatBubbleIcon,
      },
      {
        value: RecordType.CALL_TRANSCRIPT,
        label: "Call",
        icon: PhoneCall,
      },
      {
        value: RecordType.REVIEW,
        label: "Review",
        icon: StarHalf,
      },
      {
        value: RecordType.POST,
        label: "Post",
        icon: StickyNote,
      },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// TODO: Add scores dynamically based on score definitions from the survey
const fixedRecordColumns: ColumnDef<RecordSchema>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="flex">{humanDate(row.getValue("date"))}</div>
    ),
  },
  {
    accessorKey: "dataSourceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => (
      <div className="flex">{row.getValue("dataSourceName")}</div>
    ),
  },
  {
    accessorKey: "externalName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex">{row.getValue("externalName")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = recordFilters[0].filterOptions.find(
        (type) => type.value === row.getValue("type"),
      );

      if (!type) {
        return null;
      }

      return (
        <div className="flex items-center">
          {type.hasOwnProperty("icon") && type.icon && (
            <type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{type.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

export function getRecordColumns() {
  const finalColumns: ColumnDef<RecordSchema>[] = [...fixedRecordColumns];
  const scoreDefinitions = ["Input Quality"];
  scoreDefinitions.forEach((name: string) => {
    const fieldName = titleCaseToCamelCase(name);
    finalColumns.push({
      accessorKey: fieldName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={name} />
      ),
      cell: ({ row }) => {
        const score: number = row.getValue(fieldName);
        return (
          <div className="flex">
            <div
              className={classNames(
                RatingLabel[score]?.color,
                "p-1 rounded-lg",
              )}
            >
              {RatingLabel[score]?.label}
            </div>
          </div>
        );
      },
    });
  });
  return finalColumns;
}
