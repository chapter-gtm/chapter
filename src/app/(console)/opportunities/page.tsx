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
      <div className="p-5 w-full">
        <OpportunitiesMain />
      </div>
    </>
  );
}
