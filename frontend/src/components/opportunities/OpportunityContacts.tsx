import { Button } from "@/components/ui/button"
import { formatPhoneNumber, fuzzySearch } from "@/utils/misc"
import { type Person } from "@/types/person"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useState } from "react"

import { toast } from "sonner"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { StrengthLabel } from "./OpportunityStrengthLabel"

import {
  Linkedin,
  Twitter,
  Mail,
  Github,
  GraduationCap,
  Send,
  Phone,
  BriefcaseBusiness,
  Radio,
} from "lucide-react"

import { type Icp } from "@/types/icp"
import { type Opportunity } from "@/types/opportunity"
import { TabContentHeader } from "./TabContentHeader"

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
  // Initialize state to track expanded skills for each user
  const [expandedSkillIndex, setExpandedSkillIndex] = useState<number | null>(
    null
  )
  const [expandedSumIndex, setExpandedSumIndex] = useState<number | null>(null)

  const toggleSkills = (index: number) => {
    // If the clicked index is already expanded, collapse it; otherwise, expand the new one
    setExpandedSkillIndex((prev) => (prev === index ? null : index))
  }

  const toggleSum = (index: number) => {
    // If the clicked index is already expanded, collapse it; otherwise, expand the new one
    setExpandedSumIndex((prev) => (prev === index ? null : index))
  }

  const findIcpMatches = (contact: Person, icp: Icp | null): boolean => {
    if (!contact || !contact.skills || !icp || !icp.tool.include) {
      return false
    }

    if (fuzzySearch(contact.skills, icp.tool.include, 0.3).length > 0) {
      return true
    }

    if (
      contact.headline &&
      fuzzySearch(contact.headline?.split(/\s+/), icp.tool.include, 0.3)
        .length > 0
    ) {
      return true
    }

    if (
      contact.title &&
      fuzzySearch(contact.title?.split(/\s+/), icp.tool.include, 0.3).length > 0
    ) {
      return true
    }

    if (
      contact.summary &&
      fuzzySearch(contact.summary?.split(/\s+/), icp.tool.include, 0.3).length >
        0
    ) {
      return true
    }

    return false
  }

  const bringMatchesForward = (originalList: string[], matchList: string[]) => {
    const overlap = fuzzySearch(originalList, matchList, 0.3)
    const remaining = originalList.filter((item) => !overlap.includes(item))
    return [...overlap, ...remaining].join(", ")
  }

  return (
    <>
      <div className="flex flex-col gap-3 px-2">
        <TabContentHeader>Personas</TabContentHeader>
        {opportunity.contacts !== null &&
          opportunity.contacts.length > 0 &&
          opportunity.contacts.map((contact: Person, index) => (
            <Accordion
              collapsible
              type="single"
              key={index}
              className="flex flex-col justify-start gap-y-3"
            >
              <AccordionItem
                value="item-1"
                className="flex flex-col justify-start rounded-lg border border-border py-0 overflow-hidden"
              >
                {/* top row */}
                <div className="flex flex-row gap-x-2 items-center justify-between w-full">
                  <TooltipProvider>
                    <div className="flex flex-row gap-2 px-2 py-2">
                      <AccordionTrigger className="flex flex-row gap-x-1 items-center bg-popover/60 dark:bg-muted px-1.5 rounded-full py-0">
                        <div className="flex flex-row items-center gap-1 w-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                              clip-rule="evenodd"
                            />
                          </svg>

                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex flex-row justify-between text-sm text-primary font-medium w-full">
                              <p>{contact.fullName}</p>
                            </div>
                            {/* <p className="w-4/5 whitespace-normal text-sm font-normal text-secondary-foreground">
                          {contact.headline}
                        </p> */}
                          </div>
                        </div>
                      </AccordionTrigger>
                      {findIcpMatches(contact, icp) && (
                        <Tooltip>
                          <TooltipTrigger>
                            <StrengthLabel>Excellent</StrengthLabel>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mentions your ICP criteria</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    {/* Right side */}

                    <div className="w-40 py-2 flex flex-wrap gap-x-2 justify-end pe-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {contact.linkedinProfileUrl && (
                            <a
                              href={contact.linkedinProfileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size={"xs"}
                                className="gap-1 bg-trasparent dark:bg-popover border border-border text-primary hover:bg-popover/60"
                              >
                                <Radio size={"14"} /> Add to audience
                              </Button>
                            </a>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Add them on LinkedIn and create a following of
                            perfect ICPs
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>

                <AccordionContent className="flex flex-row py-0 border-none">
                  <div className="flex flex-col">
                    <div className="flex flex-col px-4 py-4 gap-3">
                      <p className="uppercase text-xs text-secondary-foreground font-semibold">
                        Details
                      </p>
                      {/* Role */}
                      <div className="flex flex-row items-center justify-start text-sm text-zinc-700 dark:text-zinc-200 ">
                        <div className="flex gap-x-2 items-center w-32 min-w-32 max-w-32 text-zinc-500 dark:text-zinc-400">
                          <PersonIcon width={18} />
                          <p>Role</p>
                        </div>
                        <p className="font-medium">{contact.title}</p>
                      </div>

                      {/* Summary */}
                      <div className="flex flex-row items-start justify-start text-sm text-zinc-700 dark:text-zinc-200">
                        <div className="flex gap-x-2 items-center w-32 min-w-32 max-w-32 text-zinc-500 dark:text-zinc-400">
                          <BriefcaseBusiness width={18} />
                          <p>Summary</p>
                        </div>
                        <div className="w-full flex flex-row items-start justify-between pt-1">
                          <p
                            className={`-ms-1.5 px-1.5 rounded-md flex-1 cursor-pointer -mr-4 ${
                              expandedSumIndex === index ? "" : "line-clamp-1" // Apply line-clamp only when not expanded
                            }`}
                            onClick={() => toggleSum(index)} // Toggle state for this user
                          >
                            {contact.summary || "n/a"}
                          </p>
                          {contact.summary && ( // Only show button if summary is not empty
                            <button
                              className="ml-2 text-primary hover:underline"
                              onClick={() => toggleSum(index)} // Toggle state for this user
                            >
                              {expandedSumIndex === index
                                ? "Show Less"
                                : "Show All"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-row items-start justify-start text-sm text-zinc-700 dark:text-zinc-200">
                        <div className="flex gap-x-2 items-center w-32 min-w-32 max-w-32 text-zinc-500 dark:text-zinc-400">
                          <GraduationCap width={18} />
                          <p>Skills</p>
                        </div>

                        <div className="w-full flex flex-row items-start justify-between pt-1">
                          <p
                            className={`-ms-1.5 px-1.5 rounded-md flex-1 cursor-pointer -mr-4 pe-8 ${
                              expandedSkillIndex === index ? "" : "line-clamp-1" // Apply line-clamp only when not expanded
                            }`}
                            onClick={() => toggleSkills(index)} // Toggle state for this user
                          >
                            {expandedSkillIndex === index
                              ? // If expanded, show all skills
                                contact.skills && contact.skills.length > 0
                                ? icp
                                  ? bringMatchesForward(
                                      contact.skills,
                                      icp.tool.include
                                    )
                                  : contact.skills.join(" . ")
                                : "n/a"
                              : // If not expanded, show truncated version
                                contact.skills && contact.skills.length > 0
                                ? icp
                                  ? bringMatchesForward(
                                      contact.skills,
                                      icp.tool.include
                                    )
                                  : contact.skills.slice(0, 1).join(" . ")
                                : "n/a"}
                          </p>
                          {contact.skills && contact.skills.length > 3 && (
                            <button
                              className="ml-2 text-primary hover:underline"
                              onClick={() => toggleSkills(index)} // Toggle state for this user
                            >
                              {expandedSkillIndex === index
                                ? "Show Less"
                                : "Show All"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col px-4 py-4 gap-3">
                      <p className="uppercase text-xs text-secondary-foreground font-semibold">
                        Contact
                      </p>
                      {/* Contact channels */}
                      <div className="flex flex-row">
                        <div className="flex gap-x-2 items-center w-32 min-w-32 max-w-32 text-zinc-500 dark:text-zinc-400">
                          <Send width={18} />
                          <p>Channels</p>
                        </div>
                        <div className="flex flex-wrap gap-x-2 justify-end pe-3 border-border">
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
                                          {formatPhoneNumber(
                                            contact.phoneNumbers[0]
                                          )}
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
      </div>
    </>
  )
}
