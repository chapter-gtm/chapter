"use client";

import {
  LayoutDashboard,
  CheckSquareIcon,
  Loader,
  ListTodo,
  LineChart,
  Inbox,
} from "lucide-react";
import { EmptySelectionCard } from "@/components/EmptySelectionCard";
import { PageHeaderRow } from "@/components/PageHeaderRow";
import { Card } from "./ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";
import { timeAgo } from "@/utils/misc";
import { Button } from "@/components/ui/button";

import { User } from "@/types/user";
import { type Opportunity } from "@/types/opportunity";
import { getOpportunities } from "@/utils/chapter/opportunity";
import { getUserProfile } from "@/utils/chapter/users";

import { useEffect, useState } from "react";
import Link from "next/link";

import { title } from "process";

export function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getUserProfile();
        setCurrentUser(user);
      } catch (error) {}
    };

    const fetchOpportunities = async () => {
      try {
        const opportunities = await getOpportunities(
          20,
          1,
          "created_at",
          "desc",
          "stage",
          "Identified",
          true
        );
        setOpportunities(opportunities);
        console.log(opportunities);
      } catch (error: any) {
        toast.error("Failed to load data.", { description: error.toString() });
      }
    };

    fetchCurrentUser();
    fetchOpportunities();
  }, []);

  return (
    <div className="w-full">
      <div className=" flex flex-col space-y-2 px-6 mt-2 pb-24">
        <div className="flex flex-row justify-start items-center gap-x-2 py-2">
          <Inbox className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">
            Recently identified
          </p>
        </div>

        <div className="flex w-full min-h-52 h-52 overflow-x-scroll ">
          <div className="flex flex-row gap-x-4 mb-4">
            {opportunities && opportunities.length > 0 ? (
              <>
                {opportunities.map((op: Opportunity, index) => (
                  <Link
                    target="blank"
                    href={`/opportunities/${op?.id}`}
                    key={index}
                  >
                    <div
                      key={index}
                      className="flex flex-col h-52 w-44 bg-card rounded-xl border border-border hover:border-muted cursor-pointer"
                    >
                      <div className="flex flex-col h-full justify-center content-center p-3 relative">
                        <div className="space-y-1">
                          {op.company?.profilePicUrl ? (
                            <Image
                              src={op.company?.profilePicUrl}
                              width={24}
                              height={72}
                              alt="Company Profile Picture"
                              className="rounded-md border border-border"
                            />
                          ) : (
                            <div className="h-[72px] w-[24px] bg-white"></div>
                          )}
                          <p className="text-xl font-semibold">
                            {op.company?.name}
                          </p>
                        </div>
                        <p className="text-sm text-zinc-500 absolute bottom-2">
                          Added {timeAgo(new Date(op.createdAt))}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <>
                <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
                <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
                <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
                <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
                <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-start items-center gap-x-2 mt-10 py-2">
          <LineChart className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">My progress</p>
        </div>
        <div className="flex flex-row min-h-96 h-96 w-full bg-white dark:bg-zinc-800/50 rounded-xl border border-border ">
          <div className="flex flex-col flex-1 justify-center items-center text-center content-center py-6 gap-y-3">
            <Image
              src="/images/customIcons/funnel.svg"
              width={120}
              height={120}
              alt="Inbox"
              className="py-3"
            />
            <div className="flex flex-col gap-y-1">
              <p className="text-xl font-medium tracking-wide">Sales funnel</p>
              <p className="text-base text-muted">Coming soon.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-start items-center gap-x-2 mt-10 py-2">
          <CheckSquareIcon className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">My tasks</p>
        </div>

        <div className="flex flex-row min-h-96 h-96 w-full bg-white dark:bg-zinc-800/50 rounded-xl border border-border">
          <div className="flex flex-col flex-1 justify-center items-center text-center content-center gap-y-3">
            <Image
              src="/images/customIcons/task.svg"
              width={80}
              height={80}
              alt="Inbox"
              className="py-3"
            />
            <div className="flex flex-col gap-y-1">
              <p className="text-xl font-medium tracking-wide">Tasks</p>
              <p className="text-base text-muted">Coming soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
