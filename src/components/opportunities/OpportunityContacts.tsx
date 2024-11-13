import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { timeAgo } from "@/utils/misc";
import { type Person } from "@/types/person";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { usePostHog } from "posthog-js/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Divide,
  ExternalLink,
  Maximize2,
  Users,
  User,
  Factory,
  MapPin,
  Landmark,
  Banknote,
  Target,
  Loader,
  StickyNote,
  ChevronRight,
  CircleUserIcon,
  Linkedin,
  Clipboard,
  Twitter,
  Mail,
  PencilLine,
  CircleUserRoundIcon,
  Github,
  ChevronDown,
  Heart,
  GraduationCap,
  Send,
} from "lucide-react";
import Link from "next/link";

import { Opportunity } from "@/types/opportunity";
import { OpportunityPropList } from "./OpportunityPropList";
import { OpportunityBrand } from "./OpportunityBrand";
import { OpportunityJobPost } from "./OpportunityJobPost";

import { Separator } from "@/components/ui/separator";
import { Investor } from "@/types/company";
import posthog from "posthog-js";
import { PersonIcon } from "@radix-ui/react-icons";

interface OpportunityDrawerProps {
  opportunity: Opportunity;
}

const handleCopyRecordLink = async (email: string | null) => {
  try {
    const currentDomain = window.location.host;
    await navigator.clipboard.writeText(`${email}`);
    toast.success("Email copied to clipboard");
  } catch (error: any) {
    toast.error("Failed to copy opportunity link.", {
      description: error.toString(),
    });
  }
};

const handleEmailClick = () => {
  posthog.capture("email clicked");
};

const handleTwitterClick = () => {
  posthog.capture("twitter clicked");
};

const handleLinkedinClick = () => {
  posthog.capture("linkedin clicked");
};

const handleGithubClick = () => {
  posthog.capture("github clicked");
};

export function OpportunityContacts({ opportunity }: OpportunityDrawerProps) {
  return (
    <>
      <div className="flex flex-col py-6 gap-y-4">
        {opportunity.contacts !== null &&
          opportunity.contacts.length > 0 &&
          opportunity.contacts.map((contact: Person, index) => (
            <div key={index} className="flex flex-col justify-start gap-y-1.5">
              <div className="flex flex-col justify-start bg-card dark:bg-popover rounded-lg px-3 py-2.5 gap-y-2 border border-border">
                <div className="flex flex-row gap-x-2 items-center py-1">
                  <div className="text-sm text-primary font-medium">
                    {contact.fullName}
                  </div>
                </div>
                <Separator />

                <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
                  <div className="flex gap-x-2 items-center w-44 min-w-44 max-w-44 text-zinc-500 dark:text-zinc-400">
                    <PersonIcon width={18} />
                    <p>Role</p>
                  </div>
                  <p className="font-medium">{contact.title}</p>
                </div>

                <div className="flex flex-row items-start justify-start text-sm text-zinc-700 dark:text-zinc-200">
                  <div className="flex gap-x-2 items-center w-44 min-w-44 max-w-44 text-zinc-500 dark:text-zinc-400">
                    <GraduationCap width={18} />
                    <p>Skills</p>
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="-ms-1.5 line-clamp-2 hover:bg-background/50 px-1.5 rounded-md flex-1">
                          {contact.skills && contact.skills.length > 0
                            ? contact.skills.join(" · ")
                            : "Empty"}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        {contact.skills && contact.skills.length > 0
                          ? contact.skills.map((skill, index) => (
                              <div
                                key={index}
                                className="flex gap-x-2 items-center"
                              >
                                <p>{skill}</p>
                              </div>
                            ))
                          : "Empty"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex flex-row h-8 items-center justify-start text-sm text-zinc-700 dark:text-zinc-200">
                  <div className="flex gap-x-2 items-center min-w-44 max-w-44 w-44 text-zinc-500 dark:text-zinc-400">
                    <Send width={18} />
                    <p>Channels</p>
                  </div>
                  <div className="flex flex-1 flex-wrap gap-x-2">
                    {contact.linkedinProfileUrl && (
                      <>
                        <a
                          href={contact.linkedinProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant={"outline"}
                            className="w-6 h-6 p-1 bg-popover hover:bg-muted"
                            onClick={handleLinkedinClick}
                          >
                            <Linkedin className="h-3 w-3" />
                          </Button>
                        </a>
                      </>
                    )}
                    {contact.twitterProfileUrl && (
                      <>
                        <a
                          href={contact.twitterProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant={"outline"}
                            className="w-6 h-6 p-1 bg-popover hover:bg-muted"
                            onClick={handleTwitterClick}
                          >
                            <Twitter className="h-3 w-3" />
                          </Button>
                        </a>
                      </>
                    )}
                    {contact.githubProfileUrl && (
                      <>
                        <a
                          href={contact.githubProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant={"outline"}
                            className="w-6 h-6 p-1 bg-popover hover:bg-muted"
                            onClick={handleGithubClick}
                          >
                            <Github className="h-3 w-3" />
                          </Button>
                        </a>
                      </>
                    )}
                    {contact.workEmail && (
                      <>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            contact.workEmail
                              ? handleCopyRecordLink(contact.workEmail)
                              : null
                          }
                        >
                          <Button
                            variant={"outline"}
                            className="w-6 h-6 p-1 bg-popover hover:bg-muted"
                            disabled={!contact.workEmail}
                            onClick={handleEmailClick}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-row justify-start">
                  {/* <div
                          className="flex items-center pe-0.5 ps-1.5 gap-x-1 bg-card h-8 cursor-default text-muted-foreground rounded-lg"
                          key={index}
                        >
                          <div className="px-1">
                            {contact.workEmail
                              ? "Email Available"
                              : "Email Unavailable"}
                          </div>

                          {contact.workEmail && (
                            <>
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                  contact.workEmail
                                    ? handleCopyRecordLink(contact.workEmail)
                                    : null
                                }
                              >
                                <Button
                                  className="px-2 bg-transparent hover:bg-primary/10 h-6.5 w-6.5 text-muted-foreground hover:text-primary"
                                  disabled={!contact.workEmail}
                                  onClick={handleEmailClick}
                                >
                                  <Clipboard className="h-3 w-3" />
                                </Button>
                              </a>
                              <a
                                href={
                                  contact.workEmail
                                    ? "mailto:" + contact.workEmail
                                    : undefined
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  className="px-2 bg-transparent hover:bg-primary/10 h-6.5 w-6.5 text-muted-foreground hover:text-primary"
                                  disabled={!contact.workEmail}
                                  onClick={handleEmailClick}
                                >
                                  <PencilLine className="h-3 w-3" />
                                </Button>
                              </a>
                            </>
                          )}
                        </div> */}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
