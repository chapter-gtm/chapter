import { Satellite } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { ProjectCard } from "@/components/project/ProjectCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Project } from "@/types/project";

async function getProjects() {
  const response = await fetch("http://localhost/projects", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const projects = data as Project[];
  return projects;
}

export async function Projects() {
  let projects: Project[] = [];
  let errorOccurred = true;
  try {
    projects = await getProjects();
    errorOccurred = false;
  } catch (error) {
    errorOccurred = true;
  }
  return (
    <>
      {errorOccurred ? (
        <ErrorMessage />
      ) : projects.length <= 0 ? (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Satellite />
            <h3 className="mt-4 text-lg font-semibold">
              Let&apos;s launch your first research project!
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">Go!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Projects
              </h2>
              <p className="text-sm text-muted-foreground">
                Here are all your research projects.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          {projects.map((item, index) => (
            <div
              key={index}
              className="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3"
            >
              <div className="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
                <ProjectCard project={item} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
