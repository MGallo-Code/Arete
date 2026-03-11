# Input Controls & Interactions — Research Findings

## Current State

Arete currently suffers from fragmented and inconsistent input controls (P1). The same type of value (CSS dimension) is handled by at least three different UI patterns:
- **`SpacingInput.tsx`**: A custom component with a numeric text input and a unit `<select>`. Used for block font sizes, heading font sizes (compact mode), box model (margin/padding), and box shadow offsets.
- **Raw `<input>` with `nudgeCSSValue`**: Used for `lineHeight` and `letterSpacing` in `TypographyControls.tsx` and for grid dimensions in `ThemePanel.tsx`.
- **Preset `<select>`**: Used for base font size in `ThemePanel.tsx` (8pt–12pt).

**Specific Issues identified:**
- **SpacingInput constraints**: Units are hard-coded to `px|pt|in|em|rem|%` and the input always re-attaches a unit (including when value is `0`). There is no support for `auto`, `inherit`, `unset`, unitless values, or `fr` (needed for grid). Parsing is a regex that strips non-numeric characters, which means `calc()` and mixed values are unsupported. (`app/components/editor/SpacingInput.tsx:6-27`)
- **Error state is temporary and silent**: `SpacingInput` sets `spacingInputError` but clears it on every keystroke and never communicates why input is invalid. (`app/components/editor/SpacingInput.tsx:48-74`, `app/components/editor/editor.module.css:1209`)
- **Arrow-key nudging exists but is invisible**: `SpacingInput` uses ArrowUp/ArrowDown for step changes and uses Shift for larger steps, but there are no visible steppers or affordances. (`app/components/editor/SpacingInput.tsx:76-94`)
- **Line-height and letter-spacing are raw text fields**: `TypographyControls` uses plain `<input>` fields with `nudgeCSSValue`, so they do not share unit dropdowns, validation, or parsing behavior with `SpacingInput`. (`app/components/editor/TypographyControls.tsx:90-138`, `app/utils/cssUtils.ts:5-16`)
- **Theme panel font size is a preset dropdown**: `ThemePanel` base size uses fixed options (8pt–12pt), while block and heading sizes use freeform `SpacingInput`. (`app/components/editor/ThemePanel.tsx:16-212`)
- **Grid track sizing has no validation**: Column/row sizes are raw text inputs and accept any string, with no unit UI or parsing feedback. (`app/components/editor/ThemePanel.tsx:412-457`)
- **BoxModelEditor uses compact inputs but no "link all sides" affordance**: It shows “All margin/padding” but lacks a link toggle or clear explanation of mixed state beyond placeholder text. (`app/components/editor/BoxModelEditor.tsx:28-123`)
- **Color inputs are bare `<input type="color">`**: No opacity control, no recent colors, and no palette token linking in these components. Box shadow supports rgba via a toggle, but borders/colors elsewhere do not. (`app/components/editor/BoxShadowControls.tsx:139-165`, `app/components/editor/ThemePanel.tsx:69-239`)
- **Inconsistent "inherit" language**: Some fields show `Inherit` text, others use placeholder text, and others rely on a clear “×” button. There is no consistent visual language for "inherited" vs "local override." (`app/components/editor/TypographyControls.tsx:66-110`, `app/components/editor/BoxModelEditor.tsx:28-123`, `app/components/editor/editor.module.css:1048-1080`)

## Industry Analysis

### Figma
- **What they do well**: Extreme density. Multiple properties (X, Y, W, H) share a single row. Label scrubbing (drag on icon/label) is the primary adjustment method.
- **What they do poorly**: Can be overwhelming for casual users; relies heavily on hidden shortcuts and non-obvious drag affordances.
- **Transferable patterns**: 
    - **Label scrubbing**: Dragging the label/icon to scrub numeric values with speed ramps.
    - **Compact Rows**: Pairing related properties (e.g., W+H or Font Size+Line Height) on one line.
    - **Inline math**: Numeric fields accept arithmetic expressions.
    - **Keyboard nudging**: Arrow keys nudge values with configurable small/big steps.

### Webflow
- **What they do well**: Best-in-class handling of CSS inheritance. Color-coding (Orange for inherited, Blue for local) provides immediate feedback on why an element looks a certain way.
- **What they do poorly**: The UI is very "heavy" and technical, aimed strictly at developers.
- **Transferable patterns**:
    - **Unit Dropdown Integration**: Unit selection is integrated into the field (type unit or pick from a dropdown).
    - **Math in inputs**: Fields accept `+`, `-`, `*`, `/` and units in the same box.
    - **Arrow-key nudging**: Up/Down increments by 1, Shift+Arrow by 10.
    - **First-class special values**: Unitless line-height, plus `auto`/`none` for relevant fields.
    - **Mouse scrubbing**: Option/Alt-drag on fields to adjust values without typing.

