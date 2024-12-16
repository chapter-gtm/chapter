import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { timeAgo, formatPhoneNumber } from "@/utils/misc"
import { type Person } from "@/types/person"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import { usePostHog } from "posthog-js/react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Linkedin,
  Twitter,
  Mail,
  Github,
  GraduationCap,
  Send,
  Phone,
  BriefcaseBusiness,
} from "lucide-react"
import Link from "next/link"

import { type Icp } from "@/types/icp"
import { type Opportunity } from "@/types/opportunity"
import { OpportunityPropList } from "./OpportunityPropList"
import { OpportunityBrand } from "./OpportunityBrand"
import { OpportunityJobPost } from "./OpportunityJobPost"

import { Separator } from "@/components/ui/separator"
import { Investor } from "@/types/company"
import posthog from "posthog-js"
import { PersonIcon } from "@radix-ui/react-icons"

interface OpportunityContactsProps {
  opportunity: Opportunity
  icp: Icp | null
}

const handleCopyEmail = async (email: string | null) => {
  try {
    const currentDomain = window.location.host
    await navigator.clipboard.writeText(`${email}`)
    toast.success("Email copied to clipboard")
  } catch (error: any) {
    toast.error("Failed to copy email.", {
      description: error.toString(),
    })
  }
}

const handleCopyPhone = async (email: string | null) => {
  try {
    const currentDomain = window.location.host
    await navigator.clipboard.writeText(`${email}`)
    toast.success("Phone copied to clipboard")
  } catch (error: any) {
    toast.error("Failed to copy phone.", {
      description: error.toString(),
    })
  }
}

export function OpportunityContacts({
  icp,
  opportunity,
}: OpportunityContactsProps) {
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
                <div className="text-sm text-primary font-small">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="-ms-1.5 line-clamp-2 hover:bg-background/50 px-1.5 rounded-md flex-1">
                          {contact.headline}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs whitespace-normal break-words p-2 text-sm">
                          {contact.headline}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                    <BriefcaseBusiness width={18} />
                    <p>Summary</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="-ms-1.5 line-clamp-2 hover:bg-background/50 px-1.5 rounded-md flex-1">
                          {contact.summary ? contact.summary : "Empty"}
                        </p>
                      </TooltipTrigger>
                      {contact.summary && (
                        <TooltipContent>
                          <p className="max-w-xs whitespace-normal break-words p-2 text-sm">
                            {contact.summary}
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
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
                            ? icp
                              ? contact.skills
                                  .filter((item) =>
                                    icp.tool.include.some(
                                      (el) =>
                                        el.toLowerCase() === item.toLowerCase()
                                    )
                                  )
                                  .concat(
                                    contact.skills.filter(
                                      (item) => !icp.tool.include.includes(item)
                                    )
                                  )
                                  .join(" · ")
                              : contact.skills.join(" . ")
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
                              ? handleCopyEmail(contact.workEmail)
                              : null
                          }
                        >
                          <Button
                            variant={"outline"}
                            className="w-6 h-6 p-1 bg-popover hover:bg-muted"
                            disabled={!contact.workEmail}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                        </a>
                      </>
                    )}
                    {contact.phoneNumbers &&
                      contact.phoneNumbers.length > 0 && (
                        <>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              contact.phoneNumbers
                                ? handleCopyPhone(contact.phoneNumbers[0])
                                : null
                            }
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className="w-6 h-6 p-1 bg-popover hover:bg-muted"
                                    disabled={!contact.phoneNumbers}
                                  >
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {formatPhoneNumber(contact.phoneNumbers[0])}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </a>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}
