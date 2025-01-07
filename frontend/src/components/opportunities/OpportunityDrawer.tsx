import { type Icp } from "@/types/icp"
import { type Opportunity } from "@/types/opportunity"
import { OpportunityBrand } from "./OpportunityBrand"
import { OpportunityHighlights } from "./OpportunityHighlight"
import { OpportunityTabs } from "./OpportunityTabs"
import { OpportunityMentions } from "./OpportunityMentions"

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
          <div className="flex px-4 py-3  ">
            <OpportunityBrand opportunity={opportunity} />
          </div>
          <OpportunityHighlights opportunity={opportunity} />
          <OpportunityMentions opportunity={opportunity} size={"sm"} />
          <Separator />
          <OpportunityTabs opportunity={opportunity} icp={icp} />
        </div>
      </div>
    </>
  )
}
