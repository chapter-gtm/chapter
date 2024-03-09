import React from "react";

import { MainNav } from "@/components/MainNav";
import { Layers, PieChart } from "lucide-react";

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserNav } from "@/components/UserNav";

type SideBarProps = React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>;

export default function Sidebar({ className }: SideBarProps) {
  return (
    <div className="border-e border-slate-200">
      <div className="space-y-4 px-3 pt-3">
        <div className="items-center justify-start">
          <UserNav className={className} />
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
