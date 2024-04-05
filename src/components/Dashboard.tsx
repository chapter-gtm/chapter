import { LayoutDashboard } from "lucide-react";
import { EmptySelectionCard } from "./survey/EmptySelectionCard";
import { PageHeaderRow } from "./survey/PageHeaderRow";
import { TemplateCard } from "./survey/TemplateCard";

export function Dashboard() {
  return (
    <div className="w-full space-y-2 px-6 mt-2">
      <PageHeaderRow title="Insights" />
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-zinc-200">
          <div className="flex flex-row justify-between items-center h-12 py-4 px-6 border-b border-zinc-200">
            <p className="font-medium text-sm">Some Name</p>
          </div>
          <div className="flex flex-row h-full p-3">
            <div className="basis-1/3 bg-zinc-50 p-3">
              <div className="flex flex-col justify-start border border-dashed border-zinc-200 p-3 rounded-xl">
                <p className="font-medium text-sm my-3">Choose a template</p>
                <div className="flex flex-col gap-y-2">
                  <TemplateCard name="name" description="soethng" emoji="🚀" />
                  <TemplateCard name="name" description="soethng" emoji="🚀" />
                  <TemplateCard name="name" description="soethng" emoji="🚀" />
                </div>
              </div>
            </div>
            <div className="basis-2/3 bg-green-400"></div>
          </div>
        </div>
      </div>

      <EmptySelectionCard
        title="Coming soon!"
        description="We're working hard on building the most useful dashboard. Let us know what's important for you."
        action="Get in touch"
      />
    </div>
  );
}
