export type Participant = {
  personas: string[];
  location: string;
};

export type SurveyStructure = {
  starter_questions: string[];
  max_followups: number;
};

export type Person = {
  email: string;
  name: string;
  title: string;
  avatar_url: string;
  calendar_link: string;
};

export type Company = {
  name: string;
  logo_url: string;
  url: string;
  description: string;
};

export type SurveyIntro = {
  title: string;
  description: string;
};

enum SurveyOutroAction {
  SCHEDULE_CALL = "Talk to a Human",
  REQUEST_CALLBACK = "Request callback",
  SHARE = "Share with someone",
}

export enum SurveyStage {
  NOT_STARTED = "Not Started",
  STARTED = "Started",
  COMPLETED = "Completed",
  ABORTED = "Aborted",
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

enum SurveyState {
  PENDING = "Pending",
  LIVE = "Live",
  EXPIRED = "Expired",
  CLOSED = "Closed",
}

export type Survey = {
  objective: string;
  participant: Participant;
  structure: SurveyStructure;
  authors: Person[];
  company: Company;
  id: string;
  intro: SurveyIntro;
  outros: {
    [key in SurveyStage]: SurveyOutro;
  };
  question_flags: QuestionFlag[];
  question_actions: QuestionAction[];
  created_ts: Date;
  published_ts: Date;
  closed_ts: Date;
  expiry_ts: Date;
  state: SurveyState;
};
