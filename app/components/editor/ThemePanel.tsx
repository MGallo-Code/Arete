"use client";

import { useEditorRequired } from "../../contexts/EditorContext";
import styles from "./editor.module.css";

const FONT_PRESETS = [
  { label: "Georgia (serif)", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Inter (sans-serif)", value: "Inter, Helvetica, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "DM Sans", value: "'DM Sans', Helvetica, sans-serif" },
  { label: "System UI", value: "system-ui, sans-serif" },
];

const SIZE_PRESETS = ["8pt", "9pt", "10pt", "11pt", "12pt"];

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export default function ThemePanel() {
  const { resume, dispatch } = useEditorRequired();
  const { theme, page } = resume.template;

  return (
    <div className={styles.themePanel}>
      {/* Font */}
      <div className={styles.themeSectionTitle}>Typography</div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font family</label>
        <select
          className={styles.propSelect}
          value={theme.root.fontFamily ?? ""}
          onChange={(e) => dispatch({ type: "UPDATE_THEME_ROOT", style: { fontFamily: e.target.value } })}
        >
          {FONT_PRESETS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Base font size</label>
        <select
          className={styles.propSelect}
          value={theme.root.fontSize ?? "10pt"}
          onChange={(e) => dispatch({ type: "UPDATE_THEME_ROOT", style: { fontSize: e.target.value } })}
        >
          {SIZE_PRESETS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Text color</label>
        <input
          type="color"
          className={styles.colorInput}
          value={theme.root.color ?? "#000000"}
          onChange={(e) => dispatch({ type: "UPDATE_THEME_ROOT", style: { color: e.target.value } })}
        />
      </div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Background</label>
        <input
          type="color"
          className={styles.colorInput}
          value={theme.root.background as string ?? "#ffffff"}
          onChange={(e) => dispatch({ type: "UPDATE_THEME_ROOT", style: { background: e.target.value } })}
        />
      </div>

      {/* Headings */}
      <div className={styles.themeSectionTitle}>Headings</div>
      {TAGS.map((tag) => (
        <div key={tag} className={styles.headingRow}>
          <span className={styles.headingTag}>{tag}</span>
          <input
            className={styles.propInput}
            style={{ width: 50 }}
            value={theme[tag].fontSize ?? ""}
            placeholder="size"
            onChange={(e) => dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { fontSize: e.target.value } })}
          />
          <input
            type="color"
            className={styles.colorInput}
            value={theme[tag].color ?? theme.root.color ?? "#000000"}
            onChange={(e) => dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { color: e.target.value } })}
          />
        </div>
      ))}

      {/* Page */}
      <div className={styles.themeSectionTitle}>Page</div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Size</label>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleBtn} ${page.size === "letter" ? styles.toggleActive : ""}`}
            onClick={() => dispatch({ type: "UPDATE_PAGE_SIZE", size: "letter" })}
          >
            Letter
          </button>
          <button
            className={`${styles.toggleBtn} ${page.size === "a4" ? styles.toggleActive : ""}`}
            onClick={() => dispatch({ type: "UPDATE_PAGE_SIZE", size: "a4" })}
          >
            A4
          </button>
        </div>
      </div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Margins</label>
        <div className={styles.marginGrid}>
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <div key={side} className={styles.marginField}>
              <span className={styles.marginLabel}>{side[0].toUpperCase()}</span>
              <input
                className={styles.propInput}
                style={{ width: 52 }}
                value={page.margins[side]}
                onChange={(e) =>
                  dispatch({ type: "UPDATE_PAGE_MARGINS", margins: { ...page.margins, [side]: e.target.value } })
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Undo/Redo indicator */}
      <div className={styles.themeSectionTitle}>Actions</div>
      <div className={styles.propBtnRow}>
        <button
          className={styles.propBtn}
          disabled={!useEditorRequired().canUndo}
          onClick={() => dispatch({ type: "UNDO" })}
        >
          Undo
        </button>
        <button
          className={styles.propBtn}
          disabled={!useEditorRequired().canRedo}
          onClick={() => dispatch({ type: "REDO" })}
        >
          Redo
        </button>
      </div>
    </div>
  );
}
