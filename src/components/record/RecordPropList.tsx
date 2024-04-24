import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { toTitleCase } from "@/utils/misc";

import { RatingLabel } from "@/types/survey";
import { DataRecord } from "@/types/record";

import { type Score } from "@/types/score";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface RecordPropListProps {
  record: DataRecord;
}

export function RecordPropList({ record }: RecordPropListProps) {
  return (
    <ul className="space-y-4 list-none">
      {record.scores.map((score: Score, index: number) => (
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
                      "items-center gap-x-2 font-normal text-sm py-0.5 px-2 rounded-lg",
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
