import type { FormationKind, PaletteSpec, SectionId, SpatialItem } from "./spatialModel";
import { VARIANTS_PART_A } from "./sculptureVariantsPartA";
import { VARIANTS_PART_B, rotateYX, type VariantEvaluator } from "./sculptureVariantsPartB";
import { VARIANTS_SEASON2_A } from "./sculptureVariantsSeason2A";
import { VARIANTS_SEASON2_B } from "./sculptureVariantsSeason2B";
import { VARIANTS_SEASON2_C } from "./sculptureVariantsSeason2C";
import { VARIANTS_SEASON3_A } from "./sculptureVariantsSeason3A";
import { VARIANTS_SEASON3_B } from "./sculptureVariantsSeason3B";
import { VARIANTS_SEASON3_C } from "./sculptureVariantsSeason3C";
import { VARIANTS_ABOUT_UNIQUE } from "./sculptureVariantsAboutUnique";
import { VARIANTS_RISK } from "./sculptureVariantsRisk";

export const CUBE_COUNT = 120;

export type CubeTarget = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
  color: string;
};

// ============================================================================
// BESPOKE 120-CUBE SCULPTURES CRAFTED FOR JAKE BRULATO'S PORTFOLIO
// ============================================================================

/**
 * 1. HOUSING SCRAPER (`jake-housing-scraper`) — Exact 120 non-overlapping cubes:
 *    - Left (84 cubes): Solid-Gable 3D House (36 perimeter walls + 8 gable triangles +
 *      6 foundation lawn cubes + 34 pitched roof tiles) swept by a live vertical scraper beam!
 *    - Right (36 cubes): Floating Structured Data Table Card (16 frame + 20 parsed data cells)
 *      receiving extracted property rows in real time!
 */
