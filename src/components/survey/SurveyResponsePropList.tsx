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
  SurveyResponse,
  SurveyResponseStage,
  Score,
  RatingLabel,
} from "@/types/survey";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SurveyResponsePropListProps {
  surveyResponse: SurveyResponse;
}

export function SurveyResponsePropList({
  surveyResponse,
}: SurveyResponsePropListProps) {
  const stageColor: { [key in SurveyResponseStage]: string } = {
    [SurveyResponseStage.NOT_STARTED]: "bg-grey-400",
    [SurveyResponseStage.IN_PROGRESS]: "bg-yellow-400",
    [SurveyResponseStage.COMPLETED]: "bg-green-500",
    [SurveyResponseStage.ABORTED]: "bg-rose-500",
  };

  return (
    <ul className="space-y-4 list-none">
      <li className="flex flex-row justify-start w-full items-center">
        <p className="basis-2/5 text-sm font-normal text-slate-600 leading-none">
          Stage
        </p>
        <div className="basis-3/5 flex">
          <div className="flex items-center gap-x-2 font-normal text-slate-700 leading-none text-sm border py-1 px-2 rounded-full">
            <span
              className={classNames(
                stageColor[surveyResponse.state.stage],
                "h-1.5 w-1.5 rounded-full"
              )}
            ></span>
            {toTitleCase(surveyResponse.state.stage)}
          </div>
        </div>
      </li>

      {surveyResponse.scores.map((score: Score, index: number) => (
        <li
          key={index}
          className="flex flex-row gap-x-2 justify-start  items-center"
        >
          {" "}
          <Accordion type="single" collapsible className="w-full border-none">
            <AccordionItem value="item-1" className="border-none">
              <div className="flex flex-row items-center">
                <div className="basis-2/5 text-sm text-slate-600">
                  {score.name}
                </div>

                <div className="basis-3/5 items-center flex flex-row justify-between">
                  <div
                    className={classNames(
                      RatingLabel[score.value].color,
                      "items-center gap-x-2 font-normal text-sm py-0.5 px-2 rounded-lg"
                    )}
                  >
                    {RatingLabel[score.value].label}
                  </div>

                  <AccordionTrigger className="p-2 rounded-lg flex-none text-sm font-normal text-slate-700 leading-none hover:no-underline hover:bg-slate-50"></AccordionTrigger>
                </div>
              </div>

              <AccordionContent className="py-2 text-slate-500">
                {score.description}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>
      ))}
    </ul>
  );
}
