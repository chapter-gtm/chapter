import { Separator } from "@/components/ui/separator";
import { Project } from "@/types/project";

interface ProjectDefinitionProps {
  project: Project;
}

export function ProjectDefinition({ project }: ProjectDefinitionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Project Definition
          </h2>
          <p className="text-sm text-muted-foreground">
            You can modify your project here. You can modify your project here. You can modify your project here. You can modify your project here.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
    </div>
  );
}