const JAKE_HOUSING_SCRAPER: VariantEvaluator = {
  hero(idx, _count, t, pal) {
    const rotY = -0.32 + Math.sin(t * 0.28) * 0.16;
    const rotX = 0.2;
    const scanY = Math.sin(t * 1.65) * 1.05 - 0.35;

    let lx = 0;
    let ly = 0;
    let lz = 0;
    let sc = 0.23;
    let col = pal.primary;

    if (idx < 84) {
      const hx = -0.82;
      if (idx < 36) {
        // 5x3 perimeter x 3 stories = 36 wall cubes
        const story = Math.floor(idx / 12);
        const k = idx % 12;
        let gx = 0;
        let gz = 0;
        if (k < 5) {
          gx = k - 2;
          gz = 1;
        } else if (k < 10) {
          gx = k - 7;
          gz = -1;
        } else if (k === 10) {
          gx = -2;
          gz = 0;
        } else {
          gx = 2;
          gz = 0;
        }
        lx = hx + gx * 0.27;
        ly = -1.04 + story * 0.27;
        lz = gz * 0.29;
        const isDoor = gz === 1 && gx === -1 && story <= 1;
        const isWindow = gz === 1 && gx === 1 && story === 1;
        const scanned = Math.abs(ly - scanY) < 0.18;
        sc = scanned ? 0.265 : 0.245;
        col = scanned
          ? "#ffffff"
          : isDoor
            ? "#2b2452"
            : isWindow
              ? "#f5b83d"
              : "#e6dff5";
      } else if (idx < 44) {
        // 8 front & back solid triangular gable cubes
        const k = idx - 36;
        const isFront = k < 4;
        const gablePts: Array<[number, number]> = [
          [-1, -0.23],
          [0, -0.23],
          [1, -0.23],
          [0, 0.04],
        ];
        const gp = gablePts[k % 4];
        lx = hx + gp[0] * 0.27;
        ly = gp[1];
        lz = isFront ? 0.29 : -0.29;
        const scanned = Math.abs(ly - scanY) < 0.18;
        sc = scanned ? 0.26 : 0.24;
        col = scanned ? "#ffffff" : "#dcd2f2";
      } else if (idx < 50) {
        // 6 foundation lawn base cubes
        const k = idx - 44;
        lx = hx + (k - 2.5) * 0.29;
        ly = -1.32;
        lz = 0.12;
        sc = 0.22;
        col = "#22bf90";
      } else {
        // 34 pitched roof cubes (15 left slope + 15 right slope + 4 ridge cap)
        const r = idx - 50;
        if (r < 30) {
          const isRight = r >= 15;
          const m = isRight ? r - 15 : r;
          const step = Math.floor(m / 5); // 0..2
          const d = (m % 5) - 2;
          const dir = isRight ? 1 : -1;
          lx = hx + dir * (0.76 - step * 0.24);
          ly = -0.24 + step * 0.24;
          lz = d * 0.25;
          const scanned = Math.abs(ly - scanY) < 0.18;
          sc = scanned ? 0.24 : 0.215;
          col = scanned ? "#ffffff" : isRight ? pal.primary : pal.deep;
        } else {
          const d = r - 30 - 1.5;
          lx = hx;
          ly = 0.48;
          lz = d * 0.27;
          sc = 0.22;
          col = "#2b2452";
        }
      }
    } else {
      // Right: Structured Extracted Dataset Card (36 cubes: 16 border/header + 20 parsed cells)
      const j = idx - 84;
      const tx = 1.15;
      if (j < 16) {
        // Top header bar (6) + bottom bar (6) + left/right side rails (4)
        if (j < 6) {
          lx = tx + (j - 2.5) * 0.24;
          ly = 0.92;
          lz = 0.12;
          sc = 0.21;
          col = "#2b2452";
        } else if (j < 12) {
          lx = tx + (j - 6 - 2.5) * 0.24;
          ly = -0.92;
          lz = 0.12;
          sc = 0.2;
          col = "#344b8c";
        } else {
          const side = j < 14 ? -1 : 1;
          const row = j % 2 === 0 ? 0.3 : -0.3;
          lx = tx + side * 0.72;
          ly = row;
          lz = 0.08;
          sc = 0.18;
          col = "#344b8c";
        }
      } else {
        // 5 rows x 4 columns = 20 clean parsed table cells lighting up in sync with scraper!
        const cell = j - 16;
        const row = Math.floor(cell / 4); // 0..4
        const c = cell % 4; // 0..3
        lx = tx + (c - 1.5) * 0.28;
        ly = 0.56 - row * 0.3;
        const activeRow = Math.floor(((t * 1.4) % 5 + 5) % 5);
        const lit = row === activeRow;
        lz = lit ? 0.22 : 0.12;
        sc = lit ? 0.21 : 0.18;
        col = lit
          ? "#f5b83d"
          : c === 0
            ? "#22bf90"
            : row % 2 === 0
              ? pal.primary
              : pal.light;
      }
    }

    const [x, y, z] = rotateYX(lx, ly, lz, rotY, rotX);
    return { x, y, z, rx: rotX, ry: rotY, rz: 0, scale: sc, color: col };
  },
  mini(idx, _cnt, t, boost, sc, pal) {
    const slot = idx % 12;
    const pts: Array<[number, number, number, string]> = [
      [-0.24, -0.18, 0, pal.light],
      [0, -0.18, 0, pal.primary],
      [0.24, -0.18, 0, pal.light],
      [-0.24, 0.04, 0, pal.primary],
      [0.24, 0.04, 0, pal.primary],
      [-0.2, 0.24, 0, pal.deep],
      [0, 0.36, 0, pal.deep],
      [0.2, 0.24, 0, pal.deep],
      [0.44, 0.18, 0.14, "#f5b83d"],
      [0.44, -0.02, 0.14, "#22bf90"],
      [0.44, -0.22, 0.14, pal.primary],
      [0, 0.04, 0.16, "#ffffff"],
    ];
    const p = pts[slot];
    const ry = Math.sin(t * 0.45) * 0.26;
    const [dx, dy, dz] = rotateYX(p[0] * boost, p[1] * boost, p[2] * boost, ry, 0.18);
    return { dx, dy, dz, rx: 0.18, ry, rz: 0, scale: sc, color: p[3] };
  },
};

/**
 * 2. FLIGHTTRACKER (`jake-flight-tracker`) — Exact 120 non-overlapping cubes:
 *    - Top/Center (74 cubes): Sleek 3D Commercial Jetliner banking gently in flight
 *      (24 fuselage + cockpit nosecone, 28 swept delta wings, 8 twin under-wing turbofan engines,
 *      14 vertical tail fin & horizontal stabilizers)!
 *    - Below (46 cubes): Curved 3D Aviation Flight-Route Arc + Departure & Arrival Airport Beacons
 *      with a live traveling radar telemetry pulse!
 */
