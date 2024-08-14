import { type User } from "@/types/user";
import { type Company } from "@/types/company";
import { type Person } from "@/types/person";
import { type JobPost } from "@/types/job_post";

export enum OpportunityStage {
    IDENTIFIED = "Identified",
    QUALIFIED = "Qualified",
    CONTACTED = "Contacted",
    ENGAGED = "Engaged",
    PROPOSED = "Proposed",
    NEGOTIATED = "Negotiated",
    DEFERRED = "Deferred",
    SUSPENDED = "Suspended",
    CUSTOMER = "Customer",
}

export type OpportunityAuditLog = {
    id: string;
    operation: string;
    user: User;
    diff: object;
    createdAt: Date;
    updatedAt: Date;
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
    jobPosts: JobPost[] | null;
    logs: OpportunityAuditLog[] | null;
    createdAt: Date;
    updatedAt: Date;
};
