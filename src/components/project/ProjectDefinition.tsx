"use client";
import React, { useState, useEffect, useCallback } from "react";

import { PlusCircledIcon } from "@radix-ui/react-icons";

import { Separator } from "@/components/ui/separator";
import {
  Project,
  ProjectResponseStage,
  Question,
  QuestionFormat,
  ProjectOutroAction,
  ProjectOutro,
} from "@/types/project";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SparkleIcon, SparklesIcon } from "lucide-react";
import { Toggle } from "@radix-ui/react-toggle";
import { Switch } from "@/components/ui/switch";

import EmojiHeader from "@/components/project/EmojiHeader";

async function updateProject(id: string, project: Project) {
  console.log(`${id} and ${project}`);
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDk3MTgxNjMsInN1YiI6InRlc3RAbmVjdGFyLnJ1biIsImlhdCI6MTcwOTYzMTc2MywiZXh0cmFzIjp7fX0.E-kpf93IqSY272vvY7I1Xe_qXcohJtFCzrgCBxQI8fY";
  const response = await fetch("http://localhost:8000/api/projects/" + id, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
}

interface ProjectDefinitionProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

export function ProjectDefinition({
  project,
  setProject,
}: ProjectDefinitionProps) {
  const [dataChanged, setDataChanged] = useState(false);
  const { toast } = useToast();
  const saveChanges = useCallback(async () => {
    try {
      if (!dataChanged) {
        return;
      }
      await updateProject(project.id, project);
      setDataChanged(false);
      toast({
        title: "Your changes have been saved!",
      });
    } catch {
      toast({
        title: "Oops! Failed to save :(",
        variant: "destructive",
      });
    }
  }, [project, dataChanged, toast]);

  useEffect(() => {
    window.addEventListener("beforeunload", saveChanges);
    return () => {
      window.removeEventListener("beforeunload", saveChanges);
    };
  }, [saveChanges]);

  useEffect(() => {
    setDataChanged(true);
  }, [project]);

  return (
    <>
      <div className="flex flex-col bg-background pt-6 w-96 justify-between">
        <div className="flex flex-col gap-y-3">
          <CardContent>
            <div className="grid gap-y-6">
              <div className="grid gap-3">
                <Label htmlFor="subject">Project name</Label>
                <Input
                  id="subject"
                  placeholder="A short name for this project."
                  value={project.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setProject({
                      ...project,
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
                  value={project.candidatePersonas.join(", ")}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setProject({
                      ...project,
                      ["candidatePersonas"]: event.target.value
                        .split(",")
                        .map((token) => token.trim()),
                    });
                  }}
                  onBlur={saveChanges}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Project goal</Label>
                <Textarea
                  id="description"
                  placeholder="What do you expect to learn from this project?"
                  value={project.goal}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setProject({
                      ...project,
                      ["goal"]: event.target.value,
                    });
                  }}
                  onBlur={saveChanges}
                />
              </div>
              <Separator className="bg-slate-100 my-4" />

              <div className="grid gap-3">
                <Label htmlFor="description">Project tags</Label>
                <div className="flex flex-wrap gap-1 pt-2">
                  <Badge variant="outline">Problem severity</Badge>
                  <Badge variant="outline">Time</Badge>
                  <Badge variant="outline">Other options</Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <Separator className="bg-slate-100 my-4" />
          <CardContent>
            <div className="grid gap-y-6">
              <div className="grid gap-3">
                <Label htmlFor="subject">Interviewer name</Label>
                <Input
                  id="subject"
                  placeholder="I need help with..."
                  value={
                    project.authors.length > 0 ? project.authors[0].name : ""
                  }
                  readOnly
                />
              </div>
            </div>
          </CardContent>
          <Separator className="bg-slate-100 my-4" />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-auto bg-slate-100 gap-4">
        <div className="w-2/3 mx-auto">
          <ul className="flex-1 overflow-y-auto space-y-4 py-6">
            <li>
              <Card className="flex-none">
                <EmojiHeader status="Welcome" />
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-1">
                      <div className="flex flex-col space-y-3">
                        <Label htmlFor="name">Welcome message</Label>
                        <Input
                          id="name"
                          placeholder="How you'd like to start the conversation"
                          value={project.intro.title}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            project.intro.title = event.target.value;
                            setProject({
                              ...project,
                              ["intro"]: {
                                title: event.target.value,
                                description: project.intro.description,
                              },
                            });
                          }}
                          onBlur={saveChanges}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </li>

            {project.components.map((component, index) => (
              <li key={index}>
                <Card className="flex-none">
                  <EmojiHeader status="Thread" />

                  <CardContent>
                    <form>
                      <div className="grid w-full items-center gap-1">
                        <div className="flex flex-col space-y-3">
                          <Label htmlFor="name">Question</Label>
                          <Input
                            id="name"
                            placeholder="How you'd like to start the conversation"
                            value={component.question}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              const updatedComponents: Question[] = [
                                ...project.components,
                              ];
                              updatedComponents[index].question =
                                event.target.value;
                              setProject({
                                ...project,
                                ["components"]: updatedComponents,
                              });
                            }}
                            onBlur={saveChanges}
                          />
                          <div className="flex flex-row space-x-3 items-center">
                            <Button variant={"outline"} size={"sm"}>
                              <SparklesIcon className="mr-2 h-4 w-4" />
                              Improve
                            </Button>
                            <p className="text-xs text-slate-400 flex">
                              Remove bias or hypothetical questioning using AI
                            </p>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex flex-row items-center justify-between ">
                          <Label htmlFor="name"># of followup questions</Label>
                          <Select
                            defaultValue={component.max_followups.toString()}
                            onValueChange={(value: string) => {
                              project.components[index].max_followups =
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
                  </CardContent>
                </Card>
              </li>
            ))}

            <li>
              <Button
                variant="outline"
                className="w-full border-dashed bg-white/20"
                onClick={() => {
                  const updatedComponents: Question[] = [
                    ...project.components,
                    {
                      question: "",
                      format: QuestionFormat.OPEN_ENDED,
                      max_followups: 2,
                    },
                  ];
                  setProject({
                    ...project,
                    ["components"]: updatedComponents,
                  });
                }}
              >
                Add thread
              </Button>
            </li>

            <li>
              <Card className="flex-none">
                <EmojiHeader status="Thanks" />

                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-3">
                      <div className="flex flex-col space-y-3">
                        <Label htmlFor="name">Message</Label>
                        <Input
                          id="name"
                          placeholder="Wow! thanks for sharing your insights with us."
                          value={project.outros.COMPLETED.title}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setProject({
                              ...project,
                              ["outros"]: {
                                [ProjectResponseStage.COMPLETED]: {
                                  title: event.target.value,
                                  description:
                                    project.outros.COMPLETED.description,
                                  actions: project.outros.COMPLETED.actions,
                                },
                              },
                            });
                          }}
                          onBlur={saveChanges}
                        />
                      </div>
                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-row justify-start space-x-3 items-center">
                            <Label htmlFor="name">Add calendar link</Label>
                            <Switch
                              checked={project.outros.COMPLETED.actions.includes(
                                ProjectOutroAction.AUTHOR_CALENDAR_LINK,
                              )}
                              onCheckedChange={(checked: boolean) => {
                                let newActions: ProjectOutroAction[] = [];
                                if (checked) {
                                  newActions = [
                                    ...project.outros.COMPLETED.actions,
                                    ProjectOutroAction.AUTHOR_CALENDAR_LINK,
                                  ];
                                } else {
                                  project.outros.COMPLETED.actions.filter(
                                    (value) =>
                                      value !==
                                      ProjectOutroAction.AUTHOR_CALENDAR_LINK,
                                  );
                                }
                                setProject({
                                  ...project,
                                  ["outros"]: {
                                    [ProjectResponseStage.COMPLETED]: {
                                      title: project.outros.COMPLETED.title,
                                      description:
                                        project.outros.COMPLETED.description,
                                      actions: newActions,
                                    },
                                  },
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </li>
            <li>
              <div className="flex-none w-full bg-gray-600 h-96"></div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
