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
  Divide,
  ExternalLink,
  Maximize2,
  Users,
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
  Twitter,
  Mail,
  PencilLine,
  CircleUserRoundIcon,
  Github,
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
      <h3 className="text-base font-medium my-4 text-zinc-700 dark:text-zinc-200 ps-2">
        Contacts{" "}
      </h3>
      <div className="flex flex-col gap-y-4">
        {opportunity.contacts !== null &&
          opportunity.contacts.length > 0 &&
          opportunity.contacts.map((contact: Person, index) => (
            <div
              key={index}
              className="flex flex-col justify-start gap-y-1.5"
            >
              <div
                className="flex flex-row items-center justify-start content-middle text-sm text-zinc-700 gap-x-3 "
                key={index}
              >
                {contact.linkedinProfileUrl && (
                  <>
                    <CircleUserRoundIcon
                      width={18}
                      className="text-muted-foreground"
                    />
                    <div className="flex flex-row justify-between w-full items-center">
                      <div className="flex flex-row justify-start gap-x-1">
                        <p
                          className="flex font-medium text-primary"
                          key={index}
                        >
                          {contact.fullName}
                        </p>
                        <p
                          className="flex text-sm text-muted-foreground"
                          key={index}
                        >
                          {contact.title}
                        </p>
                      </div>
                      <div
                        className="flex flex-row justify-start gap-x-2 items-center ps-7 h-6"
                        key={index}
                      >
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                          contact.workEmail
                            ? handleCopyRecordLink(contact.workEmail)
                            : null
                          }
                        >
                          <Button size={"sm"} disabled={!contact.workEmail}>
                          Copy email
                          </Button>
                        </a>
                        <a
                          href={contact.workEmail ? "mailto:" + contact.workEmail : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size={"sm"} disabled={!contact.workEmail}>
                          Draft email
                          </Button>
                        </a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div
                className="flex flex-row justify-start gap-x-2 items-center ps-7 h-6"
                key={index}
              >
                {contact.linkedinProfileUrl && (
                  <>
                    <a
                      href={contact.linkedinProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant={"outline"} className="w-8 h-8 p-1">
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
                      <Button variant={"outline"} className="w-8 h-8 p-1">
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
                      <Button variant={"outline"} className="w-8 h-8 p-1">
                        <Github className="h-3 w-3" />
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
