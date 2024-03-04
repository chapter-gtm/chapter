export type Candidate = {
  personas: string[];
  location: string;
};

export type ProjectStructure = {
  starter_questions: string[];
  max_followups: number;
};

export enum QuestionFormat {
  OPEN_ENDED = "OPEN_ENDED",
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

export enum ProjectResponseStage {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ABORTED = "ABORTED",
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
  candidatePersonas: string[];
  components: Question[];
  authors: User[];
  company: Organization;
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
