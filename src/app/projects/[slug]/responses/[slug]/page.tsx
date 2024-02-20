import Image from "next/image";
import { Metadata } from "next";
import { ProjectDetails } from "@/components/project/ProjectDetails";
import { ProjectResponseTranscript } from "@/components/project/ProjectResponseTranscript";

export const metadata: Metadata = {
  title: "Dashboatd: Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function ProjectDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <div>
        <div className="bg-background h-full">
         
          <div className="col-span-3 lg:col-span-4">
            <div className="h-full ">
              <ProjectResponseTranscript id={[params.slug]} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
