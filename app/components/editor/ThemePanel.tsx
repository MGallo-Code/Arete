"use client";

import { useEditorRequired } from "../../contexts/EditorContext";
import { FONT_PRESETS } from "../../data/constants";
import BoxModelEditor from "./BoxModelEditor";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

const SIZE_PRESETS = ["8pt", "9pt", "10pt", "11pt", "12pt"];

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const TEXT_TRANSFORM_OPTIONS = ["none", "uppercase", "lowercase", "capitalize"] as const;

/** Parse a borderBottom shorthand like "2px solid #2563eb" into parts */
function parseBorder(value: string | undefined): { width: string; color: string } {
  if (!value) return { width: "", color: "#000000" };
  const parts = value.trim().split(/\s+/);
  const width = parts[0] ?? "";
  // Color is typically the last part
  const color = parts.find((p) => p.startsWith("#") || p.startsWith("rgb")) ?? "#000000";
  return { width, color };
}

export default function ThemePanel() {
  const { resume, dispatch, canUndo, canRedo } = useEditorRequired();
  const { theme, page } = resume.template;

  return (
    <div className={styles.panelSection}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Theme</div>
      </div>
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
          value={(theme.root.background as string) ?? "#ffffff"}
          onChange={(e) => dispatch({ type: "UPDATE_THEME_ROOT", style: { background: e.target.value } })}
        />
      </div>

      {/* Canvas */}
      <div className={styles.themeSectionTitle}>Canvas</div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Background color</label>
        <div className={styles.headingRow}>
          <input
            type="color"
            className={styles.colorInput}
            value={(theme.canvas.backgroundColor as string) ?? (theme.canvas.background as string) ?? "#ffffff"}
            onChange={(e) => dispatch({ type: "UPDATE_THEME_CANVAS", style: { backgroundColor: e.target.value } })}
          />
          {(theme.canvas.backgroundColor || theme.canvas.background) && (
            <button
              className={styles.clearBtn}
              title="Remove background color"
              onClick={() =>
                dispatch({
                  type: "UPDATE_THEME_CANVAS",
                  style: { backgroundColor: undefined, background: undefined },
                })
              }
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Links */}
      <div className={styles.themeSectionTitle}>Links</div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Link color</label>
        <div className={styles.headingRow}>
          <input
            type="color"
            className={styles.colorInput}
            value={theme.link.color ?? "#2563eb"}
            onChange={(e) => dispatch({ type: "UPDATE_THEME_LINK", style: { color: e.target.value } })}
          />
          {theme.link.color && (
            <button
              className={styles.clearBtn}
              title="Remove link color"
              onClick={() => dispatch({ type: "UPDATE_THEME_LINK", style: { color: undefined } })}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Headings */}
      <div className={styles.themeSectionTitle}>Headings</div>
      {TAGS.map((tag) => {
        const headingStyle = theme[tag];
        const border = parseBorder(headingStyle.borderBottom as string | undefined);
        const hasBorder = !!headingStyle.borderBottom;

        return (
          <div key={tag} className={styles.headingGroup}>
            {/* Row 1: tag + fontSize + color */}
            <div className={styles.headingRow}>
              <span className={styles.headingTag}>{tag}</span>
              <SpacingInput
                compact
                value={(headingStyle.fontSize as string) ?? ""}
                placeholder="0"
                onChange={(v) => dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { fontSize: v } })}
              />
              <input
                type="color"
                className={styles.colorInput}
                value={headingStyle.color ?? theme.root.color ?? "#000000"}
                onChange={(e) => dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { color: e.target.value } })}
              />
            </div>
            {/* Row 2: letterSpacing + textTransform */}
            <div className={styles.headingDetailRow}>
              <input
                type="text"
                className={styles.headingSmallInput}
                value={(headingStyle.letterSpacing as string) ?? ""}
                placeholder="spacing"
                title="Letter spacing (e.g. 0.05em)"
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_HEADING_STYLE",
                    tag,
                    style: { letterSpacing: e.target.value || undefined },
                  })
                }
              />
              <select
                className={styles.headingSmallSelect}
                value={(headingStyle.textTransform as string) ?? "none"}
                title="Text transform"
                onChange={(e) => {
                  const val = e.target.value;
                  dispatch({
                    type: "UPDATE_HEADING_STYLE",
                    tag,
                    style: { textTransform: val === "none" ? undefined : (val as "uppercase" | "lowercase" | "capitalize") },
                  });
                }}
              >
                {TEXT_TRANSFORM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {/* Row 3: borderBottom */}
            <div className={styles.headingDetailRow}>
              <input
                type="text"
                className={styles.headingSmallInput}
                value={border.width}
                placeholder="border"
                title="Border width (e.g. 2px, 1px)"
                onChange={(e) => {
                  const w = e.target.value;
                  if (!w) {
                    dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { borderBottom: undefined } });
                  } else {
                    dispatch({
                      type: "UPDATE_HEADING_STYLE",
                      tag,
                      style: { borderBottom: `${w} solid ${border.color}` },
                    });
                  }
                }}
              />
              <input
                type="color"
                className={styles.colorInput}
                value={border.color}
                title="Border color"
                onChange={(e) => {
                  const w = border.width || "1px";
                  dispatch({
                    type: "UPDATE_HEADING_STYLE",
                    tag,
                    style: { borderBottom: `${w} solid ${e.target.value}` },
                  });
                }}
              />
              {hasBorder && (
                <button
                  className={styles.clearBtn}
                  title="Remove border"
                  onClick={() => dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { borderBottom: undefined } })}
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        );
      })}

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
        <BoxModelEditor
          marginTop={page.margins.top}
          marginRight={page.margins.right}
          marginBottom={page.margins.bottom}
          marginLeft={page.margins.left}
          paddingTop=""
          paddingRight=""
          paddingBottom=""
          paddingLeft=""
          onMarginChange={(side, value) => {
            dispatch({ type: "UPDATE_PAGE_MARGINS", margins: { ...page.margins, [side]: value } });
          }}
          onPaddingChange={() => {}}
        />
      </div>

      {/* Undo/Redo indicator */}
      <div className={styles.themeSectionTitle}>Actions</div>
      <div className={styles.propBtnRow}>
        <button
          className={styles.propBtn}
          disabled={!canUndo}
          onClick={() => dispatch({ type: "UNDO" })}
        >
          Undo
        </button>
        <button
          className={styles.propBtn}
          disabled={!canRedo}
          onClick={() => dispatch({ type: "REDO" })}
        >
          Redo
        </button>
      </div>
    </div>
  );
}
