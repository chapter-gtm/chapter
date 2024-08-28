import { Separator } from "@/components/ui/separator";
import { AgentForm } from "@/components/AgentForm";

export default function AccountSettings() {
  return (
    <div className="w-full">
      <div className="space-y-1">
        <h3 className="text-xl font-medium">Prospecting Agents</h3>
        <p className="text-base text-muted-foreground">
          Define what your agent should search for.
        </p>
      </div>
      <AgentForm />
    </div>
  );
}
