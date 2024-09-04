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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { timeAgo } from "@/utils/misc";

import { Opportunity } from "@/types/opportunity";
import { getJobPostPdf } from "@/utils/chapter/job_post";

import Link from "next/link";
import Image from "next/image";

interface OpportunityDrawerProps {
  opportunity: Opportunity;
}

export function OpportunityJobPost({ opportunity }: OpportunityDrawerProps) {
  const handleDownload = async () => {
    if (
      opportunity === null ||
      opportunity.jobPosts === null ||
      opportunity.jobPosts.length <= 0
    ) {
      toast.error("Failed to find job post");
    }
    try {
      await getJobPostPdf(opportunity.jobPosts[0].id);
    } catch (error: any) {
      toast.error("Failed to fetch job post pdf", {
        description: error.toString(),
      });
    }
  };

  return (
    <>
      <Link href={""} onClick={handleDownload}>
        <div className="mt-4 flex flex-row justify-between rounded-lg h-20 p-4 items-center gap-x-3 border border-border bg-popover hover:bg-accent-hover hover:border-violet-400/50">
          <div className="flex gap-x-4">
            <div className="w-9 items-center justify-center flex flex-col text-zinc-500">
              <StickyNote width={20} />
            </div>
            <div className="flex flex-col justify-center gap-y-1 text-base">
              <p className="font-medium dark:text-zinc-200">JobPost.pdf</p>{" "}
              <p className="font-light text-muted">
                Added{" "}
                {opportunity?.jobPosts?.[0]?.createdAt &&
                  timeAgo(new Date(opportunity.jobPosts[0].createdAt))}{" "}
              </p>
            </div>
          </div>
          <div>
            <ChevronRight width={20} />
          </div>
        </div>
      </Link>
    </>
  );
}
