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
  monthlySpend: number;
  userCount: number;
  customAttributes: object;
};

export type Contact = {
  id: string;
  email: string;
  name: string;
  plan: Plan;
  location: Location;
  companies: Company[];
};
