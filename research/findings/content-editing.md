# Content Editing Workflows — Research Findings

## Current State
Content editing in Arete is siloed by content type.
- **Data Model:** `Content` is a union type (`text`, `bullets`, `blocks`, `image`).
- **Editing Logic:** `ContentView.tsx` switches rendering based on the type. `EditableRichText.tsx` handles `text` and `header`. `BulletsView.tsx` handles `bullets` with a sophisticated Enter/Tab/Backspace model. `ImageControls.tsx` handles `image` source/alt/style in the sidebar.
- **Switching:** There is NO UI for changing a block's content type once created. You must delete and re-add from the Block Library.
- **Empty States:** Blocks with no content (e.g., empty string in text) are visually difficult to select or interact with unless they have a header.

## Industry Analysis

### Notion
- **What they do well:** The "/" command and "Turn into" menu allow seamless switching between text, bullets, headings, and callouts.
- **What they do poorly:** Can be complex for a casual user to discover the full breadth of commands.
- **Transferable patterns:** "Turn into" dropdown in the sidebar or block menu.

### Google Docs
- **What they do well:** Familiar "Format" menu and toolbar buttons to convert selection to a list or heading.
- **What they do poorly:** Not really a block-based editor, so switching a "block" is less relevant than formatting text.
- **Transferable patterns:** Converting a block of text into a bulleted list should split by paragraph/newline.

### WordPress Gutenberg
- **What they do well:** "Transform" menu in the toolbar for each block type. It shows only compatible transforms (e.g., Paragraph → List, List → Paragraph).
- **What they do poorly:** Some transforms are destructive or result in unexpected layouts.
- **Transferable patterns:** Intelligent mapping when switching (e.g., text value becomes the first bullet point).

### Canva
- **What they do well:** Drag-and-drop from a library. If you select an element, the sidebar updates with context-specific actions (e.g., for an image, show "Edit Image" or "Replace").
- **What they do poorly:** Less of a structured "block" flow, more of a free-form canvas.
- **Transferable patterns:** Contextual primary actions (e.g., "Add Item" for lists, "Change Source" for images) in a "Content" sidebar section.

## Recommendations

### Must-Have Changes
1. **Add "Content" section to `BlockStylePanel`:**
   - **Content Type Selector:** A dropdown or toggle group to switch the `Content` type (Text, Bullets, Image).
   - **Conversion Logic:**
     - Text → Bullets: Create a single bullet with the text content.
     - Bullets → Text: Join all bullet items with newlines (or use `RichText` from the first item).
     - Text/Bullets → Image: Replace content with a placeholder image.
2. **"Add Content" for Empty Blocks:**
   - If a block is empty (e.g., initial state), show a small "Content Picker" overlay with icons for "Text", "Bullets", and "Image" directly in the preview.
3. **Sidebar Action Buttons:**
   - For `bullets`, add a permanent "+ Add Item" button in the sidebar.
   - For `image`, add a "Change Image" button that opens a URL input (or eventually a file picker).
4. **Improved Empty State Rendering:**
   - Ensure empty text blocks have a minimum height or a "Type something..." placeholder to keep them clickable.

### Nice-to-Have Improvements
1. **Multi-line Paste into Bullets:** Already exists in `BulletsView.tsx`, but ensure it's robust and handles various line endings.
2. **Contextual Toolbar "Convert" Button:** Add a "Turn into..." button to the `FloatingToolbar`.
3. **Image Placeholder Service:** Use a service like Unsplash or clear placeholders if no URL is provided.

### Things to Avoid
- **Avoid destructive transforms without confirmation:** If switching from a large list of bullets to an image, warn the user.
- **Don't hide sidebar controls based on content type:** Use `CollapsibleSection` to hide/show them, but keep the overall panel structure consistent.

## Agent Findings

### Gemini
- **"Add Content" Visual Affordance:** When a block is empty, the preview should show a subtle "plus" icon or "Select content type..." overlay that disappears on hover or selection. This reduces the "Where do I click?" friction.
- **Style Copy/Paste (Format Painter):** Add "Copy Style" and "Paste Style" buttons to the `FloatingToolbar`. This allows users to quickly unify the look of different sections (e.g., copy heading style from "Experience" to "Education").
- **Content Type Quick-Actions:** In the sidebar's "Content" section, show visual thumbnails for the content types (Text, List, Image) to make switching feel more like a "Template" choice than a technical "Type" change.
- **Auto-Formatting on Paste:** When pasting text into a `bullets` block, the editor should automatically detect if it's a list (e.g., starts with "-", "*", or "1.") and split it into multiple `BulletItem` entries.
- **Quick-Add "Skill Tag":** A resume-specific quick-action for "Add Skill Tag" that creates a pre-styled small block or bullet with a pill background.
