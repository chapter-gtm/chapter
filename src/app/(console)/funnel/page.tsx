import { Metadata } from "next";
import { OutboundSalesFunnel } from "@/components/OutboundSalesFunnel";

export const metadata: Metadata = {
  title: "Funnel: Nectar Console",
  description: "Outbound Sales",
};

export default function FunnelPage() {
  return <OutboundSalesFunnel />;
}
