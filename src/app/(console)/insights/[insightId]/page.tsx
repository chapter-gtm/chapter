import Image from "next/image";
import { Metadata } from "next";
import { InsightDetails } from "@/components/insight/InsightDetails";

export const metadata: Metadata = {
  title: "Insight: Nectar Console",
};

export default function InsightDetailsPage({
  params,
}: {
  params: { insightId: string };
}) {
  return (
    <>
      <InsightDetails insightId={params.insightId} />
    </>
  );
}
