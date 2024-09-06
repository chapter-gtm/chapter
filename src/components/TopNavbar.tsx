"use client";
import Link from "next/link";
import { MainNav, NavPropsLink } from "@/components/MainNav";
import { LucideIceCream, HomeIcon } from "lucide-react";

export function TopNavbar() {
  const links: NavPropsLink[] = [
    {
      title: "",
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
    },
  ];

  return (
    <>
      <MainNav links={links} />
    </>
  );
}
