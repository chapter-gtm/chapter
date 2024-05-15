export enum ThirdPartySystem {
  NECTAR = "NECTAR",
  INTERCOM = "INTERCOM",
  GONG = "GONG",
  HUBSPOT = "HUBSPOT",
}

export enum ThirdPartySystemType {
  SURVEY = "SURVEY",
  CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
  SALES = "SALES",
  CRM = "CRM",
  SOCIAL = "SOCIAL",
}

export enum IntegrationProvider {
  CUSTOM = "CUSTOM",
  NANGO = "NANGO",
}

export type Integration = {
  id: string;
  name: string;
  system: ThirdPartySystem;
  systemType: ThirdPartySystemType;
  provider: IntegrationProvider;
  imageUrl: string;
};

export type DataSource = {
  id: string;
  name: string;
  syncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  integrationId: string;
  integration: Integration;
};
