import Image from "next/image";
import { Metadata } from "next";
import { EmptySelectionCard } from "@/components/EmptySelectionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Insights } from "@/components/insight/Insights";
import { Records } from "@/components/record/Records";

export const metadata: Metadata = {
  title: "Insights: Nectar Console",
  description: "Contineous Customer Insights",
};

export default function InsightsPage() {
  return (
    <>
      <div className="w-full space-y-2 px-6 mt-2">
        <Tabs defaultValue="conversations" className="h-dvh flex flex-col ">
          <div className="space-between basis-1/3 ">
            <div className="flex items-center justify-center">
              <TabsList className="bg-zinc-200 font-normal">
                <TabsTrigger value="conversations" className="relative">
                  Conversations
                </TabsTrigger>
                <TabsTrigger value="insights">Custom Insights</TabsTrigger>
              </TabsList>
              <TabsContent
                value="conversations"
                className="mt-0 data-[state=active]:flex flex-col h-full pb-32 px-6"
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
    </>
  );
}
