"use client";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptySelectionCard } from "@/components/EmptySelectionCard";
import { InsightCard } from "@/components/insight/InsightCard";
import { type Insight } from "@/types/insight";
import { getInsights } from "@/utils/nectar/insights";
import { getUserAccessToken } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Insights() {
  const router = useRouter();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        setInsights(await getInsights(userToken, 1000, 1));
      } catch (error: any) {
        toast.error("Failed to load insights.", {
          description: error.toString(),
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  return (
    <>
      <Toaster theme="light" />
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="w-2/3 mx-auto pt-4">
          <div className="flex flex-row justify-between space-y-1 items-center h-[44px] pb-5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-700">
              Insights
            </h2>
          </div>
          {!isLoading ? (
            insights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-4">
                {insights.map((item, index) => (
                  <div key={index} className="items-start justify-center">
                    <InsightCard insight={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full space-y-2 px-6 mt-2">
                <EmptySelectionCard
                  title="It's a clean slate"
                  description="Be the first to create a new survey!"
                />
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-4 animate-pulse">
              <div className="w-full h-44 bg-white/80 rounded-lg"></div>
              <div className="w-full h-44 bg-white/50 rounded-lg"></div>
              <div className="w-full h-44 bg-white/30 rounded-lg"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
