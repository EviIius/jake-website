import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CUBE_COUNT, computeAllCubeTargets } from "./CubeFormations";
import {
  PALETTE_THEMES,
  getPaletteTheme,
  setPaletteTheme,
  transformCubeColor,
} from "./paletteThemes";
import { SECTIONS, getItemsForSection } from "./spatialModel";
import StudioPage from "./StudioPage";

// Mock R3F Canvas in jsdom unit tests while testing full StudioPage HUD & interactions
vi.mock("./SpatialStage", () => ({
  default: ({
    items,
    onSelect,
  }: {
    items: Array<{ uid: string; slug: string; title: string }>;
    onSelect: (slug: string) => void;
  }) => (
    <div data-testid="mock-spatial-stage">
      {items.map((i) => (
        <button key={i.uid} type="button" onClick={() => onSelect(i.slug)}>
          Stage:{i.title}
        </button>
      ))}
    </div>
  ),
}));

describe("Jake Brulato Spatial Portfolio & Palette Engine", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setPaletteTheme("indigo");
  });

  it("populates all 5 sections strictly from Jake's resume with 14 unique 120-cube formations", () => {
    expect(SECTIONS.map((s) => s.id)).toEqual([
      "experience",
      "projects",
      "education",
      "skills",
      "about",
    ]);

    const allItems = SECTIONS.flatMap((s) => getItemsForSection(s.id));
    expect(allItems).toHaveLength(14);

    // Every single item across the entire site has a unique 3D formation
    const formations = new Set(allItems.map((i) => i.formation));
    expect(formations.size).toBe(14);

    // Verify finite non-NaN 120-cube targets in both Overview and Hero states
    for (const sec of SECTIONS) {
      const secItems = getItemsForSection(sec.id);
      const overview = computeAllCubeTargets(secItems, sec.id, null, null, 1.2, -1.8);
      expect(overview).toHaveLength(CUBE_COUNT);
      for (const cube of overview) {
        expect(Number.isFinite(cube.x)).toBe(true);
        expect(Number.isFinite(cube.y)).toBe(true);
        expect(Number.isFinite(cube.z)).toBe(true);
        expect(cube.scale).toBeGreaterThan(0);
      }

      for (const item of secItems) {
        const hero = computeAllCubeTargets(secItems, sec.id, item, null, 2.4, -1.8);
        expect(hero).toHaveLength(CUBE_COUNT);
        for (const cube of hero) {
          expect(Number.isFinite(cube.x)).toBe(true);
          expect(Number.isFinite(cube.y)).toBe(true);
          expect(Number.isFinite(cube.z)).toBe(true);
        }
      }
    }
  });

  it("switches across all 6 color palettes and harmonizes 3D cube colors cleanly", () => {
    expect(PALETTE_THEMES).toHaveLength(6);
    for (const candidate of PALETTE_THEMES) {
      const applied = setPaletteTheme(candidate.id);
      expect(applied.id).toBe(candidate.id);
      expect(document.documentElement.dataset.palette).toBe(candidate.id);
      expect(window.localStorage.getItem("jake:color-palette")).toBe(candidate.id);

      const sampleColor = transformCubeColor("#8461db", getPaletteTheme());
      expect(sampleColor).toMatch(/^#[0-9a-f]{6}$/i);
    }
    expect(transformCubeColor("#8461db", getPaletteTheme("spice"))).not.toBe("#8461db");
  });

  it("renders Jake's desktop HUD, inspects resume items, and changes color palette on demand", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1440 });
    Object.defineProperty(window, "innerHeight", { writable: true, value: 900 });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <StudioPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Jake Brulato")).toBeInTheDocument();
    expect(screen.getAllByText(/Wells Fargo · Data Mgmt/i).length).toBeGreaterThan(0);

    // Open Palette Picker and select Spice Orange
    const paletteBtn = screen.getByRole("button", {
      name: /Change color palette/i,
    });
    fireEvent.click(paletteBtn);
    fireEvent.click(screen.getByRole("menuitemradio", { name: /Spice Orange/i }));
    expect(document.documentElement.dataset.palette).toBe("spice");

    // Press `P` shortcut to cycle to Emerald Mint
    fireEvent.keyDown(window, { key: "p" });
    expect(document.documentElement.dataset.palette).toBe("emerald");

    // Navigate to Projects and open FlightTracker
    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    fireEvent.click(screen.getByRole("button", { name: "Stage:FlightTracker" }));
    expect(
      screen.getByText(/integrates flight data from external APIs/i),
    ).toBeInTheDocument();
  });
});
