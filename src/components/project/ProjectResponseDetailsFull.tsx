"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { ProjectResponseIdentity } from "@/components/project/ProjectResponseIdentity";

import { Maximize2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProjectResponse } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Link2Icon,
  Cross1Icon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ErrorMessage } from "@/components/ErrorMessage";
import { ProjectResponseTranscript } from "@/components/project/ProjectResponseTranscript";
import { ProjectResponsePropList } from "@/components/project/ProjectResponsePropList";

async function getProjectResponse(
  projectId: string,
  projectResponseId: string,
) {
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk4OTU3NzgsInN1YiI6InRlc3RAbmVjdGFyLnJ1biIsImlhdCI6MTcwOTgwOTM3OCwiZXh0cmFzIjp7fX0.f1reY5_k-8m5tRU9G9Y5ZVVgfQpgV8wEyQb7kyknyyg";
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

interface ProjectResponseDetailsFullProps {
  projectId?: string;
  projectResponseId?: string;
  projectResponse?: ProjectResponse;
}

export function ProjectResponseDetailsFull({
  projectId,
  projectResponseId,
  projectResponse,
}: ProjectResponseDetailsFullProps) {
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
    <>
      {response !== null ? (
        <div className="grid grid-cols-4 justify-start content-start">
          <div className="col-span-3 border-e border-slate-100 h-dvh">
            <div className="flex-1 border-b border-slate-100 pb-3 ">
              <div className="flex flex-row justify-between w-full py-3 px-7 justify-start">
                <div className="flex gap-4 items-center">
                  <ToggleGroup type="single">
                    <ToggleGroupItem
                      value="a"
                      className="border-slate-200 border"
                    >
                      <Cross1Icon className="w-3 h-3" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="a"
                      className="border-slate-200 border"
                    >
                      <ChevronDownIcon className="w-3 h-3" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="b"
                      className="border-slate-200 border"
                    >
                      <ChevronUpIcon className="w-3 h-3" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <p className="text-sm font-medium text-slate-600">
                    Respondant #312
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <button className="border-slate-200 border p-2 rounded-lg hover:bg-slate-100">
                    <Link2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="w-2/3 mx-auto py-3 px-7 mt-12">
                <h1 className="text-3xl font-semibold text-slate-600">
                  Unknown
                </h1>
              </div>
            </div>
            <div className="flex w-full">
              <Tabs defaultValue="transcript" className="w-full ">
                <div className="w-full flex flex-row border-b border-slate-100 justify-between py-3 items-center">
                  <div className="w-2/3 mx-auto">
                    <TabsList className="grid w-full grid-cols-2 w-[200px]">
                      <TabsTrigger value="transcript">Transcript</TabsTrigger>
                      <TabsTrigger value="password">Activity</TabsTrigger>
                    </TabsList>
                  </div>
                </div>
                <TabsContent value="transcript">
                  <div className="w-2/3 mx-auto">
                    {response !== null && (
                      <ProjectResponseTranscript projectResponse={response} />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="col-span-1 pt-2 px-6 space-y-5">
            <ProjectResponseIdentity />
            {response !== null && (
              <ProjectResponsePropList projectResponse={response} />
            )}
          </div>
        </div>
      ) : (
        <ErrorMessage />
      )}
    </>
  );
}
