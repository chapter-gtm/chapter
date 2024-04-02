"use client";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SurveyResponse } from "@/types/survey";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Link2Icon,
  Cross1Icon,
  RocketIcon,
} from "@radix-ui/react-icons";
function getSurveyResponse(surveyId: string, surveyResponseId: string) {
  // TODO: Fetch survey responses
  const response = {
    id: "1234",
    date: "Feb 12, 2024",
    email: "bob@example.com",
    stage: "Completed",
    sentiment: "Positive",
  };

  return response;
}

interface SurveyResponseDetailsProps {
  surveyId?: string;
  surveyResponseId?: string;
  surveyResponse?: SurveyResponse | null;
}

export function SurveyResponseIdentity({
  surveyId,
  surveyResponseId,
  surveyResponse,
}: SurveyResponseDetailsProps) {
  let response = null;
  if (surveyResponse !== undefined) {
    response = surveyResponse;
  } else if (surveyId !== undefined && surveyResponseId !== undefined) {
    response = getSurveyResponse(surveyId, surveyResponseId);
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
    <div className="mt-2 flex flex-col justify-center w-full text-center py-12">
      <div className="mx-auto">
        <Avatar className="bg-blue-200"></Avatar>
      </div>
      <h1 className="text-2xl text-slate-300 font-medium mt-4">
        {surveyResponse?.contactPseudoName}
      </h1>
    </div>
  );
}
