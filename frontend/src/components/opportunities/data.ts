import { toTitleCase } from "@/utils/misc"
import { OpportunityStage } from "@/types/opportunity"
import { getOpportunities } from "@/utils/chapter/opportunity"

import type { Column } from "./BoardColumn"

export async function getColumns() {
  let stages: Column[] = []
  for (let stage in OpportunityStage) {
    const value = OpportunityStage[stage as keyof typeof OpportunityStage]
    stages.push({ id: value, title: toTitleCase(stage) })
  }
  return stages
}

export async function getRecords() {
  return await getOpportunities()
}
