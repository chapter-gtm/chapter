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
          5,
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
            Recently added
          </p>
        </div>

        <div className="flex w-full min-h-52 h-52 overflow-x-scroll ">
          <div className="flex flex-row gap-x-4 mb-4">
            {currentUser !== null && (
              <div className="flex flex-col h-52 w-96 bg-white dark:bg-zinc-800/50 rounded-xl border border-border hover:border-zinc-300/80">
                <div className="flex flex-col h-full justify-center items-center text-center content-center ">
                  <Image
                    src="/images/customIcons/inbox.svg"
                    width={80}
                    height={80}
                    alt="Inbox"
                    className="py-3"
                  />

                  <h3 className="font-semibold">
                    {currentUser.name.split(/\s+/)[0]}, you&apos;ve got leads!
                  </h3>
                </div>
              </div>
            )}

            {opportunities !== null &&
              opportunities.length > 0 &&
              opportunities.map((op: Opportunity, index) => (
                <Link
                  target="blank"
                  href={`/opportunities/${op?.id}`}
                  key={index}
                >
                  <div
                    key={index}
                    className="flex flex-col h-52 w-44 bg-white dark:bg-zinc-800/50 rounded-xl border border-border hover:border-zinc-300/80 cursor-pointer"
                  >
                    <div className="flex flex-col h-full justify-center content-center p-3 relative">
                      <div className="space-y-1">
                        {op.company?.profilePicUrl ? (
                          <Image
                            src={op.company?.profilePicUrl}
                            width={24}
                            height={72}
                            alt="Company Profile Picture"
                          />
                        ) : (
                          <></>
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
          </div>
        </div>

        <div className="flex flex-row justify-start items-center gap-x-2 mt-10 py-2">
          <CheckSquareIcon className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">My tasks</p>
        </div>

        <div className="flex flex-row min-h-96 h-96 w-full bg-white dark:bg-zinc-800/50 rounded-xl border border-border hover:border-zinc-300/80 cursor-pointer">
          <div className="flex flex-col flex-1 justify-center items-center text-center content-center gap-y-2">
            <Image
              src="/images/customIcons/task.svg"
              width={80}
              height={80}
              alt="Inbox"
              className="py-3"
            />

            <p className="text-base text-zinc-400">
              See all your tasks across your workspace in one place
            </p>
          </div>
        </div>

        <div className="flex flex-row justify-start items-center gap-x-2 mt-10 py-2">
          <LineChart className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">My progress</p>
        </div>
        <div className="flex flex-row min-h-96 h-96 w-full bg-white dark:bg-zinc-800/50 rounded-xl border border-border hover:border-zinc-300/80 cursor-pointer">
          <div className="flex flex-col flex-1 justify-center items-center text-center content-center gap-y-2">
            <Image
              src="/images/customIcons/task.svg"
              width={80}
              height={80}
              alt="Inbox"
              className="py-3"
            />

            <p className="text-base text-zinc-400">
              See all your tasks across your workspace in one place
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
