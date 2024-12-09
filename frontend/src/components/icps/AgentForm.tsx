"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FieldValues } from "react-hook-form"
import { z } from "zod"

import * as React from "react"

import { cva } from "class-variance-authority"

import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

import { InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Checkbox } from "@/components/ui/checkbox"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { MultiSelect } from "@/components/ui/multi-select"

import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

import { type Icp } from "@/types/icp"
import { updateIcp } from "@/utils/chapter/icp"

import { FundingRound } from "@/types/company"

const agentFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Add ICP should have a unique name." })
    .max(30, { message: "ICP name cannot exceed 30 characters." }),
  company: z
    .object({
      funding: z.array(z.string()),
      headcountMin: z
        .number({ invalid_type_error: "Min must be a number" })
        .min(1, "Min must be greater than 0")
        .max(10000, "Min must not be greater than 10,000")
        .int()
        .default(1),
      headcountMax: z
        .number({ invalid_type_error: "Max must be a number" })
        .min(1, "Max must be greater than 0")
        .max(10000, "Max must not be greater than 10,000")
        .int()
        .default(10000),
      orgSize: z
        .object({
          engineeringMin: z
            .number({ invalid_type_error: "Min must be a number" })
            .min(1, "Min must be greater than 0")
            .max(2000, "Min must not be greater than 2000")
            .int()
            .default(1),
          engineeringMax: z
            .number({ invalid_type_error: "Max must be a number" })
            .min(1, "Max must be greater than 0")
            .max(2000, "Max must not be greater than 2000")
            .int()
            .default(100),
        })
        .refine((data) => data.engineeringMax > data.engineeringMin, {
          message: "Max must be greater than Min",
          path: ["engineeringMax"],
        }),
      countries: z.array(z.string()),
      docs: z.boolean(),
      changelog: z.boolean(),
    })
    .refine((data) => data.headcountMax > data.headcountMin, {
      message: "Max must be greater than Min",
      path: ["headcountMax"],
    }),
  tool: z.object({
    include: z.array(z.string()),
    exclude: z.array(z.string()),
  }),
  // process didn't work, may be it's a special keyword
  process_: z.object({
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
})

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
)

