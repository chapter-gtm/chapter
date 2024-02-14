"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Survey } from "@/types/survey";

interface SurveyListProps {
  surveys: Survey[];
}

export function SurveyList({ surveys }: SurveyListProps) {
  const [selectedSurvey, setSelectedSurvey] = useState(
    surveys.length > 0 ? surveys[0] : null,
  );

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {surveys.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              selectedSurvey.id === item.id && "bg-muted",
            )}
            onClick={() => setSelectedSurvey(item)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.intro.title}</div>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedSurvey.id === item.id
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.created_ts.toLocaleDateString}
                </div>
              </div>
              <div className="text-xs font-medium">{item.objective}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.intro.description.substring(0, 300)}
            </div>
            <div className="flex items-center gap-2">
              {item.participant.personas.map((persona) => (
                <Badge key={persona} variant="default">
                  {persona}
                </Badge>
              ))}
              <Badge key={item.participant.location} variant="outline">
                {item.participant.location}
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
