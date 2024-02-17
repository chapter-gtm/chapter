import { LayoutDashboard } from "lucide-react";

export function Dashboard() {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <LayoutDashboard />
        <h3 className="mt-4 text-lg font-semibold">Coming Soon!</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          A quick overview of things you should know.
        </p>
      </div>
    </div>
  );
}
