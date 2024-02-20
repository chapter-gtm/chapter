import Image from "next/image";
import { Metadata } from "next";
import { ProjectDetails } from "@/components/project/ProjectDetails";
import { ProjectResponseDetails } from "@/components/project/ProjectResponseDetails";

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
      <div>
        <div className="bg-background h-full">
          <div className="col-span-3 lg:col-span-4">
            <div className="h-full ">
              <ProjectResponseDetails
                projectId={params.project_id}
                projectResponseId={params.project_response_id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
