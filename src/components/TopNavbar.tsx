"use client";
import Link from "next/link";
import { MainNav, NavPropsLink } from "@/components/MainNav";

export function TopNavbar() {
  const links: NavPropsLink[] = [
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