const JAKE_FLIGHT_TRACKER: VariantEvaluator = {
  hero(idx, _count, t, pal) {
    const rotY = -0.38 + Math.sin(t * 0.32) * 0.22;
    const rotX = 0.26;
    const bankZ = Math.sin(t * 0.85) * 0.09;
    const hoverY = Math.sin(t * 1.35) * 0.08 + 0.24;

    const applyBank = (px: number, py: number, pz: number): [number, number, number] => {
      const cb = Math.cos(bankZ);
      const sb = Math.sin(bankZ);
      const bx = px * cb - py * sb;
      const by = px * sb + py * cb + hoverY;
      return rotateYX(bx, by, pz, rotY, rotX);
    };

    if (idx < 74) {
      let px = 0;
      let py = 0;
      let pz = 0;
      let sc = 0.22;
      let col = "#ffffff";

      if (idx < 24) {
        // 24 fuselage + cockpit cubes along X from tail (-1.45) to nose (+1.55)
        if (idx < 12) {
          // Upper fuselage spine (12 cubes)
          const u = idx / 11;
          px = -1.42 + u * 2.88;
          py = 0.11;
          pz = 0;
          sc = idx === 11 ? 0.2 : idx >= 9 ? 0.23 : 0.245;
          col = idx >= 9 ? "#2d6ae0" : "#ffffff"; // cobalt cockpit windshield!
        } else {
          // Lower fuselage belly (12 cubes)
          const k = idx - 12;
          const u = k / 11;
          px = -1.36 + u * 2.82;
          py = -0.11;
          pz = 0;
          sc = k === 11 ? 0.18 : 0.235;
          col = k % 3 === 0 ? pal.primary : "#dce6fa";
        }
      } else if (idx < 52) {
        // 28 swept main wing cubes (14 port -Z, 14 starboard +Z)
        const w = idx - 24;
        const side = w < 14 ? -1 : 1;
        const k = w % 14;
        // 2 chord rows: leading edge (8 cubes) + trailing flap edge (6 cubes)
        if (k < 8) {
          const span = k + 1; // 1..8
          px = 0.42 - span * 0.14;
          py = -0.02 + span * 0.015;
          pz = side * (0.28 + span * 0.2);
          sc = k === 7 ? 0.18 : 0.22;
          // Navigation wingtip strobes (emerald starboard / crimson port)
          col =
            k === 7
              ? side > 0
                ? "#22bf90"
                : "#f05b7d"
              : k % 2 === 0
                ? "#ffffff"
                : pal.light;
        } else {
          const span = k - 8 + 1; // 1..6
          px = 0.14 - span * 0.14;
          py = -0.03 + span * 0.012;
          pz = side * (0.32 + span * 0.2);
          sc = 0.205;
          col = pal.primary;
        }
      } else if (idx < 60) {
        // 8 twin under-wing turbofan engine pods (4 per side)
        const e = idx - 52;
        const side = e < 4 ? -1 : 1;
        const k = e % 4;
        px = 0.22 - (k % 2) * 0.24;
        py = -0.24;
        pz = side * (0.76 + (k >= 2 ? 0.42 : 0));
        sc = 0.185;
        col = k % 2 === 0 ? "#f5b83d" : "#2b2452";
      } else {
        // 14 empennage tail assembly cubes (8 tall swept vertical fin + 6 horizontal tailplane)
        const tl = idx - 60;
        if (tl < 8) {
          const row = Math.floor(tl / 2); // 0..3
          const colIdx = tl % 2;
          px = -1.18 - row * 0.12 - colIdx * 0.22;
          py = 0.34 + row * 0.22;
          pz = 0;
          sc = 0.21;
          col = colIdx === 0 ? pal.deep : pal.primary;
        } else {
          const h = tl - 8; // 0..5 -> 3 per side
          const side = h < 3 ? -1 : 1;
          const span = (h % 3) + 1;
          px = -1.24 - span * 0.09;
          py = 0.08;
          pz = side * (0.24 + span * 0.2);
          sc = 0.19;
          col = pal.light;
        }
      }

      const [x, y, z] = applyBank(px, py, pz);
      return { x, y, z, rx: rotX, ry: rotY, rz: bankZ, scale: sc, color: col };
    }

    // Bottom 46 cubes: Departure Airport Pin (7) + Arrival Airport Pin (7) + 32 Flight Route Arc Cubes!
    const rIdx = idx - 74;
    if (rIdx < 14) {
      const isArrival = rIdx >= 7;
      const k = rIdx % 7;
      const baseX = isArrival ? 1.62 : -1.62;
      const baseY = isArrival ? -0.78 : -1.12;
      const baseZ = isArrival ? -0.24 : 0.28;
      let ox = 0;
      let oy = 0;
      let oz = 0;
      if (k < 4) {
        const a = (k / 4) * Math.PI * 2 + t * 0.8;
        ox = Math.cos(a) * 0.22;
        oz = Math.sin(a) * 0.22;
      } else {
        oy = (k - 3) * 0.22;
      }
      const [x, y, z] = rotateYX(baseX + ox, baseY + oy, baseZ + oz, rotY, rotX);
      return {
        x,
        y,
        z,
        rx: rotX,
        ry: rotY,
        rz: 0,
        scale: k === 6 ? 0.22 : 0.17,
        color: k === 6 ? "#f5b83d" : isArrival ? "#22bf90" : pal.deep,
      };
    }

    // 32 curved flight-path corridor cubes with smooth traveling telemetry pulse
    const sIdx = rIdx - 14; // 0..31
    const u = (sIdx + 0.5) / 32;
    const ax = -1.52 + u * 3.04;
    const ay = -1.06 + u * 0.3 + Math.sin(u * Math.PI) * 0.48;
    const az = 0.26 - u * 0.48 + Math.sin(u * Math.PI) * 0.22;

    const pulsePos = ((t * 0.55) % 1 + 1) % 1;
    let d = u - pulsePos;
    if (d > 0.5) d -= 1;
    if (d < -0.5) d += 1;
    const lit = Math.abs(d) < 0.085;

    const [x, y, z] = rotateYX(ax, ay, az, rotY, rotX);
    return {
      x,
      y,
      z,
      rx: rotX,
      ry: rotY,
      rz: 0,
      scale: lit ? 0.21 : 0.135,
      color: lit ? "#f5b83d" : sIdx % 2 === 0 ? pal.primary : pal.light,
    };
  },
  mini(idx, _cnt, t, boost, sc, pal) {
    const slot = idx % 12;
    const pts: Array<[number, number, number, string]> = [
      [-0.3, 0.05, 0, "#ffffff"],
      [-0.08, 0.06, 0, "#ffffff"],
      [0.14, 0.07, 0, "#ffffff"],
      [0.34, 0.08, 0, "#2d6ae0"],
      [0.02, 0.04, -0.26, pal.primary],
      [-0.08, 0.04, -0.46, pal.light],
      [0.02, 0.04, 0.26, pal.primary],
      [-0.08, 0.04, 0.46, pal.light],
      [-0.34, 0.26, 0, pal.deep],
      [-0.28, -0.26, 0.1, "#f5b83d"],
      [0, -0.2, 0, pal.light],
      [0.28, -0.24, -0.1, "#22bf90"],
    ];
    const p = pts[slot];
    const ry = -0.35 + Math.sin(t * 0.45) * 0.24;
    const [dx, dy, dz] = rotateYX(p[0] * boost, p[1] * boost, p[2] * boost, ry, 0.24);
    return { dx, dy, dz, rx: 0.24, ry, rz: 0, scale: sc, color: p[3] };
  },
};

