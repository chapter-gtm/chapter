"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { EmptySelectionCard } from "@/components/EmptySelectionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Insights } from "@/components/insight/Insights";
import { Records } from "@/components/record/Records";

export default function InsightsPage() {
  function InsightTabs() {
    const searchParams = useSearchParams();
    let tabName = searchParams.get("tab") || "conversations";

    if (!["conversations", "insights"].includes(tabName)) {
      tabName = "conversations";
    }

    return (
      <div className="w-full space-y-2 px-6 mt-2">
        <Tabs defaultValue={tabName} className="h-dvh">
          <div className="space-between basis-1/3 ">
            <div className="justify-start">
              <div className="flex flex-row items-center justify-start px-6 mt-1">
                <TabsList className="bg-zinc-200 font-normal flex">
                  <TabsTrigger value="conversations" className="relative">
                    Conversations
                  </TabsTrigger>
                  <TabsTrigger value="insights">Custom Insights</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent
                value="conversations"
                className="mt-0 data-[state=active]:flex flex-col h-full pb-32 px-6 pt-4"
              >
                <Records />
              </TabsContent>

              <TabsContent
                value="insights"
                className="mt-0 data-[state=active]:flex flex-col h-full pb-32 px-6"
              >
                <Insights />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <>
      <Suspense>
        <InsightTabs />
      </Suspense>
    </>
  );
}
