export type Candidate = {
  personas: string[];
  location: string;
};

export type ProjectStructure = {
  starter_questions: string[];
  max_followups: number;
};

enum QuestionFormat {
  OPEN_ENDED = "Open Ended",
}

export type Question = {
  question: string;
  format: QuestionFormat;
  max_followups: number;
};

export type User = {
  email: string;
  name: string;
  title: string;
  avatar_url: string;
  calendar_link: string;
};

export type Organization = {
  name: string;
  logo_url: string;
  url: string;
  description: string;
};

export type ProjectIntro = {
  title: string;
  description: string;
};

enum SurveyOutroAction {
  SCHEDULE_CALL = "Talk to a Human",
  REQUEST_CALLBACK = "Request callback",
  SHARE = "Share with someone",
}

export enum ProjectStage {
  NOT_STARTED = "Not Started",
  STARTED = "Started",
  COMPLETED = "Completed",
  ABORTED = "Aborted",
}

export type ProjectOutro = {
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

export enum ProjectState {
  IN_DEVELOPMENT = "In development",
  LIVE = "Live",
  EXPIRED = "Expired",
  CLOSED = "Closed",
}

export type ProjectResponse = {
  id: string;
  date: string;
  email: string;
  stage: string;
  sentiment: number;
};

export type Project = {
  name: string;
  goal: string;
  candidate_personas: string[];
  components: Question[];
  authors: User[];
  company: Organization;
  id: string;
  orgid: string;
  intro: ProjectIntro;
  outros: {
    [key in ProjectStage]: ProjectOutro;
  };
  question_flags: QuestionFlag[];
  question_actions: QuestionAction[];
  created_ts: Date;
  published_ts: Date;
  closed_ts: Date;
  expiry_ts: Date;
  state: ProjectState;
};
