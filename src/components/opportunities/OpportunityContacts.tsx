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
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem className="border-none" value="item-1">
          <AccordionTrigger className="hover:no-underline	 justify-start gap-x-2">
            <div className="text-base font-medium my-4 text-zinc-700 dark:text-zinc-200 ps-2">
              Point of contact
            </div>
          </AccordionTrigger>

          <AccordionContent className="ps-2 flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-4">
              {opportunity.contacts !== null &&
                opportunity.contacts.length > 0 &&
                opportunity.contacts.map((contact: Person, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-start gap-y-1.5 pb-4"
                  >
                    <div className="flex flex-row items-center justify-between ">
                      <div className="flex flex-row gap-x-2">
                        <div className="py-1.5 px-2.5 bg-background hover:bg-background/50 dark:bg-popover rounded-lg text-primary">
                          {contact.firstName}
                        </div>

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
                                  className="w-8 h-8 p-1"
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
                                  className="w-8 h-8 p-1"
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
                                  className="w-8 h-8 p-1"
                                >
                                  <Github className="h-3 w-3" />
                                </Button>
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex">
                        <Button
                          className="flex items-center bg-primary rounded-lg px-2 py-1.5 hover:bg-primary/00 cursor-pointer"
                          key={index}
                          disabled={!contact.workEmail}
                        >
                          <div className="px-1 text-background">Email</div>
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
                              className="px-2 h-8"
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
                              className="px-2 h-8"
                              disabled={!contact.workEmail}
                            >
                              <PencilLine className="h-3 w-3" />
                            </Button>
                          </a>
                        </Button>
                      </div>
                    </div>
                    <p className="font-normal text-zinc-500 ps-2 pt-2">
                      {contact.title}
                    </p>
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
