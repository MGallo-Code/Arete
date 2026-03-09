import type { Block } from "../models";

export interface BlockTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  create: () => Block;
}

let _seq = 0;
function uid(prefix: string): string {
  return `${prefix}-${++_seq}-${Date.now().toString(36)}`;
}

// ─── Name / Header ───

const nameTitle: BlockTemplate = {
  id: "name-title",
  name: "Name + Title",
  category: "name",
  description: "Full name heading with job title subtitle",
  create: () => ({
    id: uid("name"),
    content: {
      type: "blocks",
      children: [
        { id: uid("name-h"), header: { content: [{ text: "Your Name" }], tag: "h1" }, content: { type: "text", value: [] } },
        { id: uid("name-sub"), content: { type: "text", value: [{ text: "Job Title", style: { fontSize: "12pt", color: "#666" } }] } },
      ],
    },
  }),
};

const nameContactRow: BlockTemplate = {
  id: "name-contact-row",
  name: "Name + Contact Row",
  category: "name",
  description: "Name with inline contact details below",
  create: () => ({
    id: uid("name"),
    content: {
      type: "blocks",
      children: [
        { id: uid("name-h"), header: { content: [{ text: "Your Name" }], tag: "h1" }, content: { type: "text", value: [] } },
        {
          id: uid("name-info"),
          content: {
            type: "text",
            value: [
              { text: "email@example.com" },
              { text: "  ·  " },
              { text: "linkedin.com/in/you", link: "https://linkedin.com" },
              { text: "  ·  " },
              { text: "City, State" },
            ],
          },
        },
      ],
    },
  }),
};

const nameOnly: BlockTemplate = {
  id: "name-only",
  name: "Name Only",
  category: "name",
  description: "Large name heading, no subtitle",
  create: () => ({
    id: uid("name"),
    header: { content: [{ text: "Your Name" }], tag: "h1" },
    content: { type: "text", value: [] },
  }),
};

// ─── Contact ───

const contactBullets: BlockTemplate = {
  id: "contact-bullets",
  name: "Bullet List",
  category: "contact",
  description: "Email, phone, LinkedIn, GitHub, location",
  create: () => ({
    id: uid("contact"),
    header: { content: [{ text: "Contact" }], tag: "h2" },
    content: {
      type: "bullets",
      items: [
        { content: [{ text: "email@example.com" }] },
        { content: [{ text: "(555) 123-4567" }] },
        { content: [{ text: "linkedin.com/in/you", link: "https://linkedin.com" }] },
        { content: [{ text: "github.com/you", link: "https://github.com" }] },
        { content: [{ text: "City, State" }] },
      ],
    },
  }),
};

const contactInline: BlockTemplate = {
  id: "contact-inline",
  name: "Inline Row",
  category: "contact",
  description: "All contact info on one line with separators",
  create: () => ({
    id: uid("contact"),
    header: { content: [{ text: "Contact" }], tag: "h2" },
    content: {
      type: "text",
      value: [
        { text: "email@example.com" },
        { text: "  |  " },
        { text: "(555) 123-4567" },
        { text: "  |  " },
        { text: "City, State" },
      ],
    },
  }),
};

const contactLinks: BlockTemplate = {
  id: "contact-links",
  name: "Links Only",
  category: "contact",
  description: "LinkedIn, GitHub, portfolio as clickable links",
  create: () => ({
    id: uid("contact"),
    header: { content: [{ text: "Links" }], tag: "h2" },
    content: {
      type: "bullets",
      items: [
        { content: [{ text: "LinkedIn", link: "https://linkedin.com/in/you" }] },
        { content: [{ text: "GitHub", link: "https://github.com/you" }] },
        { content: [{ text: "Portfolio", link: "https://yoursite.com" }] },
      ],
    },
  }),
};

const contactMinimal: BlockTemplate = {
  id: "contact-minimal",
  name: "Minimal",
  category: "contact",
  description: "Just email and location",
  create: () => ({
    id: uid("contact"),
    header: { content: [{ text: "Contact" }], tag: "h2" },
    content: {
      type: "text",
      value: [{ text: "email@example.com  ·  City, State" }],
    },
  }),
};

// ─── Summary ───

const summaryParagraph: BlockTemplate = {
  id: "summary-paragraph",
  name: "Paragraph",
  category: "summary",
  description: "A concise professional summary",
  create: () => ({
    id: uid("summary"),
    header: { content: [{ text: "Summary" }], tag: "h2" },
    content: {
      type: "text",
      value: [{ text: "Experienced professional with N years in [field]. Skilled in [key skills]. Passionate about [focus area]." }],
    },
  }),
};

