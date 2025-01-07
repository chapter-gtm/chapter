import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeColorProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: keyof typeof colorVariants
  children?: React.ReactNode
}

const colorVariants = {
  teal: "bg-teal-50 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 dark:ring-teal-700 ring-teal-700",
  lime: "bg-lime-50 text-lime-700 dark:bg-lime-500/20 dark:text-lime-400 dark:ring-lime-700 ring-lime-700",
  yellow:
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 dark:ring-yellow-700 ring-yellow-700",
  orange:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 dark:ring-orange-700 ring-orange-700",
  red: "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400 dark:ring-red-700 ring-red-600",
  amber:
    "bg-amber-50 text-amber-700 ring-amber-700 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-700",
  pink: "bg-pink-50 text-pink-700 ring-pink-700 dark:bg-pink-500/20 dark:text-pink-400 dark:ring-pink-700",
  indigo:
    "bg-indigo-50 text-indigo-700 ring-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 dark:ring-indigo-700",
  violet:
    "bg-violet-50 text-violet-700 ring-violet-700 dark:bg-violet-500/20 dark:text-violet-400 dark:ring-violet-700",
  emerald:
    "bg-emerald-50 text-emerald-700 ring-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 dark:ring-emerald-700",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400 dark:ring-cyan-700",
  sky: "bg-sky-50 text-sky-700 ring-sky-700 dark:bg-sky-500/20 dark:text-sky-400 dark:ring-sky-700",
  green:
    "bg-green-50 text-green-700 ring-green-700 dark:bg-green-500/20 dark:text-green-400 dark:ring-green-700 ",
  zinc: "bg-zinc-50 text-zinc-700  ring-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-400 dark:ring-zinc-700",
}

export function BadgeColor({
  color = "zinc",
  children,
  className,
  ...props
}: BadgeColorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        colorVariants[color],
        "ring-opacity-20 dark:ring-opacity-20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
