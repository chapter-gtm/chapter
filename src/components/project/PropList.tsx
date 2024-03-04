import Link from "next/link";
import { useState } from "react";
import * as React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

import { Project, ProjectState } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export function PropList() {
  const inputQualityColor: { [key: string]: string } = {
    "Super High": "bg-indigo-400",
    High: "bg-green-400",
    Medium: "bg-yellow-500",
    Low: "bg-rose-400",
    "Super Low": "bg-fuchsia-400",
  };

  const problemSeverityColor: { [key: string]: string } = {
    "Super High": "bg-indigo-400",
    High: "bg-rose-400",
    Medium: "bg-yellow-400",
    Low: "bg-green-400",
    "Super Low": "bg-fuchsia-400",
  };

  const completionStatusColor: { [key: string]: string } = {
    Completed: "bg-green-500",
    "In Progress": "bg-yellow-400",
    Aborted: "bg-rose-500",
  };

  const [properties, setProperties] = React.useState({
    id: "312",
    contact: "unknown",
    surveyStatus: "Completed",
    sentiment: "Medium",
    input: "Super Low",
  });

  return (
    <ul className="flex-1 space-y-4 list-none">
      {Object.keys(properties).map((key, index) => (
        <li
          key={index}
          className="flex flex-row justify-start w-full items-center"
        >
          <p className="w-2/5 flex-none text-sm font-normal text-slate-600 leading-none">
            {key}
          </p>
          <div
            key={index}
            className={`flex items-center gap-x-2 font-medium text-sm ${key === "surveyStatus" ? "text-xs border py-1 px-2 rounded-full" : key === "sentiment" || key === "input" ? "bg-gray-100 py-1 px-2 rounded-md" : ""}`}
          >
            <div
              className={`flex text-slate-600 relative items-center gap-2 ${key === "input" || key === "sentiment" ? "text-xs font-medium" : ""}`}
            >
              {key === "input" && (
                <span
                  className={classNames(
                    inputQualityColor[properties[key]],
                    "h-1.5 w-1.5 rounded-full",
                  )}
                ></span>
              )}

              {key === "sentiment" && (
                <span
                  className={classNames(
                    problemSeverityColor[properties[key]],
                    "h-1.5 w-1.5 rounded-full",
                  )}
                ></span>
              )}

              {key === "surveyStatus" && (
                <span
                  className={classNames(
                    completionStatusColor[properties[key]],
                    "h-1.5 w-1.5 rounded-full",
                  )}
                ></span>
              )}

              {key}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
