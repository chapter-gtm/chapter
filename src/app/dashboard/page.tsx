import Image from "next/image";
import { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboatd: Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function DashboardPage() {
  return <Dashboard />;
}
