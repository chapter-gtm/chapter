"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  PenBox,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { SurveyList } from "@/components/SurveyList";
import { SurveyDetails } from "@/components/SurveyDetails";
import { Survey } from "@/types/survey";

async function getSurveys() {
  const response = await fetch("http://localhost/survey", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const surveys = data as Survey[];
  return surveys;
}

export function SurveyScreen() {
  const defaultLayout = [265, 440, 655];
  const [surveys, setSuevrys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    const initSurveys = async () => {
      const surveys = await getSurveys();
      setSuevrys(surveys);
      setSelectedSurvey(surveys.length > 0 ? surveys[0] : null);
    };
    initSurveys();
  }, []);

  function handleSelection(survey: Survey) {
    setSelectedSurvey(survey);
  }

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Surveys</h1>
              <div className="ml-auto mr-4">
                <Button>
                  <PlusCircledIcon className="mr-2 h-4 w-4" />
                  Add survey
                </Button>
              </div>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All surveys
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Finished
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <SurveyList
                surveys={surveys}
                selectedSurvey={selectedSurvey}
                handleSelection={handleSelection}
              />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <SurveyList
                surveys={surveys.filter(
                  (item) => item.state === "Expired" || item.state === "Closed",
                )}
                selectedSurvey={selectedSurvey}
                handleSelection={handleSelection}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <SurveyDetails survey={selectedSurvey} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
