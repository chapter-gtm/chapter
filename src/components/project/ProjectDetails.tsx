import { ServerCrash } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProjectDefinition } from "@/components/project/ProjectDefinition";
import { ProjectResults } from "@/components/project/ProjectResults";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Project } from "@/types/project";

async function getProject(id: string) {
  const response = await fetch("http://localhost/projects/" + id, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const project = data as Project;
  return project;
}

interface ProjectDetailsProps {
  id: string;
}

export async function ProjectDetails({ id }: ProjectDetailsProps) {
  let project: Project | null = null;
  let errorOccurred = true;
  try {
    project = await getProject(id);
    errorOccurred = false;
  } catch (error) {
    errorOccurred = true;
  }
  return (
    <>
      {errorOccurred ? (
        <ErrorMessage />
      ) : (
        <div className="hidden md:block">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <div className="col-span-3 lg:col-span-4">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="definition" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="definition" className="relative">
                          Definition
                        </TabsTrigger>
                        <TabsTrigger value="results">Results</TabsTrigger>
                        <TabsTrigger value="insights" disabled>
                          Insights
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent
                      value="definition"
                      className="border-none p-0 outline-none"
                    >
                      <ProjectDefinition project={project} />
                    </TabsContent>
                    <TabsContent
                      value="results"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <ProjectResults project={project} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
