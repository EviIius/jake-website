import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import SiteNavigation from "../../components/SiteNavigation";
import { profileContent } from "../../content/profile";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import CityMapScene from "./CityMapScene";

const conceptOptions = [
  {
    id: "city-map",
    label: "City map",
    className: "concept-pane--city",
    Scene: CityMapScene
  }
];

function ConceptComparePage() {
  const [activeSectionId, setActiveSectionId] = useState(profileContent.sceneSections[0].id);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isSingleConcept = conceptOptions.length === 1;
  const activeSection =
    profileContent.sceneSections.find((section) => section.id === activeSectionId) ??
    profileContent.sceneSections[0];

  return (
    <div className="concept-page">
      <SiteNavigation
        navLinks={[
          { id: "portfolio", label: "Portfolio", href: "/" },
          { id: "compare", label: "Compare", href: "/concepts" }
        ]}
        brandSubtitle="concept comparison"
        showActions={false}
      />

      <main className="concept-shell">
        <section className="concept-header">
          <div>
            <span className="concept-header__eyebrow">Portfolio world concept</span>
            <h1>City map, but sharper</h1>
          </div>

          <div className="concept-controls" aria-label="Compare section">
            {profileContent.sceneSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={
                  section.id === activeSectionId
                    ? "concept-controls__button is-active"
                    : "concept-controls__button"
                }
                onClick={() => setActiveSectionId(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
        </section>

        <section
          className={isSingleConcept ? "concept-grid concept-grid--single" : "concept-grid"}
          aria-label="Portfolio scene concepts"
        >
          {conceptOptions.map(({ id, label, className, Scene }) => (
            <article key={id} className={`concept-pane ${className}`} aria-label={`${label} concept`}>
              <div className="concept-pane__canvas">
                <Canvas camera={{ position: [-1, 1.8, 14], fov: 42 }} dpr={[1, 1.25]}>
                  <Scene
                    sections={profileContent.sceneSections}
                    activeSectionId={activeSectionId}
                    reducedMotion={prefersReducedMotion}
                  />
                </Canvas>
              </div>
              <div className="concept-pane__meta">
                <span>{label}</span>
                <strong>{activeSection.label}</strong>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default ConceptComparePage;
