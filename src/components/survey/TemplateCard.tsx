import Link from "next/link";
import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";

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
import Emoji from "./Emoji";

interface TemplateCardProps {
  name: String;
  emoji: String;
  description: String;
}

export function TemplateCard({ name, emoji, description }: TemplateCardProps) {
  return (
    <div className="flex flex-row gap-x-3 w-full items-center border-slate-200 border p-3 rounded-lg hover:bg-zinc-200/30">
      <div className="h-12 w-12 bg-zinc-200 rounded-lg items-center">
        <span className="mx-auto text-lg">{emoji}</span>
      </div>
      <div className="flex flex-col gap-y-1 justify-start items-start">
        <div className="text-base font-medium line-clamp-1">{name}</div>
        <div className="text-xs font-normal text-slate-400">{description}</div>
      </div>
    </div>
  );
}
