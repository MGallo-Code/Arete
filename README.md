# Arete

A resume tailoring tool, allows you to write out your full portfolio once, and generate a full one-page resume targeted to any specific job position.

> _Arete (ἀρετή) — excellence, the best possible expression of a thing._

## Status

**Currently working on Layout Engine** (in progress): live resume editor with PDF export. No accounts, backend, AI yet involved

## Stack (Future)

- **Next.js + TypeScript** — framework
- **React 19** — UI (plain CSS modules, no Tailwind)
- **Radix UI** — accessible primitives (dialogs, tabs, tooltips, etc.)
- **Puppeteer** — PDF export (planned)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

Arete is a [Next.js](https://nextjs.org/) app (App Router, React 19, TypeScript) that treats a resume as structured data and renders it through a composable pipeline:

```
Resume → Template (grid layout + theme) → Regions → Blocks → Content (text / bullets / images / nested blocks)
```

### Data model

- **Resume** — top-level document containing a template and a flat block map
- **Template** — CSS Grid layout (`grid-template`), region styles, page settings, theme, and optional font list
- **Theme** — cascading styles for headings, bullets, links, and root/canvas surfaces, plus a 5-color palette
- **Block** — a content unit with an optional header, style overrides, and one of four content types: rich text, bullet list, image, or nested blocks
- **Region** — a named CSS Grid area; the resume maps region names to ordered block ID lists

All types live in `app/models.ts`.

### Renderer

```
ResumePreview → BlockView → ContentView → RichTextView / BulletsView / (recurse BlockView)
```

The renderer is a pure React tree with no editor dependencies, making it reusable for PDF export via Puppeteer.
