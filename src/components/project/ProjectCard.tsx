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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
      <Card className="w-full h-56 items-center">
        

        <CardContent>
          
          <div className="flex flex-col py-3 justify-between ">
            <div className="flex flex-row justify-between pb-2 h-12">
              <div className="flex space-x-4 text-sm text-muted-foreground">
                {project.state === ProjectState.IN_DEVELOPMENT && (
                  <div className="flex items-center">
                    <Badge variant="outline">{project.state}</Badge>     
                  </div>
                )}
                {project.state === ProjectState.LIVE && (
                  <div className="flex items-center">
                    <Badge variant="outline">{project.state}</Badge>
                  </div>
                )}
                {(project.state === ProjectState.EXPIRED ||
                  project.state === ProjectState.CLOSED) && (
                  <div className="flex items-center">
                    <Badge variant="outline">{project.state}</Badge>
                  </div>
                )}

                
              </div>
              <div className="flex items-center">
                <Avatar className="w-7 h-7">
                  <AvatarImage 
                    className=""
                    src={project.authors[0].avatar_url}
                    alt={project.authors[0].name}
                  />
                  <AvatarFallback>{project.authors[0].name}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          
            <CardTitle className="flex text-base font-medium">{project.name}</CardTitle>

          </div>
        </CardContent>
        
      </Card>
    </Link>
  );
}
