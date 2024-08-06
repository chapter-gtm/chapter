import { type User } from "@/types/user";
import { type Company } from "@/types/company";
import { type Person } from "@/types/person";
import { type JobPost } from "@/types/job_post";

export enum OpportunityStage {
    IDENTIFIED = "identified",
    QUALIFIED = "qualified",
    CONTACTED = "contacted",
    ENGAGED = "engaged",
    PROPOSED = "proposed",
    NEGOTIATED = "negotiated",
    DEFERRED = "deferred",
    SUSPENDED = "suspended",
    CUSTOMER = "customer",
}

export type OpportunityAuditLog = {
    id: string;
    operation: string;
    user: User;
    diff: object;
};

export type Opportunity = {
    id: string;
    slug: string | null;
    name: string;
    stage: OpportunityStage;
    notes: string | null;
    owner: User | null;
    company: Company | null;
    contacts: Person[] | null;
    job_posts: JobPost[] | null;
    logs: OpportunityAuditLog[] | null;
};
