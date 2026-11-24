import { useEffect, useState } from "react";
import type { PaletteSpec } from "./spatialModel";

export type PaletteThemeId =
  | "indigo"
  | "spice"
  | "emerald"
  | "sapphire"
  | "rose"
  | "midnight";

export type PaletteTheme = {
  id: PaletteThemeId;
  label: string;
  shortLabel: string;
  subtitle: string;
  isDark: boolean;
  /** Swatch triad shown in the palette picker UI */
  swatches: [string, string, string];
  /** Primary hue center in degrees [0..360) for 3D cube harmonization; null preserves multi-jewel original */
  hueCenter: number | null;
  /** Boot 5x5x5 hero cube 5-shade jewel progression [core, corner, edge4, even, odd] */
  bootCubeColors: [string, string, string, string, string];
  /** 3D stage lighting & architecture ring colors */
  stage: {
    ambientColor: string;
    ambientIntensity: number;
    hemiSky: string;
    hemiGround: string;
    hemiIntensity: number;
    keyColor: string;
    fillColor: string;
    rimColor: string;
    envLeft: string;
    envRight: string;
    envNegA: string;
    envNegB: string;
    ringOuter: string;
    ringInner: string;
    bootPointLight: string;
    bootShadow: string;
    heroShadow: string;
    pearlHighlight: string;
  };
  /** Distinct analogous item palettes for dots & point lights */
  itemPalettes: PaletteSpec[];
  /** CSS variables applied to documentElement (inherited by .spatial-app, .mobile-portfolio, body) */
  cssVars: Record<string, string>;
  /** Browser theme-color meta value */
  themeColorMeta: string;
  /** Brand medallion 3-stop gradient */
  brandStops: [string, string, string];
};

const STORAGE_KEY = "jake:color-palette";

