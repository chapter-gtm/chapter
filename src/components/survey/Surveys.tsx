"use client";
import { SurveyCard } from "@/components/survey/SurveyCard";
import { Button } from "@/components/ui/button";
import { Survey } from "@/types/survey";
import { createSurvey, getSurveys } from "@/utils/nectar/surveys";
import { getUserAccessToken } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";

export function Surveys() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        setSurveys(await getSurveys(userToken));
      } catch (error) {
        // TODO: Show a toast with error
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
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="w-2/3 mx-auto pt-4">
          <div className="flex flex-row justify-between space-y-1 items-center h-[44px] pb-5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-700">
              Surveys
            </h2>
            <Button onClick={handleCreateSurvey}>Create survey</Button>
          </div>
          {surveys.length <= 0 ? (
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
