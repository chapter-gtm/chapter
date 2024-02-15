"use client";

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
import { Survey } from "@/types/survey";
import { DataTable } from "@/components/data-table/data-table";
import {
  resultColumns,
  submissionSchema,
  filters,
} from "@/components/survey/result-columns";

interface SurveyResultsProps {
  survey: Survey | null;
}

function getSubmissions() {
  // TODO: Fetch survey submissions
  const submissions = [
    {
      id: "1234",
      date: "2024-02-14T10:00:30.123456Z",
      email: "bob@example.com",
      stage: "Completed",
      sentiment: 4,
    },
  ];

  return z.array(submissionSchema).parse(submissions);
}

export function SurveyResults({ survey }: SurveyResultsProps) {
  const submissions = getSubmissions();
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Survey Results
          </h2>
          <p className="text-sm text-muted-foreground">Your survey results.</p>
        </div>
      </div>
      <Separator className="my-4" />
      <DataTable columns={resultColumns} data={submissions} filters={filters} />
    </>
  );
}
