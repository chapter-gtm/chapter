import Link from "next/link";
import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import {
  Construction,
  RadioTower,
  LucideIcon,
  CheckCircleIcon,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { type Insight } from "@/types/insight";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <Link href={`/insights/${insight.id}`}>
      <div className="flex w-full items-center border-slate-200 bg-white border p-4 rounded-lg hover:bg-slate-100/30">
        <div className="flex flex-col justify-between h-full ">
          <div className="flex-1 group">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex justify-center items-center text-md mb-2 group-hover:border border-slate-200">
              4w
              {/* {insight.type} */}
            </div>
            <div className="text-base font-medium line-clamp-1">
              {insight.insight.title}
            </div>
            {/* <div className="text-base font-small line-clamp-1">
              {insight.insight.statement}
            </div> */}
          </div>
          <div className="flex flex-col justify-start gap-y-1 my-2 text-left">
            <p className="text-xs font-medium text-slate-400">
              {insight.records.length === 1
                ? " Conversation:"
                : " Conversations:"}{" "}
              {insight.records.length}
            </p>

            <p className="text-xs font-medium text-slate-400">
              {insight.companies.length === 1 ? " Accounts:" : " Accounts:"}{" "}
              {insight.companies.length}
            </p>
            <p className="text-xs font-medium text-slate-400">ARR: $50,000</p>
          </div>
          <Avatar className="w-7 h-7">
            <AvatarImage
              className=""
              src={insight.author.avatarUrl}
              alt={insight.author.name}
            />
            <AvatarFallback>{insight.author.name}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Link>
  );
}
