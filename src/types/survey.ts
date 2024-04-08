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

export type SurveyIntro = {
  title: string;
  description: string;
};

export enum SurveyOutroAction {
  AUTHOR_CALENDAR_LINK = "AUTHOR_CALENDAR_LINK",
}

export enum SurveyResponseStage {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ABORTED = "ABORTED",
}

export type SurveyOutro = {
  title: string;
  description: string;
  actions: SurveyOutroAction[];
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

export enum SurveyState {
  IN_DEVELOPMENT = "IN_DEVELOPMENT",
  LIVE = "LIVE",
  EXPIRED = "EXPIRED",
  CLOSED = "CLOSED",
}

export type SurveyResponseState = {
  stage: SurveyResponseStage;
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
  value: number;
  description: string;
};

export const RatingLabel: { [key: number]: { label: string; color: string } } =
  {
    1: { label: "Very Low", color: "bg-teal-100" },
    2: { label: "Low", color: "bg-blue-100" },
    3: { label: "Medium", color: "bg-yellow-100" },
    4: { label: "High", color: "bg-orange-100" },
    5: { label: "Very High", color: "bg-red-100" },
  };

export type SurveyResponse = {
  org_id: string;
  surveyId: string;
  id: string;
  utm: string;
  contactPseudoName: string;
  state: SurveyResponseState;
  startedAt: Date;
  endedAt: Date;
  transcript: QuestionThread[];
  scores: Score[];
  tags: string[];
};

export type SurveyMetadata = {
  id: string;
  name: string;
  emoji: string;
  authors: User[];
  state: SurveyState;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  responseCount: number;
};

export type Survey = {
  name: string;
  emoji: string;
  goal: string;
  candidatePersonas: string[];
  components: Question[];
  authors: User[];
  org: Organization;
  id: string;
  orgid: string;
  intro: SurveyIntro;
  outro: SurveyOutro;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  closedAt: Date;
  expiredAt: Date;
  state: SurveyState;
};
