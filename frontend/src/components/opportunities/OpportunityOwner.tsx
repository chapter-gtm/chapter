"use client"
import { useEffect, useState } from "react"

import { CircleUserRound, Check, UserCircleIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { getNameInitials } from "@/utils/misc"
import { getOpportunity } from "@/utils/chapter/opportunity"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

interface OpportunityOwnerProps {
  opportunityId: string
}

export function OpportunityOwner({ opportunityId }: OpportunityOwnerProps) {
  // Create an array of users
  const users = [
    { name: "Robin", url: "" },
    { name: "Dennis", url: "" },
    { name: "Johan", url: "" },
  ]
  // Create a selected owner state, and make default empty
  const [selectedOwner, setSelectedOwner] = useState("")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row items-center border border-border h-[25px] px-2 text-sm font-normal rounded-lg text-secondary-foreground hover:text-foreground">
          {selectedOwner ? (
            <>
              <Avatar className="h-[15px] w-[15px] mr-1.5 rounded-lg">
                <AvatarImage
                  src={users.find((u) => u.name === selectedOwner)?.url}
                  alt={selectedOwner}
                />
                <AvatarFallback className="text-[8px]">
                  {getNameInitials(selectedOwner)}
                </AvatarFallback>
              </Avatar>
              {selectedOwner}
            </>
          ) : (
            <>
              <CircleUserRound size={15} className="mr-1.5" />
              Assignee
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[200px] font-normal"
        >
          {/* Render out the list of users as dropdown items, add an option at the top titled "no assignee" and if none is selected make that selected, else the selected user  */}
          <DropdownMenuLabel>Team members</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuCheckboxItem
            onClick={() => setSelectedOwner("")}
            className=""
          >
            <div className="flex h-6 w-6 me-2 items-center justify-center">
              <span className="flex">
                <UserCircleIcon size={16} />
              </span>
            </div>
            <span className="opacity-50">No assignee</span>
          </DropdownMenuCheckboxItem>

          {users.map((user) => (
            <DropdownMenuCheckboxItem
              key={user.name}
              onSelect={() => setSelectedOwner(user.name)}
              checked={selectedOwner === user.name}
              className="hover:bg-red-400 cursor-pointer"
            >
              <Avatar className="mr-2 h-6 w-6 rounded-lg">
                <AvatarImage src={user.url} alt={user.name} />
                <AvatarFallback className="text-xs bg-muted">
                  {getNameInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {user.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
