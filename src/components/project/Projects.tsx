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
          <div className="flex items-center justify-between px-6 pt-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-slate-700">
                Projects
              </h2>
            </div>
          </div>
          {/* <Separator className="my-4" /> */}
          
          <div className="md:grid  lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-4 px-6">
            {projects.map((item, index) => (
              <div
                key={index}
                className="items-start justify-center"
              >
                <ProjectCard project={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
