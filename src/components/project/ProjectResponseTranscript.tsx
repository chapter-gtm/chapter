import { ProjectResponse } from "@/types/project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import {
  projectResponseSchema
} from "@/components/project/result-columns";
import { BadgeDollarSign } from "lucide-react";
import { Badge } from "../ui/badge";

function getResponderAttributes() {
  // TODO: Fetch project responses
  const responses = [
    {
      id: "1234",
      date: "Feb 12, 2024",
      email: "bob@example.com",
      stage: "Completed",
      sentiment: "Positive"
    },
  ];

  return z.array(projectResponseSchema).parse(responses);
}


interface ProjectResponseTranscriptProps {
  projectResponse: ProjectResponse | null;
}

export function ProjectResponseTranscript({
  projectResponse,
}: ProjectResponseTranscriptProps) {
  return (
    <div className="flex flex-col justify-start items-center px-6 h-dvh">
      {projectResponse ? (
        <div className="w-full">
          <div className="flex flex-col justify-center w-full rounded-xl text-center py-6 bg-slate-100">
            <div className="mx-auto">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl text-slate-400 font-bold mt-4">Add a name...</h1>
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
          <TabsList>
            <TabsTrigger value="results" className="relative">
              Transcript
            </TabsTrigger>
            <TabsTrigger value="">Activity</TabsTrigger>
          </TabsList>
          </div>
        </div>
      </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">No response</div>
      )}
    </div>
  );
}