export const PALETTE_THEMES: PaletteTheme[] = [
  {
    id: "indigo",
    label: "Indigo Cube",
    shortLabel: "Indigo",
    subtitle: "Classic GameCube lavender & amethyst crystal",
    isDark: false,
    swatches: ["#8461db", "#a888eb", "#5d39ad"],
    hueCenter: null,
    bootCubeColors: ["#5c39b0", "#9a76e8", "#8461db", "#744fcb", "#8f6ce2"],
    stage: {
      ambientColor: "#f5efff",
      ambientIntensity: 0.34,
      hemiSky: "#ffffff",
      hemiGround: "#5a3fa3",
      hemiIntensity: 0.58,
      keyColor: "#ffffff",
      fillColor: "#c0a3ff",
      rimColor: "#f4c7e4",
      envLeft: "#d6bfff",
      envRight: "#f7d2eb",
      envNegA: "#1e1240",
      envNegB: "#261852",
      ringOuter: "#b9a1e3",
      ringInner: "#cbb9ec",
      bootPointLight: "#a986f7",
      bootShadow: "#5837a6",
      heroShadow: "#472b8f",
      pearlHighlight: "#f2ecff",
    },
    itemPalettes: [
      { primary: "#8461db", deep: "#5434ad", light: "#ddd2fc", glow: "#a585f2" },
      { primary: "#62ab9c", deep: "#377d6e", light: "#cdeee6", glow: "#87ccc0" },
      { primary: "#708ee0", deep: "#4361b5", light: "#d3e0fc", glow: "#96b0f5" },
      { primary: "#aa74d4", deep: "#7944a6", light: "#e8d3fa", glow: "#c694ed" },
      { primary: "#c27da8", deep: "#8d4b75", light: "#f4d4e8", glow: "#dc9ec5" },
    ],
    themeColorMeta: "#fdfbff",
    brandStops: ["#a888eb", "#805ad4", "#5d39ad"],
    cssVars: {
      "--page-bg-solid": "#fdfbff",
      "--page-bg-grad": "radial-gradient(circle at 20% 14%, #fdfbff 0%, #f0e7fc 48%, #e5dbf7 100%)",
      "--mobile-bg-grad": "linear-gradient(165deg, #fdfbff 0%, #f1e8fc 52%, #e8def8 100%)",
      "--selection-bg": "rgba(132, 97, 219, 0.26)",
      "--ink": "#1b1328",
      "--ink-secondary": "#4e4163",
      "--ink-muted": "#726488",
      "--accent": "#6c48b8",
      "--accent-deep": "#4e2e94",
      "--hero-em-grad": "linear-gradient(120deg, #6e48bd, #9b73dc)",
      "--boot-enter-grad": "linear-gradient(125deg, #5531a8 0%, #7a52d4 52%, #a37cea 100%)",
      "--boot-enter-line": "#7c54d4",
      "--boot-enter-glow": "rgba(108, 72, 184, 0.26)",
      "--cta-grad": "linear-gradient(135deg, #8660d8, #633eb5)",
      "--cta-grad-hover": "linear-gradient(135deg, #916ce0, #6d48c0)",
      "--cta-shadow": "rgba(99, 62, 181, 0.3)",
      "--glass-bg": "linear-gradient(152deg, rgba(255, 255, 255, 0.7) 0%, rgba(252, 248, 255, 0.42) 52%, rgba(238, 228, 255, 0.54) 100%)",
      "--glass-bg-strong": "linear-gradient(155deg, rgba(255, 255, 255, 0.82) 0%, rgba(252, 249, 255, 0.6) 54%, rgba(241, 233, 255, 0.72) 100%)",
      "--glass-border": "rgba(255, 255, 255, 0.88)",
      "--shadow-tint": "64, 38, 118",
      "--rim-tint": "145, 118, 198",
      "--pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.88) 0%, rgba(250, 245, 255, 0.74) 100%)",
      "--pill-hover-bg": "rgba(255, 255, 255, 0.96)",
      "--pill-text": "#241936",
      "--nav-indicator-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 244, 255, 0.92))",
      "--control-pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(247, 242, 255, 0.94) 100%)",
      "--surface-card": "rgba(255, 255, 255, 0.8)",
      "--surface-card-hover": "#ffffff",
      "--surface-chip": "rgba(242, 235, 253, 0.9)",
      "--surface-subtle": "rgba(235, 226, 250, 0.84)",
      "--theater-bar-bg": "rgba(255, 254, 255, 0.9)",
      "--mobile-header-bg": "rgba(248, 244, 255, 0.93)",
      "--mobile-drawer-bg": "linear-gradient(155deg, #ffffff 0%, #fcf9ff 58%, #f6f0ff 100%)",
      "--orb-a": "rgba(202, 178, 248, 0.72)",
      "--orb-b": "rgba(238, 198, 230, 0.64)",
      "--orb-c": "rgba(196, 214, 250, 0.62)",
      "--orb-exp": "rgba(186, 206, 248, 0.72)",
      "--orb-edu": "rgba(220, 192, 248, 0.72)",
      "--orb-skills": "rgba(182, 228, 218, 0.62)",
      "--orb-about": "rgba(232, 198, 238, 0.68)",
    },
  },
  {
    id: "spice",
    label: "Spice Orange",
    shortLabel: "Spice",
    subtitle: "Japanese GameCube tangerine, amber & warm cream",
    isDark: false,
    swatches: ["#e06a2b", "#f59e56", "#a83f10"],
    hueCenter: 24,
    bootCubeColors: ["#a83e10", "#f59b52", "#e06a2b", "#c95319", "#eb813e"],
    stage: {
      ambientColor: "#fff4eb",
      ambientIntensity: 0.36,
      hemiSky: "#ffffff",
      hemiGround: "#9e4416",
      hemiIntensity: 0.58,
      keyColor: "#ffffff",
      fillColor: "#ffc294",
      rimColor: "#ffe09e",
      envLeft: "#ffd1ad",
      envRight: "#ffe4b8",
      envNegA: "#3b1708",
      envNegB: "#4a1e0a",
      ringOuter: "#e3b08d",
      ringInner: "#edd8bd",
      bootPointLight: "#ff9854",
      bootShadow: "#993b12",
      heroShadow: "#87330e",
      pearlHighlight: "#fff4eb",
    },
    itemPalettes: [
      { primary: "#e06a2b", deep: "#a63f0e", light: "#fde0cc", glow: "#ff9657" },
      { primary: "#d98a26", deep: "#9c5c0c", light: "#fce8c8", glow: "#f7b354" },
      { primary: "#cf5338", deep: "#942e19", light: "#fbd8d0", glow: "#f07e65" },
      { primary: "#e37b40", deep: "#ab4c18", light: "#fde3d2", glow: "#ffa470" },
      { primary: "#c76828", deep: "#8c4210", light: "#fae0cc", glow: "#e89254" },
    ],
    themeColorMeta: "#fffaf6",
    brandStops: ["#f59b52", "#e06a2b", "#a83e10"],
    cssVars: {
      "--page-bg-solid": "#fffaf6",
      "--page-bg-grad": "radial-gradient(circle at 20% 14%, #fffcf9 0%, #fdeee2 48%, #f8dec9 100%)",
      "--mobile-bg-grad": "linear-gradient(165deg, #fffcf9 0%, #fdeee2 52%, #f8dec9 100%)",
      "--selection-bg": "rgba(224, 106, 43, 0.24)",
      "--ink": "#2a160c",
      "--ink-secondary": "#664230",
      "--ink-muted": "#8c6551",
      "--accent": "#c95318",
      "--accent-deep": "#963608",
      "--hero-em-grad": "linear-gradient(120deg, #b8450e, #e87a38)",
      "--boot-enter-grad": "linear-gradient(125deg, #9c3808 0%, #d95f22 52%, #f28f4b 100%)",
      "--boot-enter-line": "#d95f22",
      "--boot-enter-glow": "rgba(204, 84, 24, 0.26)",
      "--cta-grad": "linear-gradient(135deg, #e67235, #b84812)",
      "--cta-grad-hover": "linear-gradient(135deg, #f07e41, #c7531a)",
      "--cta-shadow": "rgba(184, 72, 18, 0.3)",
      "--glass-bg": "linear-gradient(152deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 249, 244, 0.46) 52%, rgba(253, 233, 216, 0.56) 100%)",
      "--glass-bg-strong": "linear-gradient(155deg, rgba(255, 255, 255, 0.84) 0%, rgba(255, 250, 246, 0.64) 54%, rgba(253, 236, 222, 0.74) 100%)",
      "--glass-border": "rgba(255, 255, 255, 0.9)",
      "--shadow-tint": "112, 46, 16",
      "--rim-tint": "204, 132, 92",
      "--pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 247, 240, 0.76) 100%)",
      "--pill-hover-bg": "rgba(255, 255, 255, 0.97)",
      "--pill-text": "#2e180d",
      "--nav-indicator-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 246, 238, 0.92))",
      "--control-pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 246, 239, 0.94) 100%)",
      "--surface-card": "rgba(255, 255, 255, 0.82)",
      "--surface-card-hover": "#ffffff",
      "--surface-chip": "rgba(253, 238, 226, 0.92)",
      "--surface-subtle": "rgba(249, 228, 212, 0.84)",
      "--theater-bar-bg": "rgba(255, 252, 249, 0.9)",
      "--mobile-header-bg": "rgba(255, 247, 241, 0.93)",
      "--mobile-drawer-bg": "linear-gradient(155deg, #ffffff 0%, #fffaf6 58%, #fdefe4 100%)",
      "--orb-a": "rgba(250, 192, 148, 0.7)",
      "--orb-b": "rgba(252, 214, 156, 0.62)",
      "--orb-c": "rgba(248, 178, 152, 0.56)",
      "--orb-exp": "rgba(250, 198, 152, 0.7)",
      "--orb-edu": "rgba(252, 212, 162, 0.68)",
      "--orb-skills": "rgba(248, 186, 146, 0.64)",
      "--orb-about": "rgba(250, 196, 166, 0.68)",
    },
  },
  {
    id: "emerald",
    label: "Emerald Mint",
    shortLabel: "Emerald",
    subtitle: "Crisp seafoam glass, jade & botanical emerald",
    isDark: false,
    swatches: ["#1e9e73", "#5fd4aa", "#11694b"],
    hueCenter: 160,
    bootCubeColors: ["#11694b", "#5cd1a8", "#1e9e73", "#178560", "#38b88c"],
    stage: {
      ambientColor: "#ebfff8",
      ambientIntensity: 0.35,
      hemiSky: "#ffffff",
      hemiGround: "#166e52",
      hemiIntensity: 0.58,
      keyColor: "#ffffff",
      fillColor: "#94ebd0",
      rimColor: "#b8f2e6",
      envLeft: "#b0f2dc",
      envRight: "#c7f5ec",
      envNegA: "#093024",
      envNegB: "#0d3d2e",
      ringOuter: "#8ccfb9",
      ringInner: "#aee0cf",
      bootPointLight: "#4ee0b2",
      bootShadow: "#12694c",
      heroShadow: "#0f5940",
      pearlHighlight: "#ebfff8",
    },
    itemPalettes: [
      { primary: "#1e9e73", deep: "#11694b", light: "#cbf5e6", glow: "#4cd9aa" },
      { primary: "#22968c", deep: "#12635c", light: "#ccf2ee", glow: "#52cfc4" },
      { primary: "#38a662", deep: "#1f703e", light: "#d4f5e0", glow: "#68d992" },
      { primary: "#1f8c9e", deep: "#125b69", light: "#cdeff5", glow: "#52c3d6" },
      { primary: "#2ca87f", deep: "#177354", light: "#d0f5e8", glow: "#5edeaf" },
    ],
    themeColorMeta: "#f6fffb",
    brandStops: ["#58cfa5", "#1e9e73", "#11694b"],
    cssVars: {
      "--page-bg-solid": "#f6fffb",
      "--page-bg-grad": "radial-gradient(circle at 20% 14%, #fafffd 0%, #e3f7ef 48%, #d2efe4 100%)",
      "--mobile-bg-grad": "linear-gradient(165deg, #fafffd 0%, #e4f7ef 52%, #d5f0e5 100%)",
      "--selection-bg": "rgba(30, 158, 115, 0.24)",
      "--ink": "#0e261e",
      "--ink-secondary": "#33594c",
      "--ink-muted": "#587d70",
      "--accent": "#16825d",
      "--accent-deep": "#0d5e42",
      "--hero-em-grad": "linear-gradient(120deg, #117553, #2eb888)",
      "--boot-enter-grad": "linear-gradient(125deg, #0d6144 0%, #1ca174 52%, #47cc9e 100%)",
      "--boot-enter-line": "#1ca174",
      "--boot-enter-glow": "rgba(22, 130, 93, 0.26)",
      "--cta-grad": "linear-gradient(135deg, #24ab7d, #137855)",
      "--cta-grad-hover": "linear-gradient(135deg, #2db889, #188761)",
      "--cta-shadow": "rgba(19, 120, 85, 0.28)",
      "--glass-bg": "linear-gradient(152deg, rgba(255, 255, 255, 0.72) 0%, rgba(244, 255, 250, 0.45) 52%, rgba(218, 245, 234, 0.56) 100%)",
      "--glass-bg-strong": "linear-gradient(155deg, rgba(255, 255, 255, 0.84) 0%, rgba(246, 255, 251, 0.64) 54%, rgba(224, 247, 238, 0.74) 100%)",
      "--glass-border": "rgba(255, 255, 255, 0.9)",
      "--shadow-tint": "16, 84, 60",
      "--rim-tint": "92, 176, 146",
      "--pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 253, 248, 0.76) 100%)",
      "--pill-hover-bg": "rgba(255, 255, 255, 0.97)",
      "--pill-text": "#102b22",
      "--nav-indicator-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(240, 252, 247, 0.92))",
      "--control-pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 253, 248, 0.94) 100%)",
      "--surface-card": "rgba(255, 255, 255, 0.82)",
      "--surface-card-hover": "#ffffff",
      "--surface-chip": "rgba(226, 247, 238, 0.92)",
      "--surface-subtle": "rgba(216, 242, 231, 0.84)",
      "--theater-bar-bg": "rgba(250, 255, 253, 0.9)",
      "--mobile-header-bg": "rgba(242, 253, 248, 0.93)",
      "--mobile-drawer-bg": "linear-gradient(155deg, #ffffff 0%, #f7fffc 58%, #e8f9f1 100%)",
      "--orb-a": "rgba(154, 232, 204, 0.68)",
      "--orb-b": "rgba(176, 236, 228, 0.62)",
      "--orb-c": "rgba(186, 240, 198, 0.58)",
      "--orb-exp": "rgba(156, 232, 212, 0.68)",
      "--orb-edu": "rgba(168, 236, 198, 0.68)",
      "--orb-skills": "rgba(152, 228, 224, 0.64)",
      "--orb-about": "rgba(170, 238, 210, 0.66)",
    },
  },
  {
    id: "sapphire",
    label: "WaveBird Ice",
    shortLabel: "Sapphire",
    subtitle: "Glacier sky-cobalt, arctic glass & sapphire crystal",
    isDark: false,
    swatches: ["#3378d6", "#74b0ff", "#1c4b94"],
    hueCenter: 214,
    bootCubeColors: ["#1d4d96", "#75b0fc", "#3378d6", "#2762b8", "#5092eb"],
    stage: {
      ambientColor: "#eef6ff",
      ambientIntensity: 0.35,
      hemiSky: "#ffffff",
      hemiGround: "#21539c",
      hemiIntensity: 0.58,
      keyColor: "#ffffff",
      fillColor: "#9ec6ff",
      rimColor: "#c2e6ff",
      envLeft: "#b8d8ff",
      envRight: "#ccebff",
      envNegA: "#0c2042",
      envNegB: "#122b57",
      ringOuter: "#94bae8",
      ringInner: "#b5d0f2",
      bootPointLight: "#66a8ff",
      bootShadow: "#1b4b91",
      heroShadow: "#163f7d",
      pearlHighlight: "#edf5ff",
    },
    itemPalettes: [
      { primary: "#3378d6", deep: "#1c4b94", light: "#d0e4fc", glow: "#68a6fa" },
      { primary: "#2990c9", deep: "#165d87", light: "#ceebfa", glow: "#5cbbed" },
      { primary: "#496ee0", deep: "#2946a3", light: "#d6dffb", glow: "#7b9bfa" },
      { primary: "#2d85bd", deep: "#185680", light: "#d0e8f7", glow: "#5fb2e6" },
      { primary: "#4482db", deep: "#24549c", light: "#d4e6fc", glow: "#75abfa" },
    ],
    themeColorMeta: "#f7fbff",
    brandStops: ["#70adfa", "#3378d6", "#1c4b94"],
    cssVars: {
      "--page-bg-solid": "#f7fbff",
      "--page-bg-grad": "radial-gradient(circle at 20% 14%, #fbfdff 0%, #e4effc 48%, #d4e4f9 100%)",
      "--mobile-bg-grad": "linear-gradient(165deg, #fbfdff 0%, #e6f0fc 52%, #d7e6f9 100%)",
      "--selection-bg": "rgba(51, 120, 214, 0.24)",
      "--ink": "#101d33",
      "--ink-secondary": "#384e70",
      "--ink-muted": "#5f7596",
      "--accent": "#2566bf",
      "--accent-deep": "#17488f",
      "--hero-em-grad": "linear-gradient(120deg, #1b56ab, #478be6)",
      "--boot-enter-grad": "linear-gradient(125deg, #174991 0%, #2e73d1 52%, #63a2f7 100%)",
      "--boot-enter-line": "#2e73d1",
      "--boot-enter-glow": "rgba(37, 102, 191, 0.26)",
      "--cta-grad": "linear-gradient(135deg, #3c82e0, #1f58a8)",
      "--cta-grad-hover": "linear-gradient(135deg, #498ee8, #2663b8)",
      "--cta-shadow": "rgba(31, 88, 168, 0.3)",
      "--glass-bg": "linear-gradient(152deg, rgba(255, 255, 255, 0.72) 0%, rgba(245, 250, 255, 0.46) 52%, rgba(221, 236, 253, 0.56) 100%)",
      "--glass-bg-strong": "linear-gradient(155deg, rgba(255, 255, 255, 0.84) 0%, rgba(247, 251, 255, 0.64) 54%, rgba(226, 239, 254, 0.74) 100%)",
      "--glass-border": "rgba(255, 255, 255, 0.9)",
      "--shadow-tint": "22, 58, 114",
      "--rim-tint": "102, 148, 212",
      "--pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.9) 0%, rgba(242, 248, 255, 0.76) 100%)",
      "--pill-hover-bg": "rgba(255, 255, 255, 0.97)",
      "--pill-text": "#122138",
      "--nav-indicator-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(241, 248, 255, 0.92))",
      "--control-pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(242, 248, 255, 0.94) 100%)",
      "--surface-card": "rgba(255, 255, 255, 0.82)",
      "--surface-card-hover": "#ffffff",
      "--surface-chip": "rgba(229, 240, 254, 0.92)",
      "--surface-subtle": "rgba(219, 234, 252, 0.84)",
      "--theater-bar-bg": "rgba(250, 253, 255, 0.9)",
      "--mobile-header-bg": "rgba(243, 249, 255, 0.93)",
      "--mobile-drawer-bg": "linear-gradient(155deg, #ffffff 0%, #f7fbff 58%, #eaf3fe 100%)",
      "--orb-a": "rgba(162, 204, 252, 0.7)",
      "--orb-b": "rgba(178, 226, 252, 0.62)",
      "--orb-c": "rgba(184, 198, 252, 0.58)",
      "--orb-exp": "rgba(166, 208, 252, 0.7)",
      "--orb-edu": "rgba(180, 202, 252, 0.68)",
      "--orb-skills": "rgba(162, 224, 248, 0.64)",
      "--orb-about": "rgba(176, 212, 252, 0.68)",
    },
  },
  {
    id: "rose",
    label: "Rose Quartz",
    shortLabel: "Rose",
    subtitle: "Sakura pearl glass, berry rose & plum crystal",
    isDark: false,
    swatches: ["#c9518b", "#f08ab9", "#8c2858"],
    hueCenter: 334,
    bootCubeColors: ["#8c2858", "#ed87b7", "#c9518b", "#b03d74", "#db6ca1"],
    stage: {
      ambientColor: "#fff0f7",
      ambientIntensity: 0.35,
      hemiSky: "#ffffff",
      hemiGround: "#8f2e5d",
      hemiIntensity: 0.58,
      keyColor: "#ffffff",
      fillColor: "#ffa8d2",
      rimColor: "#ffd1c7",
      envLeft: "#ffc2df",
      envRight: "#ffd9e8",
      envNegA: "#381025",
      envNegB: "#471530",
      ringOuter: "#dfa0bf",
      ringInner: "#ebc2d6",
      bootPointLight: "#f57cb4",
      bootShadow: "#8a2958",
      heroShadow: "#78214b",
      pearlHighlight: "#fff0f7",
    },
    itemPalettes: [
      { primary: "#c9518b", deep: "#8c2858", light: "#fad2e5", glow: "#f07eb5" },
      { primary: "#b8589e", deep: "#7d2e68", light: "#f5d4ec", glow: "#e084c7" },
      { primary: "#d15c74", deep: "#943146", light: "#fad5dd", glow: "#f2889e" },
      { primary: "#cf6896", deep: "#913961", light: "#fad7e7", glow: "#f294be" },
      { primary: "#ab568e", deep: "#732c5b", light: "#f3d4e9", glow: "#d683ba" },
    ],
    themeColorMeta: "#fff9fc",
    brandStops: ["#eb86b6", "#c9518b", "#8c2858"],
    cssVars: {
      "--page-bg-solid": "#fff9fc",
      "--page-bg-grad": "radial-gradient(circle at 20% 14%, #fffcfe 0%, #fbe7f1 48%, #f4d7e6 100%)",
      "--mobile-bg-grad": "linear-gradient(165deg, #fffcfe 0%, #fbe8f2 52%, #f4d9e7 100%)",
      "--selection-bg": "rgba(201, 81, 139, 0.24)",
      "--ink": "#29111e",
      "--ink-secondary": "#633c50",
      "--ink-muted": "#8a6076",
      "--accent": "#b53f78",
      "--accent-deep": "#852252",
      "--hero-em-grad": "linear-gradient(120deg, #a6336b, #db679e)",
      "--boot-enter-grad": "linear-gradient(125deg, #872353 0%, #c44983 52%, #eb7db0 100%)",
      "--boot-enter-line": "#c44983",
      "--boot-enter-glow": "rgba(181, 63, 120, 0.26)",
      "--cta-grad": "linear-gradient(135deg, #cf5791, #9c2f64)",
      "--cta-grad-hover": "linear-gradient(135deg, #db639d, #ab3870)",
      "--cta-shadow": "rgba(156, 47, 100, 0.3)",
      "--glass-bg": "linear-gradient(152deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 247, 251, 0.46) 52%, rgba(250, 226, 239, 0.56) 100%)",
      "--glass-bg-strong": "linear-gradient(155deg, rgba(255, 255, 255, 0.84) 0%, rgba(255, 249, 252, 0.64) 54%, rgba(251, 231, 242, 0.74) 100%)",
      "--glass-border": "rgba(255, 255, 255, 0.9)",
      "--shadow-tint": "104, 30, 68",
      "--rim-tint": "198, 114, 156",
      "--pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 244, 250, 0.76) 100%)",
      "--pill-hover-bg": "rgba(255, 255, 255, 0.97)",
      "--pill-text": "#2c1320",
      "--nav-indicator-bg": "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 243, 249, 0.92))",
      "--control-pill-bg": "linear-gradient(155deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 244, 250, 0.94) 100%)",
      "--surface-card": "rgba(255, 255, 255, 0.82)",
      "--surface-card-hover": "#ffffff",
      "--surface-chip": "rgba(252, 233, 243, 0.92)",
      "--surface-subtle": "rgba(248, 223, 237, 0.84)",
      "--theater-bar-bg": "rgba(255, 251, 253, 0.9)",
      "--mobile-header-bg": "rgba(255, 244, 250, 0.93)",
      "--mobile-drawer-bg": "linear-gradient(155deg, #ffffff 0%, #fff9fc 58%, #fcebf3 100%)",
      "--orb-a": "rgba(246, 182, 214, 0.7)",
      "--orb-b": "rgba(250, 202, 212, 0.62)",
      "--orb-c": "rgba(236, 186, 234, 0.58)",
      "--orb-exp": "rgba(246, 186, 218, 0.7)",
      "--orb-edu": "rgba(238, 186, 232, 0.68)",
      "--orb-skills": "rgba(248, 196, 208, 0.64)",
      "--orb-about": "rgba(244, 184, 222, 0.68)",
    },
  },
  {
    id: "midnight",
    label: "Jet Black BIOS",
    shortLabel: "Midnight",
    subtitle: "Midnight GameCube BIOS void & smoked crystal glass",
    isDark: true,
    swatches: ["#1a1433", "#9b78ff", "#4de0d6"],
    hueCenter: null,
    bootCubeColors: ["#4f32a8", "#b394ff", "#8f68f5", "#7650e0", "#a17ff7"],
    stage: {
      ambientColor: "#cfc2ff",
      ambientIntensity: 0.42,
      hemiSky: "#e8dfff",
      hemiGround: "#28195c",
      hemiIntensity: 0.68,
      keyColor: "#ffffff",
      fillColor: "#9d7aff",
      rimColor: "#5ce1e6",
      envLeft: "#9b78ff",
      envRight: "#66e0e8",
      envNegA: "#070510",
      envNegB: "#0c081c",
      ringOuter: "#6c52b5",
      ringInner: "#533c96",
      bootPointLight: "#9d78ff",
      bootShadow: "#05030a",
      heroShadow: "#05030a",
      pearlHighlight: "#f0ebff",
    },
    itemPalettes: [
      { primary: "#9c7aff", deep: "#6540d6", light: "#dfd4ff", glow: "#b59aff" },
      { primary: "#4cd4c0", deep: "#218f80", light: "#c8f7f0", glow: "#75ebd9" },
      { primary: "#6ea2ff", deep: "#3868c9", light: "#d4e4ff", glow: "#96bdff" },
      { primary: "#c982ff", deep: "#8b42c9", light: "#edd4ff", glow: "#dca6ff" },
      { primary: "#f082b4", deep: "#ad3e74", light: "#ffd6e8", glow: "#ff9ec8" },
    ],
    themeColorMeta: "#0d0a1a",
    brandStops: ["#b091ff", "#845ef0", "#5532bd"],
    cssVars: {
      "--page-bg-solid": "#0d0a1a",
      "--page-bg-grad": "radial-gradient(circle at 22% 16%, #1d1638 0%, #110d24 52%, #090714 100%)",
      "--mobile-bg-grad": "linear-gradient(165deg, #1b1436 0%, #110d24 52%, #090714 100%)",
      "--selection-bg": "rgba(156, 122, 255, 0.34)",
      "--ink": "#f5f2ff",
      "--ink-secondary": "#c7bddf",
      "--ink-muted": "#9386b2",
      "--accent": "#b396ff",
      "--accent-deep": "#d6c4ff",
      "--hero-em-grad": "linear-gradient(120deg, #b89cff, #78e3dc)",
      "--boot-enter-grad": "linear-gradient(125deg, #9875ff 0%, #bfa6ff 52%, #7ae8df 100%)",
      "--boot-enter-line": "#a98aff",
      "--boot-enter-glow": "rgba(152, 117, 255, 0.42)",
      "--cta-grad": "linear-gradient(135deg, #946ef7, #6840cf)",
      "--cta-grad-hover": "linear-gradient(135deg, #a380ff, #764ee0)",
      "--cta-shadow": "rgba(116, 74, 230, 0.45)",
      "--glass-bg": "linear-gradient(152deg, rgba(42, 33, 74, 0.72) 0%, rgba(26, 20, 48, 0.58) 52%, rgba(36, 27, 66, 0.68) 100%)",
      "--glass-bg-strong": "linear-gradient(155deg, rgba(44, 35, 78, 0.86) 0%, rgba(28, 22, 52, 0.78) 54%, rgba(38, 29, 68, 0.84) 100%)",
      "--glass-border": "rgba(196, 176, 255, 0.24)",
      "--shadow-tint": "4, 2, 12",
      "--rim-tint": "168, 142, 245",
      "--pill-bg": "linear-gradient(155deg, rgba(46, 36, 82, 0.88) 0%, rgba(28, 22, 52, 0.82) 100%)",
      "--pill-hover-bg": "rgba(64, 50, 112, 0.95)",
      "--pill-text": "#f5f2ff",
      "--nav-indicator-bg": "linear-gradient(180deg, rgba(148, 112, 246, 0.38), rgba(108, 74, 208, 0.28))",
      "--control-pill-bg": "linear-gradient(155deg, rgba(40, 31, 72, 0.94) 0%, rgba(26, 20, 48, 0.92) 100%)",
      "--surface-card": "rgba(255, 255, 255, 0.07)",
      "--surface-card-hover": "rgba(255, 255, 255, 0.13)",
      "--surface-chip": "rgba(158, 128, 255, 0.14)",
      "--surface-subtle": "rgba(255, 255, 255, 0.08)",
      "--theater-bar-bg": "rgba(22, 17, 42, 0.94)",
      "--mobile-header-bg": "rgba(19, 14, 36, 0.92)",
      "--mobile-drawer-bg": "linear-gradient(155deg, #211940 0%, #17112e 58%, #120d24 100%)",
      "--orb-a": "rgba(126, 86, 235, 0.34)",
      "--orb-b": "rgba(64, 190, 204, 0.24)",
      "--orb-c": "rgba(168, 86, 198, 0.24)",
      "--orb-exp": "rgba(104, 118, 240, 0.32)",
      "--orb-edu": "rgba(144, 92, 238, 0.32)",
      "--orb-skills": "rgba(64, 196, 188, 0.28)",
      "--orb-about": "rgba(182, 92, 208, 0.3)",
    },
  },
];

