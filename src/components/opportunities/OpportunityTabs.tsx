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

import { type Icp } from "@/types/icp";
import { type Opportunity } from "@/types/opportunity";
import { OpportunityPropList } from "./OpportunityPropList";
import { OpportunityJobPost } from "./OpportunityJobPost";
import { OpportunityContacts } from "./OpportunityContacts";

interface OpportunityTabsProps {
  opportunity: Opportunity;
  updateOpportunity: (updatedOpportunity: Opportunity) => void;
  icp: Icp | null;
}

export function OpportunityTabs({
  opportunity,
  updateOpportunity,
  icp,
}: OpportunityTabsProps) {
  return (
    <>
      <Tabs defaultValue="account" className="p-5">
        <TabsList
          className={cn(
            "grid w-full p-0 h-auto bg-transparent border-border border ",
            opportunity.jobPosts !== null && opportunity.jobPosts.length > 0
              ? "grid-cols-3"
              : "grid-cols-3"
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

          <TabsTrigger
            value="evidence"
            className="data-[state=active]:bg-popover"
          >
            Evidence
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <OpportunityPropList
            opportunity={opportunity}
            updateOpportunity={updateOpportunity}
          />
        </TabsContent>
        <TabsContent value="people">
          {" "}
          <OpportunityContacts opportunity={opportunity} icp={icp} />
        </TabsContent>

        <TabsContent value="evidence">
          {opportunity.jobPosts !== null && opportunity.jobPosts.length > 0 ? (
            <OpportunityJobPost opportunity={opportunity} />
          ) : (
            <>
              <div className="flex flex-col py-6">
                <div className="bg-card dark:bg-popover p-3 border border-border rounded-lg text-white text-sm text-center">
                  Not applicable
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
