"use client";
import React, { useCallback, useEffect, useState } from "react";

import clsx from "clsx";
import { CheckIcon, X, SparklesIcon, Trash2, Undo2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { humanDate } from "@/utils/misc";
import { Textarea } from "@/components/ui/textarea";
import { Tag as TagType, TagInput } from "@/components/tag-input/tag-input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  type Survey,
  SurveyOutroAction,
  SurveyResponseStage,
  type Question,
  QuestionFormat,
  SurveyState,
} from "@/types/survey";
import {
  updateSurvey,
  publishSurvey,
  getImprovedQuestion,
} from "@/utils/nectar/surveys";
import { getUserAccessToken } from "@/utils/supabase/client";

import EmojiHeader from "@/components/survey/EmojiHeader";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface SurveyDefinitionProps {
  survey: Survey;
  setSurvey: React.Dispatch<React.SetStateAction<Survey | null>>;
}

type ThreadState = {
  question: string;
  showUndoOverImprove: boolean;
};

export function SurveyDefinition({ survey, setSurvey }: SurveyDefinitionProps) {
  const [dataChanged, setDataChanged] = useState(false);
  const [published, setPublished] = useState(false);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const [candidatePersonaTags, setCandidatePersonaTags] = useState<TagType[]>(
    survey.candidatePersonas.map(
      (persona, index) =>
        ({
          id: index.toString(),
          text: persona,
        } as TagType)
    )
  );

  // Handles improve and undo on thread questions
  const initialThreadStates: ThreadState[] = [];
  survey.components.map((component) => {
    initialThreadStates.push({
      question: component.question,
      showUndoOverImprove: false,
    });
  });
  const [threadStates, setThreadStates] =
    useState<ThreadState[]>(initialThreadStates);

  const saveChanges = useCallback(async () => {
    try {
      if (!dataChanged) {
        return;
      }
      const userToken = await getUserAccessToken();
      if (userToken === undefined) {
        throw Error("User needs to login!");
      }
      await updateSurvey(userToken, survey);
      setDataChanged(false);

      toast.success("Auto saved!");
    } catch (error: any) {
      toast.error("Auto saved failed", { description: error.toString() });
    }
  }, [survey, dataChanged]);

  useEffect(() => {
    window.addEventListener("beforeunload", saveChanges);
    return () => {
      window.removeEventListener("beforeunload", saveChanges);
    };
  }, [saveChanges]);

  useEffect(() => {
    setDataChanged(true);
    setPublished(false);
  }, [survey]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const handlePublish = async () => {
    try {
      const userToken = await getUserAccessToken();
      if (userToken === undefined) {
        throw Error("User needs to login!");
      }
      await publishSurvey(userToken, survey.id);
      setPublished(true);

      // Update the survey object to cause state update
      setSurvey({ ...survey, ["publishedAt"]: new Date() });
      setSurvey({ ...survey, ["state"]: SurveyState.LIVE });

      toast.success("Survey published!");
    } catch (error: any) {
      toast.error("Publish failed", { description: error.toString() });
    }
  };

  const handleDeleteTag = async () => {};

  const handleImproveQuestion = async (index: number) => {
    try {
      const userToken = await getUserAccessToken();
      if (userToken === undefined) {
        throw Error("User needs to login!");
      }
      const improvedQuestion = await getImprovedQuestion(
        userToken,
        survey.id,
        survey.components[index].question
      );
      const updatedComponents: Question[] = [...survey.components];
      updatedComponents[index].question = improvedQuestion;

      setSurvey({ ...survey, ["components"]: updatedComponents });
      saveChanges();

      const newStates: ThreadState[] = [...threadStates];
      newStates[index].showUndoOverImprove = true;
      setThreadStates(newStates);
    } catch (error: any) {
      toast.error("Improve failed", { description: error.toString() });
    }
  };

  const handleRevertToLastQuestion = async (index: number) => {
    const updatedComponents: Question[] = [...survey.components];
    updatedComponents[index].question = threadStates[index].question;
    setSurvey({ ...survey, ["components"]: updatedComponents });
    saveChanges();

    const newStates: ThreadState[] = [...threadStates];
    newStates[index].showUndoOverImprove = false;
    setThreadStates(newStates);
  };

  const handleTagRemove = async (tag: string) => {
    // This is a hack because I didn't have enough time to figure out how
    // to `setSurvey` and `saveChanges` in one event. Note: `setSurvey`
    // is async so make the above two calls one after the other on an
    // event doesn't work.
    // TODO: Revisit auto-save implementation on this page. Use debounce
    // or websockets.
    try {
      const surveyClone: Survey = {
        ...survey,
        ["candidatePersonas"]: survey.candidatePersonas.filter(
          (item) => item !== tag
        ),
      };
      const userToken = await getUserAccessToken();
      if (userToken === undefined) {
        throw Error("User needs to login!");
      }
      await updateSurvey(userToken, surveyClone);
      setDataChanged(false);

      toast.success("Auto saved!");
    } catch (error: any) {
      toast.error("Auto saved failed", { description: error.toString() });
    }
  };

  return (
    <>
      <Toaster theme="light" />
      {survey && (
        <>
          <div className="bg-white border rounded-lg border-zinc-200 flex-1 overflow-hidden">
            <div className="flex flex-row h-full">
              <div className="basis-1/3 lg:max-w-[500px] border-r border-zinc-100">
                <div className="flex flex-row justify-between w-full h-14 items-center px-4 bg-white border-b border-zinc-100">
                  <p className="font-medium text-sm">
                    <span className="bg-zinc-100 px-2 py-1 rounded-lg mr-1">
                      1
                    </span>
                    General info
                  </p>
                </div>
                <div className="flex flex-col gap-y-3 pt-8">
                  <CardContent>
                    <div className="grid gap-y-6">
                      <div className="grid gap-3">
                        <Label htmlFor="survey-name">Survey name</Label>
                        <Input
                          id="survey-name"
                          placeholder="A short name for this survey."
                          value={survey.name}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setSurvey({
                              ...survey,
                              ["name"]: event.target.value,
                            });
                          }}
                          onBlur={saveChanges}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="target-user">Target user</Label>
                        <TagInput
                          placeholder="e.g. Product Managers, UX Researchers"
                          tags={candidatePersonaTags}
                          className="w-full"
                          setTags={(newTags) => {
                            setCandidatePersonaTags(newTags);
                            setSurvey({
                              ...survey,
                              ["candidatePersonas"]: (
                                newTags as [TagType, ...TagType[]]
                              ).map((tag) => tag.text),
                            });
                          }}
                          onBlur={saveChanges}
                          onTagRemove={handleTagRemove}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="goal">Survey goal</Label>
                        <Textarea
                          id="goal"
                          className="min-h-[130px]"
                          placeholder="What do you expect to learn from this survey?"
                          value={survey.goal !== null ? survey.goal : ""}
                          onChange={(
                            event: React.ChangeEvent<HTMLTextAreaElement>
                          ) => {
                            setSurvey({
                              ...survey,
                              ["goal"]: event.target.value,
                            });
                          }}
                          onBlur={saveChanges}
                        />
                      </div>
                      <Label htmlFor="scores">Topics to score</Label>
                      <div className="flex flex-row gap-x-2">
                        {survey.scoreDefinitions.map((scoreDef, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  key={index}
                                  className="border border-zinc-200 px-2 py-1 rounded-lg text-sm"
                                >
                                  {scoreDef.name}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{scoreDef.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
              <div className="grow bg-zinc-100/50 overflow-hidden flex flex-col">
                <div className="flex flex-row justify-between w-full min-h-14 h-14 items-center px-4 bg-white border-b border-zinc-100">
                  <p className="font-medium text-sm">
                    <span className="bg-zinc-100 px-2 py-1 rounded-lg mr-1">
                      2
                    </span>
                    Components
                  </p>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto">
                    <ul
                      role="list"
                      className="space-y-4 px-6 xl:px-8 2xl:px-12 mx-auto py-4 mb-20 flex flex-col"
                    >
                      <li>
                        <div className="w-full flex flex-col bg-white rounded-lg border border-slate-200">
                          <EmojiHeader status="Welcome" />
                          <CardContent className="space-y-4">
                            <div className="items-center gap-1">
                              <div className="space-y-3">
                                <Label htmlFor="intro-title">
                                  Welcome title
                                </Label>
                                <Input
                                  id="intro-title"
                                  placeholder="How you'd like to start the conversation"
                                  value={survey.intro.title}
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    survey.intro.title = event.target.value;
                                    setSurvey({
                                      ...survey,
                                      ["intro"]: {
                                        title: event.target.value,
                                        description: survey.intro.description,
                                      },
                                    });
                                  }}
                                  onBlur={saveChanges}
                                />
                              </div>
                            </div>
                            <div className="items-center gap-1">
                              <div className="space-y-3">
                                <Label htmlFor="intro-description">
                                  Welcome message
                                </Label>
                                <Input
                                  id="intro-description"
                                  placeholder="How you'd like to start the conversation"
                                  value={survey.intro.description}
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    survey.intro.description =
                                      event.target.value;
                                    setSurvey({
                                      ...survey,
                                      ["intro"]: {
                                        title: survey.intro.title,
                                        description: event.target.value,
                                      },
                                    });
                                  }}
                                  onBlur={saveChanges}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </li>

                      {survey.components.map((component, index) => (
                        <li key={index}>
                          <div className="w-full flex flex-col bg-white rounded-lg border border-slate-200">
                            <div className="flex flex-row items-center justify-between relative">
                              <EmojiHeader status="Thread" />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="me-6"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">More</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        const updatedComponents: Question[] = [
                                          ...survey.components.slice(0, index),
                                          ...survey.components.slice(index + 1),
                                        ];
                                        setSurvey({
                                          ...survey,
                                          ["components"]: updatedComponents,
                                        });
                                        setThreadStates([
                                          ...threadStates.slice(0, index),
                                          ...threadStates.slice(index + 1),
                                        ]);
                                      }}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Cancel</DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex flex-col px-6 py-3 gap-y-4">
                              <Label htmlFor="question">Question</Label>
                              <Input
                                id="question"
                                placeholder="How you'd like to start the conversation"
                                value={component.question}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const updatedComponents: Question[] = [
                                    ...survey.components,
                                  ];
                                  updatedComponents[index].question =
                                    event.target.value;
                                  setSurvey({
                                    ...survey,
                                    ["components"]: updatedComponents,
                                  });
                                  const newStates: ThreadState[] = [
                                    ...threadStates,
                                  ];
                                  newStates[index].question =
                                    event.target.value;
                                  setThreadStates(newStates);
                                }}
                                onBlur={saveChanges}
                              />
                              <div className="flex flex-row gap-x-3 items-center">
                                {!threadStates[index].showUndoOverImprove ? (
                                  <>
                                    <Button
                                      variant={"outline"}
                                      size={"sm"}
                                      onClick={() =>
                                        handleImproveQuestion(index)
                                      }
                                      disabled={
                                        survey.components[index].question === ""
                                          ? true
                                          : false
                                      }
                                    >
                                      <SparklesIcon className="mr-2 h-4 w-4" />
                                      Improve
                                    </Button>
                                    <p className="text-xs text-slate-400 flex">
                                      Remove bias or hypothetical questioning
                                      using AI
                                    </p>
                                  </>
                                ) : (
                                  <Button
                                    variant={"outline"}
                                    size={"sm"}
                                    onClick={() =>
                                      handleRevertToLastQuestion(index)
                                    }
                                  >
                                    <Undo2 className="mr-2 h-4 w-4" />
                                    Undo
                                  </Button>
                                )}
                              </div>
                            </div>
                            <Separator className="mt-2" />
                            <div className="flex flex-col px-6 py-2">
                              <div className="flex flex-row items-center justify-between h-12  relative">
                                <Label htmlFor="followup-count">
                                  # of followup questions
                                </Label>
                                <Select
                                  defaultValue={component.followups.toString()}
                                  onValueChange={(value: string) => {
                                    const updatedComponents: Question[] = [
                                      ...survey.components,
                                    ];
                                    updatedComponents[index].followups =
                                      parseInt(value);

                                    setSurvey({
                                      ...survey,
                                      ["components"]: updatedComponents,
                                    });
                                    saveChanges();
                                  }}
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="1">1</SelectItem>
                                      <SelectItem value="2">2</SelectItem>
                                      <SelectItem value="3">3</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}

                      {survey.components.length === 0 && (
                        <li>
                          <Button
                            variant="outline"
                            className="w-full border-dashed bg-white/20"
                            onClick={() => {
                              const updatedComponents: Question[] = [
                                ...survey.components,
                                {
                                  question: "",
                                  format: QuestionFormat.OPEN_ENDED,
                                  followups: 2,
                                },
                              ];
                              setSurvey({
                                ...survey,
                                ["components"]: updatedComponents,
                              });
                              setThreadStates((oldStates) => [
                                ...oldStates,
                                { question: "", showUndoOverImprove: false },
                              ]);
                            }}
                          >
                            Add thread
                          </Button>
                        </li>
                      )}

                      <li>
                        <div className="flex flex-col bg-white rounded-lg border border-slate-200">
                          <EmojiHeader status="Thanks" />

                          <div className="space-y-3 px-6">
                            <Label htmlFor="outro-title">Message</Label>
                            <Input
                              id="outro-title"
                              placeholder="Wow! thanks for sharing your insights with us."
                              value={survey.outro.title}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setSurvey({
                                  ...survey,
                                  ["outro"]: {
                                    title: event.target.value,
                                    description: survey.outro.description,
                                    actions: survey.outro.actions,
                                  },
                                });
                              }}
                              onBlur={saveChanges}
                            />
                          </div>
                          <Separator className="mt-3" />
                          <div className="flex flex-row justify-start space-x-3 items-center py-5 px-6 relative">
                            <Switch
                              checked={survey.outro.actions.includes(
                                SurveyOutroAction.AUTHOR_CALENDAR_LINK
                              )}
                              onCheckedChange={(checked: boolean) => {
                                let newActions: SurveyOutroAction[] = [];
                                if (checked) {
                                  newActions = [
                                    ...survey.outro.actions,
                                    SurveyOutroAction.AUTHOR_CALENDAR_LINK,
                                  ];
                                } else {
                                  newActions = survey.outro.actions.filter(
                                    (value) =>
                                      value !==
                                      SurveyOutroAction.AUTHOR_CALENDAR_LINK
                                  );
                                }
                                setSurvey({
                                  ...survey,
                                  ["outro"]: {
                                    title: survey.outro.title,
                                    description: survey.outro.description,
                                    actions: newActions,
                                  },
                                });
                              }}
                              onBlur={saveChanges}
                            />
                            <Label htmlFor="name">Add calendar link</Label>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="basis-1/3 lg:max-w-[500px] border-l border-zinc-100">
                <div className="flex flex-row justify-between w-full h-14 items-center px-4 border-b border-zinc-100">
                  <p className="font-medium text-sm">
                    <span className="bg-zinc-100 px-2 py-1 rounded-lg mr-1">
                      3
                    </span>
                    Publish
                  </p>
                </div>
                <div className="flex flex-col gap-y-2 justify-center h-1/2 px-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 mx-auto flex justify-center items-center text-2xl mb-2 group-hover:border border-slate-200">
                    {survey.emoji}
                  </div>
                  <div className="text-2xl text-center font-medium text-zinc-600 mt-2">
                    {survey.name}
                  </div>
                  {survey.publishedAt ? (
                    <p className="text-center text-xs text-slate-500">
                      Last published at{" "}
                      {humanDate(new Date(survey.publishedAt), true)}
                    </p>
                  ) : (
                    <p className="text-center text-xs text-slate-500">
                      Not published yet.
                    </p>
                  )}
                  <div className="flex flex-row justify-center w-full mt-6">
                    <div className="space-x-2 mx-auto">
                      <Button
                        variant="default"
                        size={"sm"}
                        onClick={handlePublish}
                      >
                        Publish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {survey === null && (
        <>
          <div className="bg-orange-300 border rounded-lg border-zinc-200 flex-1 overflow-hidden"></div>
        </>
      )}
    </>
  );
}
