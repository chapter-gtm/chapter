"use client";
import Link from "next/link";
import { MainNav, NavPropsLink } from "@/components/MainNav";

export function TopNavbar() {
  const links: NavPropsLink[] = [
    {
      title: "Overview",
      label: "",
      variant: "ghost",
      route: "/dashboard",
    },
    {
      title: "Funnel",
      label: "",
      variant: "ghost",
      route: "/funnel",
    },
  ];

  return (
    <>
      <MainNav links={links} />
    </>
  );
}
