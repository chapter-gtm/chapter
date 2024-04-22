import { type Contact } from "@/types/contact";
import { type DataRecord } from "@/types/record";

export enum InsightType {
  FOUR_WS = "FOUR_WS",
}

export type BaseInsight = {
  statement: string;
  facts: string[];
  who: string;
  where: string;
  what: string;
  why: string;
};

export type Insight = {
  id: string;
  type: InsightType;
  insight: BaseInsight;
  contacts: Contact[];
  records: DataRecord[];
  createdAt: Date;
  updatedAt: Date;
};
