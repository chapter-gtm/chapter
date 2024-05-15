import Image from "next/image";
import { Metadata } from "next";
import { Integrations } from "@/components/settings/Integrations";

export const metadata: Metadata = {
  title: "Dashboatd: Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function IntegrationsPage() {
  return <Integrations />;
}
