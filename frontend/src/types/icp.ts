import { FundingRound } from "@/types/company"

export type OrgSizeCriteria = {
  engineeringMin: number
  engineeringMax: number
}

export type CompanyCriteria = {
  headcountMin: number
  headcountMax: number
  orgSize: OrgSizeCriteria
  funding: FundingRound[]
  countries: string[]
  docs: boolean
  changelog: boolean
}

export type ToolCriteria = {
  include: string[]
  exclude: string[]
}

export type ProcessCriteria = {
  include: string[]
  exclude: string[]
}

export type PersonCriteria = {
  titles: string[]
  subRoles: string[]
}

export type RepoCriteria = {
  query: string
}

export type Icp = {
  id: string
  name: string
  company: CompanyCriteria
  tool: ToolCriteria
  process: ProcessCriteria
  person: PersonCriteria
  pitch: string
  repo: RepoCriteria
}
