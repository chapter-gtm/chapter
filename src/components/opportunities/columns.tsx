import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ChatBubbleIcon, FileTextIcon, StackIcon } from "@radix-ui/react-icons";
import { PhoneCall, StarHalf, StickyNote } from "lucide-react";

import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { z } from "zod";

import { type Opportunity, OpportunityStage } from "@/types/opportunity";
import { type Company, FundingRound } from "@/types/company";
import { type Location } from "@/types/location";
import { humanDate, titleCaseToCamelCase } from "@/utils/misc";

import { toTitleCase } from "@/utils/misc";

export const TableRecord = z.record(z.any());
export type RecordSchema = z.infer<typeof TableRecord>;

export const filters = [
  {
    tableColumnName: "stage",
    label: "Stage",
    filterOptions: [
      {
        value: OpportunityStage.IDENTIFIED,
        label: OpportunityStage.IDENTIFIED,
        icon: StackIcon,
      },
      {
        value: OpportunityStage.QUALIFIED,
        label: OpportunityStage.QUALIFIED,
        icon: StackIcon,
      },
      {
        value: OpportunityStage.CONTACTED,
        label: OpportunityStage.CONTACTED,
        icon: StackIcon,
      },
      {
        value: OpportunityStage.ENGAGED,
        label: OpportunityStage.ENGAGED,
        icon: StackIcon,
      },
      {
        value: OpportunityStage.PROPOSED,
        label: OpportunityStage.PROPOSED,
        icon: StackIcon,
      },
      {
        value: OpportunityStage.NEGOTIATED,
        label: OpportunityStage.NEGOTIATED,
        icon: StackIcon,
      },
      {
        value: OpportunityStage.DEFERRED,
        label: OpportunityStage.DEFERRED,
        icon: StackIcon,
      },
      {
        value: OpportunityStage.SUSPENDED,
        label: OpportunityStage.SUSPENDED,
        icon: StackIcon,
      },
      {
        value: OpportunityStage.CUSTOMER,
        label: OpportunityStage.CUSTOMER,
        icon: StackIcon,
      },
    ],
  },
  {
    tableColumnName: "companySize",
    label: "Company Size",
    filterOptions: [
      {
        value: "1-10",
        label: "1-10",
        icon: undefined,
      },
      {
        value: "11-50",
        label: "11-50",
        icon: undefined,
      },
      {
        value: "51-200",
        label: "51-200",
        icon: undefined,
      },
      {
        value: "201-500",
        label: "201-500",
        icon: undefined,
      },
      {
        value: "501-1000",
        label: "501-1000",
        icon: undefined,
      },
      {
        value: "1000+",
        label: "1000+",
        icon: undefined,
      },
    ],
  },
  {
    tableColumnName: "fundingRound",
    label: "Funding",
    filterOptions: [
      {
        value: FundingRound.GRANT,
        label: FundingRound.GRANT,
        icon: StackIcon,
      },
      {
        value: FundingRound.PRE_SEED,
        label: FundingRound.PRE_SEED,
        icon: StackIcon,
      },
      {
        value: FundingRound.SEED,
        label: FundingRound.SEED,
        icon: StackIcon,
      },
      {
        value: FundingRound.SERIES_A,
        label: FundingRound.SERIES_A,
        icon: StackIcon,
      },
      {
        value: FundingRound.SERIES_B,
        label: FundingRound.SERIES_B,
        icon: StackIcon,
      },
      {
        value: FundingRound.SERIES_C,
        label: FundingRound.SERIES_C,
        icon: StackIcon,
      },
      {
        value: FundingRound.SERIES_D,
        label: FundingRound.SERIES_D,
        icon: StackIcon,
      },
      {
        value: FundingRound.SERIES_E,
        label: FundingRound.SERIES_E,
        icon: StackIcon,
      },
      {
        value: FundingRound.SERIES_UNKNOWN,
        label: FundingRound.SERIES_UNKNOWN,
        icon: StackIcon,
      },
      {
        value: FundingRound.PUBLIC,
        label: FundingRound.PUBLIC,
        icon: StackIcon,
      },
    ],
  },
  {
    tableColumnName: "companyLocation",
    label: "Location",
    filterOptions: [
      {
        value: "Canada",
        label: "Canada",
        icon: undefined,
      },
      {
        value: "France",
        label: "France",
        icon: undefined,
      },
      {
        value: "Germany",
        label: "Germany",
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
      {
        value: "Rest of the World",
        label: "Rest of the World",
        icon: undefined,
      },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function getStageFromStage(stage: OpportunityStage) {
  const stageLabel: string = stage;

  const opportunityStage = filters[0].filterOptions.find(
    (opportunityStage) => opportunityStage.value === stageLabel
  );

  return opportunityStage;
}

function getCompanySizeFromHeadcount(headcount: number) {
  let companySizeLabel = "Unknown";
  if (headcount <= 10) {
    companySizeLabel = "1-10";
  } else if (headcount <= 50) {
    companySizeLabel = "11-50";
  } else if (headcount <= 200) {
    companySizeLabel = "51-200";
  } else if (headcount <= 201 - 500) {
    companySizeLabel = "201-500";
  } else if (headcount <= 501 - 1000) {
    companySizeLabel = "501-1000";
  } else {
    companySizeLabel = "1000+";
  }
  const companySize = filters[1].filterOptions.find(
    (companySize) => companySize.value === companySizeLabel
  );

  return companySize;
}

function getFundingFromFundingRound(fundingRound: FundingRound) {
  const fundingRoundLabel: string = fundingRound;

  const funding = filters[2].filterOptions.find(
    (funding) => funding.value === fundingRoundLabel
  );

  return funding;
}

function getLocationFromCountry(country: string) {
  let locationLabel = "Rest of the World";
  if (country == "Canada") {
    locationLabel = "Canada";
  } else if (country == "France") {
    locationLabel = "France";
  } else if (country == "Germany") {
    locationLabel = "Germany";
  } else if (country == "UK") {
    locationLabel = "UK";
  } else if (country == "US") {
    locationLabel = "US";
  } else {
    locationLabel = "Rest of the World";
  }
  const location = filters[3].filterOptions.find(
    (location) => location.value === locationLabel
  );

  return location;
}

export const defaultColumnVisibility: VisibilityState = {
  date: true,
  stage: true,
  companyName: true,
  companySize: true,
  fundingRound: true,
  companyLocation: true,
  industry: true,
};

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
    cell: ({ row }) => {
      const createdAt: Date = row.getValue("date");
      return <div className="flex">{humanDate(createdAt)}</div>;
    },
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stage" />
    ),
    cell: ({ row }) => {
      const opportunityStage = getStageFromStage(row.getValue("stage"));
      if (!opportunityStage) {
        return null;
      }

      return (
        <div className="flex items-center">
          {opportunityStage.hasOwnProperty("icon") && opportunityStage.icon && (
            <opportunityStage.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{opportunityStage.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const stage: OpportunityStage = row.getValue(id);
      if (!stage) {
        return false;
      }

      const opportunityStage = getStageFromStage(stage);
      if (!opportunityStage) {
        return false;
      }

      return value.includes(opportunityStage.value);
    },
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      return <div className="flex">{row.getValue("companyName")}</div>;
    },
  },
  {
    accessorKey: "companySize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Size" />
    ),
    cell: ({ row }) => {
      const companySize = getCompanySizeFromHeadcount(
        row.getValue("companySize")
      );
      if (!companySize) {
        return null;
      }

      return (
        <div className="flex items-center">
          {companySize.hasOwnProperty("icon") && companySize.icon && (
            <companySize.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{companySize.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const headcount: number = row.getValue(id);
      const companySize = getCompanySizeFromHeadcount(headcount);
      if (!companySize) {
        return false;
      }

      return value.includes(companySize.value);
    },
  },
  {
    accessorKey: "fundingRound",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funding" />
    ),
    cell: ({ row }) => {
      const funding = getFundingFromFundingRound(row.getValue("fundingRound"));
      if (!funding) {
        return null;
      }

      return (
        <div className="flex items-center">
          {funding.hasOwnProperty("icon") && funding.icon && (
            <funding.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{funding.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const fundingRound: FundingRound = row.getValue(id);
      const funding = getFundingFromFundingRound(fundingRound);
      if (!funding) {
        return false;
      }

      return value.includes(funding.value);
    },
  },
  {
    accessorKey: "companyLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const location: Location = row.getValue("companyLocation");
      return (
        <div className="flex">{` ${location?.city}, ${location?.region}, ${location?.country}`}</div>
      );
    },
    filterFn: (row, id, value) => {
      const location: Location = row.getValue(id);
      if (!location?.country) {
        return false;
      }

      const companyLocation = getLocationFromCountry(location.country);
      if (!companyLocation) {
        return false;
      }

      return value.includes(companyLocation.value);
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "industry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({ row }) => {
      return <div className="flex">{row.getValue("industry")}</div>;
    },
  },
];

export function getRecordColumns() {
  const finalColumns: ColumnDef<RecordSchema>[] = [...fixedRecordColumns];
  return finalColumns;
}
