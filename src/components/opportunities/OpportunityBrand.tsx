import Image from "next/image";
import { type Person } from "@/types/person";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Mail,
  Globe,
  Twitter,
} from "lucide-react";
import { SiCrunchbase } from "react-icons/si";

import Link from "next/link";
import { timeAgo } from "@/utils/misc";

import { Opportunity } from "@/types/opportunity";

interface OpportunityDrawerProps {
  opportunity: Opportunity;
}

export function OpportunityBrand({ opportunity }: OpportunityDrawerProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto rounded-xl m-5">
        <div className="flex flex-col px-4 gap-y-1 py-4 ">
          <div className="flex flex-col gap-y-2 items-center justify-center">
            {opportunity.company?.profilePicUrl && opportunity.company?.url ? (
              <a
                href={`https://${opportunity.company.url.replace(
                  /^https?:\/\//,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[72px] min-h-[72px] max-w-[72px] max-h-[72px]"
              >
                <Image
                  src={opportunity.company?.profilePicUrl}
                  width={72}
                  height={72}
                  alt="Company Profile Picture"
                  className="rounded-xl border border-border"
                />
              </a>
            ) : (
              <></>
            )}
            <div className="bg-background dark:bg-popover border border-border px-1 py-0.5 rounded-lg drop-shadow-lg">
              <div className="flex flex-inline max-h-7 gap-x-1.5 items-center justify-center text-xs text-zinc-700 dark:text-zinc-200">
                {opportunity.company?.url ? (
                  <a
                    href={`https://${opportunity.company?.url.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center text-center rounded-md dark:hover:bg-card flex items-center"
                  >
                    <span className="">
                      <Globe className="w-3" />
                    </span>
                  </a>
                ) : (
                  <p className="font-medium">{opportunity.company?.url}</p>
                )}
                {opportunity.company?.linkedinProfileUrl ? (
                  <a
                    href={`https://${opportunity.company?.linkedinProfileUrl.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-x-2 bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center rounded-md dark:hover:bg-card flex items-center"
                  >
                    <span>
                      <Linkedin className="w-3" />
                    </span>
                  </a>
                ) : null}
                {opportunity.company?.twitterProfileUrl ? (
                  <a
                    href={`https://${opportunity.company?.twitterProfileUrl.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-x-2 bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center rounded-md dark:hover:bg-card flex items-center"
                  >
                    <span>
                      <Twitter className="w-3" />
                    </span>
                  </a>
                ) : null}
                {opportunity.company?.crunchbaseProfileUrl ? (
                  <a
                    href={`https://${opportunity.company?.crunchbaseProfileUrl.replace(
                      /^https?:\/\//,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-x-2 bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center rounded-md dark:hover:bg-card flex items-center"
                  >
                    <span>
                      <SiCrunchbase className="w-3" />
                    </span>
                  </a>
                ) : null}

                {/* PlayStore */}
                {/* <a
                  href={
                    "https://play.google.com/store/apps/details?id=com.scribd.app.reader0.docs"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-x-2 bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center rounded-md dark:hover:bg-card flex items-center"
                >
                  <span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.84822 0.839956C2.8433 0.841596 2.84002 0.85144 2.8351 0.853081C2.82361 0.854721 2.80721 0.8498 2.79572 0.853081C2.70713 0.862925 2.6251 0.899018 2.55947 0.958081C2.27729 1.1123 2.1001 1.42894 2.1001 1.77183V19.32C2.1001 19.5808 2.21494 19.8548 2.42822 20.0156C2.52666 20.1255 2.67596 20.1747 2.82197 20.1468C3.01393 20.1567 3.21572 20.114 3.38635 20.0156C3.74236 19.8089 11.012 15.6056 11.012 15.6056L14.8051 13.4137C14.8133 13.4104 14.8231 13.4055 14.8313 13.4006L14.8838 13.3743C14.8838 13.3743 14.9347 13.3481 14.9363 13.3481C14.9413 13.3432 14.9446 13.3399 14.9495 13.335C15.0627 13.2693 18.17 11.481 18.5982 11.235C18.8935 11.0643 19.1281 10.7871 19.1232 10.4475C19.1183 10.1078 18.8788 9.84371 18.6113 9.69933C18.4637 9.62058 17.5056 9.07261 16.6163 8.55746C15.7271 8.0423 14.8838 7.54683 14.8838 7.54683L11.012 5.31558C11.012 5.31558 3.97205 1.25011 3.55697 1.01058C3.41096 0.926909 3.24525 0.859643 3.08447 0.839956C3.00408 0.830112 2.92697 0.826831 2.84822 0.839956ZM2.9401 1.96871L11.4976 10.4606L2.9401 18.9525V1.96871ZM4.9351 2.76933C7.07119 4.00308 10.592 6.03746 10.592 6.03746L13.9782 7.99308L12.0882 9.86996L4.9351 2.76933ZM14.7263 8.42621C14.9281 8.54433 15.4417 8.84292 16.1963 9.27933C17.0856 9.79449 17.9978 10.3162 18.2176 10.4343C18.2389 10.4458 18.2324 10.4524 18.2438 10.4606C18.2274 10.4721 18.2225 10.4753 18.1782 10.5C17.7746 10.7329 15.1578 12.2521 14.7395 12.495L12.6788 10.4606L14.7263 8.42621ZM12.0882 11.0381L13.9913 12.9281L10.592 14.8837C10.592 14.8837 7.16307 16.8623 4.94822 18.1387L12.0882 11.0381Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </a> */}
                {/* Apple */}
                {/* <a
                  href={
                    "https://apps.apple.com/us/app/scribd-170m-documents/id6448807714"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-x-2 bg-background hover:bg-background/50 dark:bg-popover h-6 w-6 justify-center rounded-md dark:hover:bg-card flex items-center"
                >
                  <span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_137_189)">
                        <path
                          d="M11.3965 4.66797C9.94141 4.66797 8.75 5.55664 7.98828 5.55664C7.17773 5.55664 6.12305 4.72656 4.85352 4.72656C2.44141 4.72656 0 6.71875 0 10.4688C0 12.8125 0.898438 15.2832 2.02148 16.875C2.97852 18.2227 3.81836 19.3262 5.0293 19.3262C6.2207 19.3262 6.74805 18.5352 8.23242 18.5352C9.73633 18.5352 10.0781 19.3066 11.3965 19.3066C12.7051 19.3066 13.5742 18.1055 14.4043 16.9238C15.3223 15.5664 15.7129 14.248 15.7227 14.1797C15.6445 14.1602 13.1445 13.1348 13.1445 10.2734C13.1445 7.79297 15.1074 6.67969 15.2246 6.5918C13.9258 4.72656 11.9434 4.66797 11.3965 4.66797ZM10.7129 3.08594C11.3086 2.36328 11.7285 1.37695 11.7285 0.380859C11.7285 0.244141 11.7188 0.107422 11.6992 0C10.7227 0.0390625 9.55078 0.644531 8.85742 1.46484C8.30078 2.08984 7.79297 3.08594 7.79297 4.08203C7.79297 4.23828 7.82227 4.38477 7.83203 4.43359C7.89062 4.44336 7.98828 4.46289 8.0957 4.46289C8.96484 4.46289 10.0586 3.87695 10.7129 3.08594Z"
                          fill="white"
                          fill-opacity="0.85"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_137_189">
                          <rect width="15.7227" height="20.4004" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </a> */}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-base text-center">
            <h2 className="font-semibold text-3xl text-zinc-700 dark:text-zinc-200 mt-3">
              {opportunity.company?.name}
            </h2>
            <div className="flex flex-col">
              <p className="text-zinc-600 dark:text-zinc-300 mt-3">
                {opportunity.company?.description}
              </p>
              <div className="my-1 text-zinc-400 font-light text-sm">
                Added about {timeAgo(new Date(opportunity.createdAt))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
