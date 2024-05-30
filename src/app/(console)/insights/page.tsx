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
      <div className="w-full space-y-2 px-6 mt-2.5">
        <Tabs defaultValue={tabName} className="h-dvh">
          <div className="flex flex-row items-center justify-between px-6 mt-1">
            <TabsList className="bg-zinc-200 font-normal flex">
              <TabsTrigger value="conversations" className="relative">
                Conversations
              </TabsTrigger>
              <TabsTrigger value="insights">Custom Insights</TabsTrigger>
            </TabsList>
            <div className="flex gap-3 bg-yellow-100/50 border border-yellow-300 h-12 items-center px-3 rounded-lg text-sm">
              <p>
                This is an interactive demo. Contact us, if you want to create
                insights from your own data.{" "}
              </p>

              <a
                href="https://cal.com/robing/nectar-trial"
                target="_blank"
                className="font-medium py-1.5 p-2.5 bg-white rounded-md border border-zinc-200"
              >
                Contact
              </a>
            </div>
          </div>
          <TabsContent
            value="conversations"
            className="mt-0 data-[state=active]:flex flex-col h-full pb-32 px-6 pt-4"
          >
            <Records />
          </TabsContent>

          <TabsContent
            value="insights"
            className="mt-0 data-[state=active]:flex flex-col h-full pb-32 px-6 pt-4"
          >
            <Insights />
          </TabsContent>
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
