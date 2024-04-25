export type Tag = {
  value: string;
  description: string;
};

export type Score = {
  name: string;
  value: number;
  description: string;
};

export type ScoreDefinition = {
  name: string;
  description: string;
  scale: number[];
};