const summaryBullets: BlockTemplate = {
  id: "summary-bullets",
  name: "Key Points",
  category: "summary",
  description: "3 highlight bullets instead of a paragraph",
  create: () => ({
    id: uid("summary"),
    header: { content: [{ text: "Highlights" }], tag: "h2" },
    content: {
      type: "bullets",
      items: [
        { content: [{ text: "N+ years of experience in [field]" }] },
        { content: [{ text: "Led teams of N engineers across [domain]" }] },
        { content: [{ text: "Shipped [product/feature] used by N+ users" }] },
      ],
    },
  }),
};

const summaryObjective: BlockTemplate = {
  id: "summary-objective",
  name: "Objective",
  category: "summary",
  description: "Career objective statement",
  create: () => ({
    id: uid("objective"),
    header: { content: [{ text: "Objective" }], tag: "h2" },
    content: {
      type: "text",
      value: [{ text: "Seeking a [role] position where I can leverage my expertise in [skills] to [goal]." }],
    },
  }),
};

// ─── Experience ───

const experienceStandard: BlockTemplate = {
  id: "experience-standard",
  name: "Standard Job Entry",
  category: "experience",
  description: "Title, company + date, 3 accomplishment bullets",
  create: () => ({
    id: uid("exp"),
    content: {
      type: "blocks",
      children: [
        {
          id: uid("exp-title"),
          header: { content: [{ text: "Job Title" }], tag: "h3" },
          content: {
            type: "text",
            value: [
              { text: "Company Name", style: { fontStyle: "italic" } },
              { text: "  ·  2022 – Present" },
            ],
          },
        },
        {
          id: uid("exp-bullets"),
          content: {
            type: "bullets",
            items: [
              { content: [{ text: "Led [initiative] resulting in [measurable outcome]." }] },
              { content: [{ text: "Built [feature/system] used by [N users/customers]." }] },
              { content: [{ text: "Collaborated with [team/stakeholders] to [achievement]." }] },
            ],
          },
        },
      ],
    },
  }),
};

const experienceCompact: BlockTemplate = {
  id: "experience-compact",
  name: "Compact Job Entry",
  category: "experience",
  description: "Title + company inline, 2 bullets",
  create: () => ({
    id: uid("exp"),
    content: {
      type: "blocks",
      children: [
        {
          id: uid("exp-title"),
          header: {
            content: [
              { text: "Job Title" },
              { text: " at ", style: { fontWeight: "normal" } },
              { text: "Company", style: { fontWeight: "normal", fontStyle: "italic" } },
            ],
            tag: "h3",
          },
          content: { type: "text", value: [{ text: "2022 – Present" }] },
        },
        {
          id: uid("exp-bullets"),
          content: {
            type: "bullets",
            items: [
              { content: [{ text: "Key accomplishment with measurable impact." }] },
              { content: [{ text: "Another significant achievement." }] },
            ],
          },
        },
      ],
    },
  }),
};

const experienceDetailed: BlockTemplate = {
  id: "experience-detailed",
  name: "Detailed Job Entry",
  category: "experience",
  description: "Title, company, dates, location, description + bullets",
  create: () => ({
    id: uid("exp"),
    content: {
      type: "blocks",
      children: [
        {
          id: uid("exp-title"),
          header: { content: [{ text: "Job Title" }], tag: "h3" },
          content: {
            type: "text",
            value: [
              { text: "Company Name", style: { fontStyle: "italic" } },
              { text: "  ·  City, State  ·  Jan 2022 – Present" },
            ],
          },
        },
        {
          id: uid("exp-desc"),
          content: {
            type: "text",
            value: [{ text: "Brief description of role responsibilities and scope." }],
          },
        },
        {
          id: uid("exp-bullets"),
          content: {
            type: "bullets",
            items: [
              { content: [{ text: "Led [initiative] resulting in [measurable outcome]." }] },
              { content: [{ text: "Built [feature/system] serving [N users]." }] },
              { content: [{ text: "Mentored [N] engineers; established [process]." }] },
              { content: [{ text: "Reduced [metric] by [N%] through [approach]." }] },
            ],
          },
        },
      ],
    },
  }),
};

