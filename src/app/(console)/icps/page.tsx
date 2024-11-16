import { Separator } from "@/components/ui/separator";
import { AgentForm } from "@/components/AgentForm";
import Image from "next/image";

export default function ICPCriteria() {
  return (
    <>
      <div className="flex-1 overflow-y-auto bg-green-500">
        <div className="flex flex-col bg-yellow-300">
          <div className="flex bg-card rounded-lg h-44 justify-center">
            <Image
              src="/images/customIcons/agent.svg"
              width={80}
              height={80}
              alt="Inbox"
              className="py-3"
            />
          </div>
          <div className="flex">
            <h3 className="text-xl font-medium">Prospecting Agents</h3>
            <p className="text-base text-muted-foreground">
              Define what your agent should search for.
            </p>
          </div>
          {/* <AgentForm /> */}
        </div>
      </div>
    </>
  );
}
