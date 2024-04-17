import { Separator } from "@/components/ui/separator";
import { SurveyResponse } from "@/types/survey";

interface SurveyResponseTranscriptProps {
  surveyResponse: SurveyResponse;
}

export function SurveyResponseTranscript({
  surveyResponse,
}: SurveyResponseTranscriptProps) {
  return (
    <>
      {surveyResponse.transcript.map((thread, threadIndex) => (
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
                {qaPair.answer !== null && qaPair.answer !== ""
                  ? qaPair.answer
                  : "[No response]"}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
