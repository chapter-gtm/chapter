"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ZodTypeAny, z } from "zod";
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

import { type Project, type ProjectResponse } from "@/types/project";
import { DataTable } from "@/components/data-table/data-table";
import {
  resultColumns,
  ProjectResponseRecord,
  ProjectResponseRecordSchema,
  filters,
} from "@/components/project/result-columns";
import { ProjectResponseDetails } from "@/components/project/ProjectResponseDetails";
import { getProjectResponses } from "@/utils/nectar/projects";
import { getUserAccessToken } from "@/utils/supabase/client";

interface ProjectResultsProps {
  project: Project;
}

function titleCaseToCamelCase(titleCaseString: string): string {
  return titleCaseString
    .replace(/\s(.)/g, ($1) => $1.toUpperCase())
    .replace(/\s/g, "")
    .replace(/^(.)/, ($1) => $1.toLowerCase());
}

export function ProjectResults({ project }: ProjectResultsProps) {
  const defaultCollapsed = false;
  const defaultLayout = [80, 20];
  const navCollapsedSize = 20;
  const [responses, setResponses] = useState<Map<string, ProjectResponse>>(
    new Map(),
  );
  const [responseRecords, setResponseRecords] = useState<
    ProjectResponseRecordSchema[]
  >([]);
  const [selectedRow, setSelectedRow] = useState<ProjectResponse | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        const projectResponses = await getProjectResponses(
          userToken,
          project.id,
        );

        const responseMap = new Map<string, ProjectResponse>();
        projectResponses.forEach((resp) => responseMap.set(resp.id, resp));

        const responseRecords = z.array(ProjectResponseRecord).parse(
          projectResponses.map((response: ProjectResponse) => {
            const record: Record<string, any> = {
              id: response.id,
              date: response.startedAt.toLocaleString(),
              participant: response.participant.name,
              stage: response.state.stage,
            };
            response.scores.forEach((item) => {
              record[titleCaseToCamelCase(item.name)] = item.score;
            });
            return record;
          }),
        );

        setResponses(responseMap);
        setResponseRecords(responseRecords);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProject();
  }, [project]);

  const handleRowClick = function <TData>(data: TData) {
    const record: ProjectResponseRecordSchema =
      data as ProjectResponseRecordSchema;
    const resp: ProjectResponse | undefined = responses.get(record.id);
    if (resp !== undefined) {
      setSelectedRow(resp);
    }
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="items-stretch">
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={20}
          maxSize={80}
        >
          <div className="px-6">
            <div className="items-center justify-between py-5">
              <h2 className="text-xl font-semibold my-2">
                {responseRecords.length}{" "}
                {responseRecords.length === 1 ? "Response" : "Responses"}
              </h2>
            </div>
            <DataTable
              columns={resultColumns}
              data={responseRecords}
              filters={filters}
              filterColumnName="participant"
              onRowClick={handleRowClick}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={20}
          maxSize={50}
        >
          {selectedRow !== null && (
            <ProjectResponseDetails projectResponse={selectedRow} />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
