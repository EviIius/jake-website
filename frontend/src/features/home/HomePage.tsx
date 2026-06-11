import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import headshotAsset from "../../assets/jake-headshot.jpg";
import ExperienceCard from "../../components/ExperienceCard";
import ProjectCard from "../../components/ProjectCard";
import { renderInlineEmphasis } from "../../components/renderInlineEmphasis";
import SectionShell from "../../components/SectionShell";
import SiteNavigation from "../../components/SiteNavigation";
import SkillClusterCard from "../../components/SkillClusterCard";
import { profileContent } from "../../content/profile";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useSectionSpy } from "../../hooks/useSectionSpy";
import { usePageReveal } from "../../hooks/usePageReveal";
import SceneBackdrop from "./SceneBackdrop";
import {
  getExperienceCardElementId,
  getProjectCardElementId,
  parseHomeHash
} from "./homeAnchors";

const sectionOrder = profileContent.sceneSections.map((section) => section.id);
const ENABLE_MOBILE_STATIC_SCENE = false;
const HEADER_SCROLL_GAP = 16;
const CARD_HASH_GAP = 14;
const INITIAL_SECTION_HASH_CORRECTION = 14;
const INITIAL_CARD_HASH_CORRECTION = 28;

function HomePage() {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isCompactViewport = useMediaQuery("(max-width: 768px)");
  const useStaticScene =
    prefersReducedMotion || (ENABLE_MOBILE_STATIC_SCENE && isCompactViewport);
  const activeSectionId = useSectionSpy(sectionOrder, profileContent.sceneSections[0].id);
  const isPageReady = usePageReveal();
  const hasSyncedSectionUrl = useRef(false);
  const initialHashPending = useRef(
    location.pathname === "/" && Boolean(location.hash || window.location.hash)
  );
  const activeSectionIndex = sectionOrder.indexOf(activeSectionId);
  const nextSectionId =
    activeSectionIndex >= 0 && activeSectionIndex < sectionOrder.length - 1
      ? sectionOrder[activeSectionIndex + 1]
      : "hero";
  const isAtLastSection = activeSectionIndex === sectionOrder.length - 1;

  function getHeaderScrollOffset() {
    const navShell = document.querySelector<HTMLElement>(".site-nav-shell");
    if (!navShell) {
      return HEADER_SCROLL_GAP;
    }

    return navShell.getBoundingClientRect().height + HEADER_SCROLL_GAP;
  }

  function scrollToSection(targetId: string) {
    if (targetId === "hero") {
      window.history.replaceState(null, "", "/#hero");
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      return;
    }

    const element = document.getElementById(targetId);
    if (!element) {
      return;
    }

    window.history.replaceState(null, "", `/#${targetId}`);

    const top = Math.max(
      0,
      window.scrollY + element.getBoundingClientRect().top - getHeaderScrollOffset()
    );

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  }

  function scrollToHashTarget(hash: string, options?: { initialLoad?: boolean }) {
    if (!hash) {
      return;
    }

    const parsedHash = parseHomeHash(hash);
    if (!parsedHash) {
      return;
    }

    const element = document.getElementById(parsedHash.targetElementId);
    if (!element) {
      return;
    }

    if (parsedHash.targetElementId === "hero") {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      return;
    }

    const initialCorrection = options?.initialLoad
      ? parsedHash.cardSlug
        ? INITIAL_CARD_HASH_CORRECTION
        : INITIAL_SECTION_HASH_CORRECTION
      : 0;
    const targetOffset =
      getHeaderScrollOffset() +
      (parsedHash.cardSlug ? CARD_HASH_GAP : 0) +
      initialCorrection;
    const top = Math.max(
      0,
      window.scrollY + element.getBoundingClientRect().top - targetOffset
    );

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  }

  useLayoutEffect(() => {
    if (location.pathname === "/" && !location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, location.hash]);

  useLayoutEffect(() => {
    if (location.pathname !== "/") {
      initialHashPending.current = false;
      return;
    }

    const hash = location.hash || window.location.hash;
    if (!hash) {
      initialHashPending.current = false;
      return;
    }

    const isInitialLoad = initialHashPending.current;
    if (isInitialLoad && !isPageReady) {
      return;
    }

    initialHashPending.current = false;
    scrollToHashTarget(hash, { initialLoad: isInitialLoad });
  }, [isPageReady, location.hash, location.pathname, prefersReducedMotion]);

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const onHashChange = () => {
      initialHashPending.current = false;
      scrollToHashTarget(window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [location.pathname, prefersReducedMotion]);

  useEffect(() => {
    if (location.pathname !== "/") {
      hasSyncedSectionUrl.current = false;
      return;
    }

    if (!hasSyncedSectionUrl.current) {
      hasSyncedSectionUrl.current = true;
      return;
    }

    window.history.replaceState(null, "", `/#${activeSectionId}`);
  }, [activeSectionId, location.pathname]);

  return (
    <div className={isPageReady ? "page-shell page-shell--ready" : "page-shell page-shell--entering"}>
      <SceneBackdrop
        sections={profileContent.sceneSections}
        activeSectionId={activeSectionId}
        useStaticScene={useStaticScene}
      />
      <SiteNavigation
        sections={profileContent.sceneSections}
        activeSectionId={activeSectionId}
        onSectionNavigate={scrollToSection}
      />

      <main className="content-shell home-shell">
        <section id="hero" className="hero-panel">
          <div className="hero-panel__copy">
            <span className="hero-panel__eyebrow">{profileContent.sceneSections[0].eyebrow}</span>
            <h1>{profileContent.name}</h1>
            <p className="hero-panel__title">{renderInlineEmphasis(profileContent.title)}</p>
            <p className="hero-panel__summary">{renderInlineEmphasis(profileContent.heroSummary)}</p>
            <ul className="detail-list detail-list--hero">
              {profileContent.heroBullets.map((bullet) => (
                <li key={bullet}>{renderInlineEmphasis(bullet)}</li>
              ))}
            </ul>
          </div>

          <div className="hero-panel__aside">
            <div className="hero-panel__portrait-wrap hero-panel__portrait-wrap--photo">
              <img src={headshotAsset} alt="Jake Brulato portrait" className="hero-panel__portrait" />
              <div className="hero-panel__portrait-data" aria-hidden="true">
                <span className="portrait-signal-line portrait-signal-line--one" />
                <span className="portrait-signal-line portrait-signal-line--two" />
                <span className="portrait-signal-node portrait-signal-node--one" />
                <span className="portrait-signal-node portrait-signal-node--two" />
                <div className="portrait-data-card portrait-data-card--role">
                  <span>Current</span>
                  <strong>Data Management</strong>
                </div>
                <div className="portrait-data-card portrait-data-card--focus">
                  <span>Focus</span>
                  <strong>AI Governance</strong>
                </div>
              </div>
            </div>
            <div className="metric-grid">
              {profileContent.metrics.map((metric) => (
                <article key={metric.label} className="metric-card">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionShell
          id="impact"
          eyebrow="Focus"
          title="I make enterprise data easier to trace, reconcile, govern, and explain."
          summary="That can mean **machine learning lineage, Generative AI workflow documentation, model risk review, approved data source strategy**, or analytics that make operational decisions clearer."
        >
          <div className="impact-grid">
            <article className="glass-card feature-card">
              <h3>Trace the system</h3>
              <p>
                {renderInlineEmphasis(
                  "The work starts with understanding where data comes from, who owns it, how it moves, and what controls need to be visible."
                )}
              </p>
            </article>
            <article className="glass-card feature-card">
              <h3>Automate the checks</h3>
              <p>
                {renderInlineEmphasis(
                  "I like turning repeated reconciliation, inventory, and reporting work into **cleaner processes with fewer manual gaps**."
                )}
              </p>
            </article>
            <article className="glass-card feature-card">
              <h3>Explain the risk</h3>
              <p>
                {renderInlineEmphasis(
                  "Whether it is an LLM, AI model, dashboard, or data source, the output has to make review criteria and next steps easier to see."
                )}
              </p>
            </article>
          </div>
        </SectionShell>

        <SectionShell
          id="experience"
          eyebrow="Experience"
          title="Experience across banking data management, model risk, logistics analytics, and analytics education."
          summary="The current shape is **Wells Fargo data governance and AI workflows**, backed by model risk experience and a graduate analytics foundation."
        >
          <div className="experience-grid">
            {profileContent.experience.map((entry) => (
              <ExperienceCard
                key={`${entry.company}-${entry.role}`}
                id={getExperienceCardElementId(entry)}
                entry={entry}
              />
            ))}
          </div>
        </SectionShell>

        <SectionShell
          id="projects"
          eyebrow="Projects"
          title="Projects and case studies from the resume."
          summary="A mix of public GitHub projects and privacy-safe summaries of professional analytics, governance, and reconciliation work."
        >
          <div className="project-grid">
            {profileContent.projects.map((project) => (
              <ProjectCard
                key={project.slug}
                id={getProjectCardElementId(project)}
                project={project}
              />
            ))}
          </div>
        </SectionShell>

        <SectionShell
          id="craft"
          eyebrow="How I work"
          title="The tools matter, but trust is the real product."
          summary="I care about **lineage, ownership, QA, repeatability, and communication** because those decide whether data work holds up in review."
        >
          <div className="skill-grid">
            {profileContent.skillClusters.map((cluster) => (
              <SkillClusterCard key={cluster.title} cluster={cluster} />
            ))}
          </div>
        </SectionShell>

        <SectionShell
          id="contact"
          eyebrow="Contact"
          title="Reach out about data management, analytics, model risk, or AI governance work."
          summary="I am especially interested in work where **data needs to be trusted before it can become a decision**."
        >
          <div className="glass-card contact-card">
            <div>
              <h3>Reach out</h3>
              <p>
                {renderInlineEmphasis(
                  "Email, LinkedIn, GitHub, and my current resume are all here if you want the full picture."
                )}
              </p>
            </div>
            <div className="contact-links">
              {profileContent.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="pill-link--neutral"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </SectionShell>
      </main>

      <button
        type="button"
        className={
          isAtLastSection
            ? "section-advance section-advance--return"
            : "section-advance"
        }
        aria-label={
          isAtLastSection
            ? "Return to top of page"
            : `Go to ${profileContent.sceneSections[activeSectionIndex + 1]?.label ?? "next section"}`
        }
        title={
          isAtLastSection
            ? "Back to top"
            : `Next: ${profileContent.sceneSections[activeSectionIndex + 1]?.label ?? "Next section"}`
        }
        onClick={() => scrollToSection(nextSectionId)}
      >
        <span className="section-advance__label" aria-hidden={!isAtLastSection}>
          Back to top
        </span>
        <span className="section-advance__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="presentation">
            <path
              d="M12 6v12M12 18l-5-5M12 18l5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}

export default HomePage;
