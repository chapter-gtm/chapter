import { parseISO } from "date-fns";
import { type Project, type ProjectResponse } from "@/types/project";

const NECTAR_API_BASE = "https://api.nectar.run";

export async function getProjects(token: string) {
  const response = await fetch(NECTAR_API_BASE + "/api/projects", {
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
  const response = await fetch(NECTAR_API_BASE + "/api/projects/" + id, {
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
    NECTAR_API_BASE + "/api/projects/" + id + "/responses",
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

export async function createProject(token: string) {
  const response = await fetch(NECTAR_API_BASE + "/api/projects/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: "{}",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const project = data as Project;
  return project;
}

export async function publishProject(token: string, projectId: string) {
  const response = await fetch(
    NECTAR_API_BASE + "/api/projects/" + projectId + "/publications",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: "{}",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
}

export async function updateProject(token: string, project: Project) {
  const response = await fetch(
    NECTAR_API_BASE + "/api/projects/" + project.id,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    },
  );
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
    NECTAR_API_BASE +
      "/api/projects/" +
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
