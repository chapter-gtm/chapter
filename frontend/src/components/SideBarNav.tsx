"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LucideIcon, Layers2Icon } from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2",
        className
      )}
      {...props}
    >
      <div className="flex flex-inline items-center space-x-2 px-1 pt-2 text-sm text-normal text-muted space-x-2">
        <Layers2Icon className="h-5 w-5 mr-2" />
        Workflow
      </div>
      <div className="flex">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "outline" }),
              pathname === item.href ? "hover:bg-card" : "hover:bg-card",
              "justify-start border-none bg-transparent ms-6 gap-x-2 w-full px-2 h-8 font-normal"
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
