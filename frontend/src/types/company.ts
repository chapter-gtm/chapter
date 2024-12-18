import { type Location } from "@/types/location"

export type Investor = {
  name: string
  type: string | null
  url: string | null
  linkedinProfileUrl: string | null
}

export enum FundingRound {
  GRANT = "Grant",
  PRE_SEED = "Pre-Seed",
  SEED = "Seed",
  SERIES_A = "Series A",
  SERIES_B = "Series B",
  SERIES_C = "Series C",
  SERIES_D = "Series D",
  SERIES_E = "Series E",
  SERIES_F = "Series F",
  SERIES_G = "Series G",
  SERIES_UNKNOWN = "Series Unknown",
  PRIVATE_EQUITY = "Private Equity",
  CORPORATE_ROUND = "Corporate Round",
  DEBT_FINANCING = "Debt Financing",
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

export type Funding = {
  roundName: FundingRound
  moneyRaised: number | null
  announcedDate: Date | null
  investors: Investor[]
}

export type OrgSize = {
  engineering: number | null
}

export type Company = {
  id: string
  slug: string
  name: string
  description: string | null
  type: string | null
  industry: string | null
  headcount: number | null
  founded_year: number | null
  url: string | null
  profilePicUrl: string | null
  linkedinProfileUrl: string | null
  iosAppUrl: string | null
  androidAppUrl: string | null
  docsUrl: string | null
  blogUrl: string | null
  changelogUrl: string | null
  githubUrl: string | null
  discordUrl: string | null
  slackUrl: string | null
  twitterUrl: string | null
  hqLocation: Location | null
  lastFunding: Funding | null
  orgSize: OrgSize | null
  productLastReleasedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
