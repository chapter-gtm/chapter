import Image from "next/image";
import { Metadata } from "next";
import { SurveyResponseDetailsFull } from "@/components/survey/SurveyResponseDetailsFull";

export const metadata: Metadata = {
  title: "Dashboatd: Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function SurveyDetailsPage({
  params,
}: {
  params: { surveyId: string; surveyResponseId: string };
}) {
  return (
    <>
      <SurveyResponseDetailsFull
        surveyId={params.surveyId}
        surveyResponseId={params.surveyResponseId}
      />
    </>
  );
}
