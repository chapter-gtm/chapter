"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    route: string;
    icon: LucideIcon;
    variant: "default" | "secondary" | "ghost";
    label?: string;
  }[];
}

export function MainNav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname();
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1  group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider key={index} delayDuration={0}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.route}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-9 w-9",
                      pathname === link.route
                        ? "bg-muted hover:bg-muted"
                        : "hover:bg-transparent hover:underline"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.title}

                  {link.label && (
                    <span className="ml-auto text-muted-foreground">
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href={link.route}
              className={cn(
                buttonVariants({ variant: link.variant }),
                pathname === link.route
                  ? "bg-zinc-200 hover:bg-zinc-300"
                  : "hover:bg-zinc-200/60",
                "justify-start items-start h-auto px-3 items-center"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              <span className="flex flex-col items-start">{link.title}</span>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
