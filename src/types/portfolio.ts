export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt?: string };

export interface PersonalData {
  name: string;
  title: string;
  company: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface HomeMetric {
  value: string;
  label: string;
  note: string;
}

export type HomeCardCommand =
  | "experience"
  | "projects"
  | "publications"
  | "skills"
  | "resume"
  | "contact";

export interface HomeCard {
  cmd: HomeCardCommand;
  label: string;
  path: string;
  eyebrow: string;
  title: string;
  summary: string;
  meta: string;
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
  resume_path: string;
  resume_download_name: string;
}

export interface PortfolioData {
  config: ConfigData;
  personal: PersonalData;
  homeMetrics: HomeMetric[];
  homeCards: HomeCard[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  education: EducationItem[];
  publications: PublicationItem[];
}
