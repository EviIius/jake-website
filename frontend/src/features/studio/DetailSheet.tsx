import {
  useEffect,
  useId,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { headshotAsset } from "../../content/profile";
import type { SkillEvidenceLink } from "../../types/content";
import { clean, type SpatialItem } from "./spatialModel";

type DetailSheetProps = {
  item: SpatialItem;
  index: number;
  total: number;
  isMobile?: boolean;
  onClose: () => void;
  onStep: (direction: -1 | 1) => void;
  onOpenResume?: () => void;
  onNavigateTarget?: (target: SkillEvidenceLink["target"]) => void;
  titleId?: string;
  onDragHandlePointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onBodyPullStart?: () => void;
  onBodyPullMove?: (dy: number) => void;
  onBodyPullEnd?: (dy: number, velocity: number) => void;
};

export default function DetailSheet({
  item,
  index,
  total,
  isMobile = false,
  onClose,
  onStep,
  onOpenResume,
  onNavigateTarget,
  titleId,
  onDragHandlePointerDown,
  onBodyPullStart,
  onBodyPullMove,
  onBodyPullEnd,
}: DetailSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pullCallbacksRef = useRef({
    onBodyPullStart,
    onBodyPullMove,
    onBodyPullEnd,
  });
  pullCallbacksRef.current = { onBodyPullStart, onBodyPullMove, onBodyPullEnd };
  const uid = useId();
  const resolvedTitleId = titleId ?? `${uid}-title`;

  useEffect(() => {
    const el = panelRef.current;
    if (!isMobile || !el) return;

    const mountedAt = performance.now();
    let hasTouchStart = false;
    let startX = 0;
    let startY = 0;
    let pullOriginY = 0;
    let pullStartTime = 0;
    let lastDy = 0;
    let pulling = false;
    let lockedToScroll = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      if (performance.now() - mountedAt < 180) return;
      const t = e.touches[0];
      hasTouchStart = true;
      startX = t.clientX;
      startY = t.clientY;
      pullOriginY = t.clientY;
      pullStartTime = performance.now();
      lastDy = 0;
      pulling = false;
      lockedToScroll = el.scrollTop > 2;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!hasTouchStart || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (!pulling) {
        if (lockedToScroll) return;
        if (Math.abs(dx) > Math.abs(dy) * 1.15 && Math.abs(dx) > 6) {
          lockedToScroll = true;
          return;
        }
        if (dy < -4) {
          lockedToScroll = true;
          return;
        }
        if (el.scrollTop <= 1 && dy > 6) {
          pulling = true;
          pullOriginY = t.clientY;
          pullStartTime = performance.now();
          lastDy = 0;
          pullCallbacksRef.current.onBodyPullStart?.();
        }
      }

      if (pulling) {
        if (e.cancelable) e.preventDefault();
        lastDy = Math.max(0, t.clientY - pullOriginY);
        pullCallbacksRef.current.onBodyPullMove?.(lastDy);
      }
    };

    const finishPull = () => {
      hasTouchStart = false;
      if (!pulling) return;
      pulling = false;
      const dt = Math.max(1, performance.now() - pullStartTime);
      const velocity = lastDy / dt;
      pullCallbacksRef.current.onBodyPullEnd?.(lastDy, velocity);
      lastDy = 0;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", finishPull, { passive: true });
    window.addEventListener("touchcancel", finishPull, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", finishPull);
      window.removeEventListener("touchcancel", finishPull);
    };
  }, [isMobile, item.uid]);

  useEffect(() => {
    panelRef.current?.scrollTo?.({ top: 0 });
    if (!isMobile) {
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [item.uid, isMobile]);

  return (
    <aside
      className={`glass-sheet ${isMobile ? "is-mobile-drawer" : ""}`}
      aria-label={`${item.title} inspector`}
    >
      {isMobile && (
        <div
          className="drawer-grab-zone"
          onPointerDown={onDragHandlePointerDown}
          aria-hidden="true"
        >
          <span className="drawer-grab-pill" />
        </div>
      )}

      <div
        className="glass-sheet__bar"
        onPointerDown={isMobile ? onDragHandlePointerDown : undefined}
      >
        <div className="glass-sheet__meta">
          <span
            className="glass-sheet__swatch"
            style={{ backgroundColor: item.palette.primary }}
            aria-hidden="true"
          />
          <span className="glass-sheet__eyebrow">{item.eyebrow}</span>
        </div>

        <div
          className="glass-sheet__controls"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {total > 1 && (
            <>
              <span className="glass-sheet__counter" aria-live="polite">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
              <div className="glass-sheet__stepper">
                <button
                  type="button"
                  onClick={() => onStep(-1)}
                  aria-label="Previous item"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => onStep(1)}
                  aria-label="Next item"
                >
                  →
                </button>
              </div>
            </>
          )}
          <button
            type="button"
            className="glass-sheet__close"
            onClick={onClose}
            aria-label="Close detail sheet"
          >
            ×
          </button>
        </div>
      </div>

      <header
        className="glass-sheet__header"
        onPointerDown={isMobile ? onDragHandlePointerDown : undefined}
      >
        <h2 ref={headingRef} id={resolvedTitleId} tabIndex={-1}>
          {item.title}
        </h2>
        <p className="glass-sheet__subtitle">{item.subtitle}</p>
      </header>

      <div className="glass-sheet__body" ref={panelRef}>
        {/* EXPERIENCE */}
        {item.payload.kind === "experience" && (
          <div key={item.uid} className="glass-sheet__panel">
            <div className="sheet-exp-hero">
              {item.payload.experience.logo && (
                <div className="sheet-exp-logo">
                  <img
                    src={item.payload.experience.logo}
                    alt={item.payload.experience.logoAlt ?? item.title}
                  />
                </div>
              )}
              <div>
                <strong className="sheet-exp-role">
                  {item.payload.experience.role}
                </strong>
                <span className="sheet-exp-meta">
                  {item.payload.experience.timeframe} ·{" "}
                  {item.payload.experience.location}
                </span>
              </div>
            </div>

            <p className="sheet-lead">{item.payload.experience.summary}</p>

            <section className="sheet-block">
              <h3>Key contributions</h3>
              <ul className="sheet-highlights">
                {item.payload.experience.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>

            <section className="sheet-block">
              <h3>Technologies & scope</h3>
              <ul className="sheet-tags">
                {item.payload.experience.tags.map((tag) => (
                  <li key={tag.label}>{tag.label}</li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* PROJECTS */}
        {item.payload.kind === "project" && (
          <div key={item.uid} className="glass-sheet__panel">
            <p className="sheet-copy">{clean(item.payload.project.description)}</p>

            <div className="sheet-actions">
              {item.payload.project.links.map((link, idx) => (
                <a
                  key={link.href}
                  className={`sheet-btn ${idx === 0 ? "sheet-btn--primary" : ""}`}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>

            <section className="sheet-block">
              <h3>Highlights</h3>
              <ul className="sheet-highlights">
                {item.payload.project.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>

            <section className="sheet-block">
              <h3>Stack & techniques</h3>
              <ul className="sheet-tags">
                {item.payload.project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* EDUCATION */}
        {item.payload.kind === "education" && (
          <div key={item.uid} className="glass-sheet__panel">
            <div className="sheet-exp-hero">
              {item.payload.education.logo && (
                <div className="sheet-exp-logo">
                  <img
                    src={item.payload.education.logo}
                    alt={item.payload.education.logoAlt ?? item.payload.education.institution}
                  />
                </div>
              )}
              <div>
                <strong className="sheet-exp-role">
                  {item.payload.education.degree}
                </strong>
                <span className="sheet-exp-meta">
                  {item.payload.education.institution} ·{" "}
                  {item.payload.education.location}
                </span>
              </div>
            </div>

            <div className="sheet-metrics">
              <div className="sheet-metric">
                <span>Cumulative GPA</span>
                <strong>{item.payload.education.gpa} / 4.00</strong>
              </div>
              <div className="sheet-metric">
                <span>Timeframe</span>
                <strong>{item.payload.education.timeframe}</strong>
              </div>
            </div>

            <p className="sheet-lead">{item.payload.education.summary}</p>

            <section className="sheet-block">
              <h3>Academic highlights</h3>
              <ul className="sheet-highlights">
                {item.payload.education.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>

            <section className="sheet-block">
              <h3>Core focus areas</h3>
              <ul className="sheet-tags">
                {item.payload.education.focusAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* SKILLS */}
        {item.payload.kind === "skill" && (
          <div key={item.uid} className="glass-sheet__panel">
            <section className="sheet-block sheet-block--first">
              <h3>Tools & capabilities</h3>
              <ul className="sheet-tags">
                {item.payload.cluster.items.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </section>

            {!!item.payload.cluster.evidence?.length && (
              <section className="sheet-block">
                <h3>Where I’ve applied this</h3>
                <div className="sheet-evidence-list" role="list">
                  {item.payload.cluster.evidence.map((ev) => (
                    <button
                      key={`${ev.target.kind}:${ev.target.slug}`}
                      type="button"
                      className="sheet-evidence-row"
                      role="listitem"
                      onClick={() => onNavigateTarget?.(ev.target)}
                    >
                      <span className="sheet-evidence-row__badge">
                        {ev.target.kind === "experience"
                          ? "Experience"
                          : ev.target.kind === "education"
                            ? "Education"
                            : "Project"}
                      </span>
                      <span className="sheet-evidence-row__text">
                        <strong>{ev.label}</strong>
                        <small>{ev.context}</small>
                      </span>
                      <span
                        className="sheet-evidence-row__arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ABOUT */}
        {item.payload.kind === "about" && (
          <div key={item.uid} className="glass-sheet__panel">
            {item.payload.about.kind === "bio" && (
              <>
                <div className="sheet-bio-hero">
                  <img
                    src={headshotAsset}
                    alt="Jake Brulato"
                    className="sheet-bio-avatar"
                  />
                  <div>
                    <strong className="sheet-bio-name">Jake Brulato</strong>
                    <span className="sheet-bio-role">
                      Data Management Analyst · Wells Fargo
                    </span>
                  </div>
                </div>
                <p className="sheet-lead">{item.payload.about.body[0]}</p>
                <div className="sheet-metrics">
                  {item.payload.about.metrics.map((m) =>
                    m.target && onNavigateTarget ? (
                      <button
                        key={m.label}
                        type="button"
                        className="sheet-metric sheet-metric--link"
                        onClick={() => onNavigateTarget(m.target!)}
                      >
                        <span>{m.label}</span>
                        <strong>
                          {m.value} <em aria-hidden="true">→</em>
                        </strong>
                      </button>
                    ) : (
                      <div key={m.label} className="sheet-metric">
                        <span>{m.label}</span>
                        <strong>{m.value}</strong>
                      </div>
                    ),
                  )}
                </div>
                <ul className="sheet-highlights">
                  {item.payload.about.body.slice(1).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="sheet-actions">
                  {item.payload.about.links.map((l) =>
                    l.href === "/files/resume.pdf" && onOpenResume ? (
                      <button
                        key={l.href}
                        type="button"
                        className="sheet-btn"
                        onClick={onOpenResume}
                      >
                        {l.label} <span aria-hidden="true">↗</span>
                      </button>
                    ) : (
                      <a
                        key={l.href}
                        href={l.href}
                        className={`sheet-btn ${l.label === "Email" ? "sheet-btn--primary" : ""}`}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                      >
                        {l.label} <span aria-hidden="true">↗</span>
                      </a>
                    ),
                  )}
                </div>
              </>
            )}

            {item.payload.about.kind === "contact" && (
              <>
                <p className="sheet-lead">{item.payload.about.body}</p>
                <div className="sheet-contact-list" role="list">
                  <a
                    href={`mailto:${item.payload.about.email}`}
                    className="sheet-contact-row sheet-contact-row--primary"
                    role="listitem"
                  >
                    <span className="sheet-contact-row__icon" aria-hidden="true">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="3" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <span className="sheet-contact-row__text">
                      <strong>Email</strong>
                      <small>{item.payload.about.email}</small>
                    </span>
                    <span className="sheet-contact-row__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>

                  <a
                    href={item.payload.about.phoneHref}
                    className="sheet-contact-row"
                    role="listitem"
                  >
                    <span className="sheet-contact-row__icon" aria-hidden="true">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    <span className="sheet-contact-row__text">
                      <strong>Phone</strong>
                      <small>{item.payload.about.phone}</small>
                    </span>
                    <span className="sheet-contact-row__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>

                  {onOpenResume ? (
                    <button
                      type="button"
                      className="sheet-contact-row"
                      role="listitem"
                      onClick={onOpenResume}
                    >
                      <span className="sheet-contact-row__icon" aria-hidden="true">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="9" y1="13" x2="15" y2="13" />
                          <line x1="9" y1="17" x2="13" y2="17" />
                        </svg>
                      </span>
                      <span className="sheet-contact-row__text">
                        <strong>Résumé</strong>
                        <small>PDF · View here or download</small>
                      </span>
                      <span className="sheet-contact-row__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </button>
                  ) : (
                    <a
                      href="/files/resume.pdf"
                      className="sheet-contact-row"
                      role="listitem"
                    >
                      <span className="sheet-contact-row__icon" aria-hidden="true">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="9" y1="13" x2="15" y2="13" />
                          <line x1="9" y1="17" x2="13" y2="17" />
                        </svg>
                      </span>
                      <span className="sheet-contact-row__text">
                        <strong>Résumé</strong>
                        <small>PDF · View or download</small>
                      </span>
                      <span className="sheet-contact-row__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  )}

                  <a
                    href={item.payload.about.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sheet-contact-row"
                    role="listitem"
                  >
                    <span className="sheet-contact-row__icon" aria-hidden="true">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                      </svg>
                    </span>
                    <span className="sheet-contact-row__text">
                      <strong>LinkedIn</strong>
                      <small>{item.payload.about.linkedinDisplay}</small>
                    </span>
                    <span className="sheet-contact-row__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>

                  <a
                    href={item.payload.about.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sheet-contact-row"
                    role="listitem"
                  >
                    <span className="sheet-contact-row__icon" aria-hidden="true">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                      </svg>
                    </span>
                    <span className="sheet-contact-row__text">
                      <strong>GitHub</strong>
                      <small>{item.payload.about.githubDisplay}</small>
                    </span>
                    <span className="sheet-contact-row__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
