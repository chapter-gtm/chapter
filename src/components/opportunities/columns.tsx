import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ChatBubbleIcon, FileTextIcon, StackIcon } from "@radix-ui/react-icons";
import {
  PhoneCall,
  StarHalf,
  StickyNote,
  Building2,
  DollarSign,
  MapPin,
  CircleUser,
  Dot,
} from "lucide-react";

import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { type Opportunity, OpportunityStage } from "@/types/opportunity";
import { type Company, FundingRound, OrgSize } from "@/types/company";
import { type Location } from "@/types/location";
import { type Tool } from "@/types/job_post";
import { type Scale, ScaleLabel } from "@/types/scale";
import { humanDate, titleCaseToCamelCase } from "@/utils/misc";
import { getIcp } from "@/utils/chapter/icp_criteria";

import { toTitleCase } from "@/utils/misc";

export const TableRecord = z.record(z.any());
export type RecordSchema = z.infer<typeof TableRecord>;

import { stageColors } from "@/types/opportunity";

export const filters = [
  {
    tableColumnName: "stage",
    label: "Stage",
    filterOptions: [
      {
        value: OpportunityStage.IDENTIFIED,
        label: OpportunityStage.IDENTIFIED,
        icon: Dot,
      },
      {
        value: OpportunityStage.QUALIFIED,
        label: OpportunityStage.QUALIFIED,
        icon: Dot,
      },
      {
        value: OpportunityStage.CONTACTED,
        label: OpportunityStage.CONTACTED,
        icon: Dot,
      },
      {
        value: OpportunityStage.ENGAGED,
        label: OpportunityStage.ENGAGED,
        icon: Dot,
      },
      {
        value: OpportunityStage.PROPOSED,
        label: OpportunityStage.PROPOSED,
        icon: Dot,
      },
      {
        value: OpportunityStage.NEGOTIATED,
        label: OpportunityStage.NEGOTIATED,
        icon: Dot,
      },
      {
        value: OpportunityStage.DEFERRED,
        label: OpportunityStage.DEFERRED,
        icon: Dot,
      },
      {
        value: OpportunityStage.SUSPENDED,
        label: OpportunityStage.SUSPENDED,
        icon: Dot,
      },
      {
        value: OpportunityStage.CUSTOMER,
        label: OpportunityStage.CUSTOMER,
        icon: Dot,
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
        icon: CircleUser,
      },
      {
        value: "11-50",
        label: "11-50",
        icon: CircleUser,
      },
      {
        value: "51-200",
        label: "51-200",
        icon: CircleUser,
      },
      {
        value: "201-500",
        label: "201-500",
        icon: CircleUser,
      },
      {
        value: "501-1000",
        label: "501-1000",
        icon: CircleUser,
      },
      {
        value: "1000+",
        label: "1000+",
        icon: CircleUser,
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
        icon: DollarSign,
      },
      {
        value: FundingRound.PRE_SEED,
        label: FundingRound.PRE_SEED,
        icon: DollarSign,
      },
      {
        value: FundingRound.SEED,
        label: FundingRound.SEED,
        icon: DollarSign,
      },
      {
        value: FundingRound.SERIES_A,
        label: FundingRound.SERIES_A,
        icon: DollarSign,
      },
      {
        value: FundingRound.SERIES_B,
        label: FundingRound.SERIES_B,
        icon: DollarSign,
      },
      {
        value: FundingRound.SERIES_C,
        label: FundingRound.SERIES_C,
        icon: DollarSign,
      },
      {
        value: FundingRound.SERIES_D,
        label: FundingRound.SERIES_D,
        icon: DollarSign,
      },
      {
        value: FundingRound.SERIES_E,
        label: FundingRound.SERIES_E,
        icon: DollarSign,
      },
      {
        value: FundingRound.SERIES_UNKNOWN,
        label: FundingRound.SERIES_UNKNOWN,
        icon: DollarSign,
      },
      {
        value: FundingRound.PUBLIC,
        label: FundingRound.PUBLIC,
        icon: DollarSign,
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
        icon: MapPin,
      },
      {
        value: "France",
        label: "France",
        icon: MapPin,
      },
      {
        value: "Germany",
        label: "Germany",
        icon: MapPin,
      },
      {
        value: "UK",
        label: "UK",
        icon: MapPin,
      },
      {
        value: "US",
        label: "US",
        icon: MapPin,
      },
      {
        value: "Rest of the World",
        label: "Rest of the World",
        icon: MapPin,
      },
    ],
  },
  {
    tableColumnName: "tools",
    label: "Tool Stack",
    // TODO: Build filters based on tenant ICP
    filterOptions: [
      {
        value: "Github Actions",
        label: "Github Actions",
        icon: undefined,
      },
      {
        value: "Cypress",
        label: "Cypress",
        icon: undefined,
      },
      {
        value: "Playwright",
        label: "Playwright",
        icon: undefined,
      },
      {
        value: "Docker",
        label: "Docker",
        icon: undefined,
      },
      {
        value: "Rust",
        label: "Rust",
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
  } else if (country == "UK" || country == "United Kingdom") {
    locationLabel = "UK";
  } else if (country == "US" || country == "United States") {
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
    id: "companyName",
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      return <div className="flex">{row.getValue("companyName")}</div>;
    },
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stage" />
    ),
    cell: ({ row }) => {
      const stage: OpportunityStage = row.getValue("stage") as OpportunityStage;
      const opportunityStage = getStageFromStage(stage);

      if (!opportunityStage) {
        return null;
      }

      return (
        <div className="">
          <div
            className={classNames(
              stageColors[stage]?.color,
              "flex  py-0.5 rounded-full hover:none focus-visible:ring-0 pr-3 items-center"
            )}
          >
            <Dot />
            {opportunityStage.label}
          </div>
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
    accessorKey: "orgSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Engineering Size" />
    ),
    cell: ({ row }) => {
      const orgSize: OrgSize = row.getValue("orgSize");
      return <div className="flex">{orgSize.engineering}</div>;
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
      return <div className="flex">{`${location?.country}`}</div>;
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
  {
    accessorKey: "tools",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tool Stack" />
    ),
    cell: ({ row }) => {
      const tools: Tool[] = row.getValue("tools");
      const icpTools: string[] = getIcp();
      return (
        <div className="flex items-center gap-2">
          {tools
            .filter((tool) => {
              return icpTools.includes(tool.name);
            })
            .map((tool, index) => (
              <Badge
                key={index}
                variant="default"
                className={classNames(
                  ScaleLabel[tool.certainty]?.color,
                  "bg-primary text-primary-foreground"
                )}
              >
                {tool.name}
              </Badge>
            ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const tools: Tool[] = row.getValue("tools");
      return tools.some((tool: Tool) => value.includes(tool.name));
    },
  },
];

export function getRecordColumns() {
  const finalColumns: ColumnDef<RecordSchema>[] = [...fixedRecordColumns];
  return finalColumns;
}
