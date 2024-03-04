import Link from "next/link";

import {
  Construction,
  RadioTower,
  LucideIcon,
  CheckCircleIcon,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySelectionProps {
  title?: string;
  description?: string;
  action?: string;
}

export function EmptySelectionCard({
  title,
  description,
  action,
}: EmptySelectionProps) {
  return (
    <div className="rounded-lg py-8 px-12 text-center h-full flex flex-1 flex-col justify-center items-center border border-dashed border-slate-200 gap-y-2">
      <h1 className="font-semibold text-lg text-slate-800">{title}</h1>
      <p className="font-normal text-sm text-slate-500 w-2/3">
        {description}
      </p>
      {action?.length > 0 && (
        <Button variant="default" size="sm" className="mt-5">
          {action}
        </Button>
      )}
    </div>
  );
}