const stackList = [
  { value: "GitHub Actions", label: "GitHub Actions" },
  { value: "Jenkins", label: "Jenkins" },
  { value: "Buildkite", label: "Buildkite" },
  { value: "GitLab", label: "GitLab" },
  { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" },
  { value: "GitOps", label: "GitOps" },
  { value: "Argo CD", label: "Argo CD" },
  { value: "Cypress", label: "Cypress" },
  { value: "Playwright", label: "Playwright" },
  { value: "Rust", label: "Rust" },
  { value: "Python", label: "Python" },
  { value: "TensorFlow", label: "TensorFlow" },
  { value: "PyTorch", label: "PyTorch" },
  { value: "LlamaIndex", label: "LlamaIndex" },
  { value: "LangChain", label: "LangChain" },
  { value: "LLM", label: "LLM" },
  { value: "RAG", label: "RAG" },
  { value: "HuggingFace", label: "HuggingFace" },
  { value: "OpenAI", label: "OpenAI" },
  { value: "API", label: "API" },
  { value: "SDK", label: "SDK" },
  { value: "REST API", label: "REST API" },
  { value: "GraphQL", label: "GraphQL" },
  { value: "OpenAPI", label: "OpenAPI" },
  { value: "Markdown", label: "Markdown" },
  { value: "Authorization", label: "Authorization" },
  { value: "Access Management", label: "Access Management" },
  { value: "AWS IAM", label: "AWS IAM" },
  { value: "Django", label: "Django" },
  { value: "Spring Boot", label: "Spring Boot" },
  { value: "Flask", label: "Flask" },
  { value: "Express", label: "Express" },
  { value: "Ruby on Rails", label: "Ruby on Rails" },
  { value: "SailPoint", label: "SailPoint" },
  { value: "Okta", label: "Okta" },
  { value: "Auth0", label: "Auth0" },
  { value: "AWS", label: "AWS" },
  { value: "Grafana", label: "Grafana" },
  { value: "Prometheus", label: "Prometheus" },
  { value: "Sentry", label: "Sentry" },
  { value: "Word2Vec", label: "Word2Vec" },
  { value: "GloVe", label: "GloVe" },
  { value: "BERT", label: "BERT" },
  { value: "ELMo", label: "ELMo" },
  { value: "fastText", label: "fastText" },
  { value: "Llama", label: "Llama" },
  { value: "Stable Diffusion", label: "Stable Diffusion" },
  { value: "ComfyUI", label: "ComfyUI" },
  { value: "ONNX", label: "ONNX" },
  { value: "OpenVINO", label: "OpenVINO" },
]
stackList.sort((a, b) => a.label.localeCompare(b.label))

const processList = [
  { value: "Code Review", label: "Code Review" },
  { value: "Testing", label: "Testing" },
  { value: "CI/CD", label: "CI/CD" },
  { value: "Documentation", label: "Documentation" },
]

const jobTitlesList = [
  { value: "Founder", label: "Founder / Co-founder" },
  { value: "CTO", label: "CTO" },
  { value: "CPO", label: "CPO" },
  {
    value: "Head / Director / VP of Engineering",
    label: "Head / Director / VP of Engineering",
  },
  {
    value: "Head / Director / VP of AI / ML",
    label: "Head / Director / VP of AI / ML",
  },
  {
    value: "Head / Director / VP of Product",
    label: "Head / Director / VP of Product",
  },
  {
    value: "Tech Lead / Staff Engineer / EM",
    label: "Tech Lead / Staff Engineer / EM",
  },
  {
    value: "Dev Rel / Ex / Advocate / Platform",
    label: "Dev Rel / Ex / Advocate / Platform",
  },
  {
    value: "Technical Writer / Documentation Manager",
    label: "Technical Writer / Documentation Manager",
  },
  { value: "Platform Engineer", label: "Platform Engineer" },
  { value: "DevOps Engineer", label: "DevOps Engineer" },
]

const jobTitlesAliasMap: Record<string, string[]> = {
  "Head / Director / VP of Engineering": [
    "VP of Engineering",
    "Vice President of Engineering",
    "Head of Engineering",
    "Director of Engineering",
  ],
  "Head / Director / VP of AI / ML": [
    "VP of AI / ML",
    "Vice President of AI / ML",
    "Head of AI / ML",
    "Director of AI / ML",
  ],
  "Head / Director / VP of Product": [
    "VP of Product",
    "Vice President of Product",
    "Head of Product",
    "Director of Product",
  ],
  "Dev Rel / Ex / Advocate / Platform": [
    "Developer Relations",
    "Developer Advocate",
    "Developer Experience",
    "Developer Platform",
  ],
  "Technical Writer / Documentation Manager": [
    "Technical Writer",
    "Documentation Manager",
  ],
  "Tech Lead / Staff Engineer / EM": [
    "Tech Lead",
    "Staff Engineer",
    "Engineering Manager",
  ],
  CTO: ["CTO", "Chief Technology Officer"],
  CPO: ["CPO", "Chief Product Officer"],
}

type AgentFormValues = z.infer<typeof agentFormSchema>

interface AgentFormProps {
  icp: Icp
  refreshIcp: (updatedIcp: Icp) => void
}

export function AgentForm({ icp, refreshIcp }: AgentFormProps) {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "New ICP",
      company: {
        funding: ["Seed", "Series A", "Series B"],
        headcountMin: 10,
        headcountMax: 1000,
        orgSize: {
          engineeringMin: 5,
          engineeringMax: 100,
        },
        docs: false,
        changelog: false,
      },
      tool: {
        include: [],
        exclude: [],
      },
      process_: {
        include: [],
        exclude: [],
      },
      person: { titles: ["Founder", "CTO"], subRoles: [] },
      pitch: "",
    },
  })

  const onSubmit = async (data: AgentFormValues) => {
    try {
      // Deaggregate titles before saving
      data.person.titles = data.person.titles
        .map((key) =>
          key in jobTitlesAliasMap ? jobTitlesAliasMap[key] : [key]
        )
        .flat()

      if (icp === null) {
        throw new Error("ICP not found")
      }
      const updatedIcp = await updateIcp(icp.id, {
        name: data.name,
        company: data.company,
        tool: data.tool,
        process: data.process_,
        person: data.person,
        pitch: data.pitch,
      } as Icp)
      refreshIcp(updatedIcp)
      toast.success("ICP Saved!")
    } catch (error: any) {
      toast.error("Failed to save ICP.", { description: error.toString() })
    }
  }

  const onError = (errors: FieldValues) => {
    toast.error("Failed to validate data.")
  }

  useEffect(() => {
    if (icp !== null) {
      // Aggregate titles to reduce noise
      const titleKeys = new Set<string>()
      const foundTitles = new Set<string>()
      for (const [key, values] of Object.entries(jobTitlesAliasMap)) {
        if (icp.person.titles.some((title) => values.includes(title))) {
          titleKeys.add(key)

          icp.person.titles.forEach((title) => {
            if (values.includes(title)) {
              foundTitles.add(title)
            }
          })
        }
      }

      // Add missing search terms to the matchingKeys array
      icp.person.titles.forEach((title) => {
        if (!foundTitles.has(title)) {
          titleKeys.add(title)
        }
      })

      icp.person.titles = Array.from(titleKeys)
      form.reset({
        name: icp.name,
        company: icp.company,
        tool: icp.tool,
        process_: icp.process,
        person: icp.person,
        pitch: icp.pitch,
      })
    }
  }, [icp])

  const checkBoxItemsOff = [
    {
      id: "Public Docs / APIs",
      label: "Public Docs / APIs",
      status: false,
    },
    {
      id: "Public Changelog",
      label: "Public Changelog",
      status: false,
    },
  ]

  const checkBoxItemsOn = [
    {
      id: "Public Docs / APIs",
      label: "Public Docs / APIs",
      status: true,
    },
    {
      id: "Public Changelog",
      label: "Public Changelog",
      status: false,
    },
  ]

  return (
    <>
      {icp !== null && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <div className="flex flex-col gap-y-8">
              <div className="flex flex-col border border-border/80 rounded-lg p-6 gap-y-6">
                {/* Start of header */}
                <div className="flex flex-col rounded-xl justify-center items-center py-8">
                  <Image
                    src="/images/customIcons/agent.svg"
                    width={90}
                    height={90}
                    alt="Inbox"
                    className="hidden dark:block"
                  />
                  <Image
                    src="/images/customIcons/agent-light.svg"
                    width={90}
                    height={90}
                    alt="Inbox"
                    className="dark:hidden"
                  />
                </div>

                {/* Start of name */}
                <div className="flex flex-col gap-y-2">
                  {/* <FormLabel className="text-lg">Agent name</FormLabel> */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col gap-y-3 justify-between w-full">
                          <Input
                            {...form.register("name")}
                            placeholder="ICP name"
                            maxLength={30}
                            className="font-medium"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Start of pitch */}
                <FormField
                  control={form.control}
                  name="pitch"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-y-3 justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                          <div className="flex flex-row gap-x-2 items-center">
                            <FormLabel className="text-lg">
                              Your value-prop
                            </FormLabel>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <InfoIcon className="w-4" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    This information will be used to identify
                                    relevant highlights from evidence, such as
                                    job postings.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        <Textarea
                          {...form.register("pitch")}
                          placeholder="Type your short pitch here."
                          maxLength={200}
                          className="bg-transparent border-border text-base font-normal"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                                htmlFor="company.headcountMin"
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
                                htmlFor="company.headcountMax"
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
                                htmlFor="company.orgSize.engineeringMin"
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
                                htmlFor="company.orgSize.engineeringMax"
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
                <FormItem>
                  <div className="flex flex-col gap-y-3 justify-between w-full">
                    <div className="flex flex-col gap-y-2">
                      <FormLabel className="text-lg">
                        Stack and Processes
                      </FormLabel>
                    </div>

                    <div className="flex flex-col gap-y-2">
                      <FormDescription>
                        Tools, libraries or frameworks that can be used as
                        proxy, e.g. Docker, Kubernetes, etc.
                      </FormDescription>

                      <FormField
                        control={form.control}
                        name="tool.include"
                        render={({ field }) => (
                          <MultiSelect
                            className="w-full"
                            options={stackList}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select stack"
                            variant="default"
                          />
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-y-2">
                      <FormDescription>
                        Processes that can be used as proxy, e.g. Code Review,
                        Documentation, etc.
                      </FormDescription>

                      <FormField
                        control={form.control}
                        name="process_.include"
                        render={({ field }) => (
                          <MultiSelect
                            className="w-full"
                            options={processList}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select processes"
                            variant="default"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              </div>

              <div className="flex flex-col border border-border rounded-lg p-6 gap-y-6">
                <div className="flex flex-col gap-y-3 justify-between w-full">
                  <div className="flex flex-col gap-y-2">
                    <FormLabel className="text-lg">Filters</FormLabel>
                    <FormDescription>
                      Filter for the following items
                    </FormDescription>
                  </div>

                  <FormField
                    control={form.control}
                    name="company.docs"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start">
                        <div className="flex flex-row items-center py-1.5 gap-x-2">
                          <Checkbox
                            id="company.docs"
                            checked={form.watch("company.docs")}
                            onCheckedChange={(checked: boolean) =>
                              form.setValue("company.docs", checked ?? false)
                            }
                          />
                          <label
                            htmlFor="company.docs"
                            className="text-sm font-medium"
                          >
                            Public Docs / APIs
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company.changelog"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start">
                        <div className="flex flex-row items-center py-1.5 gap-x-2">
                          <Checkbox
                            id="company.changelog"
                            checked={form.watch("company.changelog")}
                            onCheckedChange={(checked: boolean) =>
                              form.setValue(
                                "company.changelog",
                                checked ?? false
                              )
                            }
                          />
                          <label
                            htmlFor="company.changelog"
                            className="text-sm font-medium"
                          >
                            Public Changelog
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                          <FormDescription>
                            Team members you wish to contact
                          </FormDescription>
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
  )
}
