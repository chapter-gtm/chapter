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
      title: "Opportunities",
      label: "",
      variant: "ghost",
      route: "/opportunities",
    },
  ];

  return (
    <>
      <MainNav links={links} />
    </>
  );
}
