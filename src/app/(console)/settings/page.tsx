import { Separator } from "@/components/ui/separator";
import { AgentForm } from "@/components/AgentForm";
import Image from "next/image";

export default function AccountSettings() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col w-1/2 mx-auto pt-24 pb-20 px-12">
        <div className="flex flex-inline bg-card rounded-xl h-44 justify-center">
          <Image
            src="/images/customIcons/agent.svg"
            width={80}
            height={80}
            alt="Inbox"
            className="py-3"
          />
        </div>
        <div className="flex flex-col gap-y-2 py-8">
          <h3 className="text-2xl font-medium">Create research agent</h3>
          <p className="text-lg text-muted-foreground">
            The account information, persona, and search criteria that
            prequalifies your ICP
          </p>
        </div>
        <AgentForm />
      </div>
    </div>
  );
}
