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
1. ✅ **Unified Dimension Input (`UnitInput`)**:
    - Replace `SpacingInput` and all raw numeric inputs with a single `UnitInput` component.
    - **Features**:
        - ✅ Integrated +/- stepper buttons (visible on hover or always).
        - Drag-to-scrub on the label or an icon.
        - ✅ Unit picker that feels like part of the input field (using Radix Popover or a styled inline select).
        - ✅ Support for `auto`, `inherit`, `unset`, and **unitless** (for line-height).
        - Support for `fr` when used in grid contexts.
        - ✅ Accept inline math (e.g., `+2`, `*1.1`), similar to Figma/Webflow/Sketch/XD.
2. ✅ **Compact Property Rows**:
    - Modify `PropertyRow` or create a `PropertyGrid` to support 2-column and 3-column layouts.
    - **Pairs to combine**: (Width, Height), (X Offset, Y Offset), (Font Size, Line Height), (Font Weight, Font Style).
3. **Redesigned Color Control**:
    - Move palette swatches into a compact horizontal strip next to the label or inside the color picker popover.
    - Avoid using a full row for the "link to palette" labels.
    - Add an opacity slider + numeric alpha input for any color control used in shadows or overlays.
4. ✅ (partial) **Visual “Inherit” Indicators**:
    - Adopt the Webflow-style color coding or a subtle “ghost” state for inherited values. If a value is inherited, the input should show the inherited value as a placeholder in a specific color (e.g., orange or muted blue).
    - ✅ Add a consistent “Reset to Theme” affordance (same place in every row). *(PropertyRow now supports `isOverridden`/`onReset` props with blue dot + reset button.)*

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

#### Industry-Leading Patterns & Insights

Based on research into Figma, Webflow, Framer, and Sketch, the following patterns are recommended for the Arete `UnitInput`:

- **Label Scrubbing (The "Figma" Way):** The most efficient way to adjust values is by dragging the label/icon. Hovering over the label (e.g., "W" or "H") changes the cursor to `ew-resize`. Clicking and dragging left/right increments/decrements the value.
- **Hidden/Contextual Steppers:** To maintain a clean UI, stepper buttons (+/-) should only be visible on hover or focus of the input field. This prevents visual noise while remaining accessible to mouse users.
- **Unit Dropdown + Direct Typing (The "Webflow" Way):** The unit should be a clickable suffix inside the input. Clicking it opens a dropdown of available units (px, pt, rem, %, fr, etc.). However, users should also be able to type the unit directly (e.g., "12rem") and have the UI automatically update the selector.
- **Inline Math Support:** All professional tools support basic arithmetic (`+`, `-`, `*`, `/`) directly in the input field. This is a massive power-user feature for relative adjustments (e.g., "+4" to increase font size).
- **Inheritance & Source Visualization:** Webflow's use of color (Orange for inherited, Blue for local) is the gold standard. Arete should use a subtle variation: gray italicized text for inherited values (placeholder) and solid black/white for local overrides.

#### Proposed `UnitInput` Design

**Component Interface:**
```typescript
interface UnitInputProps {
  value: string; // The raw CSS value (e.g., "12px", "1.5", "auto")
  onChange: (value: string) => void;
  label?: string | ReactNode; // If provided, enables scrubbing
  units?: string[]; // e.g., ["px", "pt", "rem", "%", "fr", "auto", "inherit"]
  allowUnitless?: boolean; // For properties like line-height
  step?: number; // Default 1 (for px/pt) or 0.1 (for em/rem/unitless)
  min?: number;
  max?: number;
  compact?: boolean; // For grid/box model inputs
  placeholder?: string;
}
```

**Visual Structure (CSS Modules):**
- **Container:** A horizontal flexbox containing the label and the input wrapper.
- **Label:** A fixed-width or auto-width text/icon that supports `onMouseDown` for scrubbing.
- **Input Wrapper:** A container with a border that houses:
    - **Numeric Input:** A borderless text field.
    - **Steppers (Hidden by default):** Two small absolute-positioned buttons on the right.
    - **Unit Button:** A small, styled button on the far right that displays the current unit and triggers a Radix Dropdown.

**Key Behaviors:**
1.  **Parsing:** On blur or Enter, the input evaluates math expressions and validates against the allowed units.
2.  **Scrubbing:** Dragging the label uses a multiplier (e.g., 1px per 5px of mouse movement). Holding `Shift` increases speed by 10x.
3.  **Keyboard:** `ArrowUp/Down` nudges by `step`. `Shift + ArrowUp/Down` nudges by `step * 10`.
4.  **Special Values:** Values like `auto` or `inherit` are selectable from the unit dropdown or by typing the word. When selected, the numeric input might be disabled or hidden.
5.  **Unitless Support:** If `allowUnitless` is true, a number without a unit is treated as a ratio (perfect for `lineHeight`).

