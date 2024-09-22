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
            <div className="flex flex-col justify-start gap-y-3">
              <div
                className="flex flex-row items-center justify-start text-sm text-zinc-700 gap-x-3"
                key={index}
              >
                {contact.linkedinProfileUrl && (
                  <>
                    <CircleUserRoundIcon
                      width={18}
                      className="text-muted-foreground"
                    />
                    <div className="flex flex-col justify-start">
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
                    </div>
                  </>
                )}
              </div>
              <div
                className="flex flex-row justify-start gap-x-2 items-center ps-7 h-6"
                key={index}
              >
                {contact.workEmail && (
                  <>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleCopyRecordLink(contact?.workEmail)}
                    >
                      <Button size={"sm"}>Copy email</Button>
                    </a>
                    <a
                      href={"mailto:" + contact.workEmail}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size={"sm"}>Draft email</Button>
                    </a>
                  </>
                )}
                {contact.linkedinProfileUrl && (
                  <>
                    <a
                      href={contact.linkedinProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant={"outline"} size={"sm"}>
                        <Linkedin className="h-4 w-4" />
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
                      <Button variant={"outline"} size={"sm"}>
                        <Twitter className="h-4 w-4" />
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
                      <Button variant={"outline"} size={"sm"}>
                        <Github className="h-4 w-4" />
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
