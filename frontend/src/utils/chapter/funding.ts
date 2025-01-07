import { FundingRound } from "@/types/company"

export function getFundingRoundColor(roundName: FundingRound | undefined | null): "teal" | "lime" | "yellow" | "orange" | "red" | "amber" | "pink" | "indigo" | "violet" | "emerald" | "cyan" | "sky" | "green" | "zinc" {
  if (!roundName) return "zinc"
  
  const colorMap: Record<FundingRound, "teal" | "lime" | "yellow" | "orange" | "red" | "amber" | "pink" | "indigo" | "violet" | "emerald" | "cyan" | "sky" | "green"> = {
    [FundingRound.PRE_SEED]: "teal",
    [FundingRound.SEED]: "lime",
    [FundingRound.SERIES_A]: "yellow",
    [FundingRound.SERIES_B]: "orange",
    [FundingRound.SERIES_C]: "red",
    [FundingRound.SERIES_D]: "amber",
    [FundingRound.SERIES_E]: "pink",
    [FundingRound.SERIES_F]: "indigo",
    [FundingRound.SERIES_G]: "violet",
    [FundingRound.PUBLIC]: "emerald",
    [FundingRound.PRIVATE_EQUITY]: "cyan",
    [FundingRound.CORPORATE_ROUND]: "teal",
    [FundingRound.DEBT_FINANCING]: "sky",
    [FundingRound.GRANT]: "green",
    [FundingRound.SERIES_UNKNOWN]: "green"
  }

  return colorMap[roundName] || "zinc"
}