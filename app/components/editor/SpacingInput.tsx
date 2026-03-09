"use client";

import { useState, useEffect } from "react";
import styles from "./editor.module.css";

const UNITS = ["px", "pt", "in", "em", "rem", "%"] as const;
type Unit = (typeof UNITS)[number];

/** Parse a CSS value like "10px", "0.5in", "12pt" into number + unit */
function parseValue(value: string): { num: string; unit: Unit } {
  if (!value || value === "0") return { num: value || "", unit: "px" };
  const match = value.match(/^(-?[\d.]+)\s*(px|pt|in|em|rem|%)$/);
  if (match) return { num: match[1], unit: match[2] as Unit };
  // If it's just a number with no unit, treat as px
  const numMatch = value.match(/^(-?[\d.]+)$/);
  if (numMatch) return { num: numMatch[1], unit: "px" };
  // Fallback — try to extract what we can
  return { num: value.replace(/[^-\d.]/g, ""), unit: "px" };
}

/** Combine number + unit back to CSS value */
function toCSS(num: string, unit: Unit): string {
  if (!num || num === "0") return "0";
  return `${num}${unit}`;
}

interface SpacingInputProps {
  value: string;
  onChange: (cssValue: string) => void;
  placeholder?: string;
  compact?: boolean; // For BoxModelEditor — hides unit selector, shows it on focus
}

export default function SpacingInput({
  value,
  onChange,
  placeholder = "0",
  compact = false,
}: SpacingInputProps) {
  const parsed = parseValue(value);
  const parsedPlaceholder = parseValue(placeholder);
  const [num, setNum] = useState(parsed.num);
  const [unit, setUnit] = useState<Unit>(parsed.unit);

  // Sync from props when value changes externally (e.g. undo)
  useEffect(() => {
    const p = parseValue(value);
    setNum(p.num);
    setUnit(p.unit);
  }, [value]);

  const handleNumChange = (newNum: string) => {
    setNum(newNum);
    onChange(toCSS(newNum, unit));
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
    if (num) {
      onChange(toCSS(num, newUnit));
    }
  };

  if (compact) {
    // Compact mode for BoxModelEditor — small number input with unit suffix
    return (
      <div className={styles.spacingCompact}>
        <input
          type="text"
          inputMode="decimal"
          className={styles.spacingCompactNum}
          value={num}
          placeholder={parsedPlaceholder.num || "0"}
          onChange={(e) => handleNumChange(e.target.value)}
        />
        <select
          className={styles.spacingCompactUnit}
          value={unit}
          onChange={(e) => handleUnitChange(e.target.value as Unit)}
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Full mode for sidebar panels
  return (
    <div className={styles.spacingFull}>
      <input
        type="text"
        inputMode="decimal"
        className={styles.spacingFullNum}
        value={num}
        placeholder={parsedPlaceholder.num || "0"}
        onChange={(e) => handleNumChange(e.target.value)}
      />
      <select
        className={styles.spacingFullUnit}
        value={unit}
        onChange={(e) => handleUnitChange(e.target.value as Unit)}
      >
        {UNITS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );
}
