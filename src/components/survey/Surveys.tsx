"use client";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SurveyCard } from "@/components/survey/SurveyCard";
import { SurveyMetadata, Survey } from "@/types/survey";
import { createSurvey, getSurveys } from "@/utils/nectar/surveys";
import { getUserAccessToken } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Surveys() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<SurveyMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        setSurveys(await getSurveys(userToken, 1000, 1));
      } catch (error: any) {
        toast.error("Failed to load surveys.", {
          description: error.toString(),
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleCreateSurvey = async () => {
    const userToken = await getUserAccessToken();
    if (userToken === undefined) {
      throw Error("User needs to login!");
    }
    const survey: Survey = await createSurvey(userToken);
    router.push(`/surveys/${survey.id}`);
  };

  return (
    <>
      <Toaster theme="light" />
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="w-2/3 mx-auto pt-4">
          <div className="flex flex-row justify-between space-y-1 items-center h-[44px] pb-5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-700">
              Surveys
            </h2>
            <Button onClick={handleCreateSurvey}>Create survey</Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-4 animate-pulse">
              <div className="w-full h-44 bg-white/80 rounded-lg"></div>
              <div className="w-full h-44 bg-white/50 rounded-lg"></div>
              <div className="w-full h-44 bg-white/30 rounded-lg"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-4">
              {surveys.map((item, index) => (
                <div key={index} className="items-start justify-center">
                  <SurveyCard survey={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
