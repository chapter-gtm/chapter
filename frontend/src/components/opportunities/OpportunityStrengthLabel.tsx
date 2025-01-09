import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2 py-1 text-xs rounded-md border-[0.5px]",
  {
    variants: {
      variant: {
        good: "flex flex-inline gap-x-2 items-center text-green-700 dark:text-green-500 bg-green-600/20 border-green-700",
        great:
          "flex flex-inline gap-x-2 items-center text-green-400 dark:text-green-400 bg-green-400/20",
      },
      size: {
        fixed: "w-24 h-7",
        default: "py1 px-3",
      },
      border: {
        dashed: "border-dashed border",
        default: "border",
      },
    },
    defaultVariants: {
      variant: "good",
    },
  }
)

export interface LabelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof labelVariants> {
  asChild?: boolean
}

function StrengthLabel({
  className,
  variant,
  size,
  border,
  ...props
}: LabelProps) {
  return (
    <div
      className={cn(labelVariants({ variant, size, border }), className)}
      {...props}
    />
  )
}

export { StrengthLabel, labelVariants }
