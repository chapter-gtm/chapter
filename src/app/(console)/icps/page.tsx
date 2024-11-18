import { Separator } from "@/components/ui/separator";
import { AgentForm } from "@/components/AgentForm";
import Image from "next/image";

export default function ICPCriteria() {
  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-y-6 max-w-4xl mx-auto pt-24 pb-20 px-12">
          <div className="flex bg-card rounded-lg justify-start items-start flex-col p-8 gap-y-2">
            <Image
              src="/images/customIcons/agent.svg"
              width={80}
              height={80}
              alt="Inbox"
              className="py-3"
            />
            <div className="justify-start flex flex-col gap-y-1">
              <h3 className="text-xl font-medium">Prospecting Agents</h3>
              <p className="text-base text-muted-foreground">
                Define what your agent should search for.
              </p>
            </div>
          </div>

          <AgentForm />
        </div>
      </div>
    </>
  );
}
