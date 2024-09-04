"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { MultiSelect } from "@/components/ui/multi-select";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui//textarea";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

import {
  ToolStack,
  EngineeringSize,
  FundingRound,
  Industry,
} from "@/types/company";

const agentFormSchema = z.object({
  fundingRound: z.string(),
  headcount: z.string(),
  industry: z.string(),
  toolStack: z.string(),
  engineeringSize: z.string(),
});

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const frameworksList = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "ember", label: "Ember" },
];

type AgentFormValues = z.infer<typeof agentFormSchema>;

export function AgentForm() {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    mode: "onChange",
  });

  const [selectedStack, setSelectedStack] = React.useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = React.useState<string[]>([
    "react",
    "angular",
  ]);

  const handleUnselectStack = React.useCallback((stack: ToolStack) => {
    setSelectedStack((prev) => prev.filter((s) => s !== stack));
  }, []);

  const handleSelectStack = (selected: string[]) => {
    setSelectedStack(selected);
  };

  function onSubmit(data: AgentFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-y-8">
            <div>
              <h3 className="text-xl font-medium py-10">Meta data</h3>
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-col gap-y-2">
                        <FormLabel>Industry</FormLabel>
                        <FormDescription>
                          Describe the industry (if applicable) you are selling
                          to.
                        </FormDescription>
                      </div>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-52">
                          <SelectTrigger>
                            <SelectValue placeholder="Industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-w-52">
                          {Object.entries(Industry).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="fundingRound"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-y-6 justify-between">
                      <div className="flex flex-col gap-y-2">
                        <FormLabel>Funding stage</FormLabel>
                        <FormDescription>
                          With the assumption that companies of this stage need
                          your service, and can pay for it.
                        </FormDescription>
                      </div>
                      <div className="flex flex-row gap-x-4">
                        <div className="grid w-44 max-w-sm items-center gap-1.5">
                          <Label htmlFor="email">Min</Label>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-w-52">
                              {Object.entries(FundingRound).map(
                                ([key, value]) => (
                                  <SelectItem key={key} value={key}>
                                    {value}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid w-44 max-w-sm items-center gap-1.5">
                          <Label htmlFor="email">Max</Label>

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-w-52">
                              {Object.entries(FundingRound).map(
                                ([key, value]) => (
                                  <SelectItem key={key} value={key}>
                                    {value}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-y-4">
              <h3 className="text-xl font-medium pt-8">Org structure</h3>

              <div>
                <FormField
                  control={form.control}
                  name="engineeringSize"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-y-6 justify-between">
                        <div className="flex flex-col gap-y-2">
                          <FormLabel>Engineering Size</FormLabel>
                          <FormDescription>
                            Teamsize can work as a proxy for new roles,
                            responsibilities and challenges. Both min and max
                            are optional.
                          </FormDescription>
                        </div>
                        <div className="flex flex-row gap-x-4">
                          <div className="grid w-44 max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Min</Label>
                            <Input
                              type="team-size"
                              id="team-min"
                              placeholder="Minimum size"
                            />
                          </div>
                          <div className="grid w-44 max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Max</Label>
                            <Input
                              type="team-size"
                              id="team-max"
                              placeholder="Maximum size"
                            />
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <Separator />

          <div className="flex flex-col gap-y-4">
            <h3 className="text-xl font-medium pt-8">Search criteria</h3>

            <FormField
              control={form.control}
              name="toolStack"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-y-3 justify-between w-full">
                    <div className="flex flex-col gap-y-2">
                      <FormLabel>Tool Stack</FormLabel>
                      <FormDescription>
                        If knowing the tool stack is a proxy that they care
                        about your service.
                      </FormDescription>
                    </div>

                    <MultiSelect
                      options={frameworksList}
                      onValueChange={setSelectedFrameworks}
                      defaultValue={selectedFrameworks}
                      placeholder="Select frameworks"
                      variant="default"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex py-12">
            <Button variant={"primary"} type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
