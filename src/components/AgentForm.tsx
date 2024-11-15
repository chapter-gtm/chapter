"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import { type Icp } from "@/types/icp";
import { getIcp, updateIcp } from "@/utils/chapter/icp";

import {
  ToolStack,
  EngineeringSize,
  FundingRound,
  Industry,
} from "@/types/company";

const agentFormSchema = z.object({
  company: z
    .object({
      funding: z.array(z.string()),
      headcountMin: z
        .number({ invalid_type_error: "Min must be a number" })
        .min(1, "Min must be greater than 0")
        .max(10000, "Max must not be greater than 10,000")
        .int(),
      headcountMax: z
        .number({ invalid_type_error: "Max must be a number" })
        .min(1, "Max must be greater than 0 and min")
        .max(10000, "Max must not be greater than 10,000")
        .int(),
      orgSize: z
        .object({
          engineeringMin: z
            .number({ invalid_type_error: "Min must be a number" })
            .min(1, "Min must be greater than 0")
            .max(1000, "Max must not be greater than 1000")
            .int(),
          engineeringMax: z
            .number({ invalid_type_error: "Max must be a number" })
            .min(1, "Max must be greater than 0 and min")
            .max(1000, "Max must not be greater than 1000")
            .int(),
        })
        .refine((data) => data.engineeringMax > data.engineeringMin, {
          message: "Max must be greater than Min",
          path: ["engineeringMax"],
        }),
      countries: z.array(z.string()),
    })
    .refine((data) => data.headcountMax > data.headcountMin, {
      message: "Max must be greater than Min",
      path: ["headcountMax"],
    }),
  tool: z.object({
    include: z.array(z.string()),
    exclude: z.array(z.string()),
  }),
  person: z.object({
    titles: z.array(z.string()),
    subRoles: z.array(z.string()),
  }),
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

const stackList = [
  { value: "Github Actions", label: "Github Actions" },
  { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" },
  { value: "Cypress", label: "Cypress" },
  { value: "Playwright", label: "Playwright" },
  { value: "Rust", label: "Rust" },
  { value: "Python", label: "Python" },
  { value: "TensorFlow", label: "TensorFlow" },
  { value: "PyTorch", label: "PyTorch" },
  { value: "LlamaIndex", label: "LlamaIndex" },
  { value: "LangChain", label: "LangChain" },
];

const jobTitlesList = [
  { value: "Founder", label: "Founder / Co-founder" },
  { value: "CTO", label: "CTO" },
  { value: "Head of Engineering", label: "Head of Engineering" },
  { value: "Director of Engineering", label: "Director of Engineering" },
  { value: "VP of Engineering", label: "VP of Engineering" },
  { value: "Head of Product", label: "Head of Product" },
  { value: "Director of Product", label: "Director of Product" },
  { value: "VP of Product", label: "VP of Product" },
  { value: "Staff Engineer", label: "Staff Engineer" },
  { value: "Tech Lead", label: "Tech Lead" },
  { value: "Platform Engineer", label: "Platform Engineer" },
  { value: "DevOps Engineer", label: "DevOps Engineer" },
];

type AgentFormValues = z.infer<typeof agentFormSchema>;

export function AgentForm() {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    mode: "onBlur",
    defaultValues: {
      company: {
        funding: ["Seed", "Series A", "Series B"],
        headcountMin: 10,
        headcountMax: 1000,
        orgSize: {
          engineeringMin: 5,
          engineeringMax: 100,
        },
      },
      tool: {
        include: ["Docker", "Kubernetes"],
        exclude: [],
      },
      person: { titles: ["Founder", "CTO"], subRoles: [] },
    },
  });

  const [icp, setIcp] = useState<Icp | null>(null);

  const onSubmit = async (data: AgentFormValues) => {
    try {
      const updatedIcp = await updateIcp(data as Icp);
      setIcp(updatedIcp);
      toast.success("ICP Saved!");
    } catch (error: any) {
      toast.error("Failed to load data.", { description: error.toString() });
    }
  };

  useEffect(() => {
    const fetchIcp = async () => {
      const currentUserIcp = await getIcp();
      setIcp(currentUserIcp);
    };
    fetchIcp();
  }, []);

  useEffect(() => {
    if (icp !== null) {
      form.reset(icp);
    }
  }, [icp]);

  return (
    <>
      <Toaster theme="light" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-y-8">
            <div>
              <h3 className="text-xl font-medium py-10">Meta data</h3>
            </div>

            <div>
              <FormField
                control={form.control}
                name="company.funding"
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
                      <MultiSelect
                        options={Object.values(FundingRound).map((value) => ({
                          label: value,
                          value: value,
                        }))}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select frameworks"
                        variant="default"
                      />
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
                <div className="flex flex-col gap-y-2">
                  <FormLabel>Company Headcount</FormLabel>
                  <FormDescription>
                    Teamsize can work as a proxy for new roles, responsibilities
                    and challenges. Both min and max are optional.
                  </FormDescription>
                </div>
                <div className="flex flex-col gap-y-6 justify-between">
                  <div className="flex flex-row gap-x-4">
                    <FormField
                      control={form.control}
                      name="company.headcountMin"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid w-44 max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Min</Label>
                            <Input
                              {...form.register("company.headcountMin", {
                                valueAsNumber: true,
                              })}
                              placeholder="Minimum size"
                            />
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company.headcountMax"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid w-44 max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Max</Label>
                            <Input
                              {...form.register("company.headcountMax", {
                                valueAsNumber: true,
                              })}
                              placeholder="Maximum size"
                            />
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-col gap-y-2">
                  <FormLabel>Engineering Team Size</FormLabel>
                  <FormDescription>
                    Teamsize can work as a proxy for new roles, responsibilities
                    and challenges. Both min and max are optional.
                  </FormDescription>
                </div>
                <div className="flex flex-col gap-y-6 justify-between">
                  <div className="flex flex-row gap-x-4">
                    <FormField
                      control={form.control}
                      name="company.orgSize.engineeringMin"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid w-44 max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Min</Label>
                            <Input
                              {...form.register(
                                "company.orgSize.engineeringMin",
                                {
                                  valueAsNumber: true,
                                }
                              )}
                              placeholder="Minimum size"
                            />
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company.orgSize.engineeringMax"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid w-44 max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Max</Label>
                            <Input
                              {...form.register(
                                "company.orgSize.engineeringMax",
                                {
                                  valueAsNumber: true,
                                }
                              )}
                              placeholder="Maximum size"
                            />
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator />

          <div className="flex flex-col gap-y-4">
            <h3 className="text-xl font-medium pt-8">Search criteria</h3>

            <FormField
              control={form.control}
              name="tool.include"
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
                      options={stackList}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select stack"
                      variant="default"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />

          <div className="flex flex-col gap-y-4">
            <h3 className="text-xl font-medium pt-8">Persona</h3>

            <FormField
              control={form.control}
              name="person.titles"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-y-3 justify-between w-full">
                    <div className="flex flex-col gap-y-2">
                      <FormLabel>Titles</FormLabel>
                      <FormDescription>
                        Who do you want to talk to?
                      </FormDescription>
                    </div>

                    <MultiSelect
                      options={jobTitlesList}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select titles"
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
