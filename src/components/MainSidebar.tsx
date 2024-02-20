import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainNav } from "@/components/MainNav";

import { LayoutDashboard, FolderOpenDot } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4">
        <div className="px-3 pt-4">
          
          <div className="px-3 flex shrink-0 items-center gap-2 relative">
            <Image
              src="/images/avatar.jpeg"
              width={30}
              height={30}
              alt="Logo"
              className="rounded-full"
              />
            <span className="w-3 h-3 rounded-full bg-green-400 border-white border-2 absolute left-8 top-5"></span>
            <p className="font-medium text-slate-600 text-sm">Robin Greenwood</p>
          </div>
          
          <div className="space-y-1 mt-12">
            <MainNav
              isCollapsed={false}
              links={[
                {
                  title: "Dashboard",
                  label: "",
                  icon: LayoutDashboard,
                  variant: "secondary",
                  route: "/dashboard",
                },
                {
                  title: "Projects",
                  label: "",
                  icon: FolderOpenDot,
                  variant: "ghost",
                  route: "/projects",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
