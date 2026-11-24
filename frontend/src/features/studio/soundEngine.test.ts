import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { soundEngine } from "./soundEngine";

describe("SpatialSoundEngine", () => {
  beforeEach(() => {
    window.localStorage.clear();
    soundEngine.setMusicMuted(false);
    soundEngine.setSfxMuted(false);
  });

  afterEach(() => {
    soundEngine.setMusicMuted(false);
    soundEngine.setSfxMuted(false);
    vi.restoreAllMocks();
  });

  it("toggles Music and SFX mute states independently and persists both to localStorage", () => {
    const snapshots: Array<{ musicMuted: boolean; sfxMuted: boolean }> = [];
    const unsub = soundEngine.subscribe((s) =>
      snapshots.push({ musicMuted: s.musicMuted, sfxMuted: s.sfxMuted }),
    );

    expect(soundEngine.isMusicMuted()).toBe(false);
    expect(soundEngine.isSfxMuted()).toBe(false);

    expect(soundEngine.toggleMusicMute()).toBe(true);
    expect(soundEngine.isMusicMuted()).toBe(true);
    expect(soundEngine.isSfxMuted()).toBe(false);
    expect(window.localStorage.getItem("jake:music-muted")).toBe("1");
    expect(window.localStorage.getItem("jake:sfx-muted")).toBe("0");

    expect(soundEngine.toggleSfxMute()).toBe(true);
    expect(soundEngine.isMusicMuted()).toBe(true);
    expect(soundEngine.isSfxMuted()).toBe(true);
    expect(soundEngine.isMuted()).toBe(true);
    expect(window.localStorage.getItem("jake:sfx-muted")).toBe("1");

    expect(soundEngine.toggleMusicMute()).toBe(false);
    expect(soundEngine.isMusicMuted()).toBe(false);
    expect(soundEngine.isSfxMuted()).toBe(true);
    expect(window.localStorage.getItem("jake:music-muted")).toBe("0");

    expect(snapshots.length).toBeGreaterThanOrEqual(4);
    unsub();
  });

  it("silently no-ops UI, palette, and boot sounds while muted without throwing", () => {
    soundEngine.setMuted(true);
    expect(() => {
      soundEngine.startExperience(true);
      soundEngine.playBootIntro(true);
      soundEngine.playHover(0);
      soundEngine.playSelect(1);
      soundEngine.playSectionTransition(2);
      soundEngine.playCategoryFilter(1);
      soundEngine.playPaletteShift(2);
      soundEngine.playClose();
      soundEngine.playOpenTheater();
    }).not.toThrow();
  });
});
