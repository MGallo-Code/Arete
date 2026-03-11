"use client";

import { useState, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import styles from "./editor.module.css";

const DEFAULT_UNITS = ["px", "pt", "in", "em", "rem", "%"] as const;
type Unit = string;

/** Parse a CSS value like "10px", "0.5in", "12pt", "auto", "1.5" into parts */
function parseValue(
  value: string,
  allowUnitless: boolean,
  allowKeywords: string[],
  units: string[],
): { num: string; unit: Unit; isKeyword: boolean } {
  if (!value) return { num: "", unit: "px", isKeyword: false };

  // Check for keyword values first
  const lower = value.trim().toLowerCase();
  if (allowKeywords.includes(lower)) {
    return { num: lower, unit: "", isKeyword: true };
  }

  if (value === "0") return { num: "0", unit: allowUnitless ? "" : "px", isKeyword: false };

  // Try to match number + unit
  const unitPattern = units.map((u) => u.replace("%", "\\%")).join("|");
  const regex = new RegExp(`^(-?[\\d.]+)\\s*(${unitPattern})$`);
  const match = value.match(regex);
  if (match) return { num: match[1], unit: match[2], isKeyword: false };

  // If it's just a number with no unit
  const numMatch = value.match(/^(-?[\d.]+)$/);
  if (numMatch) {
    return { num: numMatch[1], unit: allowUnitless ? "" : "px", isKeyword: false };
  }

  // Fallback — try to extract what we can
  return { num: value.replace(/[^-\d.]/g, ""), unit: "px", isKeyword: false };
}

/** Combine number + unit back to CSS value */
function toCSS(num: string, unit: Unit, allowUnitless: boolean): string {
  if (!num) return "";
  if (num === "0" && !unit && !allowUnitless) return "0px";
  if (num === "0") return unit ? `0${unit}` : "0";
  return unit ? `${num}${unit}` : num;
}

/** Get default step size for a given unit */
function getStepForUnit(unit: string, customStep?: number): number {
  if (customStep !== undefined) return customStep;
  switch (unit) {
    case "em":
    case "rem":
    case "":
      return 0.1;
    case "%":
      return 10;
    default:
      return 1;
  }
}

/** Try to evaluate inline math like "+2", "-3", "*1.5" */
function evaluateMath(input: string, currentValue: number): number | null {
  const match = input.match(/^([+\-*/])(-?[\d.]+)$/);
  if (!match) return null;
  const op = match[1];
  const operand = parseFloat(match[2]);
  if (isNaN(operand)) return null;
  switch (op) {
    case "+":
      return currentValue + operand;
    case "-":
      return currentValue - operand;
    case "*":
      return currentValue * operand;
    case "/":
      return operand === 0 ? null : currentValue / operand;
    default:
      return null;
  }
}

interface UnitInputProps {
  value: string;
  onChange: (cssValue: string) => void;
  placeholder?: string;
  compact?: boolean;
  label?: string;
  units?: string[];
  allowUnitless?: boolean;
  allowKeywords?: string[];
  step?: number;
  showSteppers?: "hover" | "always" | "never";
}

export default function UnitInput({
  value,
  onChange,
  placeholder = "0",
  compact = false,
  label,
  units = DEFAULT_UNITS as unknown as string[],
  allowUnitless = false,
  allowKeywords = [],
  step: customStep,
  showSteppers = "hover",
}: UnitInputProps) {
  const parsed = parseValue(value, allowUnitless, allowKeywords, units);
  const parsedPlaceholder = parseValue(placeholder, allowUnitless, allowKeywords, units);
  const [num, setNum] = useState(() => parsed.num);
  const [unit, setUnit] = useState<Unit>(() => parsed.unit);
  const [isKeyword, setIsKeyword] = useState(() => parsed.isKeyword);
  const [prevValue, setPrevValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [unitMenuOpen, setUnitMenuOpen] = useState(false);
  const unitMenuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /** A valid numeric string: optional minus, digits, optional decimal + digits */
  const isValidNum = (v: string) => v === "" || /^-?\d+(\.\d+)?$/.test(v);

  // Sync from props when value changes externally (e.g. undo)
  if (value !== prevValue) {
    setPrevValue(value);
    const p = parseValue(value, allowUnitless, allowKeywords, units);
    setNum(p.num);
    setUnit(p.unit);
    setIsKeyword(p.isKeyword);
    setError(null);
  }

  const handleNumChange = (newNum: string) => {
    setNum(newNum);
    if (error) setError(null);
  };

  const validate = useCallback(() => {
    // Handle keyword values
    const lower = num.trim().toLowerCase();
    if (allowKeywords.includes(lower)) {
      setError(null);
      setIsKeyword(true);
      onChange(lower);
      return;
    }
    setIsKeyword(false);

    // Handle inline math
    if (/^[+\-*/]/.test(num)) {
      const currentNum = parseFloat(parseValue(value, allowUnitless, allowKeywords, units).num) || 0;
      const result = evaluateMath(num, currentNum);
      if (result !== null) {
        const isSmallUnit = unit === "em" || unit === "rem" || (allowUnitless && !unit);
        const formatted = isSmallUnit
          ? result.toFixed(2).replace(/0$/, "").replace(/\.$/, "")
          : String(Math.round(result));
        setNum(formatted);
        setError(null);
        onChange(toCSS(formatted, unit, allowUnitless));
        return;
      } else {
        setError("Invalid math expression");
        return;
      }
    }

    if (!isValidNum(num)) {
      setError("Invalid number");
      return;
    }
    setError(null);
    onChange(toCSS(num, unit, allowUnitless));
  }, [num, unit, value, allowUnitless, allowKeywords, units, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.target as HTMLElement).blur();
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (isKeyword) return;
      e.preventDefault();
      const base = parseFloat(num) || 0;
      const stepSize = getStepForUnit(unit, customStep);
      const multiplier = e.shiftKey ? 10 : 1;
      const delta = (e.key === "ArrowUp" ? 1 : -1) * stepSize * multiplier;
      const isSmallUnit = unit === "em" || unit === "rem" || (allowUnitless && !unit);
      const next = isSmallUnit
        ? (base + delta).toFixed(2).replace(/0$/, "").replace(/\.$/, "")
        : String(Math.round(base + delta));
      setNum(next);
      setError(null);
      onChange(toCSS(next, unit, allowUnitless));
    }
  };

  const handleStep = (direction: 1 | -1) => {
    if (isKeyword) return;
    const base = parseFloat(num) || 0;
    const stepSize = getStepForUnit(unit, customStep);
    const delta = direction * stepSize;
    const isSmallUnit = unit === "em" || unit === "rem" || (allowUnitless && !unit);
    const next = isSmallUnit
      ? (base + delta).toFixed(2).replace(/0$/, "").replace(/\.$/, "")
      : String(Math.round(base + delta));
    setNum(next);
    setError(null);
    onChange(toCSS(next, unit, allowUnitless));
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    setUnitMenuOpen(false);
    if (num && isValidNum(num)) {
      setError(null);
      onChange(toCSS(num, newUnit, allowUnitless));
    }
  };

  // Close unit menu on outside click
  const handleUnitMenuBlur = useCallback(() => {
    // Small delay to allow clicks inside the menu to register
    setTimeout(() => {
      setUnitMenuOpen(false);
    }, 150);
  }, []);

  const unitChoices = allowUnitless ? ["", ...units] : units;
  const displayUnit = isKeyword ? "" : (unit || (allowUnitless ? "—" : "px"));

  if (compact) {
    return (
      <div
        ref={containerRef}
        className={`${styles.unitInputCompact} ${showSteppers === "always" ? styles.unitInputSteppersAlways : ""}`}
      >
        <input
          type="text"
          inputMode={isKeyword ? "text" : "decimal"}
          className={`${styles.spacingCompactNum}${error ? ` ${styles.unitInputFieldError}` : ""}`}
          value={num}
          placeholder={parsedPlaceholder.num || "0"}
          onChange={(e) => handleNumChange(e.target.value)}
          onBlur={validate}
          onKeyDown={handleKeyDown}
          {...(label ? { "aria-label": label } : {})}
        />
        {showSteppers !== "never" && !isKeyword && (
          <div className={`${styles.unitInputSteppers} ${showSteppers === "always" ? styles.unitInputSteppersVisible : ""}`}>
            <button
              type="button"
              className={styles.unitInputStepUp}
              onClick={() => handleStep(1)}
              onMouseDown={(e) => e.preventDefault()}
              tabIndex={-1}
              aria-label="Increase"
            >
              <ChevronUp size={10} />
            </button>
            <button
              type="button"
              className={styles.unitInputStepDown}
              onClick={() => handleStep(-1)}
              onMouseDown={(e) => e.preventDefault()}
              tabIndex={-1}
              aria-label="Decrease"
            >
              <ChevronDown size={10} />
            </button>
          </div>
        )}
        {!isKeyword && (
          <button
            type="button"
            className={styles.unitInputUnitBtn}
            onClick={() => setUnitMenuOpen(!unitMenuOpen)}
            onBlur={handleUnitMenuBlur}
            tabIndex={-1}
            aria-label="Change unit"
          >
            {displayUnit}
          </button>
        )}
        {unitMenuOpen && (
          <div className={styles.unitInputDropdown}>
            {unitChoices.map((u) => (
              <button
                key={u || "__unitless"}
                type="button"
                className={`${styles.unitInputDropdownItem} ${u === unit ? styles.unitInputDropdownItemActive : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleUnitChange(u);
                }}
              >
                {u || "—"}
              </button>
            ))}
          </div>
        )}
        {error && <div className={styles.unitInputError}>{error}</div>}
      </div>
    );
  }

  // Full mode for sidebar panels
  return (
    <div
      ref={containerRef}
      className={`${styles.unitInput} ${showSteppers === "always" ? styles.unitInputSteppersAlways : ""}`}
    >
      <input
        type="text"
        inputMode={isKeyword ? "text" : "decimal"}
        className={`${styles.unitInputField}${error ? ` ${styles.unitInputFieldError}` : ""}`}
        value={num}
        placeholder={parsedPlaceholder.num || "0"}
        onChange={(e) => handleNumChange(e.target.value)}
        onBlur={validate}
        onKeyDown={handleKeyDown}
        {...(label ? { "aria-label": label } : {})}
      />
      {showSteppers !== "never" && !isKeyword && (
        <div className={`${styles.unitInputSteppers} ${showSteppers === "always" ? styles.unitInputSteppersVisible : ""}`}>
          <button
            type="button"
            className={styles.unitInputStepUp}
            onClick={() => handleStep(1)}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex={-1}
            aria-label="Increase"
          >
            <ChevronUp size={10} />
          </button>
          <button
            type="button"
            className={styles.unitInputStepDown}
            onClick={() => handleStep(-1)}
            onMouseDown={(e) => e.preventDefault()}
            tabIndex={-1}
            aria-label="Decrease"
          >
            <ChevronDown size={10} />
          </button>
        </div>
      )}
      {!isKeyword && (
        <button
          type="button"
          className={styles.unitInputUnitBtnFull}
          onClick={() => setUnitMenuOpen(!unitMenuOpen)}
          onBlur={handleUnitMenuBlur}
          tabIndex={-1}
          aria-label="Change unit"
        >
          {displayUnit}
        </button>
      )}
      {unitMenuOpen && (
        <div className={styles.unitInputDropdown}>
          {unitChoices.map((u) => (
            <button
              key={u || "__unitless"}
              type="button"
              className={`${styles.unitInputDropdownItem} ${u === unit ? styles.unitInputDropdownItemActive : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleUnitChange(u);
              }}
            >
              {u || "—"}
            </button>
          ))}
        </div>
      )}
      {error && <div className={styles.unitInputError}>{error}</div>}
    </div>
  );
}
