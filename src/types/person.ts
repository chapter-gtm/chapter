import { type Location } from "@/types/location";

export type WorkExperience = {
    startsAt: Date;
    title: string;
    companyName: string;
    endsAt: Date | null;
    linkedinProfileUrl: string | null;
    description: string | null;
    location: Location | null;
    logoUrl: string | null;
};

export type SocialActivity = {
    title: string;
    link: string | null;
    status: string | null;
};

export type Person = {
    id: string;
    slug: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    headline: string | null;
    summary: string | null;
    title: string | null;
    occupation: string | null;
    industry: string | null;
    profilePicUrl: string | null;
    url: string | null;
    linkedinProfileUrl: string | null;
    twitterProfileUrl: string | null;
    githubProfileUrl: string | null;
    location: Location | null;
    personalEmails: string[] | null;
    workEmail: string | null;
    personalNumbers: string[] | null;
    birthDate: Date | null;
    gender: string | null;
    languages: string[] | null;
    workExperiences: WorkExperience[] | null;
    socialActivities: SocialActivity[] | null;
    createdAt: Date;
    updatedAt: Date;
};
