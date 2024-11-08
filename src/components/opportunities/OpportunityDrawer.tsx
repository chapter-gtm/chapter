import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { timeAgo } from "@/utils/misc";
import { type Person } from "@/types/person";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

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
import Link from "next/link";

import { Opportunity } from "@/types/opportunity";
import { OpportunityPropList } from "./OpportunityPropList";
import { OpportunityBrand } from "./OpportunityBrand";
import { OpportunityJobPost } from "./OpportunityJobPost";
import { OpportunityContacts } from "./OpportunityContacts";
import { OpportunityStageList } from "./OpportunityStageList";

import { Separator } from "@/components/ui/separator";
import { Investor } from "@/types/company";

interface OpportunityDrawerProps {
  opportunity: Opportunity;
  updateOpportunity: (updatedOpportunity: Opportunity) => void;
}

export function OpportunityDrawer({
  opportunity,
  updateOpportunity,
}: OpportunityDrawerProps) {
  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col">
          <OpportunityBrand opportunity={opportunity} />
          <Separator />

          <Separator />

          <Tabs defaultValue="account" className="p-5">
            <TabsList className="grid w-full grid-cols-3 p-0 h-auto bg-transparent border-border border">
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
              <OpportunityContacts opportunity={opportunity} />
            </TabsContent>
            <TabsContent value="evidence">
              {" "}
              <OpportunityJobPost opportunity={opportunity} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
