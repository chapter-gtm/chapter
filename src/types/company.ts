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
    PRIVATE_EQUITY = "Private Equity",
    PUBLIC = "Public",
}

export enum EngineeringSize {
    XSmall = "1-5",
    Small = "5-25",
    Medium = "25-50",
    Large = "5-100",
    XLarge = "100-200",
    XXL = "200+",
}

export enum Industry {
    SoftwareDevelopement = "Software Developement",
    FinTech = "FinTech",
    HealthTech = "HealthTech",
    EdTech = "EdTech",
    ECommerce = "ECommerce",
    SaaS = "SaaS",
}

export enum ToolStack {
    GithubActions = "Github Actions",
    Cypress = "Cypress",
    Kubernetes = "Kubernetes",
    Docker = "Docker",
    Playwright = "Playwright",
    Rust = "Rust",
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
    twitterProfileUrl: string | null;
    crunchbaseProfileUrl: string | null;
    hqLocation: Location | null;
    lastFunding: Funding | null;
    orgSize: OrgSize | null;
    createdAt: Date;
    updatedAt: Date;
};
