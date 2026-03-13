"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
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
import { IconHeader, IconContent, IconColors, IconTypography, IconLayout, IconBorders, IconBoxShadow, IconImage, IconBullets } from "./SectionIcons";
import UnitInput from "./UnitInput";
import TypographyControls from "./TypographyControls";
import styles from "./editor.module.css";

export default function BlockStylePanel() {
  const { resume, selectedBlockId, selectedPath, dispatch } = useEditorRequired();
  const theme = resume.template.theme;

  const block = selectedBlockId ? findBlock(resume.blocks, selectedBlockId) : null;
  const style = block?.style ?? {};

  const defaults = useMemo(() => {
    const result: Record<string, string> = {};
    const root = theme.root ?? {};
    const tag = block?.header?.tag;
    const tagStyle: Style | undefined = tag ? theme[tag] : undefined;

    // Typography: only from theme.root (which cascades to the block div).
    // theme[tag] styles apply to the heading element directly — showing them
    // as block-level defaults is misleading because relative units like em
    // resolve against different font sizes at different DOM levels.
    const typographyKeys = [
      "fontFamily", "fontSize", "lineHeight", "fontWeight",
      "fontStyle", "letterSpacing", "textAlign", "textTransform", "textDecoration",
    ] as const;
    for (const key of typographyKeys) {
      const val = root[key] as string | undefined;
      if (val) result[key] = val;
    }

    // textDecoration: walk ancestor blocks to find inherited value.
    // CSS text-decoration doesn't inherit normally, so we implement our own chain.
    for (let i = selectedPath.length - 2; i >= 0; i--) {
      const ancestor = findBlock(resume.blocks, selectedPath[i]);
      if (ancestor?.style?.textDecoration) {
        result.textDecoration = ancestor.style.textDecoration as string;
        break;
      }
    }

    // Spacing: from tag style only
    const spacingSource = tagStyle ?? {};
    if (spacingSource.margin && typeof spacingSource.margin === "string") {
      const parsed = parseShorthand(spacingSource.margin as string);
      result.marginTop = parsed.top;
      result.marginRight = parsed.right;
      result.marginBottom = parsed.bottom;
      result.marginLeft = parsed.left;
    }
    if (spacingSource.padding && typeof spacingSource.padding === "string") {
      const parsed = parseShorthand(spacingSource.padding as string);
      result.paddingTop = parsed.top;
      result.paddingRight = parsed.right;
      result.paddingBottom = parsed.bottom;
      result.paddingLeft = parsed.left;
    }

    if (spacingSource.marginTop) result.marginTop = spacingSource.marginTop as string;
    if (spacingSource.marginRight) result.marginRight = spacingSource.marginRight as string;
    if (spacingSource.marginBottom) result.marginBottom = spacingSource.marginBottom as string;
    if (spacingSource.marginLeft) result.marginLeft = spacingSource.marginLeft as string;
    if (spacingSource.paddingTop) result.paddingTop = spacingSource.paddingTop as string;
    if (spacingSource.paddingRight) result.paddingRight = spacingSource.paddingRight as string;
    if (spacingSource.paddingBottom) result.paddingBottom = spacingSource.paddingBottom as string;
    if (spacingSource.paddingLeft) result.paddingLeft = spacingSource.paddingLeft as string;

    return result;
  }, [block?.header?.tag, theme, selectedPath, resume.blocks]);

  if (!selectedBlockId || !block) return null;

  const updateStyle = (patch: Record<string, string | undefined>) => {
    dispatch({ type: "UPDATE_BLOCK_STYLE", blockId: selectedBlockId, style: patch });
  };

  const clearStyle = (...keys: string[]) => {
    const newStyle = { ...style };
    for (const key of keys) delete (newStyle as Record<string, unknown>)[key];
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

      {/* Content type */}
      {block.content.type !== "blocks" && (
        <CollapsibleSection panelId="block" title="Content" icon={<IconContent />}>
          <div className={styles.propRow}>
            <label className={styles.propLabel}>Type</label>
            <div className={styles.toggleGroup}>
              {(["text", "bullets", "image"] as const).map((t) => (
                <button
                  key={t}
                  className={`${styles.toggleBtn} ${block.content.type === t ? styles.toggleActive : ""}`}
                  onClick={() => {
                    if (block.content.type !== t) {
                      dispatch({ type: "CHANGE_CONTENT_TYPE", blockId: selectedBlockId, newType: t });
                    }
                  }}
                >
                  {t === "text" ? "Text" : t === "bullets" ? "Bullets" : "Image"}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleSection>
      )}

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
          defaults={defaults}
        />
      </CollapsibleSection>

      {/* Layout */}
      <CollapsibleSection panelId="block" title="Layout" icon={<IconLayout />}>
        <div className={styles.propertyPair}>
          <div>
            <div className={styles.propertyPairLabel}>Width</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleBtn} ${!style.width || style.width === "100%" ? styles.toggleActive : ""}`}
                  onClick={() => {
                    if (style.width && style.width !== "100%") updateStyle({ width: "100%" });
                  }}
                >
                  Fill
                </button>
                <button
                  className={`${styles.toggleBtn} ${style.width === "fit-content" ? styles.toggleActive : ""}`}
                  onClick={() => {
                    if (style.width !== "fit-content") updateStyle({ width: "fit-content" });
                  }}
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
          </div>
          <div>
            <div className={styles.propertyPairLabel}>Alignment</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleBtn} ${!style.alignSelf || style.alignSelf === "flex-start" ? styles.toggleActive : ""}`}
                  onClick={() => {
                    if (style.alignSelf && style.alignSelf !== "flex-start") updateStyle({ alignSelf: "flex-start" });
                  }}
                  title="Left"
                >
                  Left
                </button>
                <button
                  className={`${styles.toggleBtn} ${style.alignSelf === "center" ? styles.toggleActive : ""}`}
                  onClick={() => {
                    if (style.alignSelf !== "center") updateStyle({ alignSelf: "center" });
                  }}
                  title="Center"
                >
                  Center
                </button>
                <button
                  className={`${styles.toggleBtn} ${style.alignSelf === "flex-end" ? styles.toggleActive : ""}`}
                  onClick={() => {
                    if (style.alignSelf !== "flex-end") updateStyle({ alignSelf: "flex-end" });
                  }}
                  title="Right"
                >
                  Right
                </button>
              </div>
              {(style.width || style.alignSelf) && (
                <button
                  className={styles.clearBtn}
                  onClick={() => {
                    // Clear both in a single dispatch to create one undo entry
                    const newStyle = { ...style };
                    delete (newStyle as Record<string, unknown>).width;
                    delete (newStyle as Record<string, unknown>).alignSelf;
                    dispatch({
                      type: "SET_BLOCK_STYLE",
                      blockId: selectedBlockId,
                      style: Object.keys(newStyle).length > 0 ? newStyle : undefined,
                    });
                  }}
                  title="Reset layout"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
        {style.width && style.width !== "100%" && style.width !== "fit-content" && (
          <PropertyRow label="Custom width">
            <UnitInput
              value={(style.width as string) ?? ""}
              placeholder="200px"
              onChange={(v) => updateStyle({ width: v })}
            />
          </PropertyRow>
        )}

        <div className={styles.themeSectionTitle}>Spacing</div>
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
          onClearAllMargins={() => clearStyle("marginTop", "marginRight", "marginBottom", "marginLeft")}
          onClearAllPadding={() => clearStyle("paddingTop", "paddingRight", "paddingBottom", "paddingLeft")}
        />
      </CollapsibleSection>

      {/* Borders */}
      <CollapsibleSection panelId="block" title="Borders" icon={<IconBorders />}>
        <BorderControls style={style} updateStyle={updateStyle} clearStyle={clearStyle} />
      </CollapsibleSection>

      {/* Box Shadow */}
      <CollapsibleSection panelId="block" title="Box Shadow" icon={<IconBoxShadow />}>
        <BoxShadowControls style={style} updateStyle={updateStyle} clearStyle={clearStyle} />
      </CollapsibleSection>

      {/* Opacity */}
      <CollapsibleSection panelId="block" title="Opacity" icon={<IconColors />}>
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
              <button className={styles.clearBtn} onClick={() => clearStyle("opacity")} title="Clear"><X size={12} /></button>
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
