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
    subRoles: string[];
};

export type Icp = {
    id: string;
    name: string;
    company: CompanyCriteria;
    tool: ToolCriteria;
    person: PersonCriteria;
    pitch: string;
};
