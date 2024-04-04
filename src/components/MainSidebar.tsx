"use client";

import React from "react";

import { MainNav } from "@/components/MainNav";
import { Layers, PieChart, ActivityIcon } from "lucide-react";

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserNav } from "@/components/UserNav";
import { Header } from "@/components/Header";

type SideBarProps = React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>;

export default function Sidebar({ className }: SideBarProps) {
  return (
    <div className="flex flex-col justify-between w-52">
      <div className="space-y-4 px-3 pt-3">
        <div className="items-center justify-start">
          <UserNav className={className} />
        </div>
        <div className="space-y-1 mt-2 w-full">
          <MainNav
            isCollapsed={false}
            links={[
              {
                title: "Surveys",
                label: "",
                icon: Layers,
                variant: "ghost",
                route: "/surveys",
              },
              {
                title: "Data",
                label: "",
                icon: ActivityIcon,
                variant: "ghost",
                route: "/streams",
              },
              {
                title: "Insights",
                label: "",
                icon: PieChart,
                variant: "ghost",
                route: "/dashboard",
              },
            ]}
          />
        </div>
      </div>
      <div className="items-center justify-start">
        <Header />
      </div>
    </div>
  );
}
