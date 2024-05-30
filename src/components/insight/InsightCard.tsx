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
  UserCircleIcon,
  MessageCircleIcon,
  LandmarkIcon,
  LightbulbIcon,
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
import { type Company } from "@/types/contact";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const currencySymbol = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Specify the currency code (e.g., USD for US Dollar, EUR for Euro)
  }).formatToParts()[0].value;

  const getTotalRevenue = (insight: Insight) => {
    let total = 0;
    insight.companies.forEach((comp: Company) => {
      total += comp.monthlySpend * 12;
    });
    return total.toLocaleString();
  };

  return (
    <Link href={`/insights/${insight.id}`}>
      <div className="flex w-full items-center border-slate-200 bg-white border p-4 rounded-lg hover:bg-zinc-200/50">
        <div className="flex flex-col justify-between py-4 gap-y-2">
          <div className="group">
            <div className="text-base font-medium line-clamp-1 text-zinc-800">
              {insight.insight.title}
            </div>

            <div className="text-base font-normal text-zinc-500 line-clamp-1">
              {insight.insight.statement}
            </div>
          </div>

          <div className="flex flex-row justify-start gap-x-3 my-2 text-left">
            <p className="flex text-xs font-normal text-zinc-600 py-1.5 px-2 bg-zinc-100 rounded-md">
              <LightbulbIcon className="w-4 h-4 mr-1" />
              4w&apos;s
            </p>
            <p className="flex text-xs font-normal text-zinc-600 py-1.5 px-2 bg-zinc-100 rounded-md">
              <MessageCircleIcon className="w-4 h-4 mr-1" />
              {/* {insight.records.length === 1
                ? " Conversation:"
                : " Conversations:"}{" "} */}
              {insight.records.length}
            </p>

            <p className="text-xs flex font-normal text-zinc-600 py-1.5 px-2 bg-zinc-100 rounded-md">
              <UserCircleIcon className="w-4 h-4 mr-1" />
              {/* {insight.companies.length === 1
                ? " Accounts:"
                : " Accounts:"}{" "} */}
              {insight.companies.length}
            </p>
            <p className="flex text-xs font-normal text-zinc-600 py-1.5 px-2 bg-zinc-100 rounded-md">
              <LandmarkIcon className="w-4 h-4 mr-1" />
              {currencySymbol + getTotalRevenue(insight)}
            </p>
          </div>
          <div className="flex items-center">
            <Avatar className="w-7 h-7">
              <AvatarImage
                className=""
                src={insight.author.avatarUrl}
                alt={insight.author.name}
              />
              <AvatarFallback>{insight.author.name}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-normal text-zinc-600 ml-2">
              {insight.author.name}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
