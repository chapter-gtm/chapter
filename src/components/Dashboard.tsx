import { LayoutDashboard } from "lucide-react";
import { EmptySelectionCard } from "@/components/EmptySelectionCard";
import { PageHeaderRow } from "./survey/PageHeaderRow";
import { TemplateCard } from "./survey/TemplateCard";

export function Dashboard() {
  return (
    <div className="w-full space-y-2 px-6 mt-2">
      <PageHeaderRow title="Dashboard" />
      <EmptySelectionCard
        title="Coming soon!"
        description="We're working hard on building the most useful dashboard. Let us know what's important for you."
        action="Get in touch"
      />
    </div>
  );
}
