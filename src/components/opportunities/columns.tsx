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
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { type Opportunity, OpportunityStage } from "@/types/opportunity";
import { type Icp } from "@/types/icp";
import { type Company, FundingRound, OrgSize } from "@/types/company";
import { type Location } from "@/types/location";
import { type Tool } from "@/types/job_post";
import { type Scale, ScaleLabel } from "@/types/scale";
import { humanDate, titleCaseToCamelCase } from "@/utils/misc";
import { updateOpportunityStage } from "@/utils/chapter/opportunity";
import { toTitleCase, truncateString } from "@/utils/misc";

export const TableRecord = z.record(z.any());
export type RecordSchema = z.infer<typeof TableRecord>;

import { stageColors } from "@/types/opportunity";

export function getFilters(icp: Icp) {
  const filters = [
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
          value: "United Kingdom",
          label: "UK",
          icon: MapPin,
        },
        {
          value: "United States",
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
      filterOptions: icp.tool.include.map((tool: string) => ({
        value: tool,
        label: tool,
        icon: undefined,
      })),
    },
    {
      tableColumnName: "investors",
      label: "Investors",
      // TODO: Build filters based on tenant ICP
      filterOptions: [
        {
          value: "Y Combinator",
          label: "Y Combinator",
          icon: undefined,
        },
        {
          value: "a16z",
          label: "a16z",
          icon: undefined,
        },
        {
          value: "Accel",
          label: "Accel",
          icon: undefined,
        },
        {
          value: "Sequoia Capital",
          label: "Sequoia Capital",
          icon: undefined,
        },
        {
          value: "Redpoint",
          label: "Redpoint",
          icon: undefined,
        },
        {
          value: "Lightspeed Venture Partners",
          label: "Lightspeed Venture Partners",
          icon: undefined,
        },
        {
          value: "Bessemer Venture Partners",
          label: "Bessemer Venture Partners",
          icon: undefined,
        },
      ],
    },
  ];

  return filters;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function getStageFromStage(icp: Icp, stage: OpportunityStage) {
  const filters = getFilters(icp);
  const stageLabel: string = stage;
  const opportunityStage = filters[0].filterOptions.find(
    (opportunityStage) => opportunityStage.value === stageLabel
  );

  return opportunityStage;
}

function getCompanySizeFromHeadcount(icp: Icp, headcount: number) {
  const filters = getFilters(icp);
  let companySizeLabel = "Unknown";
  if (headcount <= 10) {
    companySizeLabel = "1-10";
  } else if (headcount <= 50) {
    companySizeLabel = "11-50";
  } else if (headcount <= 200) {
    companySizeLabel = "51-200";
  } else if (headcount <= 500) {
    companySizeLabel = "201-500";
  } else if (headcount <= 1000) {
    companySizeLabel = "501-1000";
  } else {
    companySizeLabel = "1000+";
  }
  const companySize = filters[1].filterOptions.find(
    (companySize) => companySize.value === companySizeLabel
  );

  return companySize;
}

function getFundingFromFundingRound(icp: Icp, fundingRound: FundingRound) {
  const filters = getFilters(icp);
  const fundingRoundLabel: string = fundingRound;

  const funding = filters[2].filterOptions.find(
    (funding) => funding.value === fundingRoundLabel
  );

  return funding;
}

function getLocationFromCountry(icp: Icp, country: string) {
  const filters = getFilters(icp);
  let locationLabel = "Rest of the World";
  if (country == "Canada") {
    locationLabel = "Canada";
  } else if (country == "France") {
    locationLabel = "France";
  } else if (country == "Germany") {
    locationLabel = "Germany";
  } else if (country == "UK" || country == "United Kingdom") {
    locationLabel = "United Kingdom";
  } else if (country == "US" || country == "United States") {
    locationLabel = "United States";
  } else {
    locationLabel = "Rest of the World";
  }
  const location = filters[3].filterOptions.find(
    (location) => location.value === locationLabel
  );

  return location;
}

export const defaultColumnVisibility: VisibilityState = {
  id: false,
  date: true,
  stage: true,
  companyName: true,
  companySize: true,
  fundingRound: true,
  companyLocation: true,
  industry: true,
};

