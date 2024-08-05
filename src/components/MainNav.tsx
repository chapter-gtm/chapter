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
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {links.map((link, index) => (
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
          {link.icon && <link.icon className="mr-2 h-4 w-4" />}
          <span className="flex flex-col items-start">{link.title}</span>
        </Link>
      ))}
    </nav>
  );
}
