import { type Location } from "@/types/location";
import { type Funding } from "@/types/funding";

export type Investor = {
    name: string;
    type: string | null;
    url: string | null;
    linkedin_profile_url: string | null;
};

export type Funding = {
    round_name: string;
    money_raised: number | null;
    announced_date: Date | null;
    investors: Investor[];
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
    profile_pic_url: string | null;
    linkedin_profile_url: string | null;
    hq_location: Location | null;
    last_funding: Funding | null;
    createdAt: Date;
    updatedAt: Date;
};
