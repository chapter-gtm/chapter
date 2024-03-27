import Image from "next/image";
import { Metadata } from "next";
import { SurveyDetails } from "@/components/survey/SurveyDetails";

export const metadata: Metadata = {
  title: "Dashboatd: Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function SurveyDetailsPage({
  params,
}: {
  params: { surveyId: string };
}) {
  return (
    <>
      <SurveyDetails surveyId={params.surveyId} />
    </>
  );
}
