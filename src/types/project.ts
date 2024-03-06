export enum QuestionFormat {
  OPEN_ENDED = "OPEN_ENDED",
}

export type Question = {
  question: string;
  format: QuestionFormat;
  followups: number;
};

export type User = {
  email: string;
  name: string;
  title: string;
  avatarUrl: string;
  calendarLink: string;
};

export type Organization = {
  name: string;
  logoUrl: string;
  url: string;
  description: string;
};

export type ProjectIntro = {
  title: string;
  description: string;
};

export enum ProjectOutroAction {
  AUTHOR_CALENDAR_LINK = "AUTHOR_CALENDAR_LINK",
}

export enum ProjectResponseStage {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ABORTED = "ABORTED",
}

export type ProjectOutro = {
  title: string;
  description: string;
  actions: ProjectOutroAction[];
};

enum QuestionFlag {
  THUMBS_UP = "Thumbs Up",
  THUMBS_DOWN = "Thumbs Down",
}

enum QuestionAction {
  NO_ACTION = "No Action",
  REGENERATE_QUESTION = "Generate New Question",
  SCHEDULE_CALL = "Talk to a Human",
  REQUEST_CALLBACK = "Request callback",
  ABORT_SURVEY = "End Survey",
}

export enum ProjectState {
  IN_DEVELOPMENT = "In development",
  LIVE = "Live",
  EXPIRED = "Expired",
  CLOSED = "Closed",
}

export type Participant = {
  email: string;
  name: string;
};

export type ProjectResponseState = {
  stage: ProjectResponseStage;
  component_next_index: number;
  followup_count: number;
};

enum QuestionType {
  STARTER = "STARTER",
  FOLLOWUP = "FOLLOWUP",
}

export type QAPair = {
  question: string;
  question_type: QuestionType;
  question_ts: Date;
  answer: string;
  answer_ts: Date;
};

export type QuestionThread = {
  question: string;
  qa_pairs: QAPair[];
};

export type Score = {
  name: string;
  score: number;
  reason: string;
};

export const RatingLabel: { [key: number]: string } = {
  1: "Very Low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Very High",
};

export type ProjectResponse = {
  org_id: string;
  project_id: string;
  id: string;
  utm: string;
  participant: Participant;
  state: ProjectResponseState;
  startedAt: Date;
  endedAt: Date;
  transcript: QuestionThread[];
  scores: Score[];
  tags: string[];
};

export type Project = {
  name: string;
  goal: string;
  candidatePersonas: string[];
  components: Question[];
  authors: User[];
  org: Organization;
  id: string;
  orgid: string;
  intro: ProjectIntro;
  outros: Required<{ [key in ProjectResponseStage.COMPLETED]: ProjectOutro }> &
    Partial<{
      [key in Exclude<
        ProjectResponseStage,
        ProjectResponseStage.COMPLETED
      >]: ProjectOutro;
    }>;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  closedAt: Date;
  expiredAt: Date;
  state: ProjectState;
};
