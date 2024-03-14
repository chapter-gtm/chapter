import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, Maximize2 } from "lucide-react";
import Link from "next/link";

import { ProjectResponseTranscript } from "@/components/project/ProjectResponseTranscript";
import { ProjectResponse } from "@/types/project";
import { ProjectResponseIdentity } from "@/components/project/ProjectResponseIdentity";
import { ProjectResponsePropList } from "@/components/project/ProjectResponsePropList";

import { EmptySelectionCard } from "./EmptySelectionCard";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface ProjectResponseDetailsProps {
  projectResponse?: ProjectResponse;
}

export function ProjectResponseDetails({
  projectResponse,
}: ProjectResponseDetailsProps) {
  return (
    <div className="flex flex-1 flex-col justify-start items-center px-6 h-full">
      {projectResponse !== undefined ? (
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between py-2 items-center">
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-row items-center gap-x-2 ">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/projects/${projectResponse.projectId}/responses/${projectResponse.id}`}
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
            <ProjectResponsePropList projectResponse={projectResponse} />
            <ProjectResponseTranscript projectResponse={projectResponse} />
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
