"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { z } from "zod";

import * as React from "react";

import { cva } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { MultiSelect } from "@/components/ui/multi-select";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import { type Icp } from "@/types/icp";
import { getIcps, updateIcp } from "@/utils/chapter/icp";

import { FundingRound } from "@/types/company";

const agentFormSchema = z.object({
  company: z
    .object({
      funding: z.array(z.string()),
      headcountMin: z
        .number({ invalid_type_error: "Min must be a number" })
        .min(1, "Min must be greater than 0")
        .max(10000, "Max must not be greater than 10,000")
        .int()
        .default(1),
      headcountMax: z
        .number({ invalid_type_error: "Max must be a number" })
        .min(1, "Max must be greater than 0 and min")
        .max(10000, "Max must not be greater than 10,000")
        .int()
        .default(10000),
      orgSize: z
        .object({
          engineeringMin: z
            .number({ invalid_type_error: "Min must be a number" })
            .min(1, "Min must be greater than 0")
            .max(1000, "Max must not be greater than 1000")
            .int()
            .default(1),
          engineeringMax: z
            .number({ invalid_type_error: "Max must be a number" })
            .min(1, "Max must be greater than 0 and min")
            .max(1000, "Max must not be greater than 1000")
            .int()
            .default(100),
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
  pitch: z
    .string()
    .max(200, { message: "Pitch cannot exceed 150 characters." }),
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
  { value: "CPO", label: "CPO" },
  {
    value: "Head / Director / VP of Engineering",
    label: "Head / Director / VP of Engineering",
  },
  {
    value: "Head / Director / VP of Product",
    label: "Head / Director / VP of Product",
  },
  {
    value: "Tech Lead / Staff Engineer / EM",
    label: "Tech Lead / Staff Engineer / EM",
  },
  { value: "Platform Engineer", label: "Platform Engineer" },
  { value: "DevOps Engineer", label: "DevOps Engineer" },
];

const jobTitlesAliasMap: Record<string, string[]> = {
  "Head / Director / VP of Engineering": [
    "VP of Engineering",
    "Vice President of Engineering",
    "Head of Engineering",
    "Director of Engineering",
  ],
  "Head / Director / VP of Product": [
    "VP of Product",
    "Vice President of Product",
    "Head of Product",
    "Director of Product",
  ],
  "Tech Lead / Staff Engineer / EM": [
    "Tech Lead",
    "Staff Engineer",
    "Engineering Manager",
  ],
  CTO: ["CTO", "Chief Technology Officer"],
  CPO: ["CPO", "Chief Product Officer"],
};

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
      pitch: "",
    },
  });

  const [icp, setIcp] = useState<Icp | null>(null);

  const onSubmit = async (data: AgentFormValues) => {
    try {
      // Deaggregate titles before saving
      data.person.titles = data.person.titles
        .map((key) =>
          key in jobTitlesAliasMap ? jobTitlesAliasMap[key] : [key]
        )
        .flat();

      if (icp === null) {
        throw new Error("ICP not found");
      }
      const updatedIcp = await updateIcp(icp.id, data as Icp);
      setIcp(updatedIcp);
      toast.success("ICP Saved!");
    } catch (error: any) {
      toast.error("Failed to save ICP.", { description: error.toString() });
    }
  };

  const onError = (errors: FieldValues) => {
    toast.error("Failed to validate data.");
  };

  useEffect(() => {
    const fetchIcp = async () => {
      const currentUserIcps = await getIcps();
      if (currentUserIcps === null || currentUserIcps.length <= 0) {
        toast.success("Failed to fetch ICP");
      } else {
        setIcp(currentUserIcps[0]);
      }
    };
    fetchIcp();
  }, []);

  useEffect(() => {
    if (icp !== null) {
      // Aggregate titles to reduce noise
      const titleKeys = new Set<string>();
      const foundTitles = new Set<string>();
      for (const [key, values] of Object.entries(jobTitlesAliasMap)) {
        if (icp.person.titles.some((title) => values.includes(title))) {
          titleKeys.add(key);

          icp.person.titles.forEach((title) => {
            if (values.includes(title)) {
              foundTitles.add(title);
            }
          });
        }
      }

      // Add missing search terms to the matchingKeys array
      icp.person.titles.forEach((title) => {
        if (!foundTitles.has(title)) {
          titleKeys.add(title);
        }
      });

      icp.person.titles = Array.from(titleKeys);
      form.reset(icp);
    }
  }, [icp]);

  return (
    <>
      <Toaster theme="light" />

      {icp !== null && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <div className="flex flex-col gap-y-8">
              <div className="flex flex-col border border-border rounded-lg p-6 gap-y-6">
                <div className="flex flex-col py-2 ">
                  <FormField
                    control={form.control}
                    name="company.funding"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col gap-y-4 justify-between relative">
                          <FormLabel className="text-lg">
                            Funding stage
                          </FormLabel>

                          <MultiSelect
                            options={Object.values(FundingRound).map(
                              (value) => ({
                                label: value,
                                value: value,
                              })
                            )}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select frameworks"
                            variant="default"
                            className="w-full"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="flex flex-col gap-y-2">
                  <FormLabel className="text-lg">Company Headcount</FormLabel>

                  <div className="flex flex-col gap-y-6 justify-between">
                    <div className="flex flex-row gap-x-4">
                      <FormField
                        control={form.control}
                        name="company.headcountMin"
                        render={({ field }) => (
                          <FormItem className="flex flex-col flex-grow">
                            <div className="flex flex-col items-start gap-1.5">
                              <Label
                                htmlFor="email"
                                className="text-muted-foreground"
                              >
                                Min
                              </Label>
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
                          <FormItem className="flex flex-col flex-grow">
                            <div className="flex flex-col  items-start gap-1.5">
                              <Label
                                htmlFor="email"
                                className="text-muted-foreground"
                              >
                                Max
                              </Label>
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

                <Separator />

                <div className="flex flex-col gap-y-2">
                  <FormLabel className="text-lg">
                    Engineering Team Size
                  </FormLabel>

                  <div className="flex flex-col gap-y-6 justify-between">
                    <div className="flex flex-row gap-x-4">
                      <FormField
                        control={form.control}
                        name="company.orgSize.engineeringMin"
                        render={({ field }) => (
                          <FormItem className="flex flex-col flex-grow">
                            <div className="flex flex-col items-start gap-1.5">
                              <Label
                                htmlFor="email"
                                className="text-muted-foreground"
                              >
                                Min
                              </Label>
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
                          <FormItem className="flex flex-col flex-grow">
                            <div className="flex flex-col items-start gap-1.5">
                              <Label
                                htmlFor="email"
                                className="text-muted-foreground"
                              >
                                Max
                              </Label>
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

              <div className="flex flex-col border border-border rounded-lg p-6 gap-y-6">
                <FormField
                  control={form.control}
                  name="tool.include"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-y-3 justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                          <FormLabel className="text-lg">Tool Stack</FormLabel>
                        </div>

                        <MultiSelect
                          className="w-full"
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

              <div className="flex flex-col border border-border rounded-lg p-6 gap-y-6">
                <FormField
                  control={form.control}
                  name="person.titles"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-y-3 justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                          <FormLabel className="text-lg">Personas</FormLabel>
                        </div>

                        <MultiSelect
                          options={jobTitlesList}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select titles"
                          variant="default"
                          className="w-full"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col border border-border rounded-lg p-6 gap-y-6">
                <FormField
                  control={form.control}
                  name="pitch"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-y-3 justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                          <FormLabel className="text-lg">Pitch</FormLabel>
                        </div>

                        <Textarea
                          {...form.register("pitch")}
                          placeholder="Type your short pitch here."
                          maxLength={200}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex">
                <Button
                  variant={"primary"}
                  type="submit"
                  className="text-base px-6 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
