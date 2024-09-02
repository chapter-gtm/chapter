"use client";

import Link from "next/link";
import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";

export interface NavPropsLink {
  title: string;
  route: string;
  variant: "default" | "secondary" | "ghost";
  icon?: null | LucideIcon;
  label?: string;
}

interface NavProps {
  links: NavPropsLink[];
}

export function MainNav({ links }: NavProps) {
  const pathname = usePathname();
  // const { setTheme } = useTheme();
  console.log("1.: pathname");

  return (
    <nav className="flex items-center space-x-2 lg:space-x-3">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.route}
          className={cn(
            buttonVariants({ variant: link.variant }),
            pathname === link.route
              ? "bg-white hover:bg-zinc-100 dark:bg-card dark:hover:bg-zinc-700/50 "
              : "hover:bg-zinc-100/60 dark:bg-transparent dark:hover:bg-zinc-800",
            "justify-start items-start h-auto px-3 items-center justify-center text-zinc-800 dark:text-zinc-200 h-10"
          )}
        >
          {link.icon && <link.icon className=" h-4 w-4" />}
          <span className="flex flex-col items-start">{link.title}</span>
        </Link>
      ))}
    </nav>
  );
}
