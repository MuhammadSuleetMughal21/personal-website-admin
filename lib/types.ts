// Copy of personal-website/lib/types.ts — keep the two in sync.
export type Stat = { value: string; label: string };

export type Social = { label: string; url: string };

export type Profile = {
  name: string;
  shortName: string;
  role: string;
  headline: string;
  tagline: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  available: boolean;
  availabilityText: string;
  avatar: string;
  resumeUrl: string;
  socials: Social[];
  stats: Stat[];
};

export type Project = {
  id: string;
  name: string;
  year: string;
  category: string;
  description: string;
  features: string[];
  tags: string[];
  platforms: string[];
  color: string;
  appStore: string;
  playStore: string;
  screens: string[];
  banners: string[];
  featured: boolean;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  points: string[];
};

export type SkillGroup = {
  id: string;
  title: string;
  items: string[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  title: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

export type SiteContent = {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  skills: SkillGroup[];
  services: Service[];
  process: ProcessStep[];
  testimonials: Testimonial[];
};

export type Message = {
  id: string;
  name: string;
  email: string;
  budget?: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type CollectionKey = Exclude<keyof SiteContent, "profile">;
