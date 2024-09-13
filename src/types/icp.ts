import { FundingRound } from "@/types/company";

export type OrgSizeCriteria = {
    engineeringMin: number;
    engineeringMax: number;
};

export type CompanyCriteria = {
    headcountMin: number;
    headcountMax: number;
    orgSize: OrgSizeCriteria;
    funding: FundingRound[];
    countries: string[];
};

export type ToolCriteria = {
    include: string[];
    exclude: string[];
};

export type PersonCriteria = {
    titles: string[];
};

export type Icp = {
    company: CompanyCriteria;
    tool: ToolCriteria;
    person: PersonCriteria;
};
