"use client";

import { useMemo } from "react";
import { useEditorRequired, findBlock, getBlockLabel } from "../../contexts/EditorContext";
import type { Style } from "../../models";
import { parseShorthand } from "../../utils/cssUtils";
import BorderControls from "./BorderControls";
import BoxModelEditor from "./BoxModelEditor";
import BoxShadowControls from "./BoxShadowControls";
import BulletStyleControls from "./BulletStyleControls";
import CollapsibleSection from "./CollapsibleSection";
import ColorControls from "./ColorControls";
import ImageControls from "./ImageControls";
import PropertyRow from "./PropertyRow";
import { IconHeader, IconColors, IconTypography, IconLayout, IconBoxModel, IconBorders, IconBoxShadow, IconImage, IconBullets } from "./SectionIcons";
import SpacingInput from "./SpacingInput";
import TypographyControls from "./TypographyControls";
import styles from "./editor.module.css";

export default function BlockStylePanel() {
  const { resume, selectedBlockId, dispatch } = useEditorRequired();
  const theme = resume.template.theme;

  const block = selectedBlockId ? findBlock(resume.blocks, selectedBlockId) : null;
  const style = block?.style ?? {};

  const defaults = useMemo(() => {
    const tag = block?.header?.tag;
    const themeStyle: Style | undefined = tag ? theme[tag] : undefined;
    if (!themeStyle) return {};

    const result: Record<string, string> = {};

    if (themeStyle.margin && typeof themeStyle.margin === "string") {
      const parsed = parseShorthand(themeStyle.margin as string);
      result.marginTop = parsed.top;
      result.marginRight = parsed.right;
      result.marginBottom = parsed.bottom;
      result.marginLeft = parsed.left;
    }
    if (themeStyle.padding && typeof themeStyle.padding === "string") {
      const parsed = parseShorthand(themeStyle.padding as string);
      result.paddingTop = parsed.top;
      result.paddingRight = parsed.right;
      result.paddingBottom = parsed.bottom;
      result.paddingLeft = parsed.left;
    }

    if (themeStyle.marginTop) result.marginTop = themeStyle.marginTop as string;
    if (themeStyle.marginRight) result.marginRight = themeStyle.marginRight as string;
    if (themeStyle.marginBottom) result.marginBottom = themeStyle.marginBottom as string;
    if (themeStyle.marginLeft) result.marginLeft = themeStyle.marginLeft as string;
    if (themeStyle.paddingTop) result.paddingTop = themeStyle.paddingTop as string;
    if (themeStyle.paddingRight) result.paddingRight = themeStyle.paddingRight as string;
    if (themeStyle.paddingBottom) result.paddingBottom = themeStyle.paddingBottom as string;
    if (themeStyle.paddingLeft) result.paddingLeft = themeStyle.paddingLeft as string;

    return result;
  }, [block?.header?.tag, theme]);

  if (!selectedBlockId || !block) return null;

  const updateStyle = (patch: Record<string, string | undefined>) => {
    dispatch({ type: "UPDATE_BLOCK_STYLE", blockId: selectedBlockId, style: patch });
  };

  const clearStyle = (key: string) => {
    const newStyle = { ...style };
    delete (newStyle as Record<string, unknown>)[key];
    dispatch({
      type: "SET_BLOCK_STYLE",
      blockId: selectedBlockId,
      style: Object.keys(newStyle).length > 0 ? newStyle : undefined,
    });
  };

  return (
    <div className={styles.selectionPanel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.selectionPanelTitle}>Block</div>
          <div className={styles.panelSubtitle}>{getBlockLabel(block)}</div>
        </div>
      </div>

      {/* Header controls */}
      <CollapsibleSection panelId="block" title="Header" icon={<IconHeader />}>
        {block.header ? (
          <div className={styles.propRow}>
            <label className={styles.propLabel}>Tag</label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <select
                className={styles.propSelect}
                value={block.header.tag}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_BLOCK_HEADER_TAG",
                    blockId: selectedBlockId,
                    tag: e.target.value as "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
                  })
                }
              >
                {(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>
              <button
                className={`${styles.propBtn} ${styles.propBtnDanger}`}
                onClick={() => dispatch({ type: "REMOVE_HEADER", blockId: selectedBlockId })}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.propRow}>
            <button
              className={styles.propBtn}
              onClick={() => dispatch({ type: "ADD_HEADER", blockId: selectedBlockId })}
            >
              + Add Header
            </button>
          </div>
        )}
      </CollapsibleSection>

      {/* Colors */}
      <CollapsibleSection panelId="block" title="Colors" icon={<IconColors />}>
        <ColorControls
          style={style}
          updateStyle={updateStyle}
          clearStyle={clearStyle}
          palette={theme.palette}
        />
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection panelId="block" title="Typography" icon={<IconTypography />}>
        <TypographyControls
          style={style}
          updateStyle={updateStyle}
          clearStyle={clearStyle}
        />
      </CollapsibleSection>

      {/* Layout */}
      <CollapsibleSection panelId="block" title="Layout" icon={<IconLayout />}>
        <PropertyRow label="Width">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleBtn} ${!style.width || style.width === "100%" ? styles.toggleActive : ""}`}
                onClick={() => updateStyle({ width: "100%" })}
              >
                Fill
              </button>
              <button
                className={`${styles.toggleBtn} ${style.width === "fit-content" ? styles.toggleActive : ""}`}
                onClick={() => updateStyle({ width: "fit-content" })}
              >
                Fit
              </button>
              <button
                className={`${styles.toggleBtn} ${style.width && style.width !== "100%" && style.width !== "fit-content" ? styles.toggleActive : ""}`}
                onClick={() => {
                  if (!style.width || style.width === "100%" || style.width === "fit-content") {
                    updateStyle({ width: "200px" });
                  }
                }}
              >
                Custom
              </button>
            </div>
          </div>
        </PropertyRow>
        {style.width && style.width !== "100%" && style.width !== "fit-content" && (
          <PropertyRow label="Custom width">
            <SpacingInput
              value={(style.width as string) ?? ""}
              placeholder="200px"
              onChange={(v) => updateStyle({ width: v })}
            />
          </PropertyRow>
        )}
        <PropertyRow label="Alignment">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleBtn} ${!style.alignSelf || style.alignSelf === "flex-start" ? styles.toggleActive : ""}`}
                onClick={() => updateStyle({ alignSelf: "flex-start" })}
                title="Left"
              >
                L
              </button>
              <button
                className={`${styles.toggleBtn} ${style.alignSelf === "center" ? styles.toggleActive : ""}`}
                onClick={() => updateStyle({ alignSelf: "center" })}
                title="Center"
              >
                C
              </button>
              <button
                className={`${styles.toggleBtn} ${style.alignSelf === "flex-end" ? styles.toggleActive : ""}`}
                onClick={() => updateStyle({ alignSelf: "flex-end" })}
                title="Right"
              >
                R
              </button>
            </div>
            {(style.width || style.alignSelf) && (
              <button
                className={styles.clearBtn}
                onClick={() => {
                  clearStyle("width");
                  clearStyle("alignSelf");
                }}
                title="Reset layout"
              >
                &times;
              </button>
            )}
          </div>
        </PropertyRow>
      </CollapsibleSection>

      {/* Box Model */}
      <CollapsibleSection panelId="block" title="Box Model" icon={<IconBoxModel />}>
        <BoxModelEditor
          marginTop={(style.marginTop as string) ?? ""}
          marginRight={(style.marginRight as string) ?? ""}
          marginBottom={(style.marginBottom as string) ?? ""}
          marginLeft={(style.marginLeft as string) ?? ""}
          paddingTop={(style.paddingTop as string) ?? ""}
          paddingRight={(style.paddingRight as string) ?? ""}
          paddingBottom={(style.paddingBottom as string) ?? ""}
          paddingLeft={(style.paddingLeft as string) ?? ""}
          defaultMarginTop={defaults.marginTop}
          defaultMarginRight={defaults.marginRight}
          defaultMarginBottom={defaults.marginBottom}
          defaultMarginLeft={defaults.marginLeft}
          defaultPaddingTop={defaults.paddingTop}
          defaultPaddingRight={defaults.paddingRight}
          defaultPaddingBottom={defaults.paddingBottom}
          defaultPaddingLeft={defaults.paddingLeft}
          onMarginChange={(side, value) => {
            const key = `margin${side[0].toUpperCase()}${side.slice(1)}`;
            updateStyle({ [key]: value });
          }}
          onPaddingChange={(side, value) => {
            const key = `padding${side[0].toUpperCase()}${side.slice(1)}`;
            updateStyle({ [key]: value });
          }}
        />
      </CollapsibleSection>

      {/* Borders */}
      <CollapsibleSection panelId="block" title="Borders" icon={<IconBorders />}>
        <BorderControls style={style} updateStyle={updateStyle} clearStyle={clearStyle} />
      </CollapsibleSection>

      {/* Box Shadow */}
      <CollapsibleSection panelId="block" title="Box Shadow" icon={<IconBoxShadow />}>
        <BoxShadowControls style={style} updateStyle={updateStyle} clearStyle={clearStyle} />
        {/* Opacity */}
        <PropertyRow label="Opacity">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="range"
              min={0}
              max={100}
              value={style.opacity != null ? Math.round(Number(style.opacity) * 100) : 100}
              onChange={(e) => updateStyle({ opacity: String(Number(e.target.value) / 100) })}
              style={{ flex: 1 }}
            />
            <input
              type="number"
              className={styles.propInput}
              style={{ width: 52 }}
              min={0}
              max={100}
              value={style.opacity != null ? Math.round(Number(style.opacity) * 100) : 100}
              onChange={(e) => {
                const v = Math.max(0, Math.min(100, Number(e.target.value)));
                updateStyle({ opacity: String(v / 100) });
              }}
            />
            <span className={styles.inheritLabel}>%</span>
            {style.opacity != null && (
              <button className={styles.clearBtn} onClick={() => clearStyle("opacity")} title="Clear">&times;</button>
            )}
          </div>
        </PropertyRow>
      </CollapsibleSection>

      {/* Content-specific — Image */}
      {block.content.type === "image" && (
        <CollapsibleSection panelId="block" title="Image" icon={<IconImage />}>
          <ImageControls blockId={selectedBlockId} content={block.content} dispatch={dispatch} />
        </CollapsibleSection>
      )}

      {/* Content-specific — Bullet styles */}
      {block.content.type === "bullets" && (
        <CollapsibleSection panelId="block" title="Bullet Styles" icon={<IconBullets />}>
          <BulletStyleControls
            blockId={selectedBlockId}
            content={block.content}
            effectiveLevels={block.content.levels ?? theme.bullets ?? []}
            dispatch={dispatch}
          />
        </CollapsibleSection>
      )}
    </div>
  );
}
