import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
  NavTabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { type Icp } from "@/types/icp"
import { type Opportunity } from "@/types/opportunity"
import { OpportunityPropList } from "./OpportunityPropList"
import { OpportunitySources } from "./OpportunitySources"
import { OpportunityContacts } from "./OpportunityContacts"
import { OpportunitySearchList } from "./OpportunitySearchList"

import { Building, User, Paperclip, Zap } from "lucide-react"

interface OpportunityTabsProps {
  opportunity: Opportunity
  icp: Icp | null
}

export function OpportunityTabs({ opportunity, icp }: OpportunityTabsProps) {
  return (
    <>
      {/* <div className="overflow-hidden bg-blue-500 flex flex-col h-full p-4"> */}
      <Tabs
        defaultValue="account"
        className="overflow-hidden flex flex-col h-full"
      >
        <TabsList className="bg-card h-14 flex justify-start px-4 border-b border-border rounded-none gap-2">
          <NavTabsTrigger
            className="border-b border-transparent data-[state=active]:border-primary rounded-none h-14 py-2 group"
            value="account"
          >
            <div className="text-sm font-normal bg-transparent px-2.5 py-1.5 items-center flex flex-inline gap-1.5 dark:group-data-[state=active]:bg-popover border border-transparent group-data-[state=active]:border-border rounded-xl">
              <Building size={"13"} />
              Account Info
            </div>
          </NavTabsTrigger>

          <NavTabsTrigger
            className="border-b border-transparent data-[state=active]:border-primary rounded-none h-14 py-2 group"
            value="search"
          >
            <div className="text-sm font-normal bg-transparent px-2.5 py-1.5 items-center flex flex-inline gap-1.5 dark:group-data-[state=active]:bg-popover border border-transparent group-data-[state=active]:border-border rounded-xl">
              <Zap size={"13"} />
              ICP Matches
            </div>
          </NavTabsTrigger>

          <NavTabsTrigger
            value="people"
            className="border-b border-transparent data-[state=active]:border-primary rounded-none h-14 py-2 group"
          >
            <div className="text-sm font-normal bg-transparent px-2.5 py-1.5 items-center flex flex-inline gap-1.5 dark:group-data-[state=active]:bg-popover border border-transparent group-data-[state=active]:border-border rounded-xl">
              <User size={"13"} />
              Personas
              <span className="w-5 h-5 items-center rounded-md border border-border text-xs">
                {opportunity.contacts ? opportunity.contacts.length : 0}
              </span>
            </div>
          </NavTabsTrigger>

          <NavTabsTrigger
            value="evidence"
            className="border-b border-transparent data-[state=active]:border-primary rounded-none h-14 py-2 group"
          >
            <div className="text-sm font-normal bg-transparent px-2.5 py-1.5 items-center flex flex-inline gap-1.5 dark:group-data-[state=active]:bg-popover border border-transparent group-data-[state=active]:border-border rounded-xl">
              <Paperclip size={"13"} />
              Sources
              <span className="w-5 h-5 items-center rounded-md border border-border text-xs">
                {opportunity.jobPosts?.length}
              </span>
            </div>
          </NavTabsTrigger>
        </TabsList>

        <TabsContent
          value="account"
          className="flex-1 overflow-y-auto mt-0 p-3"
        >
          <OpportunityPropList opportunity={opportunity} />
        </TabsContent>
        <TabsContent value="people" className="flex-1 overflow-y-auto mt-0 p-3">
          <OpportunityContacts opportunity={opportunity} icp={icp} />
        </TabsContent>
        <TabsContent value="search" className="flex-1 overflow-y-auto mt-0 p-3">
          <OpportunitySearchList opportunity={opportunity} />
        </TabsContent>
        <TabsContent
          value="evidence"
          className="flex-1 overflow-y-auto mt-0 p-3"
        >
          {opportunity.jobPosts !== null && opportunity.jobPosts.length > 0 ? (
            <OpportunitySources opportunity={opportunity} />
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
  )
}
