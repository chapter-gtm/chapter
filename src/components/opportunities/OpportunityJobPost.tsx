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
  Download,
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
      return;
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
      <div className="flex flex-col gap-y-4 pb-6">
        <div className="flex gap-x-1 flex-row justify-between rounded-lg h-20 p-4 items-center gap-x-3 border border-border bg-popover">
          <div className="flex flex-col text-zinc-500 dark:text-zinc-400">
            <p className="flex text-base font-medium">Job Post</p>
            <p className="flex text-sm">
              Added{" "}
              {opportunity?.jobPosts?.[0]?.createdAt &&
                timeAgo(new Date(opportunity.jobPosts[0].createdAt))}{" "}
            </p>
          </div>
          <div className="flex flex-row justify-end gap-x-2 items-center">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={opportunity.jobPosts[0].url}
            >
              <Button variant={"outline"}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>

            <Link href={""} onClick={handleDownload}>
              <Button variant={"outline"}>
                <Download className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
