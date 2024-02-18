import { ProjectResponse } from "@/types/project";

interface ProjectResponseTranscriptProps {
  projectResponse: ProjectResponse | null;
}

export function ProjectResponseTranscript({
  projectResponse,
}: ProjectResponseTranscriptProps) {
  return (
    <div className="flex h-full flex-col">
      {projectResponse ? (
        <div className="flex flex-1 flex-col">
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {projectResponse.id}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">No response</div>
      )}
    </div>
  );
}
