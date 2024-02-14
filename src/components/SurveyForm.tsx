import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Survey } from "@/types/survey";

const surveyFormSchema = z.object({
  goal: z
    .string()
    .min(20, {
      message: "Objective must be at least 20 characters.",
    })
    .max(200, {
      message: "Objective must not be longer than 200 characters.",
    }),
  starter_question: z
    .string()
    .min(20, {
      message: "Starter question must be at least 20 characters.",
    })
    .max(200, {
      message: "Starter question must not be longer than 200 characters.",
    }),
  target_personas: z
    .string()
    .min(3, {
      message: "Target personas must be at least 3 characters.",
    })
    .max(50, {
      message: "Target personas must not be longer than 50 characters.",
    }),
});

type SurveyFormValues = z.infer<typeof surveyFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<SurveyFormValues> = {};

interface SurveyFormProps {
  survey: Survey | null;
}

export function SurveyForm({ survey }: SurveyFormProps) {
  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: SurveyFormValues) {
    toast({
      title: "Survey created!",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Survey Definition</h3>
        <p className="text-sm text-muted-foreground">
          This is your survey definition.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {" "}
                  What do you want to find out? (Research Goal)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g. Product teams have a strong unmet need to get deep insights at a quicker speed"
                    className="resize-none"
                    {...field}
                    value={
                      survey !== null && survey.objective !== undefined
                        ? survey.objective
                        : ""
                    }
                  ></Textarea>
                </FormControl>
                <FormDescription>
                  This is the goal of your research or the hypothesis
                  you&apos;re testing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="starter_question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {" "}
                  How do you want to start? (First question to the participant)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g. Tell me a little about your last user-interview. This can include the planning, conducting, and review."
                    className="resize-none"
                    {...field}
                    value={
                      survey !== null &&
                      survey.structure !== undefined &&
                      survey.structure.starter_questions.length > 0
                        ? survey.structure.starter_questions[0]
                        : ""
                    }
                  />
                </FormControl>
                <FormDescription>
                  This will be the interview starter question. It sets the
                  direction of your interview.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="target_personas"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Who&apos;s your target persona? </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Product Managers, UX Researchers"
                    {...field}
                    value={
                      survey !== null && survey.participant !== undefined
                        ? survey.participant.personas.join(", ")
                        : ""
                    }
                  ></Input>
                </FormControl>
                <FormDescription>
                  Role name or description of your target audience.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create survey</Button>
        </form>
      </Form>
    </div>
  );
}
