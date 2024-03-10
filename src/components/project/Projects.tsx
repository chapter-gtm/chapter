"use client";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { createProject, getProjects } from "@/utils/nectar/projects";
import { getUserAccessToken } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptySelectionCard } from "./EmptySelectionCard";

export function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        setProjects(await getProjects(userToken));
      } catch (error) {
        // TODO: Show a toast with error
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    const userToken = await getUserAccessToken();
    if (userToken === undefined) {
      throw Error("User needs to login!");
    }
    const project: Project = await createProject(userToken);
    router.push(`/projects/${project.id}`);
  };

  return (
    <>
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="w-2/3 mx-auto pt-4">
          <div className="flex flex-row justify-between space-y-1 items-center h-[44px] pb-5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-700">
              Projects
            </h2>
            <Button onClick={handleCreateProject}>Create new project</Button>
          </div>
          {projects.length <= 0 ? (
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
