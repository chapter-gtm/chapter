import { LayoutDashboard } from "lucide-react";
import { EmptySelectionCard } from "@/components/EmptySelectionCard";
import { PageHeaderRow } from "@/components/PageHeaderRow";

export function OutboundSalesFunnel() {
  return (
    <div className="w-full space-y-2 px-6 mt-2">
      <PageHeaderRow title="Funnel" />
      <EmptySelectionCard
        title="Coming soon!"
        description="We're working hard on building the most useful funnel. Let us know what's important for you."
        action="Get in touch"
      />
    </div>
  );
}
