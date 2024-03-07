import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  ProjectResponse,
  ProjectResponseStage,
  Score,
  RatingLabel,
} from "@/types/project";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ProjectResponsePropListProps {
  projectResponse: ProjectResponse;
}

export function ProjectResponsePropList({
  projectResponse,
}: ProjectResponsePropListProps) {
  const scoreColor: { [key: number]: string } = {
    1: "bg-fuchsia-400",
    2: "bg-rose-400",
    3: "bg-yellow-500",
    4: "bg-green-400",
    5: "bg-indigo-400",
  };

  const stageColor: { [key in ProjectResponseStage]: string } = {
    [ProjectResponseStage.NOT_STARTED]: "bg-grey-400",
    [ProjectResponseStage.IN_PROGRESS]: "bg-yellow-400",
    [ProjectResponseStage.COMPLETED]: "bg-green-500",
    [ProjectResponseStage.ABORTED]: "bg-rose-500",
  };

  return (
    <ul className="flex-1 space-y-4 list-none">
      <li className="flex flex-row justify-start w-full items-center">
        <p className="w-2/5 flex-none text-sm font-normal text-slate-600 leading-none">
          Stage
        </p>
        <div className="flex items-center gap-x-2 font-medium text-sm text-xs border py-1 px-2 rounded-full">
          <span
            className={classNames(
              stageColor[projectResponse.state.stage],
              "h-1.5 w-1.5 rounded-full",
            )}
          ></span>
          {projectResponse.state.stage}
        </div>
      </li>
      <Accordion type="single" collapsible className="w-full">
        {projectResponse.scores.map((score: Score, index: number) => (
          <li
            key={index}
            className="flex flex-row justify-start w-full items-center"
          >
            {" "}
            <AccordionItem value="item-1 w-full">
              <AccordionTrigger className="w-2/5 flex-none text-sm font-normal text-slate-600 leading-none">
                {score.name}
                <div className="flex items-center gap-x-2 font-medium text-sm text-xs border py-1 px-2 rounded-full">
                  <span
                    className={classNames(
                      scoreColor[score.score],
                      "h-1.5 w-1.5 rounded-full",
                    )}
                  ></span>
                  {RatingLabel[score.score]}
                </div>
              </AccordionTrigger>
              <AccordionContent>{score.reason}</AccordionContent>
            </AccordionItem>
          </li>
        ))}
      </Accordion>
    </ul>
  );
}
