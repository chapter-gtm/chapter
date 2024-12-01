import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { timeAgo } from "@/utils/misc"
import { type Person } from "@/types/person"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"

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
} from "lucide-react"

import { type Icp } from "@/types/icp"
import { type Opportunity } from "@/types/opportunity"
import { OpportunityBrand } from "./OpportunityBrand"
import { OpportunityTabs } from "./OpportunityTabs"

import { Separator } from "@/components/ui/separator"

interface OpportunityDrawerProps {
  opportunity: Opportunity
  updateOpportunity: (updatedOpportunity: Opportunity) => void
  icp: Icp | null
}

export function OpportunityDrawer({
  opportunity,
  updateOpportunity,
  icp,
}: OpportunityDrawerProps) {
  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col">
          <OpportunityBrand opportunity={opportunity} />
          <Separator />
          <OpportunityTabs
            opportunity={opportunity}
            updateOpportunity={updateOpportunity}
            icp={icp}
          />
        </div>
      </div>
    </>
  )
}
