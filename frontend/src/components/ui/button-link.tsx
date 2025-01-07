import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex gap-x-2 items-center justify-center whitespace-nowrap underline-offset-8 hover:underline rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 py-2",
        sm: "h-9 rounded-md",
        lg: "h-11 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const ButtonLink = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {children}

        {/* Icon visibility controlled by hover */}
        <ExternalLink className="h-3.5 w-3.5" />
      </Comp>
    )
  }
)
ButtonLink.displayName = "Button"

export { ButtonLink, buttonVariants }
