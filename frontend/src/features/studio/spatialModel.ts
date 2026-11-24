import { profileContent } from "../../content/profile";
import type {
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  SectionId,
  SkillCluster,
} from "../../types/content";
import { getPaletteTheme, type PaletteTheme } from "./paletteThemes";

export type { SectionId };

export type FormationKind =
  // Experience (3 unique formations)
  | "exp-wf-data-mgmt"
  | "exp-wf-mrm-dsai"
  | "exp-alg-logistics"
  // Projects (2 bespoke formations)
  | "proj-housing-scraper"
  | "proj-flight-tracker"
  // Education (2 unique formations)
  | "edu-ms-dsba"
  | "edu-bsba-analytics"
  // Skills (5 unique formations)
  | "skill-languages"
  | "skill-frameworks"
  | "skill-infrastructure"
  | "skill-databases"
  | "skill-domains"
  // About (2 unique formations)
  | "about-monogram"
  | "about-beacon";

export type PaletteSpec = {
  /** Saturated jewel primary */
  primary: string;
  /** Deeper structural anchor shade */
  deep: string;
  /** Soft pastel highlight shade */
  light: string;
  /** Luminous emissive/pointLight glow */
  glow: string;
};

export type AboutCardPayload =
  | {
      kind: "bio";
      eyebrow: string;
      headline: string;
      body: string[];
      metrics: typeof profileContent.metrics;
      links: typeof profileContent.links;
    }
  | {
      kind: "contact";
      eyebrow: string;
      headline: string;
      body: string;
      email: string;
      phone: string;
      phoneHref: string;
      githubUrl: string;
      githubDisplay: string;
      linkedinUrl: string;
      linkedinDisplay: string;
      links: typeof profileContent.links;
    };

export type SpatialItemPayload =
  | { kind: "experience"; experience: ExperienceEntry }
  | { kind: "project"; project: ProjectEntry }
  | { kind: "education"; education: EducationEntry }
  | { kind: "skill"; cluster: SkillCluster }
  | { kind: "about"; about: AboutCardPayload };

export type SpatialItem = {
  uid: string;
  slug: string;
  section: SectionId;
  title: string;
  shortLabel: string;
  subtitle: string;
  hoverDescription?: string;
  eyebrow: string;
  formation: FormationKind;
  palette: PaletteSpec;
  badges?: string[];
  payload: SpatialItemPayload;
};

export type SectionConfig = {
  id: SectionId;
  label: string;
  eyebrowBase: string;
  headlineTop: string;
  headlineAccent: string;
  description: string;
  mobileDescription: string;
  cameraPosition: [number, number, number];
  ringScale: number;
};

export const clean = (text: string) => text.replace(/\*\*/g, "");

const SECTION_STAGE_DEFAULTS: Record<
  SectionId,
  { label: string; cameraPosition: [number, number, number]; ringScale: number }
> = {
  experience: {
    label: "Experience",
    cameraPosition: [0, 0.25, 13.4],
    ringScale: 0.92,
  },
  projects: {
    label: "Projects",
    cameraPosition: [0, 0.15, 13.2],
    ringScale: 0.88,
  },
  education: {
    label: "Education",
    cameraPosition: [0, 0.2, 13.2],
    ringScale: 0.88,
  },
  skills: {
    label: "Skills",
    cameraPosition: [0, 0.2, 13.6],
    ringScale: 0.94,
  },
  about: {
    label: "About",
    cameraPosition: [0, 0.18, 12.6],
    ringScale: 0.84,
  },
};

export const SECTIONS: SectionConfig[] = profileContent.sectionCopy.map((copy) => {
  const stage = SECTION_STAGE_DEFAULTS[copy.id];
  return {
    id: copy.id,
    label: stage.label,
    eyebrowBase: copy.eyebrow,
    headlineTop: copy.headlineTop,
    headlineAccent: copy.headlineAccent,
    description: copy.description,
    mobileDescription: copy.mobileDescription,
    cameraPosition: stage.cameraPosition,
    ringScale: stage.ringScale,
  };
});

const EXPERIENCE_FORMATION: Record<string, FormationKind> = {
  "wells-fargo-data-management-analyst": "exp-wf-data-mgmt",
  "wells-fargo-mrm-extern-dsai": "exp-wf-mrm-dsai",
  "alg-worldwide-logistics-freight-forwarder": "exp-alg-logistics",
};

const PROJECT_FORMATION: Record<string, FormationKind> = {
  "housing-scraper": "proj-housing-scraper",
  "flight-tracker": "proj-flight-tracker",
};

const EDUCATION_FORMATION: Record<string, FormationKind> = {
  "uncc-ms-data-science-business-analytics": "edu-ms-dsba",
  "uncc-bsba-business-analytics": "edu-bsba-analytics",
};

const SKILL_FORMATION: Record<string, FormationKind> = {
  languages: "skill-languages",
  "frameworks-libraries": "skill-frameworks",
  "infrastructure-tools": "skill-infrastructure",
  "databases-data-systems": "skill-databases",
  domains: "skill-domains",
};

export function getSectionConfig(section: SectionId): SectionConfig {
  return SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];
}

