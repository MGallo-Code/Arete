# Editor UI Overhaul — Research Instructions

> **Purpose:** This document briefs AI agents (Claude, Gemini, Codex, or others) on researching improvements to the Arete resume editor's sidebar UI. Each agent audits, compares to industry-leading tools, and proposes concrete changes. **No code is written during research** — only findings and recommendations.

---

## Project Context

Arete is a WYSIWYG resume editor. The user clicks directly on the resume preview to select blocks/regions, then edits properties in a right-hand sidebar. The preview IS the editor — there is no separate "edit mode" vs "preview mode."

**Read these files before starting any research:**
- `CLAUDE.md` — full architecture, data model, rendering pipeline, editor plan
- `app/models.ts` — the data model (Style, Block, Theme, Template, etc.)
- `app/components/editor/` — all current editor components
- `app/styles/tokens.css` — design tokens
- `app/components/editor/editor.module.css` — editor styles

**Branch:** `editor-ui-experimental` (all editor work is here, not yet merged to main)

---

## What We're Keeping (Do NOT Propose Replacing)

These are working well and are not up for redesign:

1. **Direct-on-preview selection system** — click to select blocks, click again to edit inline, hierarchical path-based selection. This is the core UX and stays.
2. **Inline contentEditable editing** — clicking into text for rich text editing with Cmd+B/I/K shortcuts.
3. **Bullet list editing** — Enter/Backspace/Tab/Shift+Tab keyboard model in BulletsView.
4. **Radix UI primitives** — Dialog, Tabs, Collapsible, Tooltip, ScrollArea. We're committed to Radix.
5. **CollapsibleSection progressive disclosure** — sections expand/collapse. The pattern is good.
6. **CSS Grid layout system** — named areas, grid-template. The data model is final.
7. **Palette/CSS variable system** — var(--palette-*) references, palette presets. Working well.
8. **Block Library modal** — categorized template picker. Good as-is.
9. **Template Picker** — visual thumbnails with grid previews. Good as-is.
10. **FloatingToolbar** — move/duplicate/delete/insert actions on selected blocks.

You MAY suggest enhancements or minor tweaks to these (e.g., "add a tooltip here," "reorder these buttons"), but do not propose replacing the fundamental pattern.

---

## Problems to Solve

### P1: Inconsistent Input Controls
The same type of value (a CSS dimension) is input differently depending on where it appears:
- **ThemePanel font size**: dropdown with preset values (8pt–12pt)
- **BlockStylePanel font size**: `SpacingInput` (numeric + unit dropdown)
- **Heading font sizes**: `SpacingInput` (compact mode)
- **Line height**: free-form text input with arrow nudging
- **Letter spacing**: free-form text input with arrow nudging
- **Grid values**: raw text input (no validation, no units UI)

**Goal:** A unified dimension input component used everywhere. Consistent behavior, consistent look.

### P2: Cluttered Layout — Short Items Wasting Full Rows
Many properties take up an entire row but are visually small (a single color picker, a small toggle). This makes the sidebar feel stretched and wastes vertical space.

**Examples of waste:**
- Font weight toggle (Normal/Bold) — two small buttons on a full row
- Text transform dropdown — small dropdown on a full row
- Single color picker — small swatch + label on a full row
- Link color in ThemePanel — one color picker, full row

