export type SectionId =
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "about";

export type ExperienceEntry = {
  slug: string;
  company: string;
  role: string;
  shortRole?: string;
  timeframe: string;
  location: string;
  logo?: string;
  logoAlt?: string;
  summary: string;
  highlights: string[];
  tags: {
    label: string;
    tone: "language" | "framework" | "infrastructure" | "domain" | "practice";
  }[];
};

export type ProjectEntry = {
  slug: string;
  title: string;
  categoryLabel: string;
  summary: string;
  description: string;
  highlights: string[];
  stack: string[];
  image?: string;
  links: {
    label: string;
    href: string;
  }[];
};

export type EducationEntry = {
  slug: string;
  institution: string;
  shortInstitution: string;
  degree: string;
  shortDegree: string;
  timeframe: string;
  location: string;
  gpa: string;
  logo?: string;
  logoAlt?: string;
  summary: string;
  highlights: string[];
  focusAreas: string[];
};

export type SkillEvidenceLink = {
  label: string;
  context: string;
  target:
    | { kind: "experience"; slug: string }
    | { kind: "project"; slug: string }
    | { kind: "education"; slug: string };
};

export type SkillCluster = {
  slug: string;
  title: string;
  shortLabel: string;
  eyebrow: string;
  summary: string;
  evidence?: SkillEvidenceLink[];
  items: string[];
};

export type PortfolioSectionCopy = {
  id: SectionId;
  eyebrow: string;
  headlineTop: string;
  headlineAccent: string;
  description: string;
  mobileDescription: string;
};

export type ProfileContent = {
  name: string;
  roleBadge: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  phoneHref: string;
  githubUrl: string;
  githubDisplay: string;
  linkedinUrl: string;
  linkedinDisplay: string;
  heroSummary: string;
  heroBullets: string[];
  metrics: {
    label: string;
    value: string;
    target?: SkillEvidenceLink["target"];
  }[];
  links: {
    label: string;
    href: string;
  }[];
  sectionCopy: PortfolioSectionCopy[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  skillClusters: SkillCluster[];
};
