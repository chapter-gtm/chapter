"use client";
import Link from "next/link";
import * as React from "react";

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
import { ProjectTranscript } from "./ProjectTranscript";
import { PropList } from "./PropList";

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

export function ProjectResponseDetailsFull({
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

  const [completionState, setCompletionState] = React.useState("Completed");

  const [messages, setMessages] = React.useState([
    {
      role: "agent",
      content:
        "When was the last time you had a less than ideal listening experience? What was it, and what made it challenging?",
    },
    {
      role: "user",
      content:
        "Last night in my basement. I listened via a bluetooth speaker. But the empty room, the walls and the speaker direction led to a muffled bad sound hurting my ears over time.",
    },
    {
      role: "agent",
      content:
        "Interesting, can you tell me more about how the room's layout and the speaker's position affected the sound quality?",
    },
    {
      role: "user",
      content:
        "There was coming reverbation coming from the whalls which had bad impact on the sound. The direction of the speaker leads to reduced availability of both highs and lows of the signal. Overall an unpleasant sound experience..",
    },
    {
      role: "agent",
      content:
        "That sounds frustrating. Can you elaborate on how the speaker's direction affected the availability of the highs and lows of the signal?",
    },
  ]);
  return (
    <div className="grid grid-cols-4 justify-start content-start">
      <div className="col-span-3 border-e border-slate-100 h-dvh">
        <div className="flex-1 border-b border-slate-100 pb-3 ">
          <div className="flex flex-row justify-between w-full py-3 px-7 justify-start">
            <div className="flex gap-4 items-center">
              <ToggleGroup type="single">
                <ToggleGroupItem value="a" className="border-slate-200 border">
                  <Cross1Icon className="w-3 h-3" />
                </ToggleGroupItem>
                <ToggleGroupItem value="a" className="border-slate-200 border">
                  <ChevronDownIcon className="w-3 h-3" />
                </ToggleGroupItem>
                <ToggleGroupItem value="b" className="border-slate-200 border">
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
            <h1 className="text-3xl font-semibold text-slate-600">Unknown</h1>
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
                <ProjectTranscript />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="col-span-1 pt-2 px-6 space-y-5">
        <ProjectResponseIdentity />
        <PropList/>
      </div>
    </div>
  );
}
