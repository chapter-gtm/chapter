import { Metadata } from "next";
import { PageHeaderRow } from "@/components/PageHeaderRow";
import { OpportunitiesMain } from "@/components/opportunities/OpportunitiesMain";

export const metadata: Metadata = {
  title: "Funnel: Nectar Console",
  description: "Outbound Sales",
};

export default function FunnelPage() {
  return (
    <>
      <PageHeaderRow title="Opportunities" />
      <OpportunitiesMain />
    </>
  );
}
