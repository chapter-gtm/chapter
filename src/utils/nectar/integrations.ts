import { type Integration, type DataSource } from "@/types/integrations";
import { toTitleCase } from "@/utils/misc";

const NECTAR_API_BASE = "https://api.nectar.run/api";

export async function getIntegrations(token: string) {
  const response = await fetch(NECTAR_API_BASE + "/integrations", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const msg = await response.json();
    throw new Error(msg?.detail);
  }
  const data = await response.json();
  const integrations = "items" in data ? (data["items"] as Integration[]) : [];
  return integrations;
}

export async function getDataSources(token: string) {
  const response = await fetch(NECTAR_API_BASE + "/integrations/data-sources", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const msg = await response.json();
    throw new Error(msg?.detail);
  }
  const data = await response.json();
  const dataSources = "items" in data ? (data["items"] as DataSource[]) : [];
  return dataSources;
}

export async function getNangoHMACDigest(
  token: string,
  system: string,
  dataSourceId: string,
) {
  const response = await fetch(
    NECTAR_API_BASE +
      "/integrations/" +
      system.toLowerCase() +
      "/data-sources/" +
      dataSourceId +
      "/digest",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const msg = await response.json();
    throw new Error(msg?.detail);
  }
  const data = await response.json();
  return data["digest"];
}

export async function addDataSource(
  token: string,
  integration: Integration,
  connectionId: string,
) {
  const response = await fetch(NECTAR_API_BASE + "/integrations/data-sources", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: connectionId,
      integrationId: integration.id,
      name: toTitleCase(integration.name),
    }),
  });
  if (!response.ok) {
    const msg = await response.json();
    throw new Error(msg?.detail);
  }
}