export function getItemsForSection(
  section: SectionId,
  theme: PaletteTheme = getPaletteTheme(),
): SpatialItem[] {
  const palettePool = theme.itemPalettes;
  const pickPalette = (index: number): PaletteSpec =>
    palettePool[index % palettePool.length];

  if (section === "experience") {
    return profileContent.experience.map((exp, index) => {
      const duplicateCompany =
        profileContent.experience.filter((e) => e.company === exp.company)
          .length > 1;
      const roleShort = exp.shortRole ?? exp.role;
      return {
        uid: `experience:${exp.slug}`,
        slug: exp.slug,
        section: "experience",
        title: duplicateCompany ? `${exp.company} — ${roleShort}` : exp.company,
        shortLabel: duplicateCompany
          ? `${exp.company} · ${roleShort}`
          : exp.company,
        subtitle: `${exp.role} · ${exp.timeframe}`,
        hoverDescription: clean(exp.summary),
        eyebrow: `${exp.timeframe} · ${exp.location.toUpperCase()}`,
        formation: EXPERIENCE_FORMATION[exp.slug] ?? "exp-wf-data-mgmt",
        palette: pickPalette(index),
        badges: [exp.timeframe],
        payload: { kind: "experience", experience: exp },
      };
    });
  }

  if (section === "projects") {
    return profileContent.projects.map((project, index) => ({
      uid: `projects:${project.slug}`,
      slug: project.slug,
      section: "projects",
      title: project.title,
      shortLabel: project.title,
      subtitle: project.summary,
      hoverDescription: project.summary,
      eyebrow: project.categoryLabel,
      formation: PROJECT_FORMATION[project.slug] ?? "proj-flight-tracker",
      palette: pickPalette(index + 1),
      badges: ["GitHub"],
      payload: { kind: "project", project },
    }));
  }

  if (section === "education") {
    return profileContent.education.map((edu, index) => ({
      uid: `education:${edu.slug}`,
      slug: edu.slug,
      section: "education",
      title: edu.shortDegree,
      shortLabel: `${edu.shortInstitution} · ${edu.shortDegree.startsWith("M.S.") ? "M.S." : "B.S.B.A."}`,
      subtitle: `${edu.institution} · GPA ${edu.gpa}`,
      hoverDescription: edu.summary,
      eyebrow: `${edu.timeframe} · GPA ${edu.gpa}`,
      formation: EDUCATION_FORMATION[edu.slug] ?? "edu-ms-dsba",
      palette: pickPalette(index + 2),
      badges: [`GPA ${edu.gpa}`, edu.timeframe],
      payload: { kind: "education", education: edu },
    }));
  }

  if (section === "skills") {
    return profileContent.skillClusters.map((cluster, index) => ({
      uid: `skills:${cluster.slug}`,
      slug: cluster.slug,
      section: "skills",
      title: cluster.title,
      shortLabel: cluster.shortLabel,
      subtitle: cluster.summary,
      hoverDescription: `${cluster.items.slice(0, 6).join(" · ")}${cluster.items.length > 6 ? " · …" : ""}`,
      eyebrow: cluster.eyebrow,
      formation: SKILL_FORMATION[cluster.slug] ?? "skill-domains",
      palette: pickPalette(index),
      badges: [`${cluster.items.length} tools`],
      payload: { kind: "skill", cluster },
    }));
  }

  return [
    {
      uid: "about:jake",
      slug: "jake",
      section: "about",
      title: "Jake Brulato",
      shortLabel: "About Jake",
      subtitle:
        "Data Management Analyst at Wells Fargo in Charlotte, NC — focused on ML lineage, Generative AI workflows, and governed data.",
      hoverDescription:
        "Background, education, focus areas, and quick links to my work at Wells Fargo and UNC Charlotte.",
      eyebrow: "PROFILE · DATA MANAGEMENT ANALYST",
      formation: "about-monogram",
      palette: pickPalette(0),
      badges: ["Charlotte, NC"],
      payload: {
        kind: "about",
        about: {
          kind: "bio",
          eyebrow: "ABOUT ME",
          headline: "Turning model & enterprise data into governed clarity.",
          body: [
            clean(profileContent.heroSummary),
            ...profileContent.heroBullets.map(clean),
          ],
          metrics: profileContent.metrics,
          links: profileContent.links,
        },
      },
    },
    {
      uid: "about:contact",
      slug: "contact",
      section: "about",
      title: "Get in Touch",
      shortLabel: "Contact & Résumé",
      subtitle: "Email, phone, résumé PDF, LinkedIn, and GitHub.",
      hoverDescription:
        "Reach out directly by email or phone, view or download my résumé PDF, or connect on LinkedIn and GitHub.",
      eyebrow: "CONNECT · CHARLOTTE, NC",
      formation: "about-beacon",
      palette: pickPalette(3),
      badges: ["Direct"],
      payload: {
        kind: "about",
        about: {
          kind: "contact",
          eyebrow: "SAY HELLO",
          headline: "Reach out directly.",
          body: "Email is the easiest way to reach me. Feel free to view or download my résumé right here, or connect with me on LinkedIn and GitHub.",
          email: profileContent.email,
          phone: profileContent.phone,
          phoneHref: profileContent.phoneHref,
          githubUrl: profileContent.githubUrl,
          githubDisplay: profileContent.githubDisplay,
          linkedinUrl: profileContent.linkedinUrl,
          linkedinDisplay: profileContent.linkedinDisplay,
          links: profileContent.links,
        },
      },
    },
  ];
}
