import { useEffect, useRef, useState } from "react";
import {
  PALETTE_THEMES,
  type PaletteTheme,
  type PaletteThemeId,
} from "./paletteThemes";
import { soundEngine } from "./soundEngine";

type PalettePickerControlProps = {
  theme: PaletteTheme;
  onSelectTheme: (id: PaletteThemeId) => void;
  compact?: boolean;
};

export default function PalettePickerControl({
  theme,
  onSelectTheme,
  compact = false,
}: PalettePickerControlProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  const handlePick = (id: PaletteThemeId, index: number) => {
    soundEngine.playPaletteShift(index);
    onSelectTheme(id);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="spatial-palette-wrap">
      <button
        type="button"
        id={compact ? "mobile-palette-trigger" : "desktop-palette-trigger"}
        data-palette-control="trigger"
        className={`spatial-audio-btn spatial-palette-btn ${open ? "is-open" : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Change color palette (current: ${theme.label})`}
        title={`Color palette: ${theme.label} (press P to cycle)`}
        onClick={() => {
          soundEngine.playHover(2);
          setOpen((prev) => !prev);
        }}
      >
        <span
          className="spatial-palette-swatch-ring"
          style={{
            background: `linear-gradient(135deg, ${theme.swatches[1]} 0%, ${theme.swatches[0]} 55%, ${theme.swatches[2]} 100%)`,
          }}
          aria-hidden="true"
        />
        {!compact && (
          <span className="spatial-audio-btn__label">Palette</span>
        )}
      </button>

      {open && (
        <div
          className={`spatial-palette-menu ${compact ? "is-compact" : ""}`}
          role="menu"
          aria-label="Color palettes"
        >
          <div className="spatial-palette-menu__header">
            <span>Color Palette</span>
            <kbd>P</kbd>
          </div>
          {PALETTE_THEMES.map((candidate, idx) => {
            const active = candidate.id === theme.id;
            return (
              <button
                key={candidate.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                data-palette-option={candidate.id}
                className={`spatial-palette-option ${active ? "is-active" : ""}`}
                onClick={() => handlePick(candidate.id, idx)}
              >
                <span className="spatial-palette-option__dots" aria-hidden="true">
                  <i style={{ backgroundColor: candidate.swatches[0] }} />
                  <i style={{ backgroundColor: candidate.swatches[1] }} />
                  <i style={{ backgroundColor: candidate.swatches[2] }} />
                </span>
                <span className="spatial-palette-option__text">
                  <strong>{candidate.label}</strong>
                  <small>{candidate.subtitle}</small>
                </span>
                {active && (
                  <span
                    className="spatial-palette-option__check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
