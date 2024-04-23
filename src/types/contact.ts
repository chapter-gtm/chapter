export type Plan = {
  id: string;
  name: string;
};

export type Location = {
  city: string;
  region: string;
  country: string;
};

export type Company = {
  id: string;
  name: string;
  plan: Plan;
  location: Location;
  size: number;
  website: string;
  industry: string;
  monthly_spend: number;
  user_count: number;
  custom_attributes: object;
};

export type Contact = {
  id: string;
  email: string;
  name: string;
  plan: Plan;
  location: Location;
  companies: Company[];
};
