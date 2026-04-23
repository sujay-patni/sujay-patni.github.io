export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt?: string };

export interface PersonalData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  team: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  period: string;
  description: string;
  tech: string[];
  publication: string | null;
  content?: ContentBlock[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  score: string;
  period: string;
  location: string;
  content?: ContentBlock[];
}

export interface PublicationItem {
  title: string;
  venue: string;
  date: string;
  content?: ContentBlock[];
}

export interface ConfigData {
  active_design: string;
  currently_doing: string;
  open_to_work: boolean;
}

export interface PortfolioData {
  config: ConfigData;
  personal: PersonalData;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  education: EducationItem[];
  publications: PublicationItem[];
}
