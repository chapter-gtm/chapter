"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ErrorMessage } from "@/components/ErrorMessage";
import { ProjectDefinition } from "@/components/project/ProjectDefinition";
import { ProjectResults } from "@/components/project/ProjectResults";
import { type Project } from "@/types/project";
import { getProject } from "@/utils/nectar/projects";
import { getUserAccessToken } from "@/utils/supabase/client";

interface ProjectDetailsProps {
  projectId: string;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        const proj = await getProject(userToken, projectId);
        setProject(proj);
      } catch (error) {}
    };
    fetchProject();
  }, [projectId]);

  return (
    <>
      {project !== null ? (
        <Tabs defaultValue="definition" className="h-dvh">
          <div className="flex flex-col flex-1 h-full ">
            <div className="flex flex-row items-center justify-between py-4 border-b border-slate-100 h-16 px-6 ">
              <div className="basis-1/3 flex-1 flex-shrink-0 overflow-hidden   me-8">
                <p className="text-slate-700 text-base font-medium truncate text-ellipsis">
                  {project.name}
                </p>
              </div>

              <div className="space-between basis-1/3 items-center justify-center">
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
              <div className="basis-1/3 flex overflow-hidden justify-end">
                <Button variant="outline">Preview</Button>
              </div>
            </div>

            <TabsContent
              value="definition"
              className="mt-0 data-[state=active]:flex flex-col h-full"
            >
              <ProjectDefinition project={project} setProject={setProject} />
            </TabsContent>

            <TabsContent
              value="results"
              className="mt-0 data-[state=active]:flex flex-col flex-1 h-full"
            >
              <ProjectResults project={project} />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <ErrorMessage />
      )}
    </>
  );
}
