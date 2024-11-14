"use client";

import {
  LayoutDashboard,
  CheckSquareIcon,
  Loader,
  ListTodo,
  LineChart,
  Inbox,
  Users,
} from "lucide-react";
import { getIcp } from "@/utils/chapter/icp";

import { TrendingUp, BellDot } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { EmptySelectionCard } from "@/components/EmptySelectionCard";
import { PageHeaderRow } from "@/components/PageHeaderRow";
import { Card } from "./ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";
import { timeAgo, isDateInLastNHours } from "@/utils/misc";
import { Button } from "@/components/ui/button";

import { User } from "@/types/user";
import { type Opportunity, OpportunityStage } from "@/types/opportunity";
import { getOpportunities } from "@/utils/chapter/opportunity";
import { getUserProfile } from "@/utils/chapter/users";

import { useEffect, useState } from "react";
import Link from "next/link";

import { title } from "process";
import { type Icp } from "@/types/icp";

export function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [recentlyViewedOpportunities, setRecentlyViewedOpportunities] =
    useState<Opportunity[]>([]);
  const [opportunityCountByStageChartData, setOpportunityByStageChartData] =
    useState<object[]>([{ x: 1, y: 0 }]);

  const [icp, setIcp] = useState<Icp | null>(null);

  const [newOpportunities, setNewOpportunities] = useState<Boolean>(false);
  const [newOpportunityCount, setNewOpportunityCount] = useState<number>(0);

  const chartConfig = {
    x: {
      label: "Desktop",
      color: "rgb(var(--chart))",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const fetchIcp = async () => {
      const currentUserIcp = await getIcp();
      setIcp(currentUserIcp);
    };

    const fetchOpportunities = async () => {
      try {
        const user = await getUserProfile();
        const opportunities = await getOpportunities(
          1000,
          1,
          "created_at",
          "desc",
          "",
          "",
          true
        );
        setCurrentUser(user);
        setOpportunities(opportunities);
        const filteredOpportunities = opportunities.filter((op) =>
          user.recentlyViewedOpportunityIds.includes(op.id)
        );
        const orderedOpportunities = user.recentlyViewedOpportunityIds
          .map((id) => filteredOpportunities.find((op) => op.id === id))
          .filter((op) => op !== undefined);
        setRecentlyViewedOpportunities(orderedOpportunities);
      } catch (error: any) {
        toast.error("Failed to load data.", { description: error.toString() });
      }
    };

    const gatherRecentlyViewedOpportunities = async (
      user: User,
      opportunities: Opportunity[]
    ) => {};

    fetchIcp();
    fetchOpportunities();
  }, []);

  useEffect(() => {
    const calculateOpportunitiesCountByStage = async () => {
      try {
        const opportunityCountByStage = new Map<string, number>();

        for (const value of Object.values(OpportunityStage)) {
          opportunityCountByStage.set(value.toString(), 0);
        }

        let count = 0;

        const hasNewOpportunities = opportunities.filter((op) => {
          const matchesCondition =
            op.stage === OpportunityStage.IDENTIFIED &&
            isDateInLastNHours(new Date(op.createdAt), 72);

          if (matchesCondition) {
            count++; // Increment count for each match
            setNewOpportunities(true);
          }
          return matchesCondition; // Keep only matching opportunities
        });

        setNewOpportunityCount(count);

        for (const opportunity of opportunities) {
          if (
            Object.values(OpportunityStage).includes(
              opportunity.stage as OpportunityStage
            )
          ) {
            opportunityCountByStage.set(
              opportunity.stage,
              opportunityCountByStage.get(opportunity.stage)! + 1
            );
          }
        }

        const chartData: object[] = [];
        let previousValue: number | null = null;
        let p = 100;

        for (const value of Object.values(OpportunityStage)) {
          let yValue = opportunityCountByStage.get(value.toString());
          if (yValue === undefined || yValue === null) {
            yValue = 0;
          }

          if (
            previousValue !== null &&
            previousValue !== 0 &&
            yValue !== null
          ) {
            p = ((yValue ?? 0) / previousValue) * 100;
            console.log(p);
          } else if (previousValue === null) {
            p = 100;
          } else {
            p = 0;
          }

          chartData.push({
            x: value,
            y: yValue,
          });

          previousValue = yValue;
        }

        setOpportunityByStageChartData(chartData);
        console.log("Data::::");
        console.log(chartData);
      } catch (error: any) {}
    };

    calculateOpportunitiesCountByStage();
  }, [opportunities]);

  return (
    <div className="overflow-auto w-full p-32 bg-background">
      <div className="flex flex-col space-y-2 px-6 mt-2">
        <div className="flex flex-row justify-start items-center gap-x-2 py-2">
          <Inbox className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">
            Newly identified
          </p>
        </div>
        <div className="flex relative">
          <div className="h-60 min-w-52 bg-gradient-to-l from-background/70 to-transparent absolute z-10 right-0 pointer-events-none"></div>

          <div className="flex w-full overflow-x-auto relative">
            <div className="flex flex-row h-60 gap-x-3 w-full">
              {opportunities && opportunities.length > 0 ? (
                <>
                  {opportunities
                    .filter(
                      (op) =>
                        op.stage === OpportunityStage.IDENTIFIED &&
                        isDateInLastNHours(new Date(op.createdAt), 72)
                    )
                    .map((op: Opportunity, index) => (
                      <Link
                        target="blank"
                        href={`/opportunities/${op?.id}`}
                        key={index}
                        className="flex-none basis-1/6 h-full"
                      >
                        <div className="flex w-full h-full flex-col relative bg-card rounded-xl border border-violet-400/40 hover:border-violet-500 cursor-pointer ">
                          <div className="flex flex-col justify-start content-center p-3 z-0">
                            <div className="space-y-3 mt-2 relative justify-start">
                              {op.company?.profilePicUrl ? (
                                <Image
                                  src={op.company?.profilePicUrl}
                                  width={24}
                                  height={72}
                                  alt="Company Profile Picture"
                                  className="rounded-md border border-border"
                                />
                              ) : (
                                <div className="h-[72px] w-[24px] bg-green-400 flex"></div>
                              )}
                              {op.company?.name ? (
                                <p className="text-xl font-semibold line-clamp-2">
                                  {op.company?.name}
                                </p>
                              ) : (
                                <div className="h-12 w-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="flex flex-wrap pt-2 gap-x-2 gap-y-1">
                              {icp &&
                                op.jobPosts
                                  ?.flatMap((jobPost) => jobPost.tools)
                                  .filter(
                                    (tool) =>
                                      tool &&
                                      icp.tool.include.includes(tool.name)
                                  )
                                  .map((tool, index) => (
                                    <>
                                      {tool && (
                                        <div
                                          key={index}
                                          className="text-xs px-1.5 py-1 bg-background/50 dark:bg-popover rounded-md text-secondary-foreground"
                                        >
                                          {tool.name}
                                        </div>
                                      )}
                                    </>
                                  ))}
                              <div className="items-center flex text-xs px-1.5 py-1 bg-background/50 dark:bg-popover rounded-md text-secondary-foreground">
                                {/* <Users className="h-3 w-3 me-1.5" /> */}
                                Eng {op.company?.orgSize?.engineering}
                              </div>
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
                  {Array.from(Array(6), (e, i) => {
                    return (
                      <div
                        key={i}
                        className="basis-1/2 sm:basis-1/4 h-60 bg-card rounded-xl border border-border animate-pulse"
                      ></div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-start items-center gap-x-2 pt-6 pb-2">
          <Inbox className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">
            Recently viewed
          </p>
        </div>
        <div className="flex relative">
          <div className="h-60 min-w-52 bg-gradient-to-l from-background/70 to-transparent absolute z-10 right-0 pointer-events-none"></div>

          <div className="flex w-full overflow-x-scroll relative ">
            <div className="relative flex flex-row w-full gap-3 h-60">
              {currentUser &&
              currentUser.recentlyViewedOpportunityIds.length > 0 &&
              recentlyViewedOpportunities.length > 0 ? (
                <>
                  {recentlyViewedOpportunities.map((op: Opportunity, index) => (
                    <Link
                      target="blank"
                      href={`/opportunities/${op?.id}`}
                      key={index}
                      className="flex-none basis-1/6"
                    >
                      <div className="flex flex-col relative h-60 col-span-1 bg-card rounded-xl border border-border hover:border-muted cursor-pointer ">
                        <div className="flex flex-col h-full justify-start content-center p-3  z-0">
                          <div className="space-y-3 mt-2 relative justify-start">
                            {op.company?.profilePicUrl ? (
                              <Image
                                src={op.company?.profilePicUrl}
                                width={24}
                                height={72}
                                alt="Company Profile Picture"
                                className="rounded-md border border-border"
                              />
                            ) : (
                              <div className="h-[72px] w-[24px] bg-green-400 flex"></div>
                            )}
                            {op.company?.name ? (
                              <p className="text-xl font-semibold line-clamp-2">
                                {op.company?.name}
                              </p>
                            ) : (
                              <div className="h-12 w-full animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex flex-wrap pt-2 gap-x-2 gap-y-1">
                            {icp &&
                              op.jobPosts
                                ?.flatMap((jobPost) => jobPost.tools)
                                .filter(
                                  (tool) =>
                                    tool && icp.tool.include.includes(tool.name)
                                )
                                .map((tool, index) => (
                                  <>
                                    {tool && (
                                      <div
                                        key={index}
                                        className="text-xs px-1.5 py-1 bg-background/50 dark:bg-popover rounded-md text-secondary-foreground"
                                      >
                                        {tool.name}
                                      </div>
                                    )}
                                  </>
                                ))}
                            <div className="items-center flex text-xs px-1.5 py-1 bg-background/50 dark:bg-popover rounded-md text-secondary-foreground">
                              {/* <Users className="h-3 w-3 me-1.5" /> */}
                              Eng {op.company?.orgSize?.engineering}
                            </div>
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
                  {Array.from(Array(6), (e, i) => {
                    return (
                      <div
                        key={i}
                        className="basis-1/2 sm:basis-1/4 h-60 bg-card rounded-xl border border-border animate-pulse"
                      ></div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-start items-center gap-x-2 mt-10  pt-6 pb-2">
          <LineChart className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">My progress</p>
        </div>
        <div className="flex flex-row bg-white dark:bg-zinc-800/50 rounded-xl border border-border ">
          <div className="w-full">
            <ChartContainer config={chartConfig} className="min-w-full h-96">
              <BarChart
                accessibilityLayer
                data={opportunityCountByStageChartData}
                margin={{
                  top: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="x"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="y"
                  style={{ fill: `hsl(var(--chart))` }}
                  radius={8}
                >
                  <LabelList
                    position="top"
                    className="fill-foreground"
                    offset={12}
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