/**
 * 3. GRADUATION CAP (`jake-grad-cap`) — Exact 120 non-overlapping cubes:
 *    - Top (64 cubes): Crisp 8x8 Diamond Mortarboard Square Board tilted with ceremonial poise!
 *    - Crown Base (32 cubes): Fitted 2-tier circular skullcap base beneath the board!
 *    - Tassel & Button (24 cubes): Golden center button + cord draped across board edge +
 *      gently swaying golden tassel fringe!
 */
const JAKE_GRAD_CAP: VariantEvaluator = {
  hero(idx, _count, t, pal) {
    const rotY = 0.62 + Math.sin(t * 0.3) * 0.22;
    const rotX = 0.34;
    const capTiltZ = -0.08;

    const tiltAndRotate = (px: number, py: number, pz: number): [number, number, number] => {
      const cz = Math.cos(capTiltZ);
      const sz = Math.sin(capTiltZ);
      const tx = px * cz - py * sz;
      const ty = px * sz + py * cz;
      return rotateYX(tx, ty, pz, rotY, rotX);
    };

    if (idx < 64) {
      // 8x8 Mortarboard Square Top (64 non-overlapping cubes)
      const r = Math.floor(idx / 8); // 0..7
      const c = idx % 8; // 0..7
      const px = (c - 3.5) * 0.31;
      const pz = (r - 3.5) * 0.31;
      const py = 0.42;
      const isEdge = r === 0 || r === 7 || c === 0 || c === 7;
      const [x, y, z] = tiltAndRotate(px, py, pz);
      return {
        x,
        y,
        z,
        rx: rotX,
        ry: rotY,
        rz: capTiltZ,
        scale: isEdge ? 0.265 : 0.255,
        color: isEdge ? pal.deep : (r + c) % 2 === 0 ? "#2b2452" : pal.primary,
      };
    }

    if (idx < 96) {
      // 32-cube fitted skullcap crown underneath the board (2 rings of 16)
      const j = idx - 64;
      const ring = Math.floor(j / 16); // 0 upper, 1 lower headband
      const k = j % 16;
      const a = (k / 16) * Math.PI * 2;
      const radius = ring === 0 ? 0.82 : 0.76;
      const px = Math.cos(a) * radius;
      const pz = Math.sin(a) * radius;
      const py = ring === 0 ? 0.08 : -0.26;
      const [x, y, z] = tiltAndRotate(px, py, pz);
      return {
        x,
        y,
        z,
        rx: rotX,
        ry: rotY,
        rz: capTiltZ,
        scale: 0.235,
        color: ring === 1 && k % 2 === 0 ? "#f5b83d" : pal.deep,
      };
    }

    // 24 cubes: Center top gold button (4) + draped cord (10) + swinging tassel fringe (10)
    const k = idx - 96;
    const sway = Math.sin(t * 1.75) * 0.14;
    if (k < 4) {
      const ox = (k % 2 === 0 ? -1 : 1) * 0.09;
      const oz = (k < 2 ? -1 : 1) * 0.09;
      const [x, y, z] = tiltAndRotate(ox, 0.64, oz);
      return {
        x,
        y,
        z,
        rx: rotX,
        ry: rotY,
        rz: capTiltZ,
        scale: 0.17,
        color: "#f5b83d",
      };
    }
    if (k < 14) {
      // 10 cord cubes running from center button across to right board edge & over the brim
      const step = k - 4; // 0..9
      let px = 0;
      let py = 0.62;
      let pz = 0.16;
      if (step < 6) {
        const u = (step + 1) / 6;
        px = u * 1.22;
        py = 0.61;
        pz = u * 0.28;
      } else {
        const drop = step - 5; // 1..4
        px = 1.26 + sway * (drop * 0.22);
        py = 0.48 - drop * 0.24;
        pz = 0.3 + sway * 0.1;
      }
      const [x, y, z] = tiltAndRotate(px, py, pz);
      return {
        x,
        y,
        z,
        rx: rotX,
        ry: rotY,
        rz: capTiltZ,
        scale: 0.155,
        color: step % 2 === 0 ? "#f5b83d" : "#d98d1a",
      };
    }

    // 10 flared golden tassel fringe cubes swaying gently below the brim!
    const f = k - 14; // 0..9 -> 2 tiers of 5
    const tier = Math.floor(f / 5);
    const a = ((f % 5) / 5) * Math.PI * 2 + t * 0.4;
    const spread = tier === 0 ? 0.14 : 0.2;
    const px = 1.26 + sway * (1.0 + tier * 0.25) + Math.cos(a) * spread;
    const py = -0.68 - tier * 0.22;
    const pz = 0.3 + sway * 0.12 + Math.sin(a) * spread;
    const [x, y, z] = tiltAndRotate(px, py, pz);
    return {
      x,
      y,
      z,
      rx: rotX,
      ry: rotY,
      rz: capTiltZ,
      scale: 0.165,
      color: tier === 1 ? "#ffffff" : "#f5b83d",
    };
  },
  mini(idx, _cnt, t, boost, sc, pal) {
    const slot = idx % 12;
    const pts: Array<[number, number, number, string]> = [
      [-0.24, 0.18, -0.24, pal.deep],
      [0, 0.18, -0.24, pal.primary],
      [0.24, 0.18, -0.24, pal.deep],
      [-0.24, 0.18, 0, pal.primary],
      [0, 0.22, 0, "#f5b83d"],
      [0.24, 0.18, 0, pal.primary],
      [-0.24, 0.18, 0.24, pal.deep],
      [0, 0.18, 0.24, pal.primary],
      [0.24, 0.18, 0.24, pal.deep],
      [-0.14, -0.14, 0, pal.deep],
      [0.14, -0.14, 0, pal.deep],
      [0.34, -0.16, 0.16, "#f5b83d"],
    ];
    const p = pts[slot];
    const ry = 0.55 + Math.sin(t * 0.45) * 0.24;
    const [dx, dy, dz] = rotateYX(p[0] * boost, p[1] * boost, p[2] * boost, ry, 0.32);
    return { dx, dy, dz, rx: 0.32, ry, rz: 0, scale: sc, color: p[3] };
  },
};

