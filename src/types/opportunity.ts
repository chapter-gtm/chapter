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
    notes: string;
    owner: User | null;
    company: Company | null;
    contacts: Person[] | null;
    jobPosts: JobPost[] | null;
    logs: OpportunityAuditLog[] | null;
    createdAt: Date;
    updatedAt: Date;
};



export const stageColors: { [key in OpportunityStage]: {color: string; highlight: string }} =
  {
    [OpportunityStage.CONTACTED]: {color: "bg-yellow-200 text-yellow-700 hover:bg-yellow-200/90", highlight: "bg-yellow-600" },
    [OpportunityStage.ENGAGED]: {color: "bg-orange-200 text-orange-700 hover:bg-orange-200/90", highlight: "bg-orange-600" },
    [OpportunityStage.PROPOSED]: {color: "bg-rose-200 text-rose-700 hover:bg-rose-200/90", highlight: "bg-rose-600" },
    [OpportunityStage.QUALIFIED]: {color: "bg-lime-200 text-lime-700 hover:bg-lime-200/90", highlight: "bg-lime-600" },
    [OpportunityStage.IDENTIFIED]: {color: "bg-amber-200 text-amber-700 hover:bg-amber-200/90", highlight: "bg-amber-600" },
    [OpportunityStage.NEGOTIATED]: {color: "bg-pink-200 text-pink-700 hover:bg-pink-200/90", highlight: "bg-pink-600" },
    [OpportunityStage.DEFERRED]: {color: "bg-teal-200 text-teal-700 hover:bg-teal-200/90", highlight: "bg-teal-600" },
    [OpportunityStage.SUSPENDED]: {color: "bg-sky-200 text-sky-700 hover:bg-sky-200/90", highlight: "bg-sky-600" },
    [OpportunityStage.CUSTOMER]: {color: "bg-violet-200 text-violet-700 hover:bg-violet-200/90", highlight: "bg-violet-600" },

  };