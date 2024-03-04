import Link from "next/link";
import { Maximize2, AlertCircle, Info, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { ProjectResponse } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { ProjectTranscript } from "./ProjectTranscript";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { PropList } from "./PropList";
import {
  ProjectResponseIdentity,
} from "./ProjectResponseIdentity";

import { EmptySelectionCard } from "./EmptySelectionCard";

function getProjectResponse(projectId: string, projectResponseId: string) {
  // TODO: Fetch project responses
  const response = {
    id: "1234",
    date: "Feb 12, 2024",
    email: "bob@example.com",
    stage: "Completed",
    sentiment: "Positive",
  };

  return response;
}

interface ProjectResponseDetailsProps {
  projectId?: string;
  projectResponseId?: string;
  projectResponse?: ProjectResponse | null;
}

export function ProjectResponseDetails({
  projectId,
  projectResponseId,
  projectResponse,
}: ProjectResponseDetailsProps) {
  
  let response = null;
  if (projectResponse !== undefined) {
    response = projectResponse;
  } else if (projectId !== undefined && projectResponseId !== undefined) {
    response = getProjectResponse(projectId, projectResponseId);
  }
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
                      href={`/projects/${projectId}/responses/${projectResponseId}`}
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
          </div>
        </div>
      ) : (
        <div className="flex flex-1 py-8">
          <EmptySelectionCard 
            title="Nothing selected" description="Choose an item from the list to view it's details"/>
        </div>
      )}
    </div>
  );
}
