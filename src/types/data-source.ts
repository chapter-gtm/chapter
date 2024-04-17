export enum DataSourceType {
  SURVEY = "SURVEY",
}

export type DataSource = {
  name: string;
  type: DataSourceType;
};
