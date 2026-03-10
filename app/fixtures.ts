import type { Block, Resume, RichText, Theme } from "./models";

// Fixture convention: use block.style for colors/font sizes so the editor can change them
// (Theme panel, Block style panel). Use run-level style only for semantic formatting (bold, italic).

export const sampleResume: Resume = {
  id: "sample-001",
  title: "John Doe — Software Engineer (Classic Two-Column)",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-07T00:00:00Z",

  template: {
    id: "classic-two-col",
    name: "Classic Two-Column",
    grid: '"header header" auto "sidebar main" 1fr / 30% 70%',
    regionStyles: {
      header: {
        background: "var(--palette-background)",
        padding: "24px 32px",
        borderBottom: "2px solid var(--palette-primary)",
      },
      sidebar: {
        background: "var(--palette-background)",
        padding: "24px 20px",
        gap: "12px",
      },
      main: {
        padding: "24px 32px",
        gap: "14px",
      },
    },
    page: {
      size: "letter",
      margins: { top: "0", right: "0", bottom: "0", left: "0" },
    },
    fonts: ["Georgia"],
    theme: {
      root: {
        fontFamily: "Georgia, serif",
        fontSize: "10pt",
        lineHeight: "1.5",
        color: "#1a1a1a",
        background: "#ffffff",
      },
      canvas: {},
      h1: {
        fontSize: "22pt",
        fontWeight: "bold",
        letterSpacing: "0.02em",
        color: "#1a1a1a",
      },
      h2: {
        fontSize: "9pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--palette-primary)",
        padding: "0 0 2px 0",
        margin: "0 0 6px 0",
        borderBottom: "1px solid var(--palette-primary)",
      },
      h3: {
        fontSize: "10pt",
        fontWeight: "bold",
        color: "#1a1a1a",
      },
      h4: {
        fontSize: "10pt",
        fontStyle: "italic",
        color: "var(--palette-muted)",
      },
      h5: { fontSize: "9pt" },
      h6: { fontSize: "9pt" },
      bullets: [
        // level 0 — top-level bullets
        { char: "•", style: { fontSize: "10pt", lineHeight: "1.5", gap: "0.35em" } },
        // level 1 — indented sub-bullets
        { char: "–", style: { fontSize: "9pt", lineHeight: "1.5", paddingLeft: "12px", gap: "0.35em" } },
      ],
      link: {
        color: "var(--palette-accent)",
      },
      palette: {
        primary: "#2563eb",
        secondary: "#1e40af",
        accent: "#3b82f6",
        muted: "#94a3b8",
        background: "#f8fafc",
      },
    },
  },

  regionBlockIds: {
    header: ["block-name"],
    sidebar: ["block-contact", "block-skills", "block-education"],
    main: ["block-summary", "block-experience", "block-projects"],
  },

  blocks: {
    "block-name": {
      id: "block-name",
      content: {
        type: "blocks",
        children: [
          {
            id: "block-name-title",
            header: { content: [{ text: "John Doe" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "block-name-subtitle",
            style: { color: "var(--palette-primary)", fontSize: "12pt" },
            content: {
              type: "text",
              value: [{ text: "Senior Software Engineer" }],
            },
          },
        ],
      },
    },

    "block-contact": {
      id: "block-contact",
      tags: ["contact"],
      header: { content: [{ text: "Contact" }], tag: "h2" },
      content: {
        type: "bullets",
        items: [
          { content: [{ text: "hello@example.dev" }] },
          { content: [{ text: "linkedin.com/in/example", link: "https://example.com/linkedin" }] },
          { content: [{ text: "github.com/example", link: "https://example.com/github" }] },
          { content: [{ text: "San Francisco, CA" }] },
        ],
      },
    },

    "block-skills": {
      id: "block-skills",
      tags: ["skills"],
      header: { content: [{ text: "Skills" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "block-skills-languages",
            header: { content: [{ text: "Languages" }], tag: "h3" },
            content: { type: "text", value: [{ text: "TypeScript, Python, Go, SQL" }] },
          },
          {
            id: "block-skills-frontend",
            header: { content: [{ text: "Frontend" }], tag: "h3" },
            content: { type: "text", value: [{ text: "React, Next.js, CSS, Figma" }] },
          },
          {
            id: "block-skills-backend",
            header: { content: [{ text: "Backend & Infra" }], tag: "h3" },
            content: { type: "text", value: [{ text: "Node.js, PostgreSQL, Redis, Docker, AWS" }] },
          },
        ],
      },
    },

    "block-education": {
      id: "block-education",
      tags: ["education"],
      header: { content: [{ text: "Education" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "block-edu-degree",
            header: { content: [{ text: "B.S. Computer Science" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                { text: "UC Berkeley", style: { fontStyle: "italic" } },
                { text: "  ·  2016" },
              ],
            },
          },
        ],
      },
    },

    "block-summary": {
      id: "block-summary",
      tags: ["summary"],
      header: { content: [{ text: "Summary" }], tag: "h2" },
      content: {
        type: "text",
        value: [
          {
            text: "Full-stack engineer with 8 years building scalable web products. Focused on developer experience, performance, and shipping things that matter. Led teams of 2–6 engineers across consumer and B2B products.",
          },
        ],
      },
    },

    "block-experience": {
      id: "block-experience",
      tags: ["experience"],
      header: { content: [{ text: "Experience" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "job-1",
            tags: ["experience"],
            content: {
              type: "blocks",
              children: [
                {
                  id: "job-1-title",
                  header: { content: [{ text: "Staff Engineer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Nexlify", style: { fontStyle: "italic" } },
                      { text: "  ·  2022 – Present" },
                    ],
                  },
                },
                {
                  id: "job-1-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Led infrastructure for Next.js edge runtime, reducing cold-start latency by 60%." }] },
                      { content: [{ text: "Designed the rollout system for 40,000+ customer deployments with zero downtime." }] },
                      { content: [{ text: "Mentored 4 engineers to senior level; established team RFC process." }] },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "job-2",
            tags: ["experience"],
            content: {
              type: "blocks",
              children: [
                {
                  id: "job-2-title",
                  header: { content: [{ text: "Senior Software Engineer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Paytrek", style: { fontStyle: "italic" } },
                      { text: "  ·  2019 – 2022" },
                    ],
                  },
                },
                {
                  id: "job-2-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Built Stripe Checkout v3 used by 500k+ merchants worldwide." }] },
                      { content: [{ text: "Reduced checkout abandonment 18% through A/B-tested UX improvements." }] },
                      { content: [{ text: "Owned PCI-DSS scope for frontend payment field isolation." }] },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "job-3",
            tags: ["experience"],
            content: {
              type: "blocks",
              children: [
                {
                  id: "job-3-title",
                  header: { content: [{ text: "Software Engineer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Staylo", style: { fontStyle: "italic" } },
                      { text: "  ·  2016 – 2019" },
                    ],
                  },
                },
                {
                  id: "job-3-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Rebuilt the host onboarding flow, increasing listing completion by 32%." }] },
                      { content: [{ text: "Contributed to the open-source React Native Maps library (2.4k GitHub stars)." }] },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    "block-projects": {
      id: "block-projects",
      tags: ["projects"],
      header: { content: [{ text: "Projects" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "project-1",
            tags: ["project"],
            header: { content: [{ text: "Arete" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                {
                  text: "Resume tailoring tool. Store your portfolio once; generate targeted one-page resumes with AI. Built with Next.js + Puppeteer.",
                },
              ],
            },
          },
          {
            id: "project-2",
            tags: ["project"],
            header: { content: [{ text: "pgvibe" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                {
                  text: "Type-safe PostgreSQL query builder for TypeScript with zero runtime overhead. 1.2k GitHub stars.",
                },
              ],
            },
          },
        ],
      },
    },
  },
};

// --- Sample Resume 2: Modern Minimal — single column, sans-serif, dark header ---

export const sampleResume2: Resume = {
  id: "sample-002",
  title: "Jane Smith — Product Designer (Modern Minimal)",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-07T00:00:00Z",

  template: {
    id: "modern-minimal",
    name: "Modern Minimal",
    grid: '"header" auto "main" 1fr / 1fr',
    regionStyles: {
      header: {
        background: "var(--palette-primary)",
        padding: "32px 40px",
        color: "#ffffff",
      },
      main: {
        padding: "32px 40px",
      },
    },
    page: {
      size: "letter",
      margins: { top: "0", right: "0", bottom: "0", left: "0" },
    },
    fonts: ["Inter"],
    theme: {
      root: {
        fontFamily: "Inter, Helvetica, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.5",
        color: "#111827",
        background: "#ffffff",
      },
      canvas: {},
      h1: {
        fontSize: "24pt",
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: "-0.01em",
      },
      h2: {
        fontSize: "8pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "var(--palette-secondary)",
        marginBottom: "8px",
        marginTop: "20px",
      },
      h3: { fontSize: "10pt", fontWeight: "bold" },
      h4: { fontSize: "10pt", color: "var(--palette-secondary)" },
      h5: { fontSize: "9pt" },
      h6: { fontSize: "9pt" },
      bullets: [
        { char: "–", style: { fontSize: "10pt", lineHeight: "1.6", gap: "0.35em" } },
        { char: "·", style: { fontSize: "9pt", lineHeight: "1.6", paddingLeft: "12px", gap: "0.35em" } },
      ],
      link: { color: "var(--palette-accent)" },
      palette: {
        primary: "#111827",
        secondary: "#6b7280",
        accent: "#2563eb",
        muted: "#9ca3af",
        background: "#ffffff",
      },
    },
  },

  regionBlockIds: {
    header: ["mc-block-name"],
    main: ["mc-block-experience", "mc-block-skills", "mc-block-education"],
  },

  blocks: {
    "mc-block-name": {
      id: "mc-block-name",
      content: {
        type: "blocks",
        children: [
          {
            id: "mc-name-title",
            header: { content: [{ text: "Jane Smith" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "mc-name-subtitle",
            style: { color: "var(--palette-muted)" },
            content: {
              type: "text",
              value: [
                { text: "Product Designer  ·  " },
                { text: "hello@example.design", link: "mailto:hello@example.design" },
                { text: "  ·  " },
                { text: "example.design", link: "https://example.design" },
              ],
            },
          },
        ],
      },
    },

    "mc-block-experience": {
      id: "mc-block-experience",
      tags: ["experience"],
      header: { content: [{ text: "Experience" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "mc-job-1",
            content: {
              type: "blocks",
              children: [
                {
                  id: "mc-job-1-title",
                  header: { content: [{ text: "Senior Product Designer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Canza", style: { fontStyle: "italic" } },
                      { text: "  ·  2023 – Present" },
                    ],
                  },
                },
                {
                  id: "mc-job-1-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Led redesign of the components panel, reducing search time by 40%." }] },
                      { content: [{ text: "Defined design system tokens adopted across 6 product teams." }] },
                      { content: [{ text: "Ran 20+ usability sessions to validate navigation restructure." }] },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "mc-job-2",
            content: {
              type: "blocks",
              children: [
                {
                  id: "mc-job-2-title",
                  header: { content: [{ text: "Product Designer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Tracklo", style: { fontStyle: "italic" } },
                      { text: "  ·  2020 – 2023" },
                    ],
                  },
                },
                {
                  id: "mc-job-2-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Designed the cycles and roadmap features from 0 to GA." }] },
                      { content: [{ text: "Established Linear's motion design principles and Framer prototyping kit." }] },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    "mc-block-skills": {
      id: "mc-block-skills",
      tags: ["skills"],
      header: { content: [{ text: "Skills" }], tag: "h2" },
      content: {
        type: "text",
        value: [{ text: "Figma, Framer, Prototyping, Design Systems, User Research, Accessibility, Webflow" }],
      },
    },

    "mc-block-education": {
      id: "mc-block-education",
      tags: ["education"],
      header: { content: [{ text: "Education" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "mc-edu-degree",
            header: { content: [{ text: "B.F.A. Interaction Design" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                { text: "California College of the Arts", style: { fontStyle: "italic" } },
                { text: "  ·  2020" },
              ],
            },
          },
        ],
      },
    },
  },
};

// --- Sample Resume 3: Navy Split — 45/55 two-column, no header row ---

export const sampleResume3: Resume = {
  id: "sample-003",
  title: "Sam Johnson — Data Scientist (Navy Split)",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-07T00:00:00Z",

  template: {
    id: "navy-split",
    name: "Navy Split",
    grid: '"sidebar main" 1fr / 45% 55%',
    regionStyles: {
      sidebar: {
        background: "var(--palette-primary)",
        padding: "36px 28px",
        color: "#ffffff",
      },
      main: {
        padding: "36px 32px",
      },
    },
    page: {
      size: "letter",
      margins: { top: "0", right: "0", bottom: "0", left: "0" },
    },
    fonts: ["DM Sans"],
    theme: {
      root: {
        fontFamily: "'DM Sans', Helvetica, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.5",
        color: "#1a1a2e",
        background: "#ffffff",
      },
      canvas: {},
      h1: {
        fontSize: "20pt",
        fontWeight: "bold",
        color: "#ffffff",
        lineHeight: "1.2",
      },
      h2: {
        fontSize: "8pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "var(--palette-accent)",
        marginBottom: "6px",
        marginTop: "20px",
        borderBottom: "1px solid var(--palette-secondary)",
        paddingBottom: "3px",
      },
      h3: { fontSize: "10pt", fontWeight: "bold", color: "#ffffff" },
      h4: { fontSize: "9pt", color: "var(--palette-muted)" },
      h5: { fontSize: "9pt" },
      h6: { fontSize: "9pt" },
      bullets: [
        { char: "▸", style: { fontSize: "10pt", lineHeight: "1.5", gap: "0.35em", color: "#ffffff" } },
        { char: "–", style: { fontSize: "9pt", lineHeight: "1.5", paddingLeft: "10px", gap: "0.35em", color: "var(--palette-muted)" } },
      ],
      link: { color: "var(--palette-muted)" },
      palette: {
        primary: "#1e3a5f",
        secondary: "#2d5a8e",
        accent: "#7eb8f7",
        muted: "#93c5fd",
        background: "#ffffff",
      },
    },
  },

  regionBlockIds: {
    sidebar: ["ar-block-name", "ar-block-contact", "ar-block-skills", "ar-block-education"],
    main: ["ar-block-summary", "ar-block-experience", "ar-block-projects"],
  },

  blocks: {
    "ar-block-name": {
      id: "ar-block-name",
      content: {
        type: "blocks",
        children: [
          {
            id: "ar-name-title",
            header: { content: [{ text: "Sam Johnson" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "ar-name-subtitle",
            style: { color: "var(--palette-muted)", fontSize: "11pt" },
            content: {
              type: "text",
              value: [{ text: "Data Scientist" }],
            },
          },
        ],
      },
    },

    "ar-block-contact": {
      id: "ar-block-contact",
      tags: ["contact"],
      header: { content: [{ text: "Contact" }], tag: "h2" },
      content: {
        type: "bullets",
        items: [
          { content: [{ text: "hello@example.io" }] },
          { content: [{ text: "github.com/example", link: "https://example.com/github" }] },
          { content: [{ text: "Seattle, WA" }] },
        ],
      },
    },

    "ar-block-skills": {
      id: "ar-block-skills",
      tags: ["skills"],
      header: { content: [{ text: "Skills" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "ar-skills-languages",
            header: { content: [{ text: "Languages" }], tag: "h3" },
            content: { type: "text", value: [{ text: "Python, R, SQL, Scala" }] },
          },
          {
            id: "ar-skills-tools",
            header: { content: [{ text: "Tools & Frameworks" }], tag: "h3" },
            content: { type: "text", value: [{ text: "PyTorch, scikit-learn, Spark, dbt, Airflow" }] },
          },
          {
            id: "ar-skills-cloud",
            header: { content: [{ text: "Cloud" }], tag: "h3" },
            content: { type: "text", value: [{ text: "AWS SageMaker, GCP BigQuery, Databricks" }] },
          },
        ],
      },
    },

    "ar-block-education": {
      id: "ar-block-education",
      tags: ["education"],
      header: { content: [{ text: "Education" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "ar-edu-ms",
            header: { content: [{ text: "M.S. Statistics" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                { text: "University of Washington", style: { fontStyle: "italic" } },
                { text: "  ·  2019" },
              ],
            },
          },
          {
            id: "ar-edu-bs",
            header: { content: [{ text: "B.S. Mathematics" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                { text: "UCLA", style: { fontStyle: "italic" } },
                { text: "  ·  2017" },
              ],
            },
          },
        ],
      },
    },

    "ar-block-summary": {
      id: "ar-block-summary",
      tags: ["summary"],
      header: { content: [{ text: "Summary" }], tag: "h2" },
      content: {
        type: "text",
        value: [
          {
            text: "Data scientist with 6 years building production ML systems across e-commerce and fintech. Focused on causal inference, experimentation, and turning messy data into decisions.",
          },
        ],
      },
    },

    "ar-block-experience": {
      id: "ar-block-experience",
      tags: ["experience"],
      header: { content: [{ text: "Experience" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "ar-job-1",
            content: {
              type: "blocks",
              children: [
                {
                  id: "ar-job-1-title",
                  header: { content: [{ text: "Staff Data Scientist" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Paytrek", style: { fontStyle: "italic" } },
                      { text: "  ·  2022 – Present" },
                    ],
                  },
                },
                {
                  id: "ar-job-1-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Built fraud detection model reducing chargebacks by $12M annually." }] },
                      { content: [{ text: "Designed A/B testing framework now used across 40+ product teams." }] },
                      { content: [{ text: "Led team of 4 scientists; drove quarterly OKR process." }] },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "ar-job-2",
            content: {
              type: "blocks",
              children: [
                {
                  id: "ar-job-2-title",
                  header: { content: [{ text: "Senior Data Scientist" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Shopwave", style: { fontStyle: "italic" } },
                      { text: "  ·  2019 – 2022" },
                    ],
                  },
                },
                {
                  id: "ar-job-2-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Developed demand forecasting models for 2M+ SKUs." }] },
                      { content: [{ text: "Reduced inventory holding cost 8% through improved reorder prediction." }] },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    "ar-block-projects": {
      id: "ar-block-projects",
      tags: ["projects"],
      header: { content: [{ text: "Projects" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "ar-project-1",
            tags: ["project"],
            header: { content: [{ text: "causalkit" }], tag: "h3" },
            content: {
              type: "text",
              value: [{ text: "Open-source Python library for causal inference in observational studies. 800+ GitHub stars." }],
            },
          },
        ],
      },
    },
  },
};

// --- Sample Resume 4: Bold Sidebar — wide left sidebar, bold geometric look ---

export const sampleResume4: Resume = {
  id: "sample-004",
  title: "Pat Taylor — Marketing Manager (Bold Sidebar)",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-09T00:00:00Z",

  template: {
    id: "bold-sidebar",
    name: "Bold Sidebar",
    grid: '"sidebar main" 1fr / 35% 65%',
    regionStyles: {
      sidebar: {
        background: "var(--palette-primary)",
        padding: "32px 24px",
        color: "#ffffff",
      },
      main: {
        padding: "32px 28px",
      },
    },
    page: {
      size: "letter",
      margins: { top: "0", right: "0", bottom: "0", left: "0" },
    },
    fonts: ["Raleway"],
    theme: {
      root: {
        fontFamily: "Raleway, Helvetica, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.5",
        color: "#2d2d2d",
        background: "#ffffff",
      },
      canvas: {},
      h1: { fontSize: "22pt", fontWeight: "bold", color: "#ffffff", lineHeight: "1.2" },
      h2: {
        fontSize: "9pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--palette-accent)",
        marginBottom: "6px",
        marginTop: "16px",
      },
      h3: { fontSize: "10pt", fontWeight: "bold" },
      h4: { fontSize: "10pt", color: "var(--palette-muted)" },
      h5: { fontSize: "9pt" },
      h6: { fontSize: "9pt" },
      bullets: [
        { char: "•", style: { fontSize: "10pt", lineHeight: "1.5", gap: "0.35em" } },
        { char: "–", style: { fontSize: "9pt", lineHeight: "1.5", paddingLeft: "12px", gap: "0.35em" } },
      ],
      link: { color: "var(--palette-accent)" },
      palette: {
        primary: "#7c3aed",
        secondary: "#5b21b6",
        accent: "#a78bfa",
        muted: "#9ca3af",
        background: "#faf5ff",
      },
    },
  },

  regionBlockIds: {
    sidebar: ["pt-block-name", "pt-block-contact", "pt-block-skills"],
    main: ["pt-block-summary", "pt-block-experience", "pt-block-education"],
  },

  blocks: {
    "pt-block-name": {
      id: "pt-block-name",
      content: {
        type: "blocks",
        children: [
          {
            id: "pt-name-title",
            header: { content: [{ text: "Pat Taylor" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "pt-name-subtitle",
            style: { color: "var(--palette-accent)", fontSize: "11pt" },
            content: { type: "text", value: [{ text: "Marketing Manager" }] },
          },
        ],
      },
    },

    "pt-block-contact": {
      id: "pt-block-contact",
      tags: ["contact"],
      header: { content: [{ text: "Contact" }], tag: "h2" },
      content: {
        type: "bullets",
        items: [
          { content: [{ text: "hello@example.com" }] },
          { content: [{ text: "linkedin.com/in/example", link: "https://example.com/linkedin" }] },
          { content: [{ text: "Chicago, IL" }] },
        ],
      },
    },

    "pt-block-skills": {
      id: "pt-block-skills",
      tags: ["skills"],
      header: { content: [{ text: "Skills" }], tag: "h2" },
      content: {
        type: "bullets",
        items: [
          { content: [{ text: "Brand Strategy & Positioning" }] },
          { content: [{ text: "Content Marketing & SEO" }] },
          { content: [{ text: "Google Analytics, HubSpot, Marketo" }] },
          { content: [{ text: "A/B Testing & Conversion Optimization" }] },
          { content: [{ text: "Team Leadership (8 direct reports)" }] },
        ],
      },
    },

    "pt-block-summary": {
      id: "pt-block-summary",
      tags: ["summary"],
      header: { content: [{ text: "Summary" }], tag: "h2" },
      content: {
        type: "text",
        value: [
          {
            text: "Marketing leader with 10 years driving growth for B2B SaaS companies. Expertise in demand generation, brand positioning, and building high-performing teams. Consistently delivered 30%+ YoY pipeline growth.",
          },
        ],
      },
    },

    "pt-block-experience": {
      id: "pt-block-experience",
      tags: ["experience"],
      header: { content: [{ text: "Experience" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "pt-job-1",
            content: {
              type: "blocks",
              children: [
                {
                  id: "pt-job-1-title",
                  header: { content: [{ text: "Director of Marketing" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "CloudSync", style: { fontStyle: "italic" } },
                      { text: "  ·  2021 – Present" },
                    ],
                  },
                },
                {
                  id: "pt-job-1-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Grew marketing-sourced pipeline from $8M to $22M annually." }] },
                      { content: [{ text: "Launched account-based marketing program targeting Fortune 500 accounts." }] },
                      { content: [{ text: "Built and managed team of 8 across content, demand gen, and design." }] },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "pt-job-2",
            content: {
              type: "blocks",
              children: [
                {
                  id: "pt-job-2-title",
                  header: { content: [{ text: "Senior Marketing Manager" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Dataflow", style: { fontStyle: "italic" } },
                      { text: "  ·  2017 – 2021" },
                    ],
                  },
                },
                {
                  id: "pt-job-2-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Increased organic traffic 150% through content strategy overhaul." }] },
                      { content: [{ text: "Managed $1.2M annual ad spend across Google, LinkedIn, and programmatic." }] },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    "pt-block-education": {
      id: "pt-block-education",
      tags: ["education"],
      header: { content: [{ text: "Education" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "pt-edu-degree",
            header: { content: [{ text: "B.A. Marketing" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                { text: "Northwestern University", style: { fontStyle: "italic" } },
                { text: "  ·  2014" },
              ],
            },
          },
        ],
      },
    },
  },
};

// --- Sample Resume 5: Clean Single Column — centered header, no sidebar ---

export const sampleResume5: Resume = {
  id: "sample-005",
  title: "Chris Lee — Backend Engineer (Clean Single)",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-09T00:00:00Z",

  template: {
    id: "clean-single",
    name: "Clean Single Column",
    grid: '"header" auto "main" 1fr / 1fr',
    regionStyles: {
      header: {
        padding: "28px 40px",
        borderBottom: "3px solid var(--palette-primary)",
      },
      main: {
        padding: "24px 40px",
      },
    },
    page: {
      size: "letter",
      margins: { top: "0", right: "0", bottom: "0", left: "0" },
    },
    fonts: ["Source Sans Pro"],
    theme: {
      root: {
        fontFamily: "'Source Sans Pro', Helvetica, sans-serif",
        fontSize: "10pt",
        lineHeight: "1.5",
        color: "#1f2937",
        background: "#ffffff",
      },
      canvas: {},
      h1: { fontSize: "26pt", fontWeight: "bold", color: "#1f2937", letterSpacing: "-0.02em" },
      h2: {
        fontSize: "10pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--palette-primary)",
        marginBottom: "6px",
        marginTop: "18px",
        borderBottom: "1px solid var(--palette-muted)",
        paddingBottom: "4px",
      },
      h3: { fontSize: "10pt", fontWeight: "bold" },
      h4: { fontSize: "10pt", color: "var(--palette-muted)" },
      h5: { fontSize: "9pt" },
      h6: { fontSize: "9pt" },
      bullets: [
        { char: "•", style: { fontSize: "10pt", lineHeight: "1.6", gap: "0.4em" } },
        { char: "–", style: { fontSize: "9pt", lineHeight: "1.6", paddingLeft: "14px", gap: "0.4em" } },
      ],
      link: { color: "var(--palette-accent)" },
      palette: {
        primary: "#0d9488",
        secondary: "#0f766e",
        accent: "#14b8a6",
        muted: "#9ca3af",
        background: "#f0fdfa",
      },
    },
  },

  regionBlockIds: {
    header: ["cl-block-name"],
    main: ["cl-block-summary", "cl-block-experience", "cl-block-skills", "cl-block-education"],
  },

  blocks: {
    "cl-block-name": {
      id: "cl-block-name",
      content: {
        type: "blocks",
        children: [
          {
            id: "cl-name-title",
            header: { content: [{ text: "Chris Lee" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "cl-name-contact",
            style: { color: "var(--palette-muted)" },
            content: {
              type: "text",
              value: [
                { text: "hello@example.dev  ·  " },
                { text: "github.com/example", link: "https://example.com/github" },
                { text: "  ·  Austin, TX" },
              ],
            },
          },
        ],
      },
    },

    "cl-block-summary": {
      id: "cl-block-summary",
      tags: ["summary"],
      header: { content: [{ text: "Summary" }], tag: "h2" },
      content: {
        type: "text",
        value: [
          {
            text: "Backend engineer with 7 years building distributed systems and APIs at scale. Deep experience with Go, PostgreSQL, and cloud infrastructure. Passionate about reliability engineering and developer tooling.",
          },
        ],
      },
    },

    "cl-block-experience": {
      id: "cl-block-experience",
      tags: ["experience"],
      header: { content: [{ text: "Experience" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "cl-job-1",
            content: {
              type: "blocks",
              children: [
                {
                  id: "cl-job-1-title",
                  header: { content: [{ text: "Senior Backend Engineer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Vaultkey", style: { fontStyle: "italic" } },
                      { text: "  ·  2021 – Present" },
                    ],
                  },
                },
                {
                  id: "cl-job-1-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Designed event-driven architecture handling 50K events/second across 12 microservices." }] },
                      { content: [{ text: "Reduced P99 API latency from 800ms to 120ms through query optimization and caching." }] },
                      { content: [{ text: "Led migration from monolith to microservices with zero customer-facing downtime." }] },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "cl-job-2",
            content: {
              type: "blocks",
              children: [
                {
                  id: "cl-job-2-title",
                  header: { content: [{ text: "Software Engineer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Gridware", style: { fontStyle: "italic" } },
                      { text: "  ·  2018 – 2021" },
                    ],
                  },
                },
                {
                  id: "cl-job-2-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Built real-time data pipeline processing 2TB daily for IoT sensor data." }] },
                      { content: [{ text: "Implemented distributed tracing across 30+ services using OpenTelemetry." }] },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    "cl-block-skills": {
      id: "cl-block-skills",
      tags: ["skills"],
      header: { content: [{ text: "Skills" }], tag: "h2" },
      content: {
        type: "text",
        value: [{ text: "Go, Python, PostgreSQL, Redis, Kafka, gRPC, Kubernetes, Terraform, AWS, Datadog" }],
      },
    },

    "cl-block-education": {
      id: "cl-block-education",
      tags: ["education"],
      header: { content: [{ text: "Education" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "cl-edu-degree",
            header: { content: [{ text: "B.S. Computer Science" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                { text: "UT Austin", style: { fontStyle: "italic" } },
                { text: "  ·  2018" },
              ],
            },
          },
        ],
      },
    },
  },
};

// --- Sample Resume 6: Warm Accent — earthy tones, top header band ---

export const sampleResume6: Resume = {
  id: "sample-006",
  title: "Morgan Davis — UX Researcher (Warm Accent)",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-09T00:00:00Z",

  template: {
    id: "warm-accent",
    name: "Warm Accent",
    grid: '"header header" auto "sidebar main" 1fr / 32% 68%',
    regionStyles: {
      header: {
        background: "var(--palette-primary)",
        padding: "28px 32px",
        color: "#ffffff",
      },
      sidebar: {
        padding: "20px 20px",
        background: "var(--palette-background)",
      },
      main: {
        padding: "20px 28px",
      },
    },
    page: {
      size: "letter",
      margins: { top: "0", right: "0", bottom: "0", left: "0" },
    },
    fonts: ["Lora"],
    theme: {
      root: {
        fontFamily: "Lora, Georgia, serif",
        fontSize: "10pt",
        lineHeight: "1.55",
        color: "#3b2f2f",
        background: "#ffffff",
      },
      canvas: {},
      h1: { fontSize: "22pt", fontWeight: "bold", color: "#ffffff" },
      h2: {
        fontSize: "9pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--palette-primary)",
        marginBottom: "6px",
        marginTop: "16px",
        borderBottom: "1px solid var(--palette-accent)",
        paddingBottom: "3px",
      },
      h3: { fontSize: "10pt", fontWeight: "bold" },
      h4: { fontSize: "10pt", color: "var(--palette-muted)" },
      h5: { fontSize: "9pt" },
      h6: { fontSize: "9pt" },
      bullets: [
        { char: "•", style: { fontSize: "10pt", lineHeight: "1.55", gap: "0.35em" } },
        { char: "–", style: { fontSize: "9pt", lineHeight: "1.55", paddingLeft: "12px", gap: "0.35em" } },
      ],
      link: { color: "var(--palette-accent)" },
      palette: {
        primary: "#92400e",
        secondary: "#78350f",
        accent: "#d97706",
        muted: "#a8a29e",
        background: "#faf5f0",
      },
    },
  },

  regionBlockIds: {
    header: ["md-block-name"],
    sidebar: ["md-block-contact", "md-block-skills", "md-block-education"],
    main: ["md-block-summary", "md-block-experience"],
  },

  blocks: {
    "md-block-name": {
      id: "md-block-name",
      content: {
        type: "blocks",
        children: [
          {
            id: "md-name-title",
            header: { content: [{ text: "Morgan Davis" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "md-name-subtitle",
            style: { color: "var(--palette-accent)", fontSize: "11pt" },
            content: { type: "text", value: [{ text: "UX Researcher" }] },
          },
        ],
      },
    },

    "md-block-contact": {
      id: "md-block-contact",
      tags: ["contact"],
      header: { content: [{ text: "Contact" }], tag: "h2" },
      content: {
        type: "bullets",
        items: [
          { content: [{ text: "hello@example.com" }] },
          { content: [{ text: "portfolio.example.com", link: "https://example.com/portfolio" }] },
          { content: [{ text: "Portland, OR" }] },
        ],
      },
    },

    "md-block-skills": {
      id: "md-block-skills",
      tags: ["skills"],
      header: { content: [{ text: "Methods" }], tag: "h2" },
      content: {
        type: "bullets",
        items: [
          { content: [{ text: "Usability Testing" }] },
          { content: [{ text: "Contextual Inquiry" }] },
          { content: [{ text: "Survey Design & Analysis" }] },
          { content: [{ text: "Journey Mapping" }] },
          { content: [{ text: "A/B Testing" }] },
          { content: [{ text: "Card Sorting & Tree Testing" }] },
        ],
      },
    },

    "md-block-education": {
      id: "md-block-education",
      tags: ["education"],
      header: { content: [{ text: "Education" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "md-edu-degree",
            header: { content: [{ text: "M.A. Human-Computer Interaction" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                { text: "Carnegie Mellon", style: { fontStyle: "italic" } },
                { text: "  ·  2018" },
              ],
            },
          },
        ],
      },
    },

    "md-block-summary": {
      id: "md-block-summary",
      tags: ["summary"],
      header: { content: [{ text: "Summary" }], tag: "h2" },
      content: {
        type: "text",
        value: [
          {
            text: "UX researcher with 7 years uncovering user needs across enterprise and consumer products. Skilled at translating qualitative and quantitative insights into actionable design recommendations that drive measurable outcomes.",
          },
        ],
      },
    },

    "md-block-experience": {
      id: "md-block-experience",
      tags: ["experience"],
      header: { content: [{ text: "Experience" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "md-job-1",
            content: {
              type: "blocks",
              children: [
                {
                  id: "md-job-1-title",
                  header: { content: [{ text: "Lead UX Researcher" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Fieldnote", style: { fontStyle: "italic" } },
                      { text: "  ·  2021 – Present" },
                    ],
                  },
                },
                {
                  id: "md-job-1-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Established research practice from scratch, building team of 4 researchers." }] },
                      { content: [{ text: "Conducted 100+ user interviews informing product roadmap for 3 product lines." }] },
                      { content: [{ text: "Reduced onboarding drop-off 25% through iterative usability testing." }] },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "md-job-2",
            content: {
              type: "blocks",
              children: [
                {
                  id: "md-job-2-title",
                  header: { content: [{ text: "UX Researcher" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Pixelcraft", style: { fontStyle: "italic" } },
                      { text: "  ·  2018 – 2021" },
                    ],
                  },
                },
                {
                  id: "md-job-2-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Designed and ran moderated usability studies for mobile and web." }] },
                      { content: [{ text: "Created research repository used by 40+ designers and PMs." }] },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
};

// --- Sample Resume 7: Compact — dense, no-frills, max content ---

export const sampleResume7: Resume = {
  id: "sample-007",
  title: "Alex Kim — DevOps Engineer (Compact)",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-09T00:00:00Z",

  template: {
    id: "compact",
    name: "Compact",
    grid: '"main" 1fr / 1fr',
    regionStyles: {
      main: {
        padding: "24px 36px",
      },
    },
    page: {
      size: "letter",
      margins: { top: "0", right: "0", bottom: "0", left: "0" },
    },
    fonts: ["IBM Plex Sans"],
    theme: {
      root: {
        fontFamily: "'IBM Plex Sans', monospace",
        fontSize: "9pt",
        lineHeight: "1.45",
        color: "#1a1a1a",
        background: "#ffffff",
      },
      canvas: {},
      h1: { fontSize: "18pt", fontWeight: "bold", color: "#1a1a1a" },
      h2: {
        fontSize: "8pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--palette-primary)",
        marginBottom: "4px",
        marginTop: "12px",
        borderBottom: "1px solid var(--palette-primary)",
        paddingBottom: "2px",
      },
      h3: { fontSize: "9pt", fontWeight: "bold" },
      h4: { fontSize: "9pt", color: "var(--palette-muted)" },
      h5: { fontSize: "8pt" },
      h6: { fontSize: "8pt" },
      bullets: [
        { char: "▸", style: { fontSize: "9pt", lineHeight: "1.45", gap: "0.3em" } },
        { char: "·", style: { fontSize: "8pt", lineHeight: "1.45", paddingLeft: "10px", gap: "0.3em" } },
      ],
      link: { color: "var(--palette-accent)" },
      palette: {
        primary: "#dc2626",
        secondary: "#991b1b",
        accent: "#ef4444",
        muted: "#6b7280",
        background: "#fef2f2",
      },
    },
  },

  regionBlockIds: {
    main: ["ak-block-header", "ak-block-experience", "ak-block-skills", "ak-block-certs", "ak-block-education"],
  },

  blocks: {
    "ak-block-header": {
      id: "ak-block-header",
      content: {
        type: "blocks",
        children: [
          {
            id: "ak-name-title",
            header: { content: [{ text: "Alex Kim" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "ak-name-contact",
            style: { color: "var(--palette-muted)", fontSize: "9pt" },
            content: {
              type: "text",
              value: [
                { text: "hello@example.dev  ·  " },
                { text: "github.com/example", link: "https://example.com/github" },
                { text: "  ·  Denver, CO" },
              ],
            },
          },
        ],
      },
    },

    "ak-block-experience": {
      id: "ak-block-experience",
      tags: ["experience"],
      header: { content: [{ text: "Experience" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "ak-job-1",
            content: {
              type: "blocks",
              children: [
                {
                  id: "ak-job-1-title",
                  header: { content: [{ text: "Senior DevOps Engineer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Infrastack", style: { fontStyle: "italic" } },
                      { text: "  ·  2022 – Present" },
                    ],
                  },
                },
                {
                  id: "ak-job-1-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Managed Kubernetes clusters serving 500M+ requests/day across 3 regions." }] },
                      { content: [{ text: "Reduced CI/CD pipeline time from 45min to 8min through parallelization and caching." }] },
                      { content: [{ text: "Implemented GitOps workflow with ArgoCD, eliminating manual deployments." }] },
                      { content: [{ text: "Designed disaster recovery runbooks; achieved 99.99% uptime SLA." }] },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "ak-job-2",
            content: {
              type: "blocks",
              children: [
                {
                  id: "ak-job-2-title",
                  header: { content: [{ text: "DevOps Engineer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Orbitra", style: { fontStyle: "italic" } },
                      { text: "  ·  2019 – 2022" },
                    ],
                  },
                },
                {
                  id: "ak-job-2-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Built infrastructure-as-code with Terraform managing 200+ AWS resources." }] },
                      { content: [{ text: "Automated security scanning in CI pipeline, catching 90% of vulnerabilities pre-merge." }] },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    "ak-block-skills": {
      id: "ak-block-skills",
      tags: ["skills"],
      header: { content: [{ text: "Skills" }], tag: "h2" },
      content: {
        type: "text",
        value: [{ text: "Kubernetes, Terraform, AWS, GCP, Docker, ArgoCD, Prometheus, Grafana, Bash, Python, Go, GitHub Actions, Jenkins" }],
      },
    },

    "ak-block-certs": {
      id: "ak-block-certs",
      tags: ["certifications"],
      header: { content: [{ text: "Certifications" }], tag: "h2" },
      content: {
        type: "bullets",
        items: [
          { content: [{ text: "AWS Solutions Architect – Professional" }] },
          { content: [{ text: "Certified Kubernetes Administrator (CKA)" }] },
        ],
      },
    },

    "ak-block-education": {
      id: "ak-block-education",
      tags: ["education"],
      header: { content: [{ text: "Education" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "ak-edu-degree",
            header: { content: [{ text: "B.S. Information Systems" }], tag: "h3" },
            content: {
              type: "text",
              value: [
                { text: "CU Boulder", style: { fontStyle: "italic" } },
                { text: "  ·  2019" },
              ],
            },
          },
        ],
      },
    },
  },
};

// --- Test Resume: exercises ALL features for visual/CSS verification ---
// Use this to verify: h1-h6, rich text (links/bold/italic), bullets (level 0/1),
// custom bullet levels, image content, nested blocks, block styles, region styles

export const testResume: Resume = {
  id: "test-all-features",
  title: "Feature Test Resume",
  createdAt: "2026-03-09T00:00:00Z",
  updatedAt: "2026-03-09T00:00:00Z",

  template: {
    id: "test-template",
    name: "Feature Test",
    grid: '"header header" auto "sidebar main" 1fr / 28% 72%',
    regionStyles: {
      header: {
        background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
        padding: "20px 24px",
        color: "#ffffff",
      },
      sidebar: {
        background: "#f8fafc",
        padding: "20px 16px",
        borderRight: "1px solid #e2e8f0",
      },
      main: {
        padding: "20px 24px",
      },
    },
    page: {
      size: "letter",
      margins: { top: "12px", right: "12px", bottom: "12px", left: "12px" },
    },
    fonts: ["Georgia", "Inter"],
    theme: {
      root: {
        fontFamily: "Georgia, serif",
        fontSize: "10pt",
        lineHeight: "1.5",
        color: "#1a1a1a",
        background: "#ffffff",
      },
      canvas: {},
      h1: { fontSize: "20pt", fontWeight: "bold", color: "#ffffff" },
      h2: {
        fontSize: "8pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--palette-primary)",
        marginBottom: "4px",
        marginTop: "12px",
        borderBottom: "1px solid var(--palette-primary)",
      },
      h3: { fontSize: "10pt", fontWeight: "bold" },
      h4: { fontSize: "10pt", fontStyle: "italic", color: "var(--palette-muted)" },
      h5: { fontSize: "9pt", fontWeight: "bold" },
      h6: { fontSize: "9pt", fontStyle: "italic" },
      bullets: [
        { char: "•", style: { fontSize: "10pt", lineHeight: "1.5", gap: "0.35em" } },
        { char: "–", style: { fontSize: "9pt", lineHeight: "1.5", paddingLeft: "12px", gap: "0.35em" } },
      ],
      link: { color: "var(--palette-accent)", textDecoration: "underline" },
      palette: {
        primary: "#2563eb",
        secondary: "#1e40af",
        accent: "#3b82f6",
        muted: "#555555",
        background: "#f8fafc",
      },
    },
  },

  regionBlockIds: {
    header: ["test-block-name"],
    sidebar: ["test-block-contact", "test-block-image", "test-block-headings"],
    main: ["test-block-summary", "test-block-experience", "test-block-bullets"],
  },

  blocks: {
    "test-block-name": {
      id: "test-block-name",
      content: {
        type: "blocks",
        children: [
          {
            id: "test-name-title",
            header: { content: [{ text: "Feature Test Candidate" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "test-name-subtitle",
            style: { color: "#93c5fd", fontSize: "12pt" },
            content: {
              type: "text",
              value: [{ text: "Resume Tailoring Specialist" }],
            },
          },
        ],
      },
    },

    "test-block-contact": {
      id: "test-block-contact",
      header: { content: [{ text: "Contact" }], tag: "h2" },
      content: {
        type: "bullets",
        items: [
          { content: [{ text: "test@arete.example" }] },
          {
            content: [
              { text: "linkedin.com/in/example", link: "https://example.com/linkedin", style: { fontWeight: "bold" } },
            ],
          },
          {
            content: [
              { text: "github.com/example", link: "https://example.com/github" },
            ],
          },
        ],
      },
    },

    "test-block-image": {
      id: "test-block-image",
      header: { content: [{ text: "Photo" }], tag: "h2" },
      content: {
        type: "image",
        src: "https://picsum.photos/seed/arete/120/120",
        alt: "Profile",
        style: { borderRadius: "50%", width: "80px", height: "80px", display: "block" },
      },
    },

    "test-block-headings": {
      id: "test-block-headings",
      header: { content: [{ text: "All Headings" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          { id: "h3", header: { content: [{ text: "H3 Heading" }], tag: "h3" }, content: { type: "text", value: [{ text: "h3 text" }] } },
          { id: "h4", header: { content: [{ text: "H4 Heading" }], tag: "h4" }, content: { type: "text", value: [{ text: "h4 text" }] } },
          { id: "h5", header: { content: [{ text: "H5 Heading" }], tag: "h5" }, content: { type: "text", value: [{ text: "h5 text" }] } },
          { id: "h6", header: { content: [{ text: "H6 Heading" }], tag: "h6" }, content: { type: "text", value: [{ text: "h6 text" }] } },
        ],
      },
    },

    "test-block-summary": {
      id: "test-block-summary",
      header: { content: [{ text: "Summary" }], tag: "h2" },
      content: {
        type: "text",
        value: [
          {
            text: "Rich text: ",
          },
          { text: "bold", style: { fontWeight: "bold" } },
          { text: ", " },
          { text: "italic", style: { fontStyle: "italic" } },
          { text: ", and " },
          { text: "link", link: "https://arete.example" },
          { text: "." },
        ],
      },
    },

    "test-block-experience": {
      id: "test-block-experience",
      header: { content: [{ text: "Experience" }], tag: "h2" },
      content: {
        type: "blocks",
        children: [
          {
            id: "test-job-1",
            content: {
              type: "blocks",
              children: [
                {
                  id: "test-job-1-title",
                  header: { content: [{ text: "Staff Engineer" }], tag: "h3" },
                  content: {
                    type: "text",
                    value: [
                      { text: "Acme Corp", style: { fontStyle: "italic" } },
                      { text: "  ·  2022 – Present" },
                    ],
                  },
                },
                {
                  id: "test-job-1-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      { content: [{ text: "Top-level bullet." }] },
                      { content: [{ text: "Another top-level bullet." }] },
                      { content: [{ text: "Indented sub-bullet (level 1)." }], level: 1 },
                      { content: [{ text: "Mixed: ", style: {} }, { text: "bold", style: { fontWeight: "bold" } }, { text: " and ", style: {} }, { text: "italic", style: { fontStyle: "italic" } }] },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },

    "test-block-bullets": {
      id: "test-block-bullets",
      header: { content: [{ text: "Custom Bullets" }], tag: "h2" },
      content: {
        type: "bullets",
        levels: [
          { char: "▸", style: { fontSize: "10pt", gap: "0.35em", color: "#059669" } },
          { char: "·", style: { fontSize: "9pt", paddingLeft: "14px", gap: "0.35em" } },
        ],
        items: [
          { content: [{ text: "Custom marker (▸) for level 0." }] },
          { content: [{ text: "Custom marker (·) for level 1." }], level: 1 },
        ],
      },
    },
  },
};

// --- Theme fixture ---

export const sampleTheme: Theme = {
  root: {
    fontFamily: "Georgia, serif",
    fontSize: "10pt",
    lineHeight: "1.5",
    color: "#1a1a1a",
    background: "#ffffff",
  },
  canvas: {},
  h1: {
    fontSize: "22pt",
    fontWeight: "bold",
    letterSpacing: "0.02em",
    color: "#1a1a1a",
  },
  h2: {
    fontSize: "9pt",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "var(--palette-primary)",
    paddingBottom: "2px",
    marginBottom: "6px",
    borderBottom: "1px solid var(--palette-primary)",
  },
  h3: {
    fontSize: "10pt",
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  h4: {
    fontSize: "10pt",
    fontStyle: "italic",
    color: "var(--palette-muted)",
  },
  h5: { fontSize: "9pt" },
  h6: { fontSize: "9pt" },
  bullets: [
    { char: "•", style: { fontSize: "10pt", lineHeight: "1.5", gap: "0.35em" } },
    { char: "–", style: { fontSize: "9pt", lineHeight: "1.5", paddingLeft: "12px", gap: "0.35em" } },
  ],
  link: {
    color: "var(--palette-accent)",
  },
  palette: {
    primary: "#2563eb",
    secondary: "#1e40af",
    accent: "#3b82f6",
    muted: "#94a3b8",
    background: "#f8fafc",
  },
};

// --- RichText fixture ---

// Covers: plain text, bold, italic, links, combined styles
export const sampleRichText: RichText = [
  { text: "Full-stack engineer with " },
  { text: "8 years", style: { fontWeight: "bold" } },
  { text: " of experience. See my work at " },
  {
    text: "github.com/example",
    link: "https://example.com/github",
    style: { textDecoration: "underline" },
  },
  { text: ", specialising in " },
  { text: "React & Node", style: { fontStyle: "italic" } },
  { text: " and " },
  { text: "distributed systems", style: { fontWeight: "bold", fontStyle: "italic" } },
  { text: "." },
];

// --- Block fixtures — one sample per content type ---

// type: "text" — rich text with inline styling
export const sampleTextBlock: Block = {
  id: "fixture-text",
  header: { content: [{ text: "Summary" }], tag: "h2" },
  content: {
    type: "text",
    value: [
      { text: "Full-stack engineer with " },
      { text: "8 years", style: { fontWeight: "bold" } },
      { text: " building scalable products. Comfortable across the stack — " },
      { text: "React, Node, PostgreSQL, AWS", style: { fontStyle: "italic" } },
      { text: "." },
    ],
  },
};

// type: "bullets" — BulletItems with levels and per-list override
export const sampleBulletsBlock: Block = {
  id: "fixture-bullets",
  header: { content: [{ text: "Highlights" }], tag: "h2" },
  content: {
    type: "bullets",
    // per-list override — different marker/indent from theme default
    levels: [
      { char: "▸", style: { fontSize: "10pt", gap: "0.35em" } },
      { char: "–", style: { fontSize: "9pt", paddingLeft: "14px", gap: "0.35em" } },
    ],
    items: [
      { content: [{ text: "Reduced cold-start latency by " }, { text: "60%", style: { fontWeight: "bold" } }] },
      { content: [{ text: "Shipped to 40,000+ customers with zero downtime." }] },
      // level 1 — indented sub-bullet
      { content: [{ text: "Zero downtime across 3 regions simultaneously." }], level: 1 },
      {
        content: [
          { text: "Open source contributor — " },
          { text: "react-native-maps", style: { fontStyle: "italic" } },
          { text: " (2.4k stars)." },
        ],
      },
    ],
  },
};

// type: "blocks" — nested child blocks (e.g. a job entry)
export const sampleBlocksBlock: Block = {
  id: "fixture-blocks",
  tags: ["experience"],
  header: { content: [{ text: "Experience" }], tag: "h2" },
  content: {
    type: "blocks",
    children: [
      {
        id: "fixture-blocks-title",
        header: { content: [{ text: "Staff Engineer" }], tag: "h3" },
        content: {
          type: "text",
          value: [
            { text: "Nexlify", style: { fontStyle: "italic" } },
            { text: "  ·  2022 – Present" },
          ],
        },
      },
      {
        id: "fixture-blocks-bullets",
        content: {
          type: "bullets",
          items: [
            { content: [{ text: "Led infrastructure for the Next.js edge runtime." }] },
            { content: [{ text: "Mentored 4 engineers to senior level." }] },
          ],
        },
      },
    ],
  },
};

// type: "image" — profile photo or logo
export const sampleImageBlock: Block = {
  id: "fixture-image",
  content: {
    type: "image",
    src: "https://picsum.photos/seed/picsum/200/300",
    alt: "Profile photo",
    style: { borderRadius: "50%", width: "80px", height: "80px" },
  },
};
