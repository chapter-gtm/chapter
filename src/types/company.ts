import { type Location } from "@/types/location";

export type Investor = {
    name: string;
    type: string | null;
    url: string | null;
    linkedinProfileUrl: string | null;
};

export enum FundingRound {
    GRANT = "Grant",
    PRE_SEED = "Pre-Seed",
    SEED = "Seed",
    SERIES_A = "Series A",
    SERIES_B = "Series B",
    SERIES_C = "Series C",
    SERIES_D = "Series D",
    SERIES_E = "Series E",
    SERIES_UNKNOWN = "Series Unknown",
    PUBLIC = "Public",
}

export type Funding = {
    roundName: FundingRound;
    moneyRaised: number | null;
    announcedDate: Date | null;
    investors: Investor[];
};

export type OrgSize = {
    engineering: number | null;
};

export type Company = {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    type: string | null;
    industry: string | null;
    headcount: number | null;
    founded_year: number | null;
    url: string | null;
    profilePicUrl: string | null;
    linkedinProfileUrl: string | null;
    hqLocation: Location | null;
    lastFunding: Funding | null;
    orgSize: OrgSize | null;
    createdAt: Date;
    updatedAt: Date;
};
