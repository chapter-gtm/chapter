"use client";
import Link from "next/link";
import { MainNav, NavPropsLink } from "@/components/MainNav";

export function TopNavbar() {
  const links: NavPropsLink[] = [
    { title: "Overview", label: "", variant: "secondary", route: "/dashboard" },
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
