import { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboatd: Nectar Console",
  description: "GTM built for technical founders",
};

export default function DashboardPage() {
  return <Dashboard />;
}
