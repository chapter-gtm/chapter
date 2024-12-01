import React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import * as LucideIcons from "lucide-react"

interface PageHeaderProps {
  title?: string
  action?: string
}

export function PageHeaderRow({ title, action }: PageHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center h-[44px]">
      <h2 className="text-sm font-semibold tracking-normal">{title}</h2>
      {action && <Button>{action}</Button>}
    </div>
  )
}