const experienceSection: BlockTemplate = {
  id: "experience-section",
  name: "Experience Section",
  category: "experience",
  description: "Section header with one standard job entry",
  create: () => {
    const entry = experienceStandard.create();
    return {
      id: uid("exp-section"),
      header: { content: [{ text: "Experience" }], tag: "h2" },
      content: { type: "blocks", children: [entry] },
    };
  },
};

// ─── Education ───

const educationStandard: BlockTemplate = {
  id: "education-standard",
  name: "Standard",
  category: "education",
  description: "Degree, school, year",
  create: () => ({
    id: uid("edu"),
    header: { content: [{ text: "B.S. Computer Science" }], tag: "h3" },
    content: {
      type: "text",
      value: [
        { text: "University Name", style: { fontStyle: "italic" } },
        { text: "  ·  2020" },
      ],
    },
  }),
};

const educationDetailed: BlockTemplate = {
  id: "education-detailed",
  name: "Detailed",
  category: "education",
  description: "Degree, school, year, GPA, coursework",
  create: () => ({
    id: uid("edu"),
    content: {
      type: "blocks",
      children: [
        {
          id: uid("edu-deg"),
          header: { content: [{ text: "B.S. Computer Science" }], tag: "h3" },
          content: {
            type: "text",
            value: [
              { text: "University Name", style: { fontStyle: "italic" } },
              { text: "  ·  2020  ·  GPA: 3.8/4.0" },
            ],
          },
        },
        {
          id: uid("edu-courses"),
          content: {
            type: "text",
            value: [{ text: "Relevant coursework: Data Structures, Algorithms, Machine Learning, Distributed Systems" }],
          },
        },
      ],
    },
  }),
};

const educationSection: BlockTemplate = {
  id: "education-section",
  name: "Education Section",
  category: "education",
  description: "Section header with one education entry",
  create: () => {
    const entry = educationStandard.create();
    return {
      id: uid("edu-section"),
      header: { content: [{ text: "Education" }], tag: "h2" },
      content: { type: "blocks", children: [entry] },
    };
  },
};

// ─── Skills ───

const skillsCategorized: BlockTemplate = {
  id: "skills-categorized",
  name: "Categorized",
  category: "skills",
  description: "Sub-headers per skill category",
  create: () => ({
    id: uid("skills"),
    header: { content: [{ text: "Skills" }], tag: "h2" },
    content: {
      type: "blocks",
      children: [
        { id: uid("sk"), header: { content: [{ text: "Languages" }], tag: "h3" }, content: { type: "text", value: [{ text: "TypeScript, Python, Go, SQL" }] } },
        { id: uid("sk"), header: { content: [{ text: "Frameworks" }], tag: "h3" }, content: { type: "text", value: [{ text: "React, Next.js, Node.js, Django" }] } },
        { id: uid("sk"), header: { content: [{ text: "Tools" }], tag: "h3" }, content: { type: "text", value: [{ text: "Docker, AWS, PostgreSQL, Redis" }] } },
      ],
    },
  }),
};

const skillsInline: BlockTemplate = {
  id: "skills-inline",
  name: "Inline List",
  category: "skills",
  description: "All skills comma-separated",
  create: () => ({
    id: uid("skills"),
    header: { content: [{ text: "Skills" }], tag: "h2" },
    content: {
      type: "text",
      value: [{ text: "TypeScript, React, Node.js, Python, PostgreSQL, Docker, AWS, Git" }],
    },
  }),
};

const skillsBullets: BlockTemplate = {
  id: "skills-bullets",
  name: "Bullet List",
  category: "skills",
  description: "One skill area per bullet",
  create: () => ({
    id: uid("skills"),
    header: { content: [{ text: "Skills" }], tag: "h2" },
    content: {
      type: "bullets",
      items: [
        { content: [{ text: "Frontend: ", style: { fontWeight: "bold" } }, { text: "React, TypeScript, CSS, Next.js" }] },
        { content: [{ text: "Backend: ", style: { fontWeight: "bold" } }, { text: "Node.js, Python, Go, PostgreSQL" }] },
        { content: [{ text: "Infra: ", style: { fontWeight: "bold" } }, { text: "Docker, AWS, CI/CD, Terraform" }] },
      ],
    },
  }),
};

// ─── Projects ───

const projectDescription: BlockTemplate = {
  id: "project-description",
  name: "With Description",
  category: "projects",
  description: "Project name + paragraph description",
  create: () => ({
    id: uid("proj"),
    header: { content: [{ text: "Project Name" }], tag: "h3" },
    content: {
      type: "text",
      value: [{ text: "Brief description of what you built, the technologies used, and the impact or scale." }],
    },
  }),
};