### Canva
- **What they do well**: Progressive disclosure. Common presets are front-and-center; raw values are reachable but not distracting.
- **What they do poorly**: Limited control for power users (e.g., hard to set specific `em` values for letter spacing).
- **Transferable patterns**:
    - **Spacing menu**: Letter spacing, line spacing, and paragraph spacing live in a single, simple menu.
    - **Quick visual feedback**: Adjustments are immediate while the menu is open.

### Sketch
- **What they do well**: Inspector inputs accept math expressions, so users can nudge relative to current values.
- **Transferable patterns**:
    - **Inline math**: Numeric fields accept arithmetic.
    - **Keyboard nudging**: Arrow keys for step changes remain a core interaction.

### Adobe XD
- **What they do well**: Property Inspector supports math in numeric fields and Shift+Arrow larger steps.
- **What they do poorly**: Math support is limited to a single operation and feels underpowered compared to Figma/Webflow.
- **Transferable patterns**:
    - **Inline math**: Quick `+3`, `*2`, etc. in any numeric box.
    - **Shift+Arrow for coarse steps**.

### Framer
- **What they do well**: Strong unit support for typography (REM sizing) and responsive scaling tied to breakpoints.
- **What they do poorly**: Less obvious about how to switch units in the UI; power features are often behind contextual panels.
- **Transferable patterns**:
    - **Unit-aware typography**: Support unit switching for font sizes (px/rem) in a way that scales across contexts.

## Recommendations

### Must-Have Changes
1. **Unified Dimension Input (`UnitInput`)**:
    - Replace `SpacingInput` and all raw numeric inputs with a single `UnitInput` component.
    - **Features**: 
        - Integrated +/- stepper buttons (visible on hover or always).
        - Drag-to-scrub on the label or an icon.
        - Unit picker that feels like part of the input field (using Radix Popover or a styled inline select).
        - Support for `auto`, `inherit`, `unset`, and **unitless** (for line-height).
        - Support for `fr` when used in grid contexts.
        - Accept inline math (e.g., `+2`, `*1.1`), similar to Figma/Webflow/Sketch/XD.
2. **Compact Property Rows**:
    - Modify `PropertyRow` or create a `PropertyGrid` to support 2-column and 3-column layouts.
    - **Pairs to combine**: (Width, Height), (X Offset, Y Offset), (Font Size, Line Height), (Font Weight, Font Style).
3. **Redesigned Color Control**:
    - Move palette swatches into a compact horizontal strip next to the label or inside the color picker popover.
    - Avoid using a full row for the "link to palette" labels.
    - Add an opacity slider + numeric alpha input for any color control used in shadows or overlays.
4. **Visual "Inherit" Indicators**:
    - Adopt the Webflow-style color coding or a subtle "ghost" state for inherited values. If a value is inherited, the input should show the inherited value as a placeholder in a specific color (e.g., orange or muted blue).
    - Add a consistent “Reset to Theme” affordance (same place in every row).

### Nice-to-Have Improvements
- **Inline Math**: Support simple addition/subtraction in dimension inputs (make this consistent everywhere).
- **Recent Colors**: A "Recent" section in the color picker, plus palette-variable chips.
- **Preset Groups**: Simple spacing presets like Tight/Comfortable/Loose for casual users.
- **Keyboard Nudge Config**: Allow users to see/edit the nudge steps (1/10 or 0.1/1).

### Things to Avoid
- **Over-complex Color Pickers**: We don't need a full Photoshop-style gradient editor yet. A simple Hex + Opacity + Palette is enough.
- **Hidden Features**: If we add scrubbing, there should be a cursor change or a tooltip to hint at it.

## Discovered Issues & Opportunities

- **Friction Point: Missing Selection Path context**: When editing a nested block, it's easy to lose track of whether you are editing the Block, the Region, or the Theme. A "Breadcrumb" or path indicator in the sidebar header would help (e.g., `Page > Sidebar > Contact Block`).
- **Opportunity: Mixed Unit Awareness**: In the grid editor, users often want a mix of `1fr` and `px`. The current raw text input makes this error-prone. A specialized Grid Track editor could handle these units more safely.
- **Accessibility Opportunity**: Screen readers currently don't have a clear way to know when a value is "inherited" vs "set." Using ARIA live regions or specific labels for the "ghost" state would be a significant win.
- **Style Comparison**: There's an opportunity to show "diffs" — e.g., if a user selects two blocks of the same type, the sidebar could highlight properties that differ between them.
- **Casual User Affordance**: "Smart Presets" for spacing (e.g., "Tight", "Comfortable", "Loose") that map to specific px/em values would allow casual users to avoid the numeric inputs entirely while still giving power users the ability to override with exact values.
- **Grid Inputs Need Contextual Unit UI**: Grid rows/columns allow `fr`, `minmax()`, and `auto` but the UI does not hint at these. Even a small unit chip or syntax help would prevent invalid entries. (`app/components/editor/ThemePanel.tsx:412-457`)
- **Lack of consistent ARIA labels**: Only `SpacingInput` optionally accepts a `label` prop; many other inputs have no explicit accessible name beyond surrounding text. This is fragile for assistive tech. (`app/components/editor/SpacingInput.tsx:29-35`, `app/components/editor/TypographyControls.tsx:90-138`)
- **No opacity control for colors**: Color inputs are hex-only, so users can’t set semi-transparent values for backgrounds or borders without switching to raw text input (which doesn’t exist in most places). (`app/components/editor/ThemePanel.tsx:69-239`)

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

