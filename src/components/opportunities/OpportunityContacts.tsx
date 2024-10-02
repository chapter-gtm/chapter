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
} from "lucide-react";
import Link from "next/link";

import { Opportunity } from "@/types/opportunity";
import { OpportunityPropList } from "./OpportunityPropList";
import { OpportunityBrand } from "./OpportunityBrand";
import { OpportunityJobPost } from "./OpportunityJobPost";

import { Separator } from "@/components/ui/separator";
import { Investor } from "@/types/company";

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

export function OpportunityContacts({ opportunity }: OpportunityDrawerProps) {
  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem className="border-none" value="item-1">
          <AccordionTrigger className="hover:no-underline	 justify-start gap-x-2">
            <div className="text-base font-medium my-3 text-zinc-700 dark:text-zinc-200 ps-2">
              Point of contact
            </div>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-4">
              {opportunity.contacts !== null &&
                opportunity.contacts.length > 0 &&
                opportunity.contacts.map((contact: Person, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-start gap-y-1.5 pb-4"
                  >
                    <div className="flex flex-col justify-start bg-popover rounded-lg px-3 py-2.5 gap-y-2">
                      <div className="flex flex-row gap-x-2 items-center pt-1.5">
                        <div className="bg-background hover:bg-background/50 dark:bg-popover rounded-lg text-primary font-semibold ps-0.5">
                          {contact.firstName}
                        </div>
                        <p className="font-normal text-zinc-400">
                          {contact.title}
                        </p>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-wrap gap-x-2">
                          {contact.linkedinProfileUrl && (
                            <>
                              <a
                                href={contact.linkedinProfileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant={"outline"}
                                  className="w-8 h-8 p-1 hover:bg-primary/10 "
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
                                  className="w-8 h-8 p-1 hover:bg-primary/10 "
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
                                  className="w-8 h-8 p-1 hover:bg-primary/10 "
                                >
                                  <Github className="h-3 w-3" />
                                </Button>
                              </a>
                            </>
                          )}
                        </div>
                        <div
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
                                >
                                  <PencilLine className="h-3 w-3" />
                                </Button>
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
