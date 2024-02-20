import { ServerCrash } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";

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
      {!errorOccurred && project !== null ? (
        <div className="hidden md:block">
          <div className="bg-background">      
            <Tabs defaultValue="definition" className="h-full space-y-6 ">
              <div className="flex flex-row items-center justify-between py-4 border-b border-slate-100 px-6">
                <div className="w-1/3 pe-12">
                  <div className="truncate text-ellipsis text-slate-700 text-base font-medium">{project.name}
                  </div>
                </div>
                <div className="flex w-1/3 space-between flex-1 items-center justify-center">
                  <TabsList>
                    <TabsTrigger value="definition" className="relative">
                      Create
                    </TabsTrigger>
                    <TabsTrigger value="results">Responses</TabsTrigger>
                    <TabsTrigger value="insights" disabled>
                      Insights
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex justify-end w-1/3">
                  <Button variant="outline">Preview</Button>
                </div>
              </div>
              
              <TabsContent
                value="definition"
                className="border-none p-0 outline-none h-full"
                >
                <ProjectDefinition project={project} />
                
              </TabsContent>
              
              <div>
                <TabsContent
                  value="results"
                  className="h-full flex-col border-none p-0 data-[state=active]:flex"
                >
                <ProjectResults project={project} />
              </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      ) : (
        <ErrorMessage />
      )}
    </>
  );
}
