import { Metadata } from "next"
import { Dashboard } from "@/components/Dashboard"

export const metadata: Metadata = {
  title: "Dashboard: Chapter App",
  description: "Lead gen for founders",
}

export default function DashboardPage() {
  return <Dashboard />
}