// Iconic 3D Sealed Envelope (`✉`) for Get in Touch / Contact (120 exact non-overlapping cubes)
const ENVELOPE_VOXELS: Array<{ x: number; y: number; z: number; part: "body" | "flap" | "seal" }> = (() => {
  const pts: Array<{ x: number; y: number; z: number; part: "body" | "flap" | "seal" }> = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 11; c++) {
      const x = (c - 5) * 0.28;
      const y = (3 - r) * 0.28;
      const isEdge = r === 0 || r === 6 || c === 0 || c === 10;
      pts.push({ x, y, z: isEdge ? 0.12 : -0.12, part: "body" });
    }
  }
  for (let step = 0; step <= 5; step++) {
    const y = (3 - step * 0.65) * 0.28;
    const lx = (-5 + step) * 0.28;
    const rx = (5 - step) * 0.28;
    pts.push({ x: lx, y, z: 0.3, part: "flap" });
    if (step < 5) pts.push({ x: rx, y, z: 0.3, part: "flap" });
  }
  pts.push(
    { x: -0.14, y: -0.08, z: 0.48, part: "seal" },
    { x: 0.14, y: -0.08, z: 0.48, part: "seal" },
    { x: -0.14, y: -0.34, z: 0.48, part: "seal" },
    { x: 0.14, y: -0.34, z: 0.48, part: "seal" },
  );
  return pts;
})();

