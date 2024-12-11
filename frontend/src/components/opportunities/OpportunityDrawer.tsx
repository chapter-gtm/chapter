import { type Icp } from "@/types/icp"
import { type Opportunity } from "@/types/opportunity"
import { OpportunityBrand } from "./OpportunityBrand"
import { OpportunityTabs } from "./OpportunityTabs"

import { Separator } from "@/components/ui/separator"

interface OpportunityDrawerProps {
  opportunity: Opportunity
  icp: Icp | null
}

export function OpportunityDrawer({
  opportunity,
  icp,
}: OpportunityDrawerProps) {
  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col">
          <OpportunityBrand opportunity={opportunity} />
          <Separator />
          <OpportunityTabs opportunity={opportunity} icp={icp} />
        </div>
      </div>
    </>
  )
}
