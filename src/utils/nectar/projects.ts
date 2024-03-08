import { parseISO } from "date-fns";
import { type Project, type ProjectResponse } from "@/types/project";

export async function getProjects(token: string) {
  const response = await fetch("http://localhost:8000/api/projects", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const projects = "items" in data ? (data["items"] as Project[]) : [];
  return projects;
}

export async function getProject(token: string, id: string) {
  const response = await fetch("http://localhost:8000/api/projects/" + id, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const project = data as Project;
  return project;
}

export async function getProjectResponses(token: string, id: string) {
  const response = await fetch(
    "http://localhost:8000/api/projects/" + id + "/responses",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const projectResponses: ProjectResponse[] =
    "items" in data
      ? data["items"].map((item: any) => ({
          ...item,
          startedAt: parseISO(item.startedAt),
        }))
      : [];

  return projectResponses;
}

export async function updateProject(
  token: string,
  id: string,
  project: Project,
) {
  const response = await fetch("http://localhost:8000/api/projects/" + id, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
}

export async function getProjectResponse(
  token: string,
  projectId: string,
  projectResponseId: string,
) {
  const response = await fetch(
    "http://localhost:8000/api/projects/" +
      projectId +
      "/responses/" +
      projectResponseId,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const projectResponse = data as ProjectResponse;
  return projectResponse;
}
