import type { Block, Resume, RichText } from "./models";

export const sampleResume: Resume = {
  id: "sample-001",
  title: "Jordan Ellis — Software Engineer",
  createdAt: "2026-03-01T00:00:00Z",
  updatedAt: "2026-03-07T00:00:00Z",

  template: {
    id: "classic-two-col",
    name: "Classic Two-Column",
    grid: '"header header" auto "sidebar main" 1fr / 30% 70%',
    areas: {
      header: {
        style: {
          background: "#f8fafc",
          padding: "24px 32px",
          borderBottom: "2px solid #2563eb",
        },
      },
      sidebar: {
        style: {
          background: "#f1f5f9",
          padding: "24px 20px",
        },
      },
      main: {
        style: {
          padding: "24px 32px",
        },
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
        lineHeight: "1.4",
        color: "#1a1a1a",
        background: "#ffffff",
      },
      main: {
        padding: "0",
      },
      body: {
        fontSize: "10pt",
        lineHeight: "1.5",
      },
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
      bullet: {
        fontSize: "10pt",
        lineHeight: "1.5",
      },
      link: {
        color: "#2563eb",
      },
    },
  },

  blockIdsByRegion: {
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
            header: { content: [{ text: "Jordan Ellis" }], level: 1 },
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
      header: { content: [{ text: "Contact" }], level: 2 },
      content: {
        type: "bullets",
        items: [
          [{ text: "jordan@ellisdev.io" }],
          [{ text: "linkedin.com/in/jordanellis", link: "https://linkedin.com/in/jordanellis" }],
          [{ text: "github.com/jordanellis", link: "https://github.com/jordanellis" }],
          [{ text: "San Francisco, CA" }],
        ],
      },
    },

    "block-skills": {
      id: "block-skills",
      tags: ["skills"],
      header: { content: [{ text: "Skills" }], level: 2 },
      content: {
        type: "blocks",
        children: [
          {
            id: "block-skills-languages",
            header: { content: [{ text: "Languages" }], level: 3 },
            content: { type: "text", value: [{ text: "TypeScript, Python, Go, SQL" }] },
          },
          {
            id: "block-skills-frontend",
            header: { content: [{ text: "Frontend" }], level: 3 },
            content: { type: "text", value: [{ text: "React, Next.js, CSS, Figma" }] },
          },
          {
            id: "block-skills-backend",
            header: { content: [{ text: "Backend & Infra" }], level: 3 },
            content: { type: "text", value: [{ text: "Node.js, PostgreSQL, Redis, Docker, AWS" }] },
          },
        ],
      },
    },

    "block-education": {
      id: "block-education",
      tags: ["education"],
      header: { content: [{ text: "Education" }], level: 2 },
      content: {
        type: "blocks",
        children: [
          {
            id: "block-edu-degree",
            header: { content: [{ text: "B.S. Computer Science" }], level: 3 },
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
      header: { content: [{ text: "Summary" }], level: 2 },
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
      header: { content: [{ text: "Experience" }], level: 2 },
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
                  header: { content: [{ text: "Staff Engineer" }], level: 3 },
                  content: {
                    type: "text",
                    value: [
                      { text: "Vercel", style: { fontStyle: "italic" } },
                      { text: "  ·  2022 – Present" },
                    ],
                  },
                },
                {
                  id: "job-1-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      [
                        {
                          text: "Led infrastructure for Next.js edge runtime, reducing cold-start latency by 60%.",
                        },
                      ],
                      [
                        {
                          text: "Designed the rollout system for 40,000+ customer deployments with zero downtime.",
                        },
                      ],
                      [
                        {
                          text: "Mentored 4 engineers to senior level; established team RFC process.",
                        },
                      ],
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
                  header: { content: [{ text: "Senior Software Engineer" }], level: 3 },
                  content: {
                    type: "text",
                    value: [
                      { text: "Stripe", style: { fontStyle: "italic" } },
                      { text: "  ·  2019 – 2022" },
                    ],
                  },
                },
                {
                  id: "job-2-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      [{ text: "Built Stripe Checkout v3 used by 500k+ merchants worldwide." }],
                      [
                        {
                          text: "Reduced checkout abandonment 18% through A/B-tested UX improvements.",
                        },
                      ],
                      [{ text: "Owned PCI-DSS scope for frontend payment field isolation." }],
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
                  header: { content: [{ text: "Software Engineer" }], level: 3 },
                  content: {
                    type: "text",
                    value: [
                      { text: "Airbnb", style: { fontStyle: "italic" } },
                      { text: "  ·  2016 – 2019" },
                    ],
                  },
                },
                {
                  id: "job-3-bullets",
                  content: {
                    type: "bullets",
                    items: [
                      [
                        {
                          text: "Rebuilt the host onboarding flow, increasing listing completion by 32%.",
                        },
                      ],
                      [
                        {
                          text: "Contributed to the open-source React Native Maps library (2.4k GitHub stars).",
                        },
                      ],
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
      header: { content: [{ text: "Projects" }], level: 2 },
      content: {
        type: "blocks",
        children: [
          {
            id: "project-1",
            tags: ["project"],
            header: { content: [{ text: "Arete" }], level: 3 },
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
            header: { content: [{ text: "pgvibe" }], level: 3 },
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
  header: { content: [{ text: "Summary" }], level: 2 },
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

// type: "bullets" — list of rich text items
export const sampleBulletsBlock: Block = {
  id: "fixture-bullets",
  header: { content: [{ text: "Highlights" }], level: 2 },
  content: {
    type: "bullets",
    items: [
      [{ text: "Reduced cold-start latency by " }, { text: "60%", style: { fontWeight: "bold" } }],
      [{ text: "Shipped to 40,000+ customers with zero downtime." }],
      [
        { text: "Open source contributor — " },
        { text: "react-native-maps", style: { fontStyle: "italic" } },
        { text: " (2.4k stars)." },
      ],
    ],
  },
};

// type: "blocks" — nested child blocks (e.g. a job entry)
export const sampleBlocksBlock: Block = {
  id: "fixture-blocks",
  tags: ["experience"],
  header: { content: [{ text: "Experience" }], level: 2 },
  content: {
    type: "blocks",
    children: [
      {
        id: "fixture-blocks-title",
        header: { content: [{ text: "Staff Engineer" }], level: 3 },
        content: {
          type: "text",
          value: [
            { text: "Vercel", style: { fontStyle: "italic" } },
            { text: "  ·  2022 – Present" },
          ],
        },
      },
      {
        id: "fixture-blocks-bullets",
        content: {
          type: "bullets",
          items: [
            [{ text: "Led infrastructure for the Next.js edge runtime." }],
            [{ text: "Mentored 4 engineers to senior level." }],
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
