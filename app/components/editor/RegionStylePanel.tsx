"use client";

import { useMemo } from "react";
import { useEditorRequired } from "../../contexts/EditorContext";
import { parseShorthand } from "../../utils/cssUtils";
import BorderControls from "./BorderControls";
import BoxModelEditor from "./BoxModelEditor";
import BoxShadowControls from "./BoxShadowControls";
import CollapsibleSection from "./CollapsibleSection";
import ColorControls from "./ColorControls";
import PropertyRow from "./PropertyRow";
import { IconColors, IconTypography, IconLayout, IconBoxModel, IconBorders, IconBoxShadow } from "./SectionIcons";
import SpacingInput from "./SpacingInput";
import TypographyControls from "./TypographyControls";
import styles from "./editor.module.css";

export default function RegionStylePanel() {
  const { resume, selectedRegionId, dispatch } = useEditorRequired();

  const regionStyle = selectedRegionId
    ? resume.template.regionStyles[selectedRegionId] ?? {}
    : {};

  const defaults = useMemo(() => {
    const result: Record<string, string> = {};
    if (regionStyle.padding && typeof regionStyle.padding === "string") {
      const parsed = parseShorthand(regionStyle.padding as string);
      result.paddingTop = parsed.top;
      result.paddingRight = parsed.right;
      result.paddingBottom = parsed.bottom;
      result.paddingLeft = parsed.left;
    }
    return result;
  }, [regionStyle.padding]);

  if (!selectedRegionId) return null;

  const theme = resume.template.theme;

  const updateStyle = (patch: Record<string, string | undefined>) => {
    dispatch({ type: "UPDATE_REGION_STYLE", regionId: selectedRegionId, style: patch });
  };

  const clearStyle = (key: string) => {
    const newStyle = { ...regionStyle };
    delete (newStyle as Record<string, unknown>)[key];
    dispatch({ type: "SET_REGION_STYLE", regionId: selectedRegionId, style: newStyle });
  };

  return (
    <div className={styles.selectionPanel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.selectionPanelTitle}>Region</div>
          <div className={styles.panelSubtitle}>{selectedRegionId}</div>
        </div>
      </div>

      {/* Colors */}
      <CollapsibleSection title="Colors" icon={<IconColors />}>
        <ColorControls
          style={regionStyle}
          updateStyle={updateStyle}
          clearStyle={clearStyle}
          palette={theme.palette}
        />
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection title="Typography" icon={<IconTypography />}>
        <TypographyControls
          style={regionStyle}
          updateStyle={updateStyle}
          clearStyle={clearStyle}
        />
      </CollapsibleSection>

      {/* Layout */}
      <CollapsibleSection title="Layout" icon={<IconLayout />}>
        <PropertyRow label="Align items">
          <select
            className={styles.propSelect}
            value={(regionStyle.alignItems as string) ?? ""}
            onChange={(e) => updateStyle({ alignItems: e.target.value || undefined })}
          >
            <option value="">Default</option>
            <option value="flex-start">Top</option>
            <option value="center">Center</option>
            <option value="flex-end">Bottom</option>
            <option value="stretch">Stretch</option>
          </select>
        </PropertyRow>
        <PropertyRow label="Gap">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <SpacingInput
              value={(regionStyle.gap as string) ?? ""}
              placeholder="0"
              onChange={(v) => updateStyle({ gap: v })}
            />
            {regionStyle.gap && (
              <button className={styles.clearBtn} onClick={() => clearStyle("gap")} title="Clear">×</button>
            )}
          </div>
        </PropertyRow>
      </CollapsibleSection>

      {/* Box Model */}
      <CollapsibleSection title="Box Model" icon={<IconBoxModel />}>
        <BoxModelEditor
          hideMargin
          marginTop=""
          marginRight=""
          marginBottom=""
          marginLeft=""
          paddingTop={(regionStyle.paddingTop as string) ?? ""}
          paddingRight={(regionStyle.paddingRight as string) ?? ""}
          paddingBottom={(regionStyle.paddingBottom as string) ?? ""}
          paddingLeft={(regionStyle.paddingLeft as string) ?? ""}
          defaultPaddingTop={defaults.paddingTop}
          defaultPaddingRight={defaults.paddingRight}
          defaultPaddingBottom={defaults.paddingBottom}
          defaultPaddingLeft={defaults.paddingLeft}
          onMarginChange={() => {}}
          onPaddingChange={(side, value) => {
            const key = `padding${side[0].toUpperCase()}${side.slice(1)}`;
            updateStyle({ [key]: value });
          }}
        />
      </CollapsibleSection>

      {/* Borders */}
      <CollapsibleSection title="Borders" icon={<IconBorders />}>
        <BorderControls style={regionStyle} updateStyle={updateStyle} clearStyle={clearStyle} />
      </CollapsibleSection>

      {/* Box Shadow */}
      <CollapsibleSection title="Box Shadow" icon={<IconBoxShadow />}>
        <BoxShadowControls style={regionStyle} updateStyle={updateStyle} clearStyle={clearStyle} />
      </CollapsibleSection>
    </div>
  );
}
