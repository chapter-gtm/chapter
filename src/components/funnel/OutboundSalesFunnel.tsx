"use client";
import { Toaster } from "@/components/ui/sonner";

import { PageHeaderRow } from "@/components/PageHeaderRow";
import { KanbanBoard } from "./KanbanBoard";

export function OutboundSalesFunnel() {
  return (
    <div className="w-full space-y-2 px-6 mt-2">
      <Toaster theme="light" />
      <PageHeaderRow title="Funnel" />
      <KanbanBoard />
    </div>
  );
}