**Cross-cutting findings from visual design audit relevant to input controls:**

1. **SpacingInput error state is transient and uninformative.** The `spacingInputError` class shows a red outline, but it disappears the moment the user types again (line 64 of SpacingInput.tsx: `if (error) setError(false)`). There is no error message explaining what was wrong. Recommendation: keep the error visible until valid input is entered, and add a brief message like "Enter a number" below the input.

2. **Line height and letter spacing inputs in TypographyControls.tsx are plain `<input type="text">` with manual `nudgeCSSValue` arrow key handling.** These should be converted to `SpacingInput` for consistency. Currently, line height is often a unitless number (e.g., "1.4") which SpacingInput does not handle well -- it assumes CSS units. SpacingInput needs a "unitless" mode or a separate component for ratio values.

3. **Grid value inputs in ThemePanel.tsx have zero validation.** Lines 422-429 and 449-453: raw text inputs for column widths and row heights accept any string. Invalid CSS grid values fail silently with no error feedback. At minimum, add a visual warning when the entered value does not parse as a valid CSS grid track size.

4. **The palette preset section in ThemePanel is duplicated.** Lines 116-133 render a `<select>` dropdown of presets, AND lines 134-152 render the same 4 presets as clickable button rows with swatch previews. One of these should be removed. The button rows are more informative (they show color swatches), so the dropdown is redundant.

5. **Inconsistent "Inherit" state across controls.** After reviewing all editor components:
   - `TypographyControls`: shows text "Inherit" next to clear button when no fontWeight set
   - `ColorPropRow`: shows text "Inherit" when no color set, with a "+" button to add one
   - `BoxModelEditor`: uses placeholder text in inputs to show inherited values
   - `BorderControls`: shows text "none" when no border set
   - `BoxShadowControls`: shows "+ Add Shadow" button when no shadow set
   This is 5 different patterns for the same concept. A unified visual language (e.g., gray italic text + consistent reset affordance) would significantly improve coherence.

6. **Color inputs cannot handle rgba/hsla directly.** `<input type="color">` only accepts hex values. The `colorToHex` helper in both `BorderControls.tsx` and `BoxShadowControls.tsx` falls back to `#000000` for any non-hex color. BoxShadowControls partially addresses this with a "picker/rgba" toggle, but BorderControls does not. This means border colors using rgba() will display as black in the picker.

### Codex
**Input control audit (with file references):**
1. **SpacingInput can’t represent unitless or special values, which blocks line-height and `auto` workflows.** The unit list is fixed (`px|pt|in|em|rem|%`) and `toCSS` always appends a unit, so values like `1.4` (unitless line-height), `auto`, or `unset` cannot be entered. (`app/components/editor/SpacingInput.tsx:6-27`)
2. **Arrow-key nudging is implemented but not surfaced visually.** There are no visible steppers or scrubbing affordances; users must discover ArrowUp/Down + Shift behavior by accident. (`app/components/editor/SpacingInput.tsx:76-94`)
3. **Line-height and letter-spacing live in a different input system.** `TypographyControls` uses raw text inputs + `nudgeCSSValue`, which does not share parsing or unit control with `SpacingInput`. This multiplies edge cases (e.g., unitless line-height vs unitful letter-spacing). (`app/components/editor/TypographyControls.tsx:90-138`, `app/utils/cssUtils.ts:5-16`)
4. **BoxModelEditor “All margin/padding” lacks a discoverable link/unlink affordance.** It uses a unified input + placeholder “mixed” but doesn’t show whether sides are linked or not. This is especially confusing because users see four separate inputs inside the diagram. (`app/components/editor/BoxModelEditor.tsx:28-123`)
5. **Grid track inputs are raw and unvalidated.** Column/row sizing allows any text, but there is no unit guidance or validation feedback even though CSS grid accepts a specialized grammar (`fr`, `minmax`, `auto`). (`app/components/editor/ThemePanel.tsx:412-457`)
6. **Color inputs are fragmented.** Most places only offer `type="color"` (hex-only), while BoxShadow adds a separate “rgba” toggle. There is no unified color picker with opacity or palette variables. (`app/components/editor/BoxShadowControls.tsx:139-165`, `app/components/editor/ThemePanel.tsx:69-239`)
7. **Error handling is shallow.** `SpacingInput` marks error state but clears it immediately on any edit and never explains the error. This makes invalid input hard to recover. (`app/components/editor/SpacingInput.tsx:48-74`, `app/components/editor/editor.module.css:1209`)
