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
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Image
            src="/images/logos/logo.svg"
            width={90}
            height={14}
            alt="Logo"
          />
          <div className="space-y-1">
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
