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
      {/* <div className="flex flex-col px-6 fixed h-full w-52 space-y-3">
          <div className="flex flex-inline items-center space-x-2 pt-3">
            <ChevronLeftIcon></ChevronLeftIcon>
            <h2 className="text-base font-medium tracking-wide">Settings</h2>
          </div>

          <SidebarNav items={sidebarNavItems} />
        </div> */}

      {/* <div className="flex flex-col max-w-7xl mx-auto">
        <div className="flex flex-col bg-yellow-400 rounded-lg p-6"> */}
      {children}
      {/* </div>
      </div> */}
    </>
  );
}
