import Image from "next/image";
import { Metadata } from "next";
import { Surveys } from "@/components/survey/Surveys";

export const metadata: Metadata = {
  title: "Surveys: Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function SurveysPage() {
  return <Surveys />;
}
