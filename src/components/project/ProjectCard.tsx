import Link from "next/link";
import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import {
  Construction,
  RadioTower,
  LucideIcon,
  CheckCircleIcon,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { Project, ProjectState } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="w-full h-64 items-center border-slate-200 bg-white border p-3 rounded-lg hover:bg-accent">
        <div className="flex flex-col py-3 justify-between h-full ">
          <div className="flex-1 group">
            <div className="w-16 h-16 rounded-lg bg-slate-100 flex justify-center items-center text-2xl mb-2 group-hover:border border-slate-200">
              🚀
            </div>
            <div className=" text-base font-medium line-clamp-2">
              {project.name}
            </div>
            {/* <div className="flex flex-row justify-between pb-2 h-12">
              <div className="flex space-x-4 text-sm text-muted-foreground">
                {project.state === ProjectState.IN_DEVELOPMENT && (
                  <div className="flex items-center">
                    <Badge variant="outline">{project.state}</Badge>
                  </div>
                )}
                {project.state === ProjectState.LIVE && (
                  <div className="flex items-center">
                    <Badge variant="outline" className="yellow">
                      {project.state}
                    </Badge>
                  </div>
                )}
                {(project.state === ProjectState.EXPIRED ||
                  project.state === ProjectState.CLOSED) && (
                  <div className="flex items-center">
                    <Badge variant="outline">{project.state}</Badge>
                  </div>
                )}
              </div>
  
            </div> */}

            
          </div>
          <div className="flex flex-row justify-between items-center">
            <Avatar className="w-7 h-7">
              <AvatarImage
                className=""
                src={project.authors[0].avatar_url}
                alt={project.authors[0].name}
              />
              <AvatarFallback>{project.authors[0].name}</AvatarFallback>
            </Avatar>
            <p className="text-xs font-medium text-slate-400">12 Responses</p>
          
          </div>
        </div>
      </div>
    </Link>
  );
}
