"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Project } from "@/types/project";
import { ProjectResponse } from "@/types/project";
import { DataTable } from "@/components/data-table/data-table";
import {
  resultColumns,
  projectResponseSchema,
  filters,
} from "@/components/project/result-columns";
import { ProjectResponseTranscript } from "@/components/project/ProjectResponseTranscript";

interface ProjectResultsProps {
  project: Project;
}

function getProjectResponses() {
  // TODO: Fetch project responses
  const responses = [
    {
      id: "1234",
      date: "2024-02-14T10:00:30.123456Z",
      email: "bob@example.com",
      stage: "Completed",
      sentiment: 4,
    },
  ];

  return z.array(projectResponseSchema).parse(responses);
}

export function ProjectResults({ project }: ProjectResultsProps) {
  const defaultCollapsed = false;
  const defaultLayout = [400, 100];
  const navCollapsedSize = 50;
  const submissions = getProjectResponses();
  const [selectedRow, setSelectedRow] = useState<ProjectResponse | null>(null);

  const handleRowClick = function <TData>(data: TData) {
    setSelectedRow(data as ProjectResponse);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Project Results
          </h2>
          <p className="text-sm text-muted-foreground">Your project results.</p>
        </div>
      </div>
      <Separator className="my-4" />
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={50}
          maxSize={400}
        >
          <DataTable
            columns={resultColumns}
            data={submissions}
            filters={filters}
            filterColumnName="email"
            onRowClick={handleRowClick}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={0}
          maxSize={100}
        >
          <ProjectResponseTranscript projectResponse={selectedRow} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
