import { Metadata } from "next";
import { PageHeaderRow } from "@/components/PageHeaderRow";
import { OpportunitiesMain } from "@/components/opportunities/OpportunitiesMain";

export const metadata: Metadata = {
  title: "Opportunities: Chapter App",
  description: "Lead gen for founders",
};

export default function FunnelPage() {
  return (
    <>
      <OpportunitiesMain />
    </>
  );
}
