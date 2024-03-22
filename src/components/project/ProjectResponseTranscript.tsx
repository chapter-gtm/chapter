import { Separator } from "@/components/ui/separator";
import { ProjectResponse } from "@/types/project";

function getProjectResponse(projectId: string, projectResponseId: string) {
  // TODO: Fetch project responses
  const response = {
    id: "1234",
    date: "Feb 12, 2024",
    email: "bob@example.com",
    stage: "Completed",
    sentiment: "Positive",
  };

  return response;
}

interface ProjectResponseTranscriptProps {
  projectResponse: ProjectResponse;
}

export function ProjectResponseTranscript({
  projectResponse,
}: ProjectResponseTranscriptProps) {
  return (
    <>
      {projectResponse.transcript.map((thread, threadIndex) => (
        <div className="flex flex-col gap-y-3 p-3" key={threadIndex}>
          {thread.qa_pairs.map((qaPair, qaPairIndex) => (
            <div key={qaPairIndex}>
              <div className="max-w-[75%] px-3 py-2 text-xs text-slate-500 ml-0">
                Agent
              </div>
              <div className=" max-w-[75%] gap-2 rounded-lg px-3 py-2 text-sm bg-white">
                {qaPair.question}
              </div>
              <div className="max-w-[75%] px-3 py-2 text-xs text-slate-500 ml-auto">
                User
              </div>
              <div className=" max-w-[75%] gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground">
                {qaPair.answer}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
