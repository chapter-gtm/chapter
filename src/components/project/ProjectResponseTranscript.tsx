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
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-y-3">
          <div className="">
            {projectResponse.transcript.map((thread, threadIndex) => (
              <div key={threadIndex}>
                {thread.qa_pairs.map((qaPair, qaPairIndex) => (
                  <div key={qaPairIndex}>
                    <div className="flex-1 w-max max-w-[75%] px-3 py-2 text-xs text-slate-500 ml-0">
                      Agent
                    </div>
                    <div className="flex-1 w-max max-w-[75%] gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                      {qaPair.question}
                    </div>
                    <div className="flex-1 w-max max-w-[75%] px-3 py-2 text-xs text-slate-500 ml-auto">
                      User
                    </div>
                    <div className="flex-1 w-max max-w-[75%] gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground">
                      {qaPair.answer}
                    </div>
                  </div>
                ))}
                <Separator className="bg-slate-100 my-4" />
              </div>
            ))}
          </div>
          <div className="flex justify-center py-8 ">
            <div className="flex font-medium text-sm text-slate-700 rounded-lg bg-green-100 p-4 border border-slate-200">
              ⭐️ Survey completed successfully
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