**Goal:** Compact property rows — two small properties side by side where it makes sense (like Figma's property panel). Not everything needs its own line.

### P3: Incomplete Property Coverage Across Panels
Different editable targets (block, region, theme heading, theme link) expose different subsets of CSS properties with no apparent logic for what's included vs. excluded:

| Property | Block | Region | Theme Heading | Theme Link |
|----------|-------|--------|---------------|------------|
| backgroundColor | Yes | Yes | No | No |
| textDecoration | No | No | No | No |
| borderBottom | Yes (all sides) | Yes (all sides) | Yes (only bottom) | No |
| boxShadow | Yes | Yes | No | No |
| opacity | No | No | No | No |
| width/height | No (except images) | No | N/A | N/A |
| textAlign | Yes | Yes | No | No |

**Goal:** Consistent property groups. Every editable target should surface the same sections where applicable. Missing properties that are useful for resume styling (textDecoration, width, opacity) should be added.

### P4: No Block Layout Controls (Width + Alignment)
Blocks are always 100% width with no way to center or right-align them within a region. Users should be able to:
- Set block width (auto, px, %, fit-content)
- Set horizontal alignment (left, center, right) — this translates to margin-left/right: auto patterns or alignSelf on the flex container

### P5: Content Type Actions Missing
There's no clear UI affordance for:
- Adding content to an empty block
- Changing a block's content type (text → bullets, bullets → text)
- Adding a bullet to an existing bullet list from the sidebar
- Adding an image to a block

The Block Library handles inserting new pre-built blocks, but editing existing block content types is not exposed.

### P6: Theme Headings/Links Lack Full Style Controls
Theme headings (h1–h6) only expose: fontSize, color, letterSpacing, textTransform, borderBottom.
Theme links only expose: color.

**Missing from headings:** backgroundColor, fontFamily, fontWeight, lineHeight, textAlign, textDecoration, padding, margin, boxShadow, borderRadius
**Missing from links:** textDecoration, fontWeight, backgroundColor, padding, borderRadius

These are commonly needed for resume styling (e.g., heading with colored background, underlined links, pill-shaped skill tags).

### P7: No Increment/Decrement Buttons on Number Inputs
`SpacingInput` supports keyboard arrow nudging but has no visible +/- buttons. Users who don't know about arrow keys have no way to increment/decrement values visually. Line height and letter spacing inputs also lack this.

### P8: Undo/Redo UI Buttons
The History section in ThemePanel has undo/redo buttons. These should be removed — Cmd+Z/Shift+Cmd+Z is sufficient and the buttons waste space. Keep the keyboard shortcuts and history stack, just remove the visible buttons.

---

## Research Areas

Each agent should investigate ALL of the following areas. Record findings in the corresponding file under `research/findings/`.

### Area 1: Input Controls & Interactions (`findings/input-controls.md`)
**Research questions:**
- How do Figma, Canva, Sketch, Adobe XD, Webflow, Framer handle dimension inputs? (stepper buttons, scrubbing, unit selection, presets)
- How do they handle color inputs? (palette integration, opacity, gradients, recent colors)
- What's the best pattern for a unified dimension input that handles px/pt/em/rem/%/fr/auto?
- Should inputs support drag-to-scrub (like Figma's number inputs)?
- How should "inherit" / "unset" / "auto" special values be handled in a numeric input?
- What keyboard shortcuts do professional tools use for nudging values?
- How do tools handle mixed units (e.g., grid values with different units per track)?

### Area 2: Property Panel Layout & Density (`findings/panel-layout.md`)
**Research questions:**
- How do Figma, Sketch, Webflow, Framer organize properties in their sidebars?
- What's the optimal balance between density and readability?
- Which properties pair well on the same row? (e.g., width+height, font-weight+font-style, x+y offsets)
- How do tools handle the "advanced" vs "common" property split?
- Should there be a "compact mode" toggle for power users?
- How wide should the sidebar be by default? (Current: 320px, range 240–500px)
- How do tools group properties? (By CSS category? By visual meaning? By frequency of use?)
- How do tools visually separate sections without wasting space?

### Area 3: Property Coverage & Consistency (`findings/property-coverage.md`)
**Research questions:**
- What CSS properties are most commonly used in resume/document styling?
- For each editable target (block, region, heading, link), what's the ideal property set?
- Should we add: textDecoration, opacity, transform, filter, overflow, display, position?
- How do Canva/Webflow/Framer handle per-element vs inherited style overrides?
- What's the right abstraction level? (Raw CSS props vs. semantic controls like "shadow: soft/medium/hard"?)
- Should there be style presets per property? (e.g., border-radius: none/slight/rounded/pill)
- How should the panel change when selecting different content types (text vs bullets vs image vs nested blocks)?

### Area 4: Block Layout & Sizing (`findings/block-layout.md`)
**Research questions:**
- How do Notion, Google Docs, Canva handle block width and alignment?
- What UI pattern works best for width input (slider? input? preset buttons like auto/50%/100%?)?
- How should horizontal alignment interact with width? (e.g., centered 50%-width block)
- Should blocks support min-width / max-width?
- How do document editors handle vertical spacing between blocks vs margin?
- Should block alignment be in the sidebar or on the floating toolbar (or both)?
- Is flex alignSelf the right CSS mechanism, or should we use margin auto patterns?

### Area 5: Content Editing Workflows (`findings/content-editing.md`)
**Research questions:**
- How do Notion, Google Docs, Confluence handle content type switching (text → list, list → text)?
- What's the best UI pattern for "add content to empty block"?
- Should content type be changeable after creation, or is delete + re-add acceptable?
- How should "add bullet" work from the sidebar vs inline?
- For images: upload vs URL? Drag-drop? Paste? (Phase 1 is URL-only, but think about UX)
- How do tools handle mixed content (text + image in same block)? Is our Content union type sufficient?
- How should the sidebar reflect what content type is active and what actions are available?

### Area 6: Theme & Global Style Controls (`findings/theme-controls.md`)
**Research questions:**
- How do Canva, Webflow, Squarespace handle global style theming?
- What properties should theme headings expose? What about links?
- Should theme have "style presets" (e.g., "Modern," "Classic," "Minimal" that set multiple properties at once)?
- How do tools handle the inheritance cascade visually? (Showing "inherited from theme" vs "overridden locally")
- Should there be a "reset to theme" button on every overridden property?
- How should the theme panel organize heading styles? (Current: per-tag rows with multiple properties inline — gets wide)
- Should link styles support hover/visited states? (Probably not for PDF, but consider)

### Area 7: Visual Design & Polish (`findings/visual-design.md`)
**Research questions:**
- What color scheme/design language do the best editor sidebars use? (Neutral grays? Accent colors? Dark mode?)
- How do tools use icons vs text labels? Which properties benefit from icons?
- What animations/transitions make the sidebar feel polished? (Section expand, value change, selection switch)
- How do tools indicate "this property is overriding an inherited value"?
- How do tools indicate "this property is using a theme/palette variable"?
- What does good error state look like for invalid values?
- How do tools handle empty states (no block selected, no content, etc.)?
- Should the sidebar have a fixed header with breadcrumbs showing the selection path?

---

## Reference Applications to Study

Study these tools specifically for their property panel UX. Note what works, what doesn't, and what's transferable to a resume editor context:

1. **Figma** — gold standard for property panel density and interaction patterns
2. **Canva** — simpler audience, good progressive disclosure
3. **Webflow** — closest analog (CSS editor with visual UI)
4. **Framer** — modern take on component property editing
5. **Sketch** — established patterns, good section organization
6. **Adobe XD** — Microsoft's approach to property panels
7. **Notion** — block-based editor, inline editing model
8. **Google Docs** — document editor, toolbar patterns
9. **Affinity Designer** — desktop-class property panels
10. **WordPress Gutenberg** — block editor with sidebar controls

---

## Output Format

For each research area, create findings in the corresponding file under `research/findings/`. Each file follows this structure:

```markdown
# [Area Name] — Research Findings

## Current State
[Brief description of how Arete currently handles this area — cite specific files/components]

## Industry Analysis

### [Tool Name 1]
- What they do well:
- What they do poorly:
- Transferable patterns:

### [Tool Name 2]
...

## Recommendations

### Must-Have Changes
[Numbered list of changes that directly address the problems stated above]

### Nice-to-Have Improvements
[Things that would be good but aren't critical for the overhaul]

### Things to Avoid
[Anti-patterns or over-engineering risks]

## Agent Findings

### Claude
[Findings from Claude agents go here]

### Gemini
[Findings from Gemini agents go here]

### Codex
[Findings from Codex agents go here]

### Other
[Findings from any other agents]
```

---

## Constraints & Guardrails

1. **No code changes.** Research only. Produce findings and recommendations.
2. **No new dependencies** unless strongly justified. We already use Radix UI.
3. **No Tailwind.** Plain CSS modules.
4. **No data model changes.** `Style = Partial<CSSProperties>` is final. `app/models.ts` is the source of truth.
5. **Preserve the selection system.** The click-on-preview-to-select-then-edit-in-sidebar flow is non-negotiable. You may suggest enhancements but not replacements.
6. **Phase 1 scope.** No auth, no database, no AI features. Just the editor.
7. **Progressive disclosure is key.** The sidebar must work for beginners AND power users. Default to showing common properties; advanced ones behind collapsible sections or expandable rows.
8. **Resume context.** This is not a general-purpose design tool. Properties that don't make sense for resume styling (cursor, pointer-events, z-index, transform) should not be added.
9. **PDF parity.** Everything in the editor must render identically in Puppeteer PDF export. No properties that only work on screen (hover states, transitions, animations).

---

## Beyond the Known Problems — Open-Ended Discovery

The problems listed above (P1–P8) are the ones we've already identified. **They are not exhaustive.** A major goal of this research is to surface issues, friction points, and improvement opportunities we haven't thought of yet.

As you study the codebase and reference applications, actively look for:

### UX Friction You Wouldn't Notice Until You Use It
- Workflows that take too many clicks or require non-obvious knowledge
- Places where a user would get stuck and not know what to do next
- Missing feedback (did my change apply? what did I just break? why doesn't this look right?)
- Confusing terminology or labels that don't match user expectations
- Situations where a casual user (someone who just wants a nice resume) would feel overwhelmed
- Situations where a power user (designer, developer) would feel limited or slowed down

### Patterns Other Tools Do That We Don't Even Have a Category For
- Onboarding / first-use experience — what happens when someone opens the editor for the first time?
- Contextual help — tooltips, inline hints, "what does this property do?" explanations
- Keyboard-first workflows — can a power user drive the entire editor without touching the mouse?
- Accessibility beyond ARIA labels — screen reader workflows, reduced motion, high contrast
- Undo granularity — are our 500ms-coalesced undo steps the right size? Do users expect finer or coarser?
- Copy/paste of styles — can you copy a block's style and paste it onto another block?
- Style comparison — can you see how two blocks differ in style?
- Responsive preview — what if someone wants to see how their resume looks at different sizes?
- Print preview — a "how will this actually look printed?" mode
- Zoom controls — can users zoom in/out on the preview?

### Serving Two Audiences
This editor must serve both:
1. **Casual users** — "I just want a professional resume in 10 minutes." They need smart defaults, presets, templates, and guardrails. They should never see raw CSS values. They want to pick from curated options, not build from scratch.
2. **Power users** — "I want pixel-perfect control over every element." They need direct CSS property access, custom values, keyboard shortcuts, and no hand-holding.

Research how other tools serve both audiences simultaneously. Look for patterns like:
- Preset selectors (dropdown of "Small / Medium / Large") with a custom option that reveals the raw input
- "Simple" vs "Advanced" mode toggles
- Progressive disclosure that naturally guides casual users while not hiding power user controls
- Smart defaults that make the 80% case work without any configuration
- One-click style presets (e.g., "Professional," "Creative," "Minimalist" button that sets 10 properties at once)

### Things That Might Be Wrong With What We're Keeping
Even for the "keep" items (selection system, inline editing, etc.), note any friction or improvement ideas — just flag them as **suggestions, not replacements**. For example:
- "The selection system works well, but there's no visual breadcrumb showing the selection path in the sidebar — users lose context"
- "Inline editing is good, but there's no way to know which keyboard shortcuts are available while editing"
- "The floating toolbar could benefit from a style-copy button"

### Resume-Specific UX Insights
Study resume-specific tools and workflows:
- What do Zety, Resume.io, Novoresume, Enhancv, Kickresume do well?
- What common resume formatting tasks are tedious in general-purpose tools?
- What resume-specific presets would save users time? (e.g., "Skills grid," "Timeline layout," "Contact bar")
- How do resume tools handle the one-page constraint UX?
- How do they handle ATS (Applicant Tracking System) compatibility concerns in the UI?

**Record all open-ended findings in the relevant area file.** If a finding doesn't fit any area, add it to `findings/visual-design.md` under a new "## Discovered Issues" section, or create a new findings file if the topic warrants it.

---

## Priority Order

If you need to prioritize your research time:

1. **Input Controls** (P1, P7) — highest impact, affects every panel
2. **Panel Layout & Density** (P2) — second highest, visual clutter is the main complaint
3. **Property Coverage** (P3, P6) — what's missing and what should be added
4. **Block Layout** (P4) — width/alignment controls
5. **Content Editing** (P5) — content type workflows
6. **Theme Controls** (P6) — heading/link style expansion
7. **Visual Design** (P7 area) — polish and consistency

---

## Getting Started

1. Read `CLAUDE.md` and `app/models.ts` thoroughly
2. Read all files in `app/components/editor/` to understand current implementation
3. Read `app/styles/tokens.css` and `app/components/editor/editor.module.css` for current visual language
4. Pick your assigned research area(s) or cover all areas
5. Study the reference applications listed above
6. Write findings in the corresponding `research/findings/` file
7. Be specific — cite exact component names, file paths, and line numbers when referencing current code
8. Be concrete — don't just say "make it better," say exactly what property goes where and how the input should work
