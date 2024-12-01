import { type Location } from "@/types/location"
import { type Company } from "@/types/company"
import { Scale } from "@/types/scale"

export type Tool = {
  name: string
  certainty: Scale
}

export type Process = {
  name: string
}

export type JobPost = {
  id: string
  title: number | null
  location: Location | null
  seniority_level: string | null
  employment_type: string | null
  job_functions: string[] | null
  url: string | null
  apply_url: string | null
  total_applicants: number | null
  external_id: string | null
  tools: Tool[] | null | null
  processes: Process[] | null | null
  company: Company | null
  createdAt: Date | null
  updatedAt: Date | null
}
