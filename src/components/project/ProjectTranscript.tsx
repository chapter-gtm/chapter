"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ProjectResponse } from "@/types/project";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export function ProjectTranscript({
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
    <>
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-y-3">
          <div className="">
            {messages.map((message, index) => (
              <div key={index} className="">
                <div
                  key={index}
                  className={cn(
                    "flex-1 w-max max-w-[75%] px-3 py-2 text-xs text-slate-500",
                    message.role === "user" ? "ml-auto" : "ml-0",
                  )}
                >
                  {message.role}
                </div>

                <div
                  key={index}
                  className={cn(
                    "flex-1 w-max max-w-[75%] gap-2 rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center py-8 ">
            <div className="flex font-medium text-sm text-slate-700 rounded-lg bg-green-100 p-4 border border-slate-200">
              ⭐️ Survey completed successfully
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
