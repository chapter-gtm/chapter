"use client";
import React, { useCallback, useEffect, useState } from "react";

import clsx from "clsx";
import { CheckIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  type Survey,
  SurveyOutroAction,
  SurveyResponseStage,
  type Question,
  QuestionFormat,
} from "@/types/survey";
import { SparklesIcon, Trash2 } from "lucide-react";
import { updateSurvey, publishSurvey } from "@/utils/nectar/surveys";
import { getUserAccessToken } from "@/utils/supabase/client";

import EmojiHeader from "@/components/survey/EmojiHeader";

interface SurveyDefinitionProps {
  survey: Survey;
  setSurvey: React.Dispatch<React.SetStateAction<Survey | null>>;
}

export function SurveyDefinition({ survey, setSurvey }: SurveyDefinitionProps) {
  const [dataChanged, setDataChanged] = useState(false);
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

      // add a message here
    } catch {
      // add a message here too
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
  }, [survey]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const handlePublish = async () => {
    const userToken = await getUserAccessToken();
    if (userToken === undefined) {
      throw Error("User needs to login!");
    }
    await publishSurvey(userToken, survey.id);
  };

  return (
    <>
      <div
        className={clsx(
          "flex flex-row items-center justify-end gap-x-2 px-6 h-12 border-b border-slate-100",
          {
            "bg-orange-100 justify-between": !dataChanged,
          }
        )}
      >
        {!dataChanged && (
          <p className="text-sm text-slate-500 flex flex-inline items-center">
            <span>
              <CheckIcon size={"15"} className="me-1" />
            </span>
            Auto saved!
          </p>
        )}
        <div className="space-x-2">
          <Button variant={"outline"} size={"sm"} onClick={saveChanges}>
            Preview
          </Button>
          <Button variant="default" size={"sm"} onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Start of column */}
        <div className="flex flex-col bg-background w-96 justify-start">
          <div className="flex flex-col gap-y-3 pt-8">
            <CardContent>
              <div className="grid gap-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="subject">Survey name</Label>
                  <Input
                    id="subject"
                    placeholder="A short name for this survey."
                    value={survey.name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSurvey({
                        ...survey,
                        ["name"]: event.target.value,
                      });
                    }}
                    onBlur={saveChanges}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="subject">Target user</Label>
                  <Input
                    id="subject"
                    placeholder="e.g. Product Managers, UX Researchers"
                    value={survey.candidatePersonas.join(", ")}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSurvey({
                        ...survey,
                        ["candidatePersonas"]: event.target.value
                          .split(",")
                          .map((token) => token.trim()),
                      });
                    }}
                    onBlur={saveChanges}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Survey goal</Label>
                  <Textarea
                    id="description"
                    placeholder="What do you expect to learn from this survey?"
                    value={survey.goal}
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
              </div>
            </CardContent>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto bg-slate-100">
            <ul role="list" className="space-y-4 w-2/3 mx-auto py-4 mb-20">
              <li>
                <div className="w-full flex flex-col bg-white rounded-lg border border-slate-200">
                  <EmojiHeader status="Welcome" />
                  <CardContent className="space-y-4">
                    <form>
                      <div className="items-center gap-1">
                        <div className="space-y-3">
                          <Label htmlFor="name">Welcome title</Label>
                          <Input
                            id="name"
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
                    </form>
                    <form>
                      <div className="items-center gap-1">
                        <div className="space-y-3">
                          <Label htmlFor="name">Welcome message</Label>
                          <Input
                            id="name"
                            placeholder="How you'd like to start the conversation"
                            value={survey.intro.description}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              survey.intro.description = event.target.value;
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
                    </form>
                  </CardContent>
                </div>
              </li>

              {survey.components.map((component, index) => (
                <li key={index}>
                  <div className="w-full flex flex-col bg-white rounded-lg border border-slate-200">
                    <form>
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
                        <Label htmlFor="name">Question</Label>
                        <Input
                          id="name"
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
                          }}
                          onBlur={saveChanges}
                        />
                        <div className="flex flex-row gap-x-3 items-center">
                          <Button variant={"outline"} size={"sm"}>
                            <SparklesIcon className="mr-2 h-4 w-4" />
                            Improve
                          </Button>
                          <p className="text-xs text-slate-400 flex">
                            Remove bias or hypothetical questioning using AI
                          </p>
                        </div>
                      </div>
                      <Separator className="mt-2" />
                      <div className="flex flex-col px-6 py-2">
                        <div className="flex flex-row items-center justify-between h-12  relative">
                          <Label htmlFor="name"># of followup questions</Label>
                          <Select
                            defaultValue={component.followups.toString()}
                            onValueChange={(value: string) => {
                              survey.components[index].followups =
                                parseInt(value);
                            }}
                            onOpenChange={saveChanges}
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
                    </form>
                  </div>
                </li>
              ))}

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
                  }}
                >
                  Add thread
                </Button>
              </li>

              <li>
                <form>
                  <div className="flex flex-col bg-white rounded-lg border border-slate-200">
                    <EmojiHeader status="Thanks" />

                    <div className="space-y-3 px-6">
                      <Label htmlFor="name">Message</Label>
                      <Input
                        id="name"
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
                            survey.outro.actions.filter(
                              (value) =>
                                value !== SurveyOutroAction.AUTHOR_CALENDAR_LINK
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
                      />
                      <Label htmlFor="name">Add calendar link</Label>
                    </div>
                  </div>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
