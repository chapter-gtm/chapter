"use client";

import { MainNav, NavPropsLink } from "@/components/MainNav";
import { Layers, PieChart, ActivityIcon } from "lucide-react";
import { User } from "@/types/user";
import { getUserAccessToken } from "@/utils/supabase/client";
import { getUserProfile } from "@/utils/nectar/users";

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserNav } from "@/components/UserNav";
import { Header } from "@/components/Header";
import React, { useEffect, useState } from "react";

type SideBarProps = React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>;

export default function Sidebar({ className }: SideBarProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [links, setLinks] = useState<NavPropsLink[]>([
    {
      title: "Insights",
      label: "",
      icon: PieChart,
      variant: "ghost",
      route: "/insights",
    },
  ]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Do nothing if we've already added survey to the links
        // We need this check to avoid calling useEffect in an infinite loop
        if (links.some((link) => link.route === "/surveys")) {
          return;
        }

        const userToken = await getUserAccessToken();
        if (userToken === undefined) {
          throw Error("User needs to login!");
        }
        const user = await getUserProfile(userToken);
        if (user.email !== "demo@nectar.run") {
          setLinks((prevLinks) => [
            ...links,
            {
              title: "Surveys",
              label: "",
              icon: Layers,
              variant: "ghost",
              route: "/surveys",
            },
          ]);
        }
      } catch (error) {}
    };
    fetchCurrentUser();
  }, [links]);

  return (
    <div className="flex flex-col justify-between w-52">
      <div className="space-y-4 px-3 pt-3">
        <div className="items-center justify-start">
          <UserNav className={className} />
        </div>
        <div className="space-y-1 mt-2 w-full">
          <MainNav isCollapsed={false} links={links} />
        </div>
      </div>
      <div className="items-center justify-start">
        <Header />
      </div>
    </div>
  );
}
