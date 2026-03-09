import type { Block, Resume, RichText, Theme } from "./models";

export const sampleResume: Resume = {
  id: "sample-001",
  title: "Jordan Ellis — Software Engineer",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-07T00:00:00Z",

  template: {
    id: "classic-two-col",
    name: "Classic Two-Column",
    grid: '"header header" auto "sidebar main" 1fr / 30% 70%',
    regionStyles: {
      header: {
        background: "#f8fafc",
        padding: "24px 32px",
        borderBottom: "2px solid #2563eb",
      },
      sidebar: {
        background: "#f1f5f9",
        padding: "24px 20px",
      },
      main: {
        padding: "24px 32px",
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
        color: "#2563eb",
        padding: "0 0 2px 0",
        margin: "0 0 6px 0",
        borderBottom: "1px solid #2563eb",
      },
      h3: {
        fontSize: "10pt",
        fontWeight: "bold",
        color: "#1a1a1a",
      },
      h4: {
        fontSize: "10pt",
        fontStyle: "italic",
        color: "#555555",
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
        color: "#2563eb",
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
            header: { content: [{ text: "Jordan Ellis" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "block-name-subtitle",
            content: {
              type: "text",
              value: [
                {
                  text: "Senior Software Engineer",
                  style: { fontSize: "12pt", color: "#2563eb" },
                },
              ],
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
          { content: [{ text: "jordan@ellisdev.io" }] },
          { content: [{ text: "linkedin.com/in/jordanellis", link: "https://linkedin.com/in/jordanellis" }] },
          { content: [{ text: "github.com/jordanellis", link: "https://github.com/jordanellis" }] },
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
  title: "Maya Chen — Product Designer",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-07T00:00:00Z",

  template: {
    id: "modern-minimal",
    name: "Modern Minimal",
    grid: '"header" auto "main" 1fr / 1fr',
    regionStyles: {
      header: {
        background: "#111827",
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
        color: "#6b7280",
        marginBottom: "8px",
        marginTop: "20px",
      },
      h3: { fontSize: "10pt", fontWeight: "bold" },
      h4: { fontSize: "10pt", color: "#6b7280" },
      h5: { fontSize: "9pt" },
      h6: { fontSize: "9pt" },
      bullets: [
        { char: "–", style: { fontSize: "10pt", lineHeight: "1.6", gap: "0.35em" } },
        { char: "·", style: { fontSize: "9pt", lineHeight: "1.6", paddingLeft: "12px", gap: "0.35em" } },
      ],
      link: { color: "#2563eb" },
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
            header: { content: [{ text: "Maya Chen" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "mc-name-subtitle",
            content: {
              type: "text",
              value: [
                { text: "Product Designer  ·  ", style: { color: "#9ca3af" } },
                { text: "maya@mayachen.design", link: "mailto:maya@mayachen.design", style: { color: "#9ca3af" } },
                { text: "  ·  ", style: { color: "#9ca3af" } },
                { text: "mayachen.design", link: "https://mayachen.design", style: { color: "#9ca3af" } },
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
  title: "Alex Rivera — Data Scientist",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-07T00:00:00Z",

  template: {
    id: "navy-split",
    name: "Navy Split",
    grid: '"sidebar main" 1fr / 45% 55%',
    regionStyles: {
      sidebar: {
        background: "#1e3a5f",
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
        color: "#7eb8f7",
        marginBottom: "6px",
        marginTop: "20px",
        borderBottom: "1px solid #2d5a8e",
        paddingBottom: "3px",
      },
      h3: { fontSize: "10pt", fontWeight: "bold", color: "#ffffff" },
      h4: { fontSize: "9pt", color: "#93c5fd" },
      h5: { fontSize: "9pt" },
      h6: { fontSize: "9pt" },
      bullets: [
        { char: "▸", style: { fontSize: "10pt", lineHeight: "1.5", gap: "0.35em", color: "#ffffff" } },
        { char: "–", style: { fontSize: "9pt", lineHeight: "1.5", paddingLeft: "10px", gap: "0.35em", color: "#93c5fd" } },
      ],
      link: { color: "#93c5fd" },
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
            header: { content: [{ text: "Alex Rivera" }], tag: "h1" },
            content: { type: "text", value: [] },
          },
          {
            id: "ar-name-subtitle",
            content: {
              type: "text",
              value: [{ text: "Data Scientist", style: { color: "#93c5fd", fontSize: "11pt" } }],
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
          { content: [{ text: "alex@riveraml.io" }] },
          { content: [{ text: "github.com/alexrivera", link: "https://github.com/alexrivera" }] },
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
    color: "#2563eb",
    paddingBottom: "2px",
    marginBottom: "6px",
    borderBottom: "1px solid #2563eb",
  },
  h3: {
    fontSize: "10pt",
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  h4: {
    fontSize: "10pt",
    fontStyle: "italic",
    color: "#555555",
  },
  h5: { fontSize: "9pt" },
  h6: { fontSize: "9pt" },
  bullets: [
    { char: "•", style: { fontSize: "10pt", lineHeight: "1.5", gap: "0.35em" } },
    { char: "–", style: { fontSize: "9pt", lineHeight: "1.5", paddingLeft: "12px", gap: "0.35em" } },
  ],
  link: {
    color: "#2563eb",
  },
};

// --- RichText fixture ---

// Covers: plain text, bold, italic, links, combined styles
export const sampleRichText: RichText = [
  { text: "Full-stack engineer with " },
  { text: "8 years", style: { fontWeight: "bold" } },
  { text: " of experience. See my work at " },
  {
    text: "github.com/jordanellis",
    link: "https://github.com/jordanellis",
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