const CONTACT_ENVELOPE_EVALUATOR: VariantEvaluator = {
  hero(idx, count, t, pal) {
    const rotY = Math.sin(t * 0.38) * 0.32;
    const rotX = 0.16 + Math.sin(t * 0.5) * 0.06;
    if (idx < ENVELOPE_VOXELS.length) {
      const v = ENVELOPE_VOXELS[idx];
      const flapLift = v.part === "flap" || v.part === "seal" ? Math.sin(t * 1.6) * 0.06 : 0;
      const [x, y, z] = rotateYX(v.x, v.y + flapLift, v.z + flapLift, rotY, rotX);
      const scale = v.part === "seal" ? 0.22 : 0.235;
      const color =
        v.part === "seal"
          ? pal.deep
          : v.part === "flap"
            ? pal.primary
            : "#f2ecff";
      return { x, y, z, rx: rotX, ry: rotY, rz: 0, scale, color };
    }
    const j = idx - ENVELOPE_VOXELS.length;
    const rem = Math.max(1, count - ENVELOPE_VOXELS.length);
    const a = (j / rem) * Math.PI * 2 + t * 0.55;
    const [x, y, z] = rotateYX(Math.cos(a) * 1.98, Math.sin(a) * 1.38, -0.35, rotY * 0.5, 0.2);
    return { x, y, z, rx: 0.2, ry: rotY * 0.5, rz: 0, scale: 0.14, color: pal.light };
  },
  mini(idx, _cnt, t, boost, sc, pal) {
    const col = (idx % 4) - 1.5;
    const row = Math.floor((idx % 12) / 4) - 1;
    const ry = Math.sin(t * 0.45) * 0.25;
    const [dx, dy, dz] = rotateYX(
      col * 0.21 * boost,
      row * 0.2 * boost,
      idx % 3 === 0 ? 0.12 * boost : 0,
      ry,
      0.2,
    );
    return {
      dx,
      dy,
      dz,
      rx: 0.2,
      ry,
      rz: 0,
      scale: sc,
      color: row === 1 ? pal.primary : idx === 4 ? pal.deep : "#f2ecff",
    };
  },
};

