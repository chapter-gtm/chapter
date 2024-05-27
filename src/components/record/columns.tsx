"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ChatBubbleIcon, FileTextIcon, StackIcon } from "@radix-ui/react-icons";
import { PhoneCall, StarHalf, StickyNote } from "lucide-react";
import SvgAppleLogo from "@/components/icons/AppleLogo";
import SvgGongLogo from "@/components/icons/GongLogo";
import SvgIntercomLogo from "@/components/icons/IntercomLogo";
import SvgNotionLogo from "@/components/icons/NotionLogo";
import SvgGooglePlayLogo from "@/components/icons/GooglePlayLogo";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import { RecordType } from "@/types/record";
import { humanDate, titleCaseToCamelCase } from "@/utils/misc";

import { type ScoreDefinition, type Tag } from "@/types/score";
import { type Contact } from "@/types/contact";
import { RatingLabel } from "@/types/survey";
import { toTitleCase } from "@/utils/misc";

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
        label: "Chat",
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
  {
    tableColumnName: "dataSourceName",
    label: "Source",
    filterOptions: [
      {
        value: "Nectar",
        label: "Survey",
        icon: undefined,
      },
      {
        value: "Intercom",
        label: "Intercom",
        icon: SvgIntercomLogo,
      },
      {
        value: "Gong",
        label: "Gong",
        icon: SvgGongLogo,
      },
      {
        value: "Notion",
        label: "Notion",
        icon: SvgNotionLogo,
      },
      {
        value: "G2",
        label: "G2",
        icon: SvgGongLogo,
      },
      {
        value: "Apple App Store",
        label: "App Store",
        icon: SvgAppleLogo,
      },
      {
        value: "Google Play Store",
        label: "Play Store",
        icon: SvgGooglePlayLogo,
      },
    ],
  },
  {
    tableColumnName: "tags",
    label: "Tags",
    filterOptions: [
      {
        value: "onboarding",
        label: "Onboarding",
        icon: undefined,
      },
      {
        value: "checkout",
        label: "Checkout",
        icon: undefined,
      },
      {
        value: "pricing",
        label: "Pricing",
        icon: undefined,
      },
    ],
  },
  {
    tableColumnName: "signedUpAt",
    label: "Tenure",
    filterOptions: [
      {
        value: ">12 months",
        label: ">12 months",
        icon: undefined,
      },
      {
        value: "6-12 months",
        label: "6-12 months",
        icon: undefined,
      },
      {
        value: "3-6 months",
        label: "3-6 months",
        icon: undefined,
      },
      {
        value: "<3 months",
        label: "<3 months",
        icon: undefined,
      },
    ],
  },
  {
    tableColumnName: "companyName",
    label: "Account",
    filterOptions: [
      {
        value: "Klarna",
        label: "Klarna",
        icon: undefined,
      },
      {
        value: "Mojang",
        label: "Mojang",
        icon: undefined,
      },
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
      {
        value: "Truecaller",
        label: "Truecaller",
        icon: undefined,
      },
    ],
  },
  {
    tableColumnName: "companyLocation",
    label: "Location",
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
        value: "starter",
        label: "Starter",
        icon: undefined,
      },
      {
        value: "growth",
        label: "Growth",
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

function getTenureFromDate(date: Date) {
  const currentDate = new Date();
  const diffInMonths =
    (currentDate.getFullYear() - date.getFullYear()) * 12 +
    (currentDate.getMonth() - date.getMonth());

  let tenureLabel = "";
  if (diffInMonths > 12) {
    tenureLabel = ">12 months";
  } else if (diffInMonths >= 6) {
    tenureLabel = "6-12 months";
  } else if (diffInMonths >= 3) {
    tenureLabel = "3-6 months";
  } else {
    tenureLabel = "<3 months";
  }
  const tenure = filters[3].filterOptions.find(
    (tenure) => tenure.value === tenureLabel,
  );

  return tenure;
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
    cell: ({ row }) => {
      const type = filters[1].filterOptions.find(
        (type) => type.value === row.getValue("dataSourceName"),
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
  {
    accessorKey: "topic",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ row }) => <div className="flex">{row.getValue("topic")}</div>,
  },
  {
    accessorKey: "contactName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => (
      <div className="flex">{row.getValue("contactName")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
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
      <DataTableColumnHeader column={column} title="Location" />
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

    cell: ({ row }) => (
      <div className="flex">
        <Badge variant="outline" className="font-normal text-sm p-1 bg-white">
          {row.getValue("plan")}
        </Badge>
      </div>
    ),
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
    accessorKey: "signedUpAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tenure" />
    ),
    cell: ({ row }) => {
      const signedUpAt: Date = row.getValue("signedUpAt");
      if (!signedUpAt) {
        return null;
      }

      const tenure = getTenureFromDate(signedUpAt);
      if (!tenure) {
        return null;
      }

      return (
        <div className="flex items-center">
          {tenure.hasOwnProperty("icon") && tenure.icon && (
            <tenure.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{tenure.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const signedUpAt: Date = row.getValue(id);
      if (!signedUpAt) {
        return false;
      }

      const tenure = getTenureFromDate(signedUpAt);
      if (!tenure) {
        return false;
      }

      return value.includes(tenure.value);
    },
  },
  // {
  //   accessorKey: "type",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Type" />
  //   ),
  //   cell: ({ row }) => {
  //     const type = filters[0].filterOptions.find(
  //       (type) => type.value === row.getValue("type")
  //     );

  //     if (!type) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {type.hasOwnProperty("icon") && type.icon && (
  //           <type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{type.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    cell: ({ row }) => {
      const tags: string[] = row.getValue("tags");
      return (
        <div className="flex items-center gap-2">
          {tags.map((item, index) => (
            <Badge
              key={index}
              variant="outline"
              className="font-normal text-sm p-1 bg-white"
            >
              {toTitleCase(item)}
            </Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const tags: string[] = row.getValue(id);
      return value.some((item: string) => tags.includes(item));
    },
  },
];

export function getRecordColumns() {
  const finalColumns: ColumnDef<RecordSchema>[] = [...fixedRecordColumns];
  const scoreDefinitions = ["Input Quality", "Sentiment"];
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
