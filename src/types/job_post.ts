import { type Location } from "@/types/location";
import { type Company } from "@/types/company";

export type JobPost = {
    id: number;
    title: number;
    body: string;
    location: Location;
    seniority_level: string;
    employment_type: string;
    job_functions: string[];
    url: string;
    apply_url: string;
    total_applicants: number;
    external_id: string;
    company: Company;
};
