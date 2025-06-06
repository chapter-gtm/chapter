"use client"
import { logout } from "@/utils/chapter/access"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { User } from "@/types/user"
import { getNameInitials } from "@/utils/misc"
import { getUserProfile } from "@/utils/chapter/users"
import { ChevronDown } from "lucide-react"
import React, { useEffect, useState } from "react"

import { LucideIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

type UserNavProps = React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>

export function UserNav({ className }: UserNavProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getUserProfile()
        setCurrentUser(user)
      } catch (error) {}
    }
    fetchCurrentUser()
  }, [])

  const onLogout = async () => {
    await logout()
  }

  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  return (
    <>
      {currentUser !== null && (
        <DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="dark:hover:bg-transparent min-w-10 h-10"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 " />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-between", className)}
            >
              <div className="flex flex-inline items-center">
                <Avatar className="mr-2 h-6 w-6 rounded-lg">
                  <AvatarImage
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="text-xs bg-muted">
                    {getNameInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-ellipsis overflow-hidden">
                  {currentUser.name}
                </div>
              </div>
              <ChevronDown className="ms-2 ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-card border-border"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentUser.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {currentUser === null && (
        <Button
          variant="outline"
          className={cn("flex justify-start", className)}
        >
          <Avatar className="mr-2 h-5 w-5 rounded-lg bg-slate-50"></Avatar>
          <div className="h-5 w-16 bg-slate-50 rounded-lg"></div>
        </Button>
      )}
    </>
  )
}
