import { type Score } from "@/types/score";
import { type DataSource } from "@/types/data-source";
import { type Contact } from "@/types/contact";

export enum RecordPartType {
  QUESTION = "QUESTION",
  ANSWER = "ANSWER",
}

export enum RecordType {
  SURVEY_RESPONSE = "SURVEY_RESPONSE",
  NOTES = "NOTES",
  CHAT_TRANSCRIPT = "CHAT_TRANSCRIPT",
}

export enum RecordState {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export type RecordPart = {
  author: string;
  type: RecordPartType;
  body: string;
  contactId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DataRecord = {
  dataSourceId: string;
  dataSource: DataSource;
  contacts: Contact[];
  externalId: string;
  externalName: string;
  type: RecordType;
  id: string;
  utm: object;
  contactPseudoName: string;
  state: RecordState;
  startedAt: Date;
  endedAt: Date;
  parts: RecordPart[];
  scores: Score[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};
