import Image from "next/image";
import { Metadata } from "next";
import { EmptySelectionCard } from "@/components/EmptySelectionCard";

export const metadata: Metadata = {
  title: "Insights: Nectar Console",
  description: "Contineous Customer Insights",
};

export default function InsightsPage() {
  return (
    <>
      <div className="w-full space-y-2 px-6 mt-2">
        <EmptySelectionCard
          title="Coming soon!"
          description="We're working hard on building insights on your qualitative data. Let us know what's important for you."
          action="Get in touch"
        />
      </div>
    </>
  );
}
