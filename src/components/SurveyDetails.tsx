import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SurveyDefinition } from "@/components/SurveyDefinition";
import { SurveyResults } from "@/components/SurveyResults";
import { Survey } from "@/types/survey";

interface SurveyDetailsProps {
  survey: Survey | null;
}

export function SurveyDetails({ survey }: SurveyDetailsProps) {
  return (
    <>
      <div className="hidden md:block">
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="definition" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="definition" className="relative">
                          Definition
                        </TabsTrigger>
                        <TabsTrigger value="results">Results</TabsTrigger>
                        <TabsTrigger value="insights" disabled>
                          Insights
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent
                      value="definition"
                      className="border-none p-0 outline-none"
                    >
                      <SurveyDefinition survey={survey} />
                    </TabsContent>
                    <TabsContent
                      value="results"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <SurveyResults survey={survey} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
