import { type Location } from "@/types/location";

export type WorkExperience = {
    starts_at: Date;
    title: string;
    company_name: string;
    ends_at: Date | null;
    linkedin_profile_url: string | null;
    description: string | null;
    location: Location | null;
    logo_url: string | null;
};

export type SocialActivity = {
    title: string;
    link: string | null;
    status: string | null;
};

export type Person = {
    id: string;
    slug: string;
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    headline: string | null;
    summary: string | null;
    occupation: string | null;
    industry: string | null;
    profile_pic_url: string | null;
    url: string | null;
    linkedin_profile_url: string | null;
    twitter_profile_url: string | null;
    github_profile_url: string | null;
    location: Location | null;
    personal_emails: string[] | null;
    work_emails: string[] | null;
    personal_numbers: string[] | null;
    birth_date: Date | null;
    gender: string | null;
    languages: string[] | null;
    work_experiences: WorkExperience[] | null;
    social_activities: SocialActivity[] | null;
};
