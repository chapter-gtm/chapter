"use client"
import { useEffect, useState } from "react"

import { CircleUserRound, Check, UserCircleIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

import { User } from "@/types/user"
import { Opportunity } from "@/types/opportunity"
import { getNameInitials } from "@/utils/misc"
import { getUsers } from "@/utils/chapter/users"
import {
  getOpportunity,
  updateOpportunityOwner,
} from "@/utils/chapter/opportunity"

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
  opportunity: Opportunity
  updateOpportunity: (updatedOpportunity: Opportunity) => void
}

export function OpportunityOwner({
  opportunity,
  updateOpportunity,
}: OpportunityOwnerProps) {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [selectedOwner, setSelectedOwner] = useState<User | null>(
    opportunity.owner
  )

  const handleOwnerChange = async (newOwner: User | null) => {
    try {
      let newOwnerId: string | null = null

      if (newOwner !== null) {
        const user = allUsers.find((u) => u.id === newOwner.id)
        if (!user) {
          toast.error("Failed to set owner.")
          return
        }
        newOwnerId = newOwner.id
      }

      const updatedOpportunity = await updateOpportunityOwner(
        opportunity.id,
        newOwnerId
      )
      setSelectedOwner(newOwner)
      updateOpportunity(updatedOpportunity)
    } catch (error: any) {
      toast.error("Failed to update owner.", { description: error.toString() })
    }
  }

  useEffect(() => {
    setSelectedOwner(opportunity.owner)
  }, [opportunity])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers()
        setAllUsers(users)
      } catch (error: any) {
        toast.error("Failed to load users.", { description: error.toString() })
      }
    }
    fetchUsers()
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row items-center border border-border h-[25px] px-2 text-sm font-normal rounded-lg text-secondary-foreground hover:text-foreground">
          {selectedOwner ? (
            <>
              <Avatar className="h-[15px] w-[15px] mr-1.5 rounded-lg">
                <AvatarImage
                  src={selectedOwner.avatarUrl}
                  alt={selectedOwner.name}
                />
                <AvatarFallback className="text-[8px]">
                  {getNameInitials(selectedOwner.name)}
                </AvatarFallback>
              </Avatar>
              {selectedOwner.name}
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
            onClick={() => handleOwnerChange(null)}
            className=""
          >
            <div className="flex h-6 w-6 me-2 items-center justify-center">
              <span className="flex">
                <UserCircleIcon size={16} />
              </span>
            </div>
            <span className="opacity-50">No assignee</span>
          </DropdownMenuCheckboxItem>

          {allUsers.map((user) => (
            <DropdownMenuCheckboxItem
              key={user.id}
              onSelect={() => handleOwnerChange(user)}
              checked={selectedOwner ? selectedOwner.id === user.id : false}
              className="hover:bg-red-400 cursor-pointer"
            >
              <Avatar className="mr-2 h-6 w-6 rounded-lg">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
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
