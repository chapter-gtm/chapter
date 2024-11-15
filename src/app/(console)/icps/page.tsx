import { Separator } from "@/components/ui/separator";
import { AgentForm } from "@/components/AgentForm";
import Image from "next/image";

export default function ICPCriteria() {
  return (
    <div className="w-full">
      <div className="space-y-10">
        <div className="flex flex-inline bg-card rounded-lg h-44 justify-center">
          <Image
            src="/images/customIcons/agent.svg"
            width={80}
            height={80}
            alt="Inbox"
            className="py-3"
          />
        </div>
        <div>
          <h3 className="text-xl font-medium">Prospecting Agents</h3>
          <p className="text-base text-muted-foreground">
            Define what your agent should search for.
          </p>
        </div>
      </div>
      <AgentForm />
    </div>
  );
}
