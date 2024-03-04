"use client";
import { useState } from "react";

import { PlusCircledIcon } from "@radix-ui/react-icons";

import { Separator } from "@/components/ui/separator";
import { Project } from "@/types/project";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
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

interface ProjectDefinitionProps {
  project: Project;
}

export function ProjectDefinition({ project }: ProjectDefinitionProps) {
  return (
    <>
      <div className="flex flex-col bg-background pt-6 w-96 justify-between">
        <div className="flex flex-col gap-y-3">
          <CardContent>
            <div className="grid gap-y-6">
              <div className="grid gap-3">
                <Label htmlFor="subject">Project name</Label>
                <Input id="subject" placeholder="I need help with..." />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="subject">Target user</Label>
                <Input id="subject" placeholder="e.g. Product Managers" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Project goal</Label>
                <Textarea
                  id="description"
                  placeholder="Please include all information relevant to your issue."
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
                <Input id="subject" placeholder="I need help with..." />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="subject">Interviewer calendar link</Label>
                <Input id="subject" placeholder="e.g. Product Managers" />
              </div>
            </div>
          </CardContent>
          <Separator className="bg-slate-100 my-4" />
          <CardContent>
            <div className="grid gap-y-2">
              <div className="flex flex-row justify-between gap-3">
                <Label htmlFor="subject">Privacy</Label>

                <Switch />
              </div>
              <Label className="text-sm font-normal text-slate-500">
                Select &quot;on&quot; if you don&apos;t want users to share.
              </Label>
            </div>
          </CardContent>
        </div>
        <div className="flex border-t border-slate-200 justify-end">
          <div className="flex p-6">
            <Button variant="outline" className="w-full">
              Save changes
            </Button>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-1 flex-col overflow-auto gap-3">
        <div className="flex-none h-96 w-full bg-gray-600"></div>
        <div className="flex-none h-96 w-full bg-gray-600"></div>
        <div className="flex-none h-96 w-full bg-gray-600"></div>    
        <div className="flex-none h-96 w-full bg-gray-600"></div>    
      </div> */}

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
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </li>

            <li>
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
                        <Select>
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

            <li>
              <Button
                variant="outline"
                className="w-full border-dashed bg-white/20"
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
                        />
                      </div>
                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-row justify-start space-x-3 items-center">
                            <Label htmlFor="name">Add calendar link</Label>
                            <Switch />
                          </div>

                          <div className="flex flex-row justify-between space-x-3 items-center">
                            <Input id="name" placeholder="url/" />
                          </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-row justify-start space-x-3 items-center">
                            <Label htmlFor="name">Add marketing link</Label>
                            <Switch />
                          </div>
                          <div className="flex flex-row justify-between space-x-3 items-center">
                            <Input id="name" placeholder="url/" />
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
