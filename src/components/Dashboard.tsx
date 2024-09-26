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

import { EmptySelectionCard } from "@/components/EmptySelectionCard";
import { PageHeaderRow } from "@/components/PageHeaderRow";
import { Card } from "./ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";
import { timeAgo } from "@/utils/misc";
import { Button } from "@/components/ui/button";
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryLabel,
  VictoryTheme,
  VictoryBrushLine,
} from "victory";

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
  const [opportunityCountByStageChartData, setOpportunityByStageChartData] =
    useState<object[]>([{ x: 1, y: 0 }]);

  const [icp, setIcp] = useState<Icp | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getUserProfile();
        setCurrentUser(user);
      } catch (error) {}
    };

    const fetchIcp = async () => {
      const currentUserIcp = await getIcp();
      setIcp(currentUserIcp);
    };

    const fetchOpportunities = async () => {
      try {
        const opportunities = await getOpportunities(
          1000,
          1,
          "created_at",
          "desc",
          "",
          "",
          true
        );
        setOpportunities(opportunities);
      } catch (error: any) {
        toast.error("Failed to load data.", { description: error.toString() });
      }
    };

    fetchCurrentUser();
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
            p: p,
          });

          previousValue = yValue;
        }

        setOpportunityByStageChartData(chartData);
      } catch (error: any) {}
    };

    calculateOpportunitiesCountByStage();
  }, [opportunities]);

  return (
    <div className="w-full relative">
      <div className="flex flex-col space-y-2 px-6 mt-2 pb-24">
        <div className="flex flex-row justify-start items-center gap-x-2 py-2">
          <Inbox className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">
            Recently identified
          </p>
        </div>
        <div className="flex relative">
          <div className="h-52 min-w-52 bg-gradient-to-l from-background/50 to-transparent absolute z-10 right-0 pointer-events-none"></div>

          <div className="flex w-full min-h-52 h-52 overflow-x-scroll relative ">
            <div className="flex flex-row gap-x-4 mb-4 relative">
              {opportunities && opportunities.length > 0 ? (
                <>
                  {opportunities
                    .filter((op) => op.stage === OpportunityStage.IDENTIFIED)
                    .map((op: Opportunity, index) => (
                      <Link
                        target="blank"
                        href={`/opportunities/${op?.id}`}
                        key={index}
                      >
                        <div
                          key={index}
                          className="flex flex-col relative h-52 w-44 bg-card rounded-xl border border-border hover:border-muted cursor-pointer "
                        >
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
                                <div className="h-12 w-full bg-yellow-400 animate-pulse"></div>
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
                  <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
                  <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
                  <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
                  <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
                  <div className="h-52 w-44 bg-card/80 border border-border rounded-xl animate-pulse"></div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-start items-center gap-x-2 mt-10 py-2">
          <LineChart className=" w-4 text-zinc-500" />
          <p className="text-sm font-semibold tracking-normal">My progress</p>
        </div>
        <div className="flex flex-row min-h-96 h-96 w-full bg-white dark:bg-zinc-800/50 rounded-xl border border-border ">
          <div className="flex flex-col flex-1 justify-center items-center text-center content-center py-6 gap-y-3">
            <div className="flex flex-col gap-y-1 w-auto">
              <VictoryChart
                domainPadding={30}
                height={300}
                width={1200}
                theme={VictoryTheme.material}
              >
                <VictoryAxis
                  gridComponent={<VictoryBrushLine width={120} />}
                  tickLabelComponent={<VictoryLabel angle={0} />}
                />
                <VictoryBar
                  barRatio={1.2}
                  cornerRadius={{ topLeft: 10, topRight: 10 }}
                  data={opportunityCountByStageChartData}
                  style={{
                    data: { fill: "#8b5cf6" },
                    labels: { fill: "white" },
                  }}
                  labels={({ datum }) => [datum.y, `${datum.p}%`]}
                  // cornerRadius={{ topLeft: "8", topRight: "8" }}
                  labelComponent={
                    <VictoryLabel
                      backgroundStyle={{ fill: "black", stroke: "gray" }}
                      backgroundPadding={3}
                      lineHeight={[1, 2]}
                      textAnchor="middle"
                      backgroundComponent={<rect rx={4} ry={4} />}
                    />
                  }
                />
              </VictoryChart>
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
              <p className="text-base text-muted-foreground">Coming soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
