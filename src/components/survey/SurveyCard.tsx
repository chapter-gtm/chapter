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

import { type SurveyMetadata, type SurveyState } from "@/types/survey";

interface SurveyCardProps {
  survey: SurveyMetadata;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  return (
    <Link href={`/surveys/${survey.id}`}>
      <div className="w-full h-44 items-center border-slate-200 bg-white border p-3 rounded-lg hover:bg-slate-100/30">
        <div className="flex flex-col justify-between h-full ">
          <div className="flex-1 group">
            <div className="w-16 h-16 rounded-lg bg-slate-100 flex justify-center items-center text-2xl mb-2 group-hover:border border-slate-200">
              {survey.emoji}
            </div>
            <div className="text-base font-medium line-clamp-1">
              {survey.name}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <Avatar className="w-7 h-7">
              <AvatarImage
                className=""
                src={survey.authors[0].avatarUrl}
                alt={survey.authors[0].name}
              />
              <AvatarFallback>{survey.authors[0].name}</AvatarFallback>
            </Avatar>
            <p className="text-xs font-medium text-slate-400">
              {survey.responseCount}{" "}
              {survey.responseCount === 1 ? " Response" : " Responses"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
