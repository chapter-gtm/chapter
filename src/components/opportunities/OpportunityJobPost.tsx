import {
  ExternalLink,
  ChevronRight,
  Linkedin,
  Mail,
  Download,
  EyeIcon,
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Opportunity } from "@/types/opportunity";
import { getJobPostPdf } from "@/utils/chapter/job_post";

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@radix-ui/react-select";

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
        <Dialog>
          <div className="flex gap-x-1 flex-row justify-between rounded-lg h-20 p-4 items-center gap-x-3 border border-border bg-popover">
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="border-t border-border pt-4">
                <Button type="button" variant="default">
                  Download
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
            <div className="flex flex-col ">
              <p className="flex text-base font-medium">Job Post</p>
              <p className="flex text-sm text-muted-foreground text-zinc-500 dark:text-zinc-400">
                Added{" "}
                {opportunity?.jobPosts?.[0]?.createdAt &&
                  timeAgo(new Date(opportunity.jobPosts[0].createdAt))}{" "}
              </p>
            </div>
            <div className="flex flex-row justify-end gap-x-2 items-center">
              {/* <DialogTrigger asChild>
                <Button variant="outline">
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger> */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={opportunity.jobPosts?.[0]?.url || undefined}
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
        </Dialog>
      </div>
    </>
  );
}
