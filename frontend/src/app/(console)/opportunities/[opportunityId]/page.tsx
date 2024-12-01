import { OpportunityFull } from "@/components/opportunities/OpportunityFull"

export default function OpportunityFullPage({
  params,
}: {
  params: { opportunityId: string }
}) {
  return (
    <>
      <OpportunityFull opportunityId={params.opportunityId} />
    </>
  )
}
