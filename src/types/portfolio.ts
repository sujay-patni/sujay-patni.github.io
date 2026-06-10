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
  /** One-line context/scope of the role — sets up the impact bullets. */
  summary?: string;
  bullets: string[];
  /** Optional "Published in …" label for a paper that came out of this role. */
  publication?: string;
  /** External URL for the publication, making the label clickable. */
  publicationUrl?: string;
  /** Lead paragraph shown at the top of the role card. From Notion "Lead". */
  lead?: string;
  /** Multi-paragraph narrative shown when the card is expanded. From Notion "Story". */
  expanded?: string[];
  /** One-line scope shown in the meta panel. From Notion "Focus". */
  focus?: string;
  /** Decorative diagram key. From Notion "Illustration". */
  illustration?: ExperienceIllustration;
}

export type ExperienceIllustration = "systems" | "search" | "research" | "quality";

export interface ProjectItem {
  name: string;
  period: string;
  /** One-line, outcome-first summary — leads the case-study card. */
  summary?: string;
  description: string;
  tech: string[];
  publication: string | null;
  /** External URL for the publication, making the label clickable. */
  publicationUrl?: string;
  content?: ContentBlock[];
  /** Subsection bucket. Defaults applied in the component when absent. */
  category?: ProjectCategory;
  /** Manual ordering rank within a section (lower = higher up). From Notion "Rank". */
  rank?: number;
  /** Lead paragraph shown at the top of the card. From Notion "Lead". */
  lead?: string;
  /** Multi-paragraph narrative shown when the card is expanded. From Notion "Story". */
  expanded?: string[];
  /** One-line problem statement in the meta panel. From Notion "Problem". */
  problem?: string;
  /** One-line approach in the meta panel. From Notion "Approach". */
  approach?: string;
  /** One-line outcome in the meta panel. From Notion "Outcome". */
  outcome?: string;
  /** Decorative diagram key. From Notion "Illustration". */
  illustration?: ProjectIllustration;
}

export type ProjectCategory = "product" | "tool" | "research";

export type ProjectIllustration = "flow" | "biometric" | "app" | "secure" | "tool" | "sync";

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
  /** External URL (DOI / paper page), making the title clickable. */
  url?: string;
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
