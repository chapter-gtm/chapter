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
import { ProjectResponseDetails } from "@/components/project/ProjectResponseDetails";

interface ProjectResultsProps {
  project: Project;
}

function getProjectResponses() {
  // TODO: Fetch project responses
  const responses = [
    {
      id: "1234",
      date: "Feb. 12",
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
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={25}
          maxSize={80}
        >
          <div className="px-6">
            <div className="items-center justify-between py-5">
              <h2 className="text-xl font-semibold my-2">
                {submissions.length}{" "}
                {submissions.length === 1 ? "Response" : "Responses"}
              </h2>
            </div>
            <DataTable
              columns={resultColumns}
              data={submissions}
              filters={filters}
              filterColumnName="email"
              onRowClick={handleRowClick}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={25}
          maxSize={50}
        >
          <ProjectResponseDetails projectResponse={selectedRow} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