const projectTechStack: BlockTemplate = {
  id: "project-tech",
  name: "With Tech Stack",
  category: "projects",
  description: "Project name, description, and technology list",
  create: () => ({
    id: uid("proj"),
    content: {
      type: "blocks",
      children: [
        {
          id: uid("proj-h"),
          header: { content: [{ text: "Project Name" }], tag: "h3" },
          content: { type: "text", value: [{ text: "Description of the project and its impact." }] },
        },
        {
          id: uid("proj-tech"),
          content: {
            type: "text",
            value: [
              { text: "Built with: ", style: { fontStyle: "italic" } },
              { text: "React, Node.js, PostgreSQL" },
            ],
          },
        },
      ],
    },
  }),
};

const projectSection: BlockTemplate = {
  id: "project-section",
  name: "Projects Section",
  category: "projects",
  description: "Section header with one project entry",
  create: () => {
    const entry = projectDescription.create();
    return {
      id: uid("proj-section"),
      header: { content: [{ text: "Projects" }], tag: "h2" },
      content: { type: "blocks", children: [entry] },
    };
  },
};

// ─── Other ───

const certifications: BlockTemplate = {
  id: "certifications",
  name: "Certifications",
  category: "other",
  description: "List of certifications with dates",
  create: () => ({
    id: uid("certs"),
    header: { content: [{ text: "Certifications" }], tag: "h2" },
    content: {
      type: "bullets",
      items: [
        { content: [{ text: "AWS Solutions Architect – Associate (2024)" }] },
        { content: [{ text: "Google Professional Cloud Developer (2023)" }] },
      ],
    },
  }),
};

const awards: BlockTemplate = {
  id: "awards",
  name: "Awards",
  category: "other",
  description: "Awards and honors",
  create: () => ({
    id: uid("awards"),
    header: { content: [{ text: "Awards" }], tag: "h2" },
    content: {
      type: "bullets",
      items: [
        { content: [{ text: "Employee of the Year", style: { fontWeight: "bold" } }, { text: " – Company Name, 2024" }] },
        { content: [{ text: "Hackathon Winner", style: { fontWeight: "bold" } }, { text: " – Event Name, 2023" }] },
      ],
    },
  }),
};

const languages: BlockTemplate = {
  id: "languages",
  name: "Languages",
  category: "other",
  description: "Spoken languages with proficiency",
  create: () => ({
    id: uid("lang"),
    header: { content: [{ text: "Languages" }], tag: "h2" },
    content: {
      type: "text",
      value: [{ text: "English (native), Spanish (professional), Mandarin (conversational)" }],
    },
  }),
};

const volunteer: BlockTemplate = {
  id: "volunteer",
  name: "Volunteer Work",
  category: "other",
  description: "Organization, role, and description",
  create: () => ({
    id: uid("vol"),
    header: { content: [{ text: "Volunteer" }], tag: "h2" },
    content: {
      type: "blocks",
      children: [
        {
          id: uid("vol-entry"),
          header: { content: [{ text: "Volunteer Role" }], tag: "h3" },
          content: {
            type: "text",
            value: [
              { text: "Organization Name", style: { fontStyle: "italic" } },
              { text: "  ·  2023 – Present" },
            ],
          },
        },
      ],
    },
  }),
};

const emptySection: BlockTemplate = {
  id: "empty-section",
  name: "Empty Section",
  category: "other",
  description: "Just a section header — add content later",
  create: () => ({
    id: uid("section"),
    header: { content: [{ text: "Section Title" }], tag: "h2" },
    content: { type: "text", value: [] },
  }),
};

// ─── Export ───

export const blockTemplates: BlockTemplate[] = [
  nameTitle,
  nameContactRow,
  nameOnly,
  contactBullets,
  contactInline,
  contactLinks,
  contactMinimal,
  summaryParagraph,
  summaryBullets,
  summaryObjective,
  experienceStandard,
  experienceCompact,
  experienceDetailed,
  experienceSection,
  educationStandard,
  educationDetailed,
  educationSection,
  skillsCategorized,
  skillsInline,
  skillsBullets,
  projectDescription,
  projectTechStack,
  projectSection,
  certifications,
  awards,
  languages,
  volunteer,
  emptySection,
];

export const categories = [
  { id: "name", label: "Name / Header" },
  { id: "contact", label: "Contact" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "other", label: "Other" },
];
