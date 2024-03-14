import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { toTitleCase } from "@/utils/misc";

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
    1: "bg-fuchsia-100",
    2: "bg-rose-100",
    3: "bg-yellow-100",
    4: "bg-green-100",
    5: "bg-indigo-100",
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
        <p className="basis-2/5 text-sm font-normal text-slate-600 leading-none">
          Stage
        </p>
        <div className="basis-3/5 flex">
          <div className="flex items-center gap-x-2 font-normal text-slate-700 leading-none text-sm border py-1 px-2 rounded-full">
            <span
              className={classNames(
                stageColor[projectResponse.state.stage],
                "h-1.5 w-1.5 rounded-full"
              )}
            ></span>
            {toTitleCase(projectResponse.state.stage)}
          </div>
        </div>
      </li>

      {projectResponse.scores.map((score: Score, index: number) => (
        <li
          key={index}
          className="flex flex-row gap-x-2 justify-start w-full items-center"
        >
          {" "}
          <Accordion type="single" collapsible className="w-full border-none">
            <AccordionItem value="item-1" className="border-none">
              <div className="flex flex-row items-center">
                <div className="basis-2/5 text-sm">{score.name}</div>
                <div className="basis-3/5 items-center flex flex-row justify-between">
                  <div
                    className={classNames(
                      scoreColor[score.score],
                      "items-center gap-x-2 font-normal text-sm py-0.5 px-2 rounded-lg"
                    )}
                  >
                    {RatingLabel[score.score]}
                  </div>

                  <AccordionTrigger className="p-2 rounded-lg flex-none text-sm font-normal text-slate-700 leading-none hover:no-underline hover:bg-slate-50"></AccordionTrigger>
                </div>
              </div>

              <AccordionContent className="py-2 text-slate-500">
                {score.reason}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>
      ))}
    </ul>
  );
}