const CHAMPION_EVALUATORS: Record<string, VariantEvaluator> = {
  ...VARIANTS_PART_A,
  ...VARIANTS_PART_B,
  ...VARIANTS_SEASON2_A,
  ...VARIANTS_SEASON2_B,
  ...VARIANTS_SEASON2_C,
  ...VARIANTS_SEASON3_A,
  ...VARIANTS_SEASON3_B,
  ...VARIANTS_SEASON3_C,
  ...VARIANTS_ABOUT_UNIQUE,
  ...VARIANTS_RISK,
  "jake-housing-scraper": JAKE_HOUSING_SCRAPER,
  "jake-flight-tracker": JAKE_FLIGHT_TRACKER,
  "jake-grad-cap": JAKE_GRAD_CAP,
  "contact-v5-envelope": CONTACT_ENVELOPE_EVALUATOR,
};

/**
 * 14 Unique Active Sculptures across Jake's 5 Resume Sections (zero duplicates!)
 */
export const ACTIVE_CHAMPION_VARIANT: Record<FormationKind, string> = {
  // Experience
  "exp-wf-data-mgmt": "gl4-server-funnel",
  "exp-wf-mrm-dsai": "risk-shield-equity",
  "exp-alg-logistics": "vel-map-tiny-truck",
  // Projects
  "proj-housing-scraper": "jake-housing-scraper",
  "proj-flight-tracker": "jake-flight-tracker",
  // Education
  "edu-ms-dsba": "jake-grad-cap",
  "edu-bsba-analytics": "risk-candlestick-breakout",
  // Skills
  "skill-languages": "js-s3-type-brackets",
  "skill-frameworks": "port-device-trio",
  "skill-infrastructure": "rv-cloud-deploy",
  "skill-databases": "sys-s3-network-mesh",
  "skill-domains": "sys-microchip",
  // About
  "about-monogram": "about-j-brand-purple",
  "about-beacon": "contact-v5-envelope",
};

/**
 * Compute clean, HUD-safe 3D overview anchor coordinates tailored to item count
 * so sculptures never collide with the top-left editorial hero column.
 */
export function getOverviewAnchor(
  _section: SectionId,
  index: number,
  count: number,
): [number, number, number] {
  if (count <= 1) return [0.45, -0.25, 0.2];

  if (count === 2) {
    const x = index === 0 ? -1.45 : 2.25;
    const y = index === 0 ? -0.34 : -0.22;
    return [x, y, 0.18];
  }

  if (count === 3) {
    const xs = [-2.25, 0.45, 3.15];
    const ys = [-0.46, -0.18, -0.42];
    const zs = [0.12, 0.22, 0.12];
    return [xs[index] ?? 0, ys[index] ?? -0.3, zs[index] ?? 0.15];
  }

  if (count === 4) {
    const xs = [-2.55, -0.45, 1.65, 3.65];
    const ys = [-0.42, -0.18, -0.18, -0.42];
    return [xs[index] ?? 0, ys[index] ?? -0.3, 0.14];
  }

  if (count === 5) {
    // 3 on upper-center/right (clearing top-left editorial hero!) + 2 on lower stage
    const coords: Array<[number, number, number]> = [
      [-0.45, 0.68, 0.14],
      [1.85, 0.76, 0.18],
      [4.05, 0.62, 0.12],
      [-1.55, -1.28, -0.04],
      [1.75, -1.28, -0.04],
    ];
    return coords[index] ?? [0, -0.3, 0];
  }

  const topCount = Math.ceil(count / 2);
  const isTop = index < topCount;
  const len = isTop ? topCount : count - topCount;
  const col = isTop ? index : index - topCount;
  const u = len > 1 ? col / (len - 1) - 0.5 : 0;
  return [u * 6.4, isTop ? 0.72 : -1.36, isTop ? 0.1 : -0.1];
}

