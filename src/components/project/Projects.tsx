import { Satellite } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/ProjectCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Project } from "@/types/project";
import { EmptySelectionCard } from "./EmptySelectionCard";
import { PageHeaderRow } from "./PageHeaderRow";

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
    // projects = [];
    errorOccurred = false;
  } catch (error) {
    errorOccurred = true;
  }
  return (
    <>
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="w-2/3 mx-auto pt-4">
          <PageHeaderRow title="Projects" action="Create project" />
          {errorOccurred ? (
            <ErrorMessage />
          ) : projects.length <= 0 ? (
            <EmptySelectionCard
              title="Create your first project"
              description="Launch your conversational survey today, and get qualitative insights without the hassle of scheduling."
              action="Create project"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-3 gap-y-4">
              {projects.map((item, index) => (
                <div key={index} className="items-start justify-center">
                  <ProjectCard project={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