#### Answers to Key Questions
- **Stepper buttons visibility?** Only on hover/focus. This keeps the sidebar clean but provides the affordance when the user is actually interacting with the field.
- **Unit selector placement?** As a suffix button *inside* the input border. It feels like one cohesive control.
- **Mixed-mode handling?** The `units` prop determines what's valid. If `units` is empty, it's a raw numeric/text field.
- **Step sizes?** Default to `1` for absolute units (px, pt) and `0.1` for relative units (em, rem, unitless).
- **Presets?** The unit dropdown can include common "presets" as a separate section (e.g., "Small (8pt)", "Normal (10pt)", "Large (14pt)").

#### Migration Path
1.  **Step 1:** Implement `UnitInput` as a standalone component using Radix Popover for units.
2.  **Step 2:** Replace `SpacingInput` everywhere. `UnitInput` is backward compatible with `SpacingInput` props but adds the new functionality.
3.  **Step 3:** Replace raw inputs in `TypographyControls` (line-height, letter-spacing) and `ThemePanel` (grid).
4.  **Step 4:** Update `cssUtils.ts` to support the more robust parsing and math evaluation required by `UnitInput`.

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
1. **SpacingInput can’t represent unitless or special values.** The unit list is fixed (`px|pt|in|em|rem|%`) and `toCSS` always appends a unit, so values like `1.4` (unitless line-height), `auto`, or `unset` cannot be entered. (`app/components/editor/SpacingInput.tsx:6-27`)
2. **Arrow-key nudging exists but has no visible affordance.** There are no steppers or scrubbing cues, so ArrowUp/Down + Shift is undiscoverable. (`app/components/editor/SpacingInput.tsx:76-94`)
3. **Line-height and letter-spacing are handled outside SpacingInput.** `TypographyControls` uses raw text inputs + `nudgeCSSValue`, so units, validation, and parsing are inconsistent across typography fields. (`app/components/editor/TypographyControls.tsx:90-138`, `app/utils/cssUtils.ts:5-16`)
4. **Grid track sizing has no validation or unit guidance.** Column and row sizing allow any string even though CSS grid track sizing expects `fr`, `minmax()`, `auto`, etc. (`app/components/editor/ThemePanel.tsx:412-457`)
5. **Error handling is shallow.** `SpacingInput` marks error state but clears it immediately on any edit and never explains the error. (`app/components/editor/SpacingInput.tsx:48-74`, `app/components/editor/editor.module.css:1209`)

**Reference app behaviors worth copying (source-backed):**
1. **Figma scrubbing:** Hover the label to reveal a scrubbing cursor, then drag to change numeric values; scrubbing speed ramps (2x, 1x, 1/2, 1/4) based on vertical cursor position. citeturn0search0
2. **Webflow numeric fields:** Inline math is allowed in numeric inputs; ArrowUp/Down steps by 1, Shift+Arrow by 10; Option/Alt enables drag-to-adjust and reveals incremental steppers; unit dropdown supports unitless “-” and special values like `auto`/`none`. citeturn0search1
3. **Sketch inspector:** Any numeric field accepts math expressions with operators like `+`, `-`, `*`, `/`, `^`. citeturn0search2
4. **Framer numeric controls:** Number controls can expose steppers via `displayStepper`, and can define `step` and `unit` explicitly. citeturn0search3
5. **CSS rules that should drive validation:** Unitless `line-height` is explicitly supported; grid tracks accept `fr` and `minmax()`; `calc()` is a valid way to express computed numeric values. citeturn1search0turn1search1turn1search2

