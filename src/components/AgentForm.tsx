"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

// const profileFormSchema = z.object({
//   username: z
//     .string()
//     .min(2, {
//       message: "Username must be at least 2 characters.",
//     })
//     .max(30, {
//       message: "Username must not be longer than 30 characters.",
//     }),
//   email: z
//     .string({
//       required_error: "Please select an email to display.",
//     })
//     .email(),
//   bio: z.string().max(160).min(4),
//   urls: z
//     .array(
//       z.object({
//         value: z.string().url({ message: "Please enter a valid URL." }),
//       })
//     )
//     .optional(),
// });

const agentFormSchema = z.object({
  fundingRound: z.string(),
  headcount: z.string(),
  industry: z.string(),
  toolStack: z.string(),
  engineeringSize: z.string(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

export function AgentForm() {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    mode: "onChange",
  });

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
      <h3 className="text-lg font-medium py-10">Meta data</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-y-2">
                    <FormLabel>Industry</FormLabel>
                    <FormDescription>
                      Describe the industry (if applicable) you are selling to.
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
          <Separator />

          <FormField
            control={form.control}
            name="fundingRound"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-y-2">
                    <FormLabel>Funding stage</FormLabel>
                    <FormDescription>
                      With the assumption that companies of this stage need your
                      service, and can pay for it.
                    </FormDescription>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-52">
                      <SelectTrigger>
                        <SelectValue placeholder="Funding Round" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-w-52">
                      {Object.entries(FundingRound).map(([key, value]) => (
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
          <Separator />

          <FormField
            control={form.control}
            name="engineeringSize"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-y-2">
                    <FormLabel>Engineering Size</FormLabel>
                    <FormDescription>
                      When teamsize is a proxy that they are experiencing the
                      problem you are solving.
                    </FormDescription>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-52">
                      <SelectTrigger>
                        <SelectValue placeholder="Team size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-w-52">
                      {Object.entries(EngineeringSize).map(([key, value]) => (
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

          <h3 className="text-lg font-medium py-8">Search criteria</h3>

          <FormField
            control={form.control}
            name="toolStack"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-y-2">
                    <FormLabel>Tool Stack</FormLabel>
                    <FormDescription>
                      If knowing the tool stack is a proxy that they care about
                      your service.
                    </FormDescription>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-52">
                      <SelectTrigger>
                        <SelectValue placeholder="Tool stack" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-w-52">
                      {Object.entries(ToolStack).map(([key, value]) => (
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

          <Button type="submit">Update agent</Button>
        </form>
      </Form>
    </>
  );
}
