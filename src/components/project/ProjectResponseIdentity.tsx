"use client";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProjectResponse } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Link2Icon,
  Cross1Icon,
  RocketIcon,
} from "@radix-ui/react-icons";
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

export function ProjectResponseIdentity({
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

  const [properties, setProperties] = React.useState([
    {
      id: "312",
      contact: "unknown",
      surveyStatus: "completed",
      sentiment: "critical",
      input: "good",
    },
  ]);
  return (
    <div className="mt-2 flex bg-slate-100 rounded-lg flex-col justify-center w-full text-center py-12">
      <div className="mx-auto">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <h1 className="text-2xl text-slate-300 font-medium mt-4">
        Add a name...
      </h1>
    </div>
  );
}
