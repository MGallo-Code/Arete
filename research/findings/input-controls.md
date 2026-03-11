# Input Controls & Interactions — Research Findings

## Current State

Arete currently suffers from fragmented and inconsistent input controls (P1). The same type of value (CSS dimension) is handled by at least three different UI patterns:
- **`SpacingInput.tsx`**: A custom component with a numeric text input and a unit `<select>`. Used for block font sizes, heading font sizes (compact mode), box model (margin/padding), and box shadow offsets.
- **Raw `<input>` with `nudgeCSSValue`**: Used for `lineHeight` and `letterSpacing` in `TypographyControls.tsx` and for grid dimensions in `ThemePanel.tsx`.
- **Preset `<select>`**: Used for base font size in `ThemePanel.tsx` (8pt–12pt).

**Specific Issues identified:**
- **Lack of Visual Steppers (P7)**: Users must know about arrow key nudging; there are no visible +/- buttons.
- **No Scrubbing**: Professional design tools allow dragging labels to change values; Arete requires typing or clicking.
- **Cluttered Rows (P2)**: Most properties use `PropertyRow.tsx`, which forces a vertical stack of Label + Input, wasting full rows for single small controls (e.g., `textTransform`, `fontWeight`).
- **Color Input Inefficiency**: `ColorPropRow.tsx` takes up significant vertical space because it displays palette swatches and the color picker on separate lines within a single property block.
- **Manual Shorthand Parsing**: `BorderControls.tsx` and `BoxShadowControls.tsx` contain complex manual regex for parsing CSS shorthands, leading to brittle UI-to-Model synchronization.
- **Inconsistent "Inherit" State**: Some inputs show an "Inherit" label, others a "×" clear button, and others a placeholder. There is no unified visual language for "this value is not set locally."

## Industry Analysis

### Figma
- **What they do well**: Extreme density. Multiple properties (X, Y, W, H) share a single row. Label scrubbing (drag on icon/label) is the primary adjustment method.
- **What they do poorly**: Can be overwhelming for casual users; relies heavily on hidden shortcuts and non-obvious drag affordances.
- **Transferable patterns**: 
    - **Label scrubbing**: Dragging the "W" label to change width.
    - **Compact Rows**: Pairing related properties (e.g., Font Size + Line Height) on one line.
    - **Unit Math**: Supporting `10 + 5` or `50%` directly in the input.

### Webflow
- **What they do well**: Best-in-class handling of CSS inheritance. Color-coding (Orange for inherited, Blue for local) provides immediate feedback on why an element looks a certain way.
- **What they do poorly**: The UI is very "heavy" and technical, aimed strictly at developers.
- **Transferable patterns**:
    - **Unit Dropdown Integration**: The unit selector is often a clickable label inside the input area, not a separate bulky `<select>`.
    - **"Auto" as a First-Class Value**: Specific UI affordance for `auto` in dimensions.

### Canva
- **What they do well**: Progressive disclosure. Common presets are front-and-center; raw values are reachable but not distracting.
- **What they do poorly**: Limited control for power users (e.g., hard to set specific `em` values for letter spacing).
- **Transferable patterns**:
    - **Slider + Input Pairing**: Useful for properties like opacity or scale where visual scrubbing is more intuitive than typing.

## Recommendations

### Must-Have Changes
1. **Unified Dimension Input (`UnitInput`)**:
    - Replace `SpacingInput` and all raw numeric inputs with a single `UnitInput` component.
    - **Features**: 
        - Integrated +/- stepper buttons (visible on hover or always).
        - Drag-to-scrub on the label or an icon.
        - Unit picker that feels like part of the input field (using Radix Popover or a styled inline select).
        - Support for `auto`, `inherit`, and `unset` as selectable presets.
2. **Compact Property Rows**:
    - Modify `PropertyRow` or create a `PropertyGrid` to support 2-column and 3-column layouts.
    - **Pairs to combine**: (Width, Height), (X Offset, Y Offset), (Font Size, Line Height), (Font Weight, Font Style).
3. **Redesigned Color Control**:
    - Move palette swatches into a compact horizontal strip next to the label or inside the color picker popover.
    - Avoid using a full row for the "link to palette" labels.
4. **Visual "Inherit" Indicators**:
    - Adopt the Webflow-style color coding or a subtle "ghost" state for inherited values. If a value is inherited, the input should show the inherited value as a placeholder in a specific color (e.g., orange or muted blue).

### Nice-to-Have Improvements
- **Inline Math**: Support simple addition/subtraction in dimension inputs.
- **Recent Colors**: A "Recent" section in the color picker.
- **Unitless Line Height**: Enforce/encourage unitless values for line-height (e.g., `1.5` instead of `1.5em`) as per CSS best practices.
- **Keyboard Nudge Config**: Allow users to see/edit the nudge steps (1px/10px).

### Things to Avoid
- **Over-complex Color Pickers**: We don't need a full Photoshop-style gradient editor yet. A simple Hex + Opacity + Palette is enough.
- **Hidden Features**: If we add scrubbing, there should be a cursor change or a tooltip to hint at it.

## Discovered Issues & Opportunities

- **Friction Point: Missing Selection Path context**: When editing a nested block, it's easy to lose track of whether you are editing the Block, the Region, or the Theme. A "Breadcrumb" or path indicator in the sidebar header would help (e.g., `Page > Sidebar > Contact Block`).
- **Opportunity: Mixed Unit Awareness**: In the grid editor, users often want a mix of `1fr` and `px`. The current raw text input makes this error-prone. A specialized Grid Track editor could handle these units more safely.
- **Accessibility Opportunity**: Screen readers currently don't have a clear way to know when a value is "inherited" vs "set." Using ARIA live regions or specific labels for the "ghost" state would be a significant win.
- **Style Comparison**: There's an opportunity to show "diffs" — e.g., if a user selects two blocks of the same type, the sidebar could highlight properties that differ between them.
- **Casual User Affordance**: "Smart Presets" for spacing (e.g., "Tight", "Comfortable", "Loose") that map to specific px/em values would allow casual users to avoid the numeric inputs entirely while still giving power users the ability to override with exact values.

## Agent Findings

### Gemini
- **Inheritance Visualization (Webflow Style):** Every input should visually reflect its source.
    - **Blue Label/Value:** Locally overridden.
    - **Neutral/Gray Label/Value:** Inherited from theme.
    - **Action:** Clicking a blue label should provide a "Reset to Theme" action.
- **Variable "Pill" UI (Figma Style):** For properties linked to the color palette, the raw hex input should be replaced with a rounded "pill" containing the variable name (e.g., "Primary"). This prevents accidental hex edits and reinforces the design system.
- **Contextual Help:** Add a subtle hover state to property labels that reveals a small "?" icon or tooltip explaining the property's effect. This is crucial for "Casual Users" who may not know what `letterSpacing` or `lineHeight` means.
- **Micro-interactions:** Implement "scrubbing" (click and drag) on labels to adjust numeric values. This is a high-polish feature common in Figma and Framer that speeds up fine-tuning.
- **Error States:** Beyond the red border, use a persistent "!" icon or a tooltip for invalid values (e.g., negative margin if not supported).

### Claude
(Placeholder for Claude's findings)

### Codex
(Placeholder for Codex's findings)
