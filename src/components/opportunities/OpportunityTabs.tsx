import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { timeAgo } from "@/utils/misc";
import { type Person } from "@/types/person";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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

import { Opportunity } from "@/types/opportunity";
import { OpportunityPropList } from "./OpportunityPropList";
import { OpportunityJobPost } from "./OpportunityJobPost";
import { OpportunityContacts } from "./OpportunityContacts";

interface OpportunityDrawerProps {
  opportunity: Opportunity;
  updateOpportunity: (updatedOpportunity: Opportunity) => void;
}

export function OpportunityTabs({
  opportunity,
  updateOpportunity,
}: OpportunityDrawerProps) {
  return (
    <>
      <Tabs defaultValue="account" className="p-5">
        <TabsList
          className={cn(
            "grid w-full p-0 h-auto bg-transparent border-border border ",
            opportunity.jobPosts !== null && opportunity.jobPosts.length > 0
              ? "grid-cols-3"
              : "grid-cols-2"
          )}
        >
          <TabsTrigger
            className="data-[state=active]:bg-popover"
            value="account"
          >
            Account info
          </TabsTrigger>
          <TabsTrigger
            value="people"
            className="data-[state=active]:bg-popover"
          >
            Points of contact
          </TabsTrigger>
          {opportunity.jobPosts !== null && opportunity.jobPosts.length > 0 && (
            <TabsTrigger
              value="evidence"
              className="data-[state=active]:bg-popover"
            >
              Evidence
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="account">
          <OpportunityPropList
            opportunity={opportunity}
            updateOpportunity={updateOpportunity}
          />
        </TabsContent>
        <TabsContent value="people">
          {" "}
          <OpportunityContacts opportunity={opportunity} />
        </TabsContent>
        {opportunity.jobPosts !== null && opportunity.jobPosts.length > 0 && (
          <TabsContent value="evidence">
            {" "}
            <OpportunityJobPost opportunity={opportunity} />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
}
