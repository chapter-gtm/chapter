import Image from "next/image";
import { Metadata } from "next";
import { ProjectDetails } from "@/components/project/ProjectDetails";

export const metadata: Metadata = {
  title: "Dashboatd: Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function ProjectDetailsPage({
  params,
}: {
  params: { project_id: string };
}) {
  return (
    <>
      <div>      
        <ProjectDetails projectId={params.project_id} />
      </div>
    </>
  );
}
