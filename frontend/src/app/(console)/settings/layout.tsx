"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/SideBarNav"

import {
  LayoutDashboard,
  CheckSquareIcon,
  Loader,
  ListTodo,
  LineChart,
  Inbox,
  ChevronLeftIcon,
  Layers2Icon,
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "Prospect agent",
    href: "/settings/account",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return <>{children}</>
}
