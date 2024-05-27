export enum ThirdPartySystem {
  NECTAR = "NECTAR",
  INTERCOM = "INTERCOM",
  GONG = "GONG",
  HUBSPOT = "HUBSPOT",
  G2 = "G2",
  APPLE_APP_STORE = "APPLE_APP_STORE",
  GOOGLE_APP_STORE = "GOOGLE_APP_STORE",
}

export enum ThirdPartySystemType {
  SURVEY = "SURVEY",
  CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
  SALES = "SALES",
  CRM = "CRM",
  SOCIAL = "SOCIAL",
  APP_STORE = "APP_STORE",
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
