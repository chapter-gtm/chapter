import Image from "next/image";
import { Metadata } from "next";
import { ProjectDetails } from "@/components/project/ProjectDetails";
import { ProjectResponseDetailsFull } from "@/components/project/ProjectResponseDetailsFull";

export const metadata: Metadata = {
  title: "Dashboatd: Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function ProjectDetailsPage({
  params,
}: {
  params: { project_id: string; project_response_id: string };
}) {
  return (
    <>
      <ProjectResponseDetailsFull
        projectId={params.project_id}
        projectResponseId={params.project_response_id}
      />
    </>
  );
}
