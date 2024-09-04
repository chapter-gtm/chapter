"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/SideBarNav";

import {
  LayoutDashboard,
  CheckSquareIcon,
  Loader,
  ListTodo,
  LineChart,
  Inbox,
  ChevronLeftIcon,
  Layers2Icon,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Prospect agent",
    href: "/settings/account",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="flex-row flex bg-red-300 flex-1 ">
        <div className="flex flex-col px-6 fixed h-full w-52 space-y-3">
          <div className="flex flex-inline items-center space-x-2 pt-3">
            <ChevronLeftIcon></ChevronLeftIcon>
            <h2 className="text-base font-medium tracking-wide">Settings</h2>
          </div>

          <SidebarNav items={sidebarNavItems} />
        </div>

        <div className="bg-background w-full h-full flex flex-col overflow-scroll p-4">
          <div className="ms-52 flex flex-col flex-1 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 bg-card/50 p-32 pb-24 rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