**UnitInput proposal (concrete design):**
1. **Props interface (minimal but extensible):**
```ts
type UnitInputContext =
  | "spacing"
  | "fontSize"
  | "lineHeight"
  | "letterSpacing"
  | "gridTrack"
  | "shadowOffset"
  | "borderWidth"
  | "generic";

type UnitInputProps = {
  value: string;
  onChange: (value: string) => void;
  onCommit?: (value: string) => void;
  label?: string;
  placeholder?: string;
  compact?: boolean;
  context?: UnitInputContext;
  allowedUnits?: string[];
  allowUnitless?: boolean;
  allowKeywords?: string[]; // e.g. ["auto", "inherit", "unset", "normal"]
  allowMath?: boolean;
  allowCalc?: boolean;
  step?: number;
  stepByUnit?: Record<string, number>;
  fineStepByUnit?: Record<string, number>;
  showSteppers?: "always" | "hover" | "focus" | "never";
  showUnit?: "always" | "hover" | "never";
  validate?: (value: string) => { valid: boolean; message?: string };
  disabled?: boolean;
};
```
2. **HTML/CSS structure (single row, no nested layout):**
```html
<div class="unitInput">
  <div class="unitInputField">
    <input class="unitInputValue" />
    <button class="unitInputUnit" type="button">px ▾</button>
    <div class="unitInputSteppers">
      <button class="unitInputStepUp" type="button" aria-label="Increase">+</button>
      <button class="unitInputStepDown" type="button" aria-label="Decrease">−</button>
    </div>
  </div>
  <div class="unitInputMeta">
    <span class="unitInputError">Enter a number, a unit, or a keyword.</span>
  </div>
</div>
```
3. **Visual behavior choices (answers to key questions):**
4. **Stepper visibility:** Default to `showSteppers="hover"` so casual users see buttons on hover/focus, while the UI stays compact. This aligns with Webflow’s “steppers appear when Option/Alt is held” discoverability but makes it visible without modifier keys. citeturn0search1
5. **Unit selector placement:** Use an inline suffix button inside the input shell, not a separate `<select>`. This keeps the field compact and mirrors Webflow’s integrated unit control. citeturn0search1
6. **Mixed-mode inputs:** Use `context` + `allowedUnits` + `allowUnitless` to define valid grammar per field rather than a single global list. For example: `lineHeight` allows unitless and `%`, `fontSize` allows `pt|px|em|rem|%`, `gridTrack` allows `fr|px|%|auto|minmax()`. citeturn1search0turn1search1

**Interaction model (concrete):**
1. **Typing:** Accept raw strings while focused. On blur or Enter, parse in this order.
2. **Keyword:** If value is in `allowKeywords` (e.g., `auto`, `inherit`, `unset`, `normal`), accept as-is and hide the unit button. This is consistent with CSS global values and avoids forcing fake units.
3. **Calc:** If input starts with `calc(` and `allowCalc` is true, accept as-is. citeturn1search2
4. **Math shorthand:** If input starts with `+`, `-`, `*`, or `/` and `allowMath` is true, evaluate relative to the current numeric value (e.g., current `12px` and input `*1.5` → `18px`). This mirrors Webflow and Sketch expectations. citeturn0search1turn0search2
5. **Unit parsing:** Accept numeric + optional unit suffix. If unit omitted and `allowUnitless` true, treat as unitless. If unit omitted and unitless not allowed, apply the default unit for that context. citeturn1search0
6. **Arrow keys:** ArrowUp/Down uses `stepByUnit` or `step` with Shift as 10x, matching Webflow. Option/Alt triggers fine steps (0.1x) and shows steppers, mirroring Webflow’s discoverability. citeturn0search1
7. **Steppers:** Click +/− triggers the same step logic as ArrowUp/Down. For unitless line-height, default step 0.1, Shift 1.0. citeturn1search0
8. **Scrubbing:** Drag the label (or a small drag-handle icon) to scrub values. Use Figma-style speed ramps by vertical cursor position. citeturn0search0
9. **Unit change:** When user selects a unit, keep the numeric value and update the suffix. If we support conversions, do it only for `px`↔`%` to mirror Webflow’s “approximate conversion on unit change.” citeturn0search1

**UnitInput replacement plan:**
1. **Drop-in replacement for SpacingInput:** Add `compact` and `label` props so `BoxModelEditor` can use the compact variant and other panels use full width.
2. **TypographyControls migration:** Replace raw line-height and letter-spacing inputs with `UnitInput` using `context="lineHeight"` and `context="letterSpacing"` to enable unitless and show units consistently.
3. **ThemePanel grid migration:** Replace grid row/column raw inputs with `UnitInput` in `context="gridTrack"` and a help tooltip that mentions `fr`, `minmax()`, and `auto`. citeturn1search1

**Validation and error state:**
1. **Persistent error messaging:** Keep error visible until the value is valid or cleared. Use a short inline message below the field, not just a red border. This fixes the current transient error state. (`app/components/editor/SpacingInput.tsx:48-74`, `app/components/editor/editor.module.css:1209`)
2. **Contextual validation rules:**
3. **Line height:** Accept unitless numbers and `%` or length. Flag negative values. citeturn1search0
4. **Spacing:** Accept lengths and `%`; reject unitless unless explicitly allowed.
5. **Grid tracks:** Accept `fr`, `auto`, `<length>`, `%`, `minmax(<track>, <track>)`, `calc()` if enabled. citeturn1search1turn1search2

**Presets popover (answer to presets question):**
1. **Optional, per-context:** Provide a small “⋯” button that opens presets only for contexts where they’re meaningful, such as line-height (1.2, 1.4, 1.6) or spacing (0, 4, 8, 12, 16, 24). Keep it off by default to avoid clutter.