export function getFixedColumns(
  icp: Icp,
  updateOpportunity: (updatedOpportunity: Opportunity) => void,
  handleOpenDrawer: (id: string) => void
) {
  const fixedRecordColumns: ColumnDef<RecordSchema>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Id" />
      ),
      cell: ({ row }) => {
        return <div className="flex">{row.getValue("id")}</div>;
      },
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
        const id: string = row.getValue("id");
        return (
          <div className="flex flex-row justify-between items-center pe-2">
            <div>{row.getValue("companyName")}</div>
            <Button
              className="text-light hover:bg-popover/20 px-1.5 py-0.5 h-7 bg-popover rounded-md curser"
              onClick={async () => {
                await handleOpenDrawer(id);
              }}
            >
              Open
            </Button>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "stage",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stage" />
      ),
      cell: ({ row }) => {
        const id: string = row.getValue("id");
        const stage: OpportunityStage = row.getValue(
          "stage"
        ) as OpportunityStage;
        const opportunityStage = getStageFromStage(icp, stage);
        const stages = Object.values(OpportunityStage);
        const handleStageChange = async (newStage: string) => {
          try {
            if (!stages.includes(newStage as OpportunityStage)) {
              toast.error("Failed to set stage.");
              return;
            }

            const opportunity = await updateOpportunityStage(
              id,
              newStage as OpportunityStage
            );
            await updateOpportunity(opportunity);
          } catch (error: any) {
            toast.error("Failed to set stage.");
          }
        };

        if (!opportunityStage) {
          return null;
        }

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="cursor-pointer flex flex-row justify-between gap-x-2 items-center">
                  <div
                    className={classNames(
                      stageColors[stage]?.color,
                      "flex py-0.5 rounded-md hover:none focus-visible:ring-0 pr-2 items-center"
                    )}
                  >
                    <span
                      className={classNames(
                        stageColors[stage]?.highlight,
                        "h-1.5 w-1.5 rounded-full ms-1.5 me-1"
                      )}
                    ></span>
                    {opportunityStage.label}
                  </div>
                  <ChevronDown className="w-3 me-1.5" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover border-border">
                <DropdownMenuLabel>Set stage</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuRadioGroup
                  value={stage}
                  onValueChange={handleStageChange}
                >
                  {stages.map((st, index) => (
                    <DropdownMenuRadioItem key={index} value={st}>
                      {st}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      filterFn: (row, id, value) => {
        const stage: OpportunityStage = row.getValue(id);
        if (!stage) {
          return false;
        }

        const opportunityStage = getStageFromStage(icp, stage);
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
          icp,
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
        const companySize = getCompanySizeFromHeadcount(icp, headcount);
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
      sortingFn: (rowA, rowB, columnId) => {
        const valueA: OrgSize = rowA.getValue(columnId);
        const valueB: OrgSize = rowB.getValue(columnId);
        return valueA.engineering !== null &&
          valueB.engineering !== null &&
          valueA.engineering > valueB.engineering
          ? 1
          : valueA.engineering !== null &&
            valueB.engineering !== null &&
            valueA.engineering < valueB.engineering
          ? -1
          : 0;
      },
      enableHiding: true,
      enableSorting: true,
    },
    {
      accessorKey: "fundingRound",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Funding" />
      ),
      cell: ({ row }) => {
        const funding = getFundingFromFundingRound(
          icp,
          row.getValue("fundingRound")
        );
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
        const funding = getFundingFromFundingRound(icp, fundingRound);
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
      accessorFn: (row) => {
        const location: Location = row.companyLocation;
        return location?.country;
      },
      cell: ({ row }) => {
        const location: Location = row.original.companyLocation;
        return <div className="flex">{`${location?.country}`}</div>;
      },
      filterFn: (row, id, value) => {
        const location: Location = row.original[id];
        if (!location?.country) {
          return false;
        }

        const companyLocation = getLocationFromCountry(icp, location.country);
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
      accessorFn: (row) => {
        return row.industry || "";
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Industry" />
      ),
      cell: ({ row }) => {
        return <div className="flex">{row.original.industry}</div>;
      },
    },
    {
      accessorKey: "tools",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tool Stack" />
      ),
      accessorFn: (row) => {
        const tools: Tool[] = row.tools;
        return tools.map((tool) => tool.name).join(", ");
      },
      cell: ({ row }) => {
        const tools: Tool[] = row.original.tools;
        return (
          <div className="flex items-center gap-2">
            {tools
              .filter((tool) => {
                return icp.tool.include.includes(tool.name);
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
        const tools: Tool[] = row.original["tools"] || [];
        return tools.some((tool: Tool) => value.includes(tool.name));
      },
    },
    {
      accessorKey: "investors",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Investors" />
      ),
      accessorFn: (row) => {
        const investors: string[] = row.investors || [];
        return truncateString(investors.join(", "));
      },
      cell: ({ row }) => {
        const investors: string[] = row.original.investors || [];
        const investorList: string = truncateString(investors.join(", "));
        return <div className="flex items-center gap-2">{investorList}</div>;
      },
      filterFn: (row, id, value) => {
        const investors: string[] = row.original["investors"] || [];
        return investors.some((investor: string) => value.includes(investor));
      },
    },
  ];
  return fixedRecordColumns;
}

export function getRecordColumns(
  icp: Icp,
  updateOpportunity: (updatedOpportunity: Opportunity) => void,
  handleOpenDrawer: (id: string) => void
) {
  const finalColumns: ColumnDef<RecordSchema>[] = getFixedColumns(
    icp,
    updateOpportunity,
    handleOpenDrawer
  );
  return finalColumns;
}
