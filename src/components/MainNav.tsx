"use client";

import Link from "next/link";
import React, { useState } from "react";

import { usePathname } from "next/navigation";
import { LucideIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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

export interface NavPropsLink {
  title: string;
  route: string;
  variant: "default" | "secondary" | "ghost";
  icon?: LucideIcon;
  label?: string;
}

interface NavProps {
  links: NavPropsLink[];
}

export function MainNav({ links }: NavProps) {
  const pathname = usePathname();
  // const { setTheme } = useTheme();

  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    console.log("Current theme:", resolvedTheme);
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    console.log("New theme set to:", newTheme);
  };

  return (
    <nav className="flex items-center space-x-2 lg:space-x-3">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.route}
          className={cn(
            buttonVariants({ variant: link.variant }),
            pathname === link.route
              ? "bg-white hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/50"
              : "hover:bg-zinc-100/60 dark:bg-zinc-900 dark:hover:bg-zinc-800",
            "justify-start items-start h-auto px-3 items-center"
          )}
        >
          {link.icon && <link.icon className="mr-2 h-4 w-4" />}
          <span className="flex flex-col items-start">{link.title}</span>
        </Link>
      ))}

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="dark:hover:bg-transparent "
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </nav>
  );
}