export function getOverviewLabelOffsetY(count: number): number {
  if (count <= 2) return -1.02;
  if (count === 3) return -0.92;
  return -0.74;
}

export function computeHeroFormation(
  item: SpatialItem,
  idx: number,
  count: number,
  t: number,
  centerX: number,
  centerY: number,
): CubeTarget {
  const pal = item.palette;
  const champKey = ACTIVE_CHAMPION_VARIANT[item.formation];
  const champ = CHAMPION_EVALUATORS[champKey] ?? CONTACT_ENVELOPE_EVALUATOR;
  const res = champ.hero(idx, count, t, pal);
  const u = idx / Math.max(count - 1, 1);
  const floatY = Math.sin(t * 0.8 + u * 2) * 0.035;
  return {
    ...res,
    x: centerX + res.x,
    y: centerY + res.y + floatY,
    z: res.z + 0.55,
  };
}

/**
 * Compute all 120 cube targets for Overview clusters OR Hero monument.
 * For simplified sections (2–5 items), each Overview cluster samples unique
 * non-overlapping voxels directly from its scaled-down Hero monument so
 * all 120 cubes form rich miniature sculptures with zero z-fighting!
 */
export function computeAllCubeTargets(
  items: SpatialItem[],
  section: SectionId,
  selected: SpatialItem | null,
  hoveredSlug: string | null,
  t: number,
  heroCenterX: number,
): CubeTarget[] {
  const targets: CubeTarget[] = new Array(CUBE_COUNT);

  if (selected) {
    for (let i = 0; i < CUBE_COUNT; i++) {
      targets[i] = computeHeroFormation(
        selected,
        i,
        CUBE_COUNT,
        t,
        heroCenterX,
        -0.1,
      );
    }
    return targets;
  }

  if (items.length === 0) {
    for (let i = 0; i < CUBE_COUNT; i++) {
      const a = (i / CUBE_COUNT) * Math.PI * 2 + t * 0.25;
      const r = 2.2;
      targets[i] = {
        x: 0.9 + Math.cos(a) * r,
        y: Math.sin(a) * r * 0.6,
        z: 0,
        rx: a,
        ry: t * 0.5,
        rz: 0,
        scale: 0.18,
        color: i % 2 === 0 ? "#9678dc" : "#dcd0fc",
      };
    }
    return targets;
  }

  const itemCount = items.length;
  const basePerItem = Math.floor(CUBE_COUNT / itemCount);
  const remainder = CUBE_COUNT % itemCount;
  const overviewRatio =
    itemCount <= 2 ? 0.5 : itemCount === 3 ? 0.44 : itemCount <= 5 ? 0.36 : 0.3;

  let cursor = 0;
  for (let itemIdx = 0; itemIdx < itemCount; itemIdx++) {
    const item = items[itemIdx];
    const sliceSize = basePerItem + (itemIdx < remainder ? 1 : 0);
    const [ax, ay, az] = getOverviewAnchor(section, itemIdx, itemCount);
    const isHovered = hoveredSlug === item.slug;
    const boost = isHovered ? 1.14 : 1;
    const hoverLift = isHovered ? 0.16 : 0;
    const champKey = ACTIVE_CHAMPION_VARIANT[item.formation];
    const champ = CHAMPION_EVALUATORS[champKey] ?? CONTACT_ENVELOPE_EVALUATOR;

    for (let localIdx = 0; localIdx < sliceSize; localIdx++) {
      // Sample strictly distinct indices in [0..119] from the item's 120-cube hero sculpture!
      const heroIdx = Math.min(
        CUBE_COUNT - 1,
        Math.floor(((localIdx + 0.5) * CUBE_COUNT) / sliceSize),
      );
      const h = champ.hero(
        heroIdx,
        CUBE_COUNT,
        t + itemIdx * 0.4,
        item.palette,
      );
      const ratio = overviewRatio * boost;

      targets[cursor++] = {
        x: ax + h.x * ratio,
        y: ay + h.y * ratio + hoverLift,
        z: az + h.z * ratio + (isHovered ? 0.42 : 0),
        rx: h.rx,
        ry: h.ry,
        rz: h.rz,
        scale: Math.max(0.085, h.scale * ratio * 1.08),
        color: isHovered && localIdx % 4 === 0 ? "#ffffff" : h.color,
      };
    }
  }

  return targets;
}