type Listener = (theme: PaletteTheme) => void;

const listeners = new Set<Listener>();
const colorTransformCache = new Map<string, string>();
let currentThemeId: PaletteThemeId = readStoredThemeId();

function readStoredThemeId(): PaletteThemeId {
  if (typeof window === "undefined") return "indigo";
  try {
    const saved = window.localStorage?.getItem(STORAGE_KEY);
    if (saved && PALETTE_THEMES.some((t) => t.id === saved)) {
      return saved as PaletteThemeId;
    }
  } catch {
    // Ignore storage errors
  }
  return "indigo";
}

export function getPaletteTheme(id: PaletteThemeId = currentThemeId): PaletteTheme {
  return PALETTE_THEMES.find((t) => t.id === id) ?? PALETTE_THEMES[0];
}

function buildFaviconDataUrl(stops: [string, string, string]): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><defs><linearGradient id="bg" x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="${stops[0]}"/><stop offset="52%" stop-color="${stops[1]}"/><stop offset="100%" stop-color="${stops[2]}"/></linearGradient><linearGradient id="sh" x1="32" y1="2" x2="32" y2="34" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.34"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></linearGradient><clipPath id="cp"><circle cx="32" cy="32" r="29"/></clipPath></defs><circle cx="32" cy="32" r="30" fill="url(#bg)"/><circle cx="32" cy="32" r="29" stroke="#ffffff" stroke-opacity="0.38" stroke-width="1.5"/><ellipse cx="32" cy="14" rx="24" ry="15" fill="url(#sh)" clip-path="url(#cp)"/><circle cx="29" cy="18" r="3.35" fill="#ffffff"/><path d="M29 26V40.4C29 45.2 25.8 48.2 21.2 48.2C19.8 48.2 18.6 47.9 17.6 47.4" stroke="#ffffff" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="42.5" cy="36.2" r="3.45" fill="#ffffff" fill-opacity="0.9"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function applyThemeToDom(theme: PaletteTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.palette = theme.id;
  root.style.colorScheme = theme.isDark ? "dark" : "light";
  Object.entries(theme.cssVars).forEach(([k, v]) => {
    root.style.setProperty(k, v);
  });
  root.style.setProperty("--brand-stop-1", theme.brandStops[0]);
  root.style.setProperty("--brand-stop-2", theme.brandStops[1]);
  root.style.setProperty("--brand-stop-3", theme.brandStops[2]);

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme.themeColorMeta;

  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (icon) {
    icon.href =
      theme.id === "indigo"
        ? `${import.meta.env.BASE_URL}favicon.svg`
        : buildFaviconDataUrl(theme.brandStops);
  }
}

