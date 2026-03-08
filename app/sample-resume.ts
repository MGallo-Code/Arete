import type { Resume } from "./models";

export const sampleResume: Resume = {
  template: {
    id: "classic-two-col",
    name: "Classic Two-Column",
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
    },
    grid: '"header header" auto "sidebar main" 1fr / 30% 70%',
    regions: {
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
  },

  regions: {
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
            header: { text: "Jordan Ellis", level: 1 },
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
      header: { text: "Contact", level: 2 },
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
      header: { text: "Skills", level: 2 },
      content: {
        type: "blocks",
        children: [
          {
            id: "block-skills-languages",
            header: { text: "Languages", level: 3 },
            content: {
              type: "text",
              value: [{ text: "TypeScript, Python, Go, SQL" }],
            },
          },
          {
            id: "block-skills-frontend",
            header: { text: "Frontend", level: 3 },
            content: {
              type: "text",
              value: [{ text: "React, Next.js, CSS, Figma" }],
            },
          },
          {
            id: "block-skills-backend",
            header: { text: "Backend & Infra", level: 3 },
            content: {
              type: "text",
              value: [{ text: "Node.js, PostgreSQL, Redis, Docker, AWS" }],
            },
          },
        ],
      },
    },

    "block-education": {
      id: "block-education",
      header: { text: "Education", level: 2 },
      content: {
        type: "blocks",
        children: [
          {
            id: "block-edu-degree",
            header: { text: "B.S. Computer Science", level: 3 },
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
      header: { text: "Summary", level: 2 },
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
      header: { text: "Experience", level: 2 },
      content: {
        type: "blocks",
        children: [
          // Job 1
          {
            id: "job-1",
            content: {
              type: "blocks",
              children: [
                {
                  id: "job-1-title",
                  header: { text: "Staff Engineer", level: 3 },
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
                      [{ text: "Led infrastructure for Next.js edge runtime, reducing cold-start latency by 60%." }],
                      [{ text: "Designed the rollout system for 40,000+ customer deployments with zero downtime." }],
                      [{ text: "Mentored 4 engineers to senior level; established team RFC process." }],
                    ],
                  },
                },
              ],
            },
          },
          // Job 2
          {
            id: "job-2",
            content: {
              type: "blocks",
              children: [
                {
                  id: "job-2-title",
                  header: { text: "Senior Software Engineer", level: 3 },
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
                      [{ text: "Reduced checkout abandonment 18% through A/B-tested UX improvements." }],
                      [{ text: "Owned PCI-DSS scope for frontend payment field isolation." }],
                    ],
                  },
                },
              ],
            },
          },
          // Job 3
          {
            id: "job-3",
            content: {
              type: "blocks",
              children: [
                {
                  id: "job-3-title",
                  header: { text: "Software Engineer", level: 3 },
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
                      [{ text: "Rebuilt the host onboarding flow, increasing listing completion by 32%." }],
                      [{ text: "Contributed to the open-source React Native Maps library (2.4k GitHub stars)." }],
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
      header: { text: "Projects", level: 2 },
      content: {
        type: "blocks",
        children: [
          {
            id: "project-1",
            header: { text: "Arete", level: 3 },
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
            header: { text: "pgvibe", level: 3 },
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
