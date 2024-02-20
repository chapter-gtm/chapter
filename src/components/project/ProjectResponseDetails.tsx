import Link from "next/link";
import { Maximize2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { ProjectResponse } from "@/types/project";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col justify-start items-center px-6 h-dvh">
      {response !== null ? (
        <div className="w-full">
          <Link href={`/projects/${projectId}/responses/${projectResponseId}`}>
            <Button variant="outline">
              <Maximize2 />
            </Button>
          </Link>
          <div className="flex flex-col justify-center w-full rounded-xl text-center py-6 bg-slate-100">
            <div className="mx-auto">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl text-slate-400 font-bold mt-4">
              Add a name...
            </h1>
          </div>
          <div>
            <div className="w-full">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Date</TableCell>
                    <TableCell>asdj kj asdk</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Stage</TableCell>
                    <TableCell>
                      <Badge>Completed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sentiment</TableCell>
                    <TableCell>
                      <Badge>High intent</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="w-full mt-12">
              <Tabs defaultValue="definition" className="h-full space-y-6 ">
                <TabsList>
                  <TabsTrigger value="transcript" className="relative">
                    Transcript
                  </TabsTrigger>
                  <TabsTrigger value="activity" disabled>
                    Activity
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">No response</div>
      )}
    </div>
  );
}
