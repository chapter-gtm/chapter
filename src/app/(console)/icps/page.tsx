import { Separator } from "@/components/ui/separator";
import { AgentForm } from "@/components/AgentForm";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ICPCriteria() {
  const icpList = [{ value: "Primary" }];

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto pt-24">
          <div className="flex flex-col gap-y-1">
            <div className="flex flex-col bg-card dark:bg-card rounded-xl justify-start items-start p-12 gap-y-2">
              <Image
                src="/images/customIcons/agent.svg"
                width={80}
                height={80}
                alt="Inbox"
                className="pb-3 hidden dark:block"
              />
              <Image
                src="/images/customIcons/agent-light.svg"
                width={80}
                height={80}
                alt="Inbox"
                className="pb-3 dark:hidden"
              />

              <div className="justify-start flex flex-col gap-y-1">
                <h3 className="text-xl font-medium">Prospecting Agents</h3>
                <p className="text-base text-muted-foreground">
                  Define what your agent should search for.
                </p>
              </div>
            </div>

            <Tabs defaultValue="Primary" className="grid grid-cols-4 gap-2">
              {/* Start of left column */}
              <div className="col-span-1 pb-20 py-2">
                <div className="flex flex-col gap-y-2">
                  {/* Vertical alignment of tabs */}
                  <TabsList className="flex flex-col gap-y-1 h-auto bg-transparent">
                    {icpList.map((icp, index) => (
                      <TabsTrigger
                        key={index}
                        value={icp.value}
                        className="py-3 w-full bg-transparent data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-700/20"
                      >
                        <div className="flex w-full text-base">{icp.value}</div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
              {/* Start of right column: content */}
              <TabsContent
                value="Primary"
                className="col-span-3 flex flex-col gap-y-4 pb-20 px-6"
              >
                <AgentForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
