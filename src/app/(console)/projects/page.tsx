import Image from "next/image";
import { Metadata } from "next";
import { Projects } from "@/components/project/Projects";

export const metadata: Metadata = {
  title: "Projects: Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function ProjectsPage() {
  return <Projects />;
}
