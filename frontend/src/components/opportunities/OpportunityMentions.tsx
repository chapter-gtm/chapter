import { Opportunity, OpportunityJobPostContext } from "@/types/opportunity"

import { OpportunityStage } from "@/types/opportunity"
import { type Icp } from "@/types/icp"

interface OpportunityHighlightsProps {
  opportunity: Opportunity
  size: String
  icp: Icp
}

export function OpportunityMentions({
  opportunity,
  size,
  icp,
}: OpportunityHighlightsProps) {
  return (
    <>
      <div className="flex flex-1 flex-col gap-y-4 py-3 px-4">
        <div className="flex flex-row gap-5">
          {opportunity?.context !== null &&
            opportunity?.context.jobPost.length > 0 && (
              <div
                className={`flex-1 border-secondary-foreground/40 rounded-2xl gap-4 grid ${
                  size === "large" ? "grid-cols-3" : "grid-cols-1"
                }`}
              >
                {opportunity?.context?.jobPost.map(
                  (
                    jobPostContext: OpportunityJobPostContext,
                    index: number
                  ) => (
                    <div key={index}>
                      <ul className="">
                        <li className="col-span-1 border-l-2 px-3 border-secondary-foreground/50">
                          <p className="text-base dark:text-secondary font-light">
                            {jobPostContext.sentence}
                          </p>
                        </li>
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </>
  )
}
