import { type User } from "@/types/user";
import { type Contact, type Company } from "@/types/contact";
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
  author: User;
  insight: BaseInsight;
  companies: Company[];
  contacts: Contact[];
  records: DataRecord[];
  createdAt: Date;
  updatedAt: Date;
};
