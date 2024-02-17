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
  params: { slug: string };
}) {
  return (
    <>
      <div className="border-t">
        <div className="bg-background">
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              <ProjectDetails id={params.slug} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
