"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, Maximize2 } from "lucide-react";

import { ProjectResponse } from "@/types/project";
import { ProjectResponseIdentity } from "./ProjectResponseIdentity";
import { ProjectResponseTranscript } from "@/components/project/ProjectResponseTranscript";
import { PropList } from "./PropList";

import { EmptySelectionCard } from "./EmptySelectionCard";

async function getProjectResponse(
  projectId: string,
  projectResponseId: string,
) {
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk4MDYwOTQsInN1YiI6InRlc3RAbmVjdGFyLnJ1biIsImlhdCI6MTcwOTcxOTY5NCwiZXh0cmFzIjp7fX0.1bjE2vGjg1gV1B_8oE-h80YX3-lfSA3W07vhtAFxRy8";
  const response = await fetch(
    "http://localhost:8000/api/projects/" +
      projectId +
      "/responses/" +
      projectResponseId,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const projectResponse = data as ProjectResponse;
  return projectResponse;
}

interface ProjectResponseDetailsProps {
  projectId?: string;
  projectResponseId?: string;
  projectResponse?: ProjectResponse;
}

export function ProjectResponseDetails({
  projectId,
  projectResponseId,
  projectResponse,
}: ProjectResponseDetailsProps) {
  const [response, setResponse] = useState<ProjectResponse | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (projectResponse !== undefined) {
          setResponse(projectResponse);
        } else if (projectId !== undefined && projectResponseId !== undefined) {
          const resp = await getProjectResponse(projectId, projectResponseId);
          setResponse(resp);
        }
      } catch (error) {}
    };
    fetchProject();
  }, [projectId, projectResponseId, projectResponse]);

  return (
    <div className="flex flex-1 flex-col justify-start items-center px-6 h-full">
      {response !== null ? (
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between py-2 items-center">
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-row items-center gap-x-2 ">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/projects/${response.projectId}/responses/${response.id}`}
                    >
                      <Button variant="outline" size="icon" disabled={false}>
                        <Maximize2 className="h-4 w-4" />
                        <span className="sr-only">Share profile</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>View fullscreen</TooltipContent>
                </Tooltip>
                <p className="text-sm text-slate-700 font-medium">#312</p>
              </div>

              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" disabled={false}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Share profile</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share link</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          <div className="flex-1 space-y-6 pb-4">
            <ProjectResponseIdentity />
            <PropList />
            <ProjectResponseTranscript projectResponse={response} />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 py-8">
          <EmptySelectionCard
            title="Nothing selected"
            description="Choose an item from the list to view it's details"
          />
        </div>
      )}
    </div>
  );
}
