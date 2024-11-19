"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { AgentForm } from "./AgentForm";
import { type Icp } from "@/types/icp";
import { getIcps } from "@/utils/chapter/icp";

export function IcpList() {
  const [icps, setIcps] = useState<Icp[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>();

  useEffect(() => {
    const fetchIcp = async () => {
      const currentUserIcps = await getIcps();
      if (currentUserIcps === null || currentUserIcps.length <= 0) {
        toast.success("Failed to fetch ICP");
      } else {
        setIcps(currentUserIcps);
        if (currentUserIcps && currentUserIcps.length > 0) {
          setSelectedTab(currentUserIcps[0].name);
        }
      }
    };
    fetchIcp();
  }, []);

  const handleUpdateIcp = (updatedIcp: Icp) => {
    setIcps((prev) =>
      prev.map((icp: Icp) =>
        icp.id === updatedIcp.id ? { ...icp, ...updatedIcp } : icp
      )
    );
  };

  const handleTabChange = (newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Toaster theme="light" />
      {icps.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto pt-24">
            <div className="flex flex-col gap-y-1">
              <Tabs
                className="grid grid-cols-4 gap-2"
                value={icps[0].name}
                onValueChange={handleTabChange}
              >
                {/* Start of left column */}
                <div className="col-span-1 pb-20">
                  <div className="flex flex-col gap-y-2">
                    {/* Vertical alignment of tabs */}
                    <TabsList className="flex flex-col gap-y-1 h-auto bg-transparent">
                      {icps.map((icp, index) => (
                        <TabsTrigger
                          key={icp.name}
                          value={icp.name}
                          className="py-3 w-full bg-transparent data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-700/20"
                        >
                          <div className="flex w-full text-base">
                            {icp.name}
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </div>
                {/* Start of right column: content */}

                {icps.map((icp, index) => (
                  <TabsContent
                    key={icp.name}
                    value={icp.name}
                    className="col-span-3 flex flex-col  pb-20 px-6 mt-1"
                  >
                    <AgentForm icp={icp} refreshIcp={handleUpdateIcp} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
