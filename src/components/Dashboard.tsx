import { LayoutDashboard } from "lucide-react";
import { EmptySelectionCard } from "./survey/EmptySelectionCard";
import { PageHeaderRow } from "./survey/PageHeaderRow";

export function Dashboard() {
  return (
    <div className="space-y-6 w-2/3 mx-auto pt-4 space-y-6">
      <PageHeaderRow title="Dashboard" />
      <EmptySelectionCard
        title="Coming soon!"
        description="We're working hard on building the most useful dashboard. Let us know what's important for you."
        action="Get in touch"
      />
    </div>
  );
}
