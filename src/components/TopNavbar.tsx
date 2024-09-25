"use client";
import Link from "next/link";
import { MainNav, NavPropsLink } from "@/components/MainNav";
import { LucideIceCream, HomeIcon, Building2 } from "lucide-react";

export function TopNavbar() {
  const links: NavPropsLink[] = [
    {
      title: "Home",
      label: "Home",
      variant: "secondary",
      route: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Opportunities",
      label: "",
      variant: "secondary",
      route: "/opportunities",
      icon: Building2,
    },
  ];

  return (
    <>
      <MainNav links={links} />
    </>
  );
}
