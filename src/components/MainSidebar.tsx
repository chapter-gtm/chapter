"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/MainNav";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FolderOpenDot,
  Layers,
  PieChart,
  ChevronDown,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

const groups = [
  {
    label: "Personal Account",
    teams: [
      {
        label: "Robin Greenwood",
        value: "robincgreenwood@gmail.com",
      },
    ],
  },
];

type Team = (typeof groups)[number]["teams"][number];

type SideBarProps = React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>;

export default function Sidebar({ className }: SideBarProps) {
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(
    groups[0].teams[0]
  );

  return (
    <div className={cn("border-e border-slate-200")}>
      <div className="space-y-4 px-3 pt-3">
        <div className={cn("items-center justify-start")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn("", className)}
              >
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage
                    src="/images/avatar.jpeg"
                    alt="avatar"
                    className=""
                  />
                  <AvatarFallback>RG</AvatarFallback>
                </Avatar>
                <div className="text-ellipsis overflow-hidden">
                  {selectedTeam.label}
                </div>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Mimi Hearing
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {selectedTeam.value}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>New Invite</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-1 mt-2 w-full">
          <MainNav
            isCollapsed={false}
            links={[
              {
                title: "Dashboard",
                label: "",
                icon: PieChart,
                variant: "secondary",
                route: "/dashboard",
              },
              {
                title: "Projects",
                label: "",
                icon: Layers,
                variant: "ghost",
                route: "/projects",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
