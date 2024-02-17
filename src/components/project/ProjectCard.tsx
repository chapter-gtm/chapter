import Link from "next/link";
import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";
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
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.goal}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            {project.state === ProjectState.IN_DEVELOPMENT && (
              <div className="flex items-center">
                <Construction />
                <div>{project.state}</div>
              </div>
            )}
            {project.state === ProjectState.LIVE && (
              <div className="flex items-center">
                <RadioTower />
                <div>{project.state}</div>
              </div>
            )}
            {(project.state === ProjectState.EXPIRED ||
              project.state === ProjectState.CLOSED) && (
              <div className="flex items-center">
                <CheckCircleIcon />
                <div>{project.state}</div>
              </div>
            )}
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  src={project.authors[0].avatar_url}
                  alt={project.authors[0].name}
                />
                <AvatarFallback>{project.authors[0].name}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
