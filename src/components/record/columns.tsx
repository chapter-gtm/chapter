"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ChatBubbleIcon, FileTextIcon, StackIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import { RecordType } from "@/types/record";
import { humanDate, titleCaseToCamelCase } from "@/utils/misc";

import { type ScoreDefinition } from "@/types/score";
import { type Contact } from "@/types/contact";
import { RatingLabel } from "@/types/survey";

export const TableRecord = z.record(z.any());
export type RecordSchema = z.infer<typeof TableRecord>;

// TODO: Add score filters dynamically based on score definitions from the survey
export const filters = [
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
    ],
  },
  {
    tableColumnName: "contactLocation",
    label: "Contact Location",
    filterOptions: [
      {
        value: "Brazil",
        label: "Brazil",
        icon: undefined,
      },
      {
        value: "UK",
        label: "UK",
        icon: undefined,
      },
      {
        value: "US",
        label: "US",
        icon: undefined,
      },
    ],
  },
  {
    tableColumnName: "companyName",
    label: "Company Name",
    filterOptions: [
      {
        value: "Spotify",
        label: "Spotify",
        icon: undefined,
      },
      {
        value: "Stripe",
        label: "Stripe",
        icon: undefined,
      },
    ],
  },
  {
    tableColumnName: "companyLocation",
    label: "Company Location",
    filterOptions: [
      {
        value: "Sweden",
        label: "Sweden",
        icon: undefined,
      },
      {
        value: "US",
        label: "US",
        icon: undefined,
      },
    ],
  },
  {
    tableColumnName: "plan",
    label: "Plan",
    filterOptions: [
      {
        value: "Free",
        label: "Free",
        icon: undefined,
      },
      {
        value: "Team",
        label: "Team",
        icon: undefined,
      },
      {
        value: "Enterprise",
        label: "Enterprise",
        icon: undefined,
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
const fixedRecordColumns: ColumnDef<RecordSchema>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "contactName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Name" />
    ),
    cell: ({ row }) => (
      <div className="flex">{row.getValue("contactName")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "contactLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Location" />
    ),
    cell: ({ row }) => (
      <div className="flex">{row.getValue("contactLocation")}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }) => (
      <div className="flex">{row.getValue("companyName")}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "companyLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Location" />
    ),
    cell: ({ row }) => (
      <div className="flex">{row.getValue("companyLocation")}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("plan")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "arr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ARR" />
    ),
    cell: ({ row }) => {
      const arr: number = row.getValue("arr");
      const currencySymbol = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD", // Specify the currency code (e.g., USD for US Dollar, EUR for Euro)
      }).formatToParts()[0].value;
      return (
        <div className="flex">{currencySymbol + arr.toLocaleString()}</div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = filters[0].filterOptions.find(
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