export function initPaletteTheme(): void {
  currentThemeId = readStoredThemeId();
  applyThemeToDom(getPaletteTheme(currentThemeId));
}

export function setPaletteTheme(nextId: PaletteThemeId): PaletteTheme {
  const theme = getPaletteTheme(nextId);
  currentThemeId = theme.id;
  try {
    window.localStorage?.setItem(STORAGE_KEY, theme.id);
  } catch {
    // Ignore storage errors
  }
  applyThemeToDom(theme);
  for (const listener of listeners) {
    listener(theme);
  }
  return theme;
}

export function cyclePaletteTheme(): { theme: PaletteTheme; index: number } {
  const currIdx = PALETTE_THEMES.findIndex((t) => t.id === currentThemeId);
  const nextIdx = (currIdx + 1) % PALETTE_THEMES.length;
  const theme = setPaletteTheme(PALETTE_THEMES[nextIdx].id);
  return { theme, index: nextIdx };
}

export function usePaletteTheme(): {
  theme: PaletteTheme;
  themes: PaletteTheme[];
  setTheme: (id: PaletteThemeId) => void;
  cycleTheme: () => { theme: PaletteTheme; index: number };
} {
  const [theme, setThemeState] = useState<PaletteTheme>(() =>
    getPaletteTheme(currentThemeId),
  );

  useEffect(() => {
    applyThemeToDom(getPaletteTheme(currentThemeId));
    const listener: Listener = (next) => setThemeState(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    theme,
    themes: PALETTE_THEMES,
    setTheme: (id: PaletteThemeId) => {
      setPaletteTheme(id);
    },
    cycleTheme: cyclePaletteTheme,
  };
}

function hexToRgb01(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    return [r, g, b];
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return [h, s, l];
}

function hslToHex(hDeg: number, s: number, l: number): string {
  const h = (((hDeg % 360) + 360) % 360) / 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  const seg = Math.floor(h * 6);
  if (seg === 0) [r, g, b] = [c, x, 0];
  else if (seg === 1) [r, g, b] = [x, c, 0];
  else if (seg === 2) [r, g, b] = [0, c, x];
  else if (seg === 3) [r, g, b] = [0, x, c];
  else if (seg === 4) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v + m)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * O(1) memoized 3D crystal cube color harmonizer.
 * Preserves dark structural anchors and white catchlights while shifting hues
 * cleanly into the active palette's analogous jewel range.
 */
export function transformCubeColor(
  rawHex: string,
  theme: PaletteTheme,
): string {
  if (theme.id === "indigo") return rawHex;
  const cacheKey = `${theme.id}:${rawHex}`;
  const hit = colorTransformCache.get(cacheKey);
  if (hit) return hit;

  const rgb = hexToRgb01(rawHex);
  if (!rgb) return rawHex;
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  let result = rawHex;
  if (theme.id === "midnight") {
    // Boost dark structural voxels slightly so silhouettes gleam against dark BIOS space
    if (l < 0.34 && s > 0.1) {
      result = hslToHex(h, Math.min(1, s * 1.15), Math.min(0.46, l + 0.14));
    } else if (s > 0.12 && l < 0.85) {
      result = hslToHex(h, Math.min(1, s * 1.08), Math.min(0.88, l + 0.05));
    }
  } else if (theme.hueCenter !== null) {
    if (s < 0.06 || l > 0.95) {
      result = l > 0.96 ? "#ffffff" : hslToHex(theme.hueCenter, 0.25, l);
    } else {
      let delta = h - 262;
      while (delta > 180) delta -= 360;
      while (delta < -180) delta += 360;
      const nextHue = theme.hueCenter + delta * 0.24;
      const nextSat = Math.min(0.92, Math.max(0.28, s * 0.95 + 0.06));
      result = hslToHex(nextHue, nextSat, l);
    }
  }

  colorTransformCache.set(cacheKey, result);
  return result;
}
