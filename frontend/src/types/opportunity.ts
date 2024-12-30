import { type User } from "@/types/user"
import { type Company } from "@/types/company"
import { type Person } from "@/types/person"
import { type JobPost } from "@/types/job_post"
import { type Repo } from "@/types/repo"

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

export type OpportunityJobPostContext = {
  sentence: string
  reason: string
}

export type OpportunityContext = {
  jobPost: OpportunityJobPostContext[]
}

export type OpportunityAuditLog = {
  id: string
  operation: string
  user: User
  diff: object
  createdAt: Date
  updatedAt: Date
}

export type Opportunity = {
  id: string
  slug: string | null
  name: string
  stage: OpportunityStage
  context: OpportunityContext | null
  notes: string
  owner: User | null
  company: Company | null
  contacts: Person[] | null
  jobPosts: JobPost[] | null
  repos: Repo[] | null
  logs: OpportunityAuditLog[] | null
  createdAt: Date
  updatedAt: Date
}

export const stageColors: {
  [key in OpportunityStage]: { color: string; highlight: string }
} = {
  [OpportunityStage.IDENTIFIED]: {
    color: "bg-yellow-200 text-yellow-700 hover:bg-yellow-200/90",
    highlight: "bg-yellow-600",
  },
  [OpportunityStage.QUALIFIED]: {
    color: "bg-lime-200 text-lime-700 hover:bg-lime-200/90",
    highlight: "bg-lime-600",
  },

  [OpportunityStage.CONTACTED]: {
    color: "bg-sky-200 text-sky-700 hover:bg-sky-200/90",
    highlight: "bg-sky-600",
  },
  [OpportunityStage.ENGAGED]: {
    color: "bg-teal-200 text-teal-700 hover:bg-teal-200/90",
    highlight: "bg-teal-600",
  },
  [OpportunityStage.PROPOSED]: {
    color: "bg-purple-200 text-purple-700 hover:bg-purple-200/90",
    highlight: "bg-purple-600",
  },
  [OpportunityStage.NEGOTIATED]: {
    color: "bg-blue-200 text-blue-700 hover:bg-blue-200/90",
    highlight: "bg-blue-600",
  },
  [OpportunityStage.DEFERRED]: {
    color: "bg-pink-200 text-pink-700 hover:bg-pink-200/90",
    highlight: "bg-pink-600",
  },
  [OpportunityStage.SUSPENDED]: {
    color: "bg-red-200 text-red-700 hover:bg-red-200/90",
    highlight: "bg-red-600",
  },
  [OpportunityStage.CUSTOMER]: {
    color: "bg-green-200 text-green-700 hover:bg-green-200/90",
    highlight: "bg-green-600",
  },
}
