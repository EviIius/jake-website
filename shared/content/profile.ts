import headshotImage from "../../frontend/src/assets/headshot.jpg";
import wellsFargoLogo from "../../frontend/src/assets/company-logos/wells-fargo.svg";
import algLogisticsLogo from "../../frontend/src/assets/company-logos/alg-logistics.svg";
import uncCharlotteLogo from "../../frontend/src/assets/company-logos/unc-charlotte.svg";
import type { ProfileContent } from "../types/content";

export const headshotAsset = headshotImage;

export const profileContent: ProfileContent = {
  name: "Jake Brulato",
  roleBadge: "Data Management Analyst",
  title:
    "Data Management Analyst focused on machine learning lineage, Generative AI workflows, model governance, and operational analytics.",
  location: "Charlotte, NC",
  email: "jakebrulato@gmail.com",
  phone: "+1 (704) 657-0756",
  phoneHref: "tel:+17046570756",
  githubUrl: "https://github.com/EviIius",
  githubDisplay: "github.com/EviIius",
  linkedinUrl: "https://www.linkedin.com/in/jake-brulato",
  linkedinDisplay: "linkedin.com/in/jake-brulato",
  heroSummary:
    "I’m a **Data Management Analyst at Wells Fargo** in Charlotte, NC, focused on **machine learning lineage, Generative AI workflows, enterprise inventory reconciliation, and approved data source strategy**.",
  heroBullets: [
    "Previously completed an **8-month Model Risk Management externship in Decision Science & AI** at Wells Fargo, supporting LLM, AI, and ML model validation and building autonomous agent memory workflows.",
    "Earned an **M.S. in Data Science and Business Analytics (4.00 GPA)** and a **B.S.B.A. in Business Analytics (3.74 GPA)** at the University of North Carolina at Charlotte.",
    "Hands-on across **Python, SQL, R, Tableau, cloud data systems, and web/API automation**, turning complex operational and model metadata into reliable, governed insights.",
  ],
  metrics: [
    {
      label: "Current Role",
      value: "Wells Fargo",
      target: { kind: "experience", slug: "wells-fargo-data-management-analyst" },
    },
    {
      label: "Primary Focus",
      value: "AI & Data Gov",
    },
    {
      label: "M.S. DSBA GPA",
      value: "4.00 / 4.00",
      target: { kind: "education", slug: "uncc-ms-data-science-business-analytics" },
    },
    {
      label: "Featured Project",
      value: "FlightTracker",
      target: { kind: "project", slug: "flight-tracker" },
    },
  ],
  links: [
    { label: "Email", href: "mailto:jakebrulato@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-brulato" },
    { label: "GitHub", href: "https://github.com/EviIius" },
    { label: "Résumé", href: "/files/resume.pdf" },
  ],
  sectionCopy: [
    {
      id: "experience",
      eyebrow: "WORK EXPERIENCE · CHARLOTTE, NC",
      headlineTop: "Where I’ve worked",
      headlineAccent: "across data & AI.",
      description:
        "Enterprise data management, machine learning lineage, LLM model risk validation at Wells Fargo, and operational freight analytics.",
      mobileDescription:
        "Enterprise data management, ML lineage, and AI model risk validation at Wells Fargo, plus operational freight analytics.",
    },
    {
      id: "projects",
      eyebrow: "SELECTED PROJECTS",
      headlineTop: "Data workflows",
      headlineAccent: "& API tools I’ve built.",
      description:
        "Automated web data extraction in Python and real-time flight tracking workflows integrating external aviation APIs.",
      mobileDescription:
        "Python web scraping automation and real-time flight tracking API integration.",
    },
    {
      id: "education",
      eyebrow: "ACADEMIC BACKGROUND · UNC CHARLOTTE",
      headlineTop: "Data science",
      headlineAccent: "& business analytics.",
      description:
        "Graduate and undergraduate degrees in Data Science and Business Analytics at the University of North Carolina at Charlotte.",
      mobileDescription:
        "M.S. in Data Science & Business Analytics (4.00 GPA) and B.S.B.A. in Business Analytics at UNC Charlotte.",
    },
    {
      id: "skills",
      eyebrow: "TECHNICAL TOOLKIT",
      headlineTop: "Languages, cloud,",
      headlineAccent: "& data systems.",
      description:
        "Core languages, web frameworks, cloud infrastructure, streaming & analytical data platforms, and engineering domains.",
      mobileDescription:
        "Languages, frameworks, cloud infrastructure, databases, and core domains from my toolkit.",
    },
    {
      id: "about",
      eyebrow: "ABOUT JAKE",
      headlineTop: "Hi, I’m Jake.",
      headlineAccent: "Let’s connect.",
      description:
        "A snapshot of my background in Charlotte, NC, my résumé, and the fastest ways to get in touch.",
      mobileDescription:
        "A snapshot of my background in Charlotte, NC, my résumé, and how to reach me directly.",
    },
  ],
  experience: [
    {
      slug: "wells-fargo-data-management-analyst",
      company: "Wells Fargo",
      role: "Data Management Analyst",
      shortRole: "Data Mgmt",
      timeframe: "06/2025 – Present",
      location: "Charlotte, NC",
      logo: wellsFargoLogo,
      logoAlt: "Wells Fargo emblem",
      summary:
        "Data management role focused on machine learning lineage, Generative AI workflows, enterprise inventory reconciliation, and approved data source strategy.",
      highlights: [
        "Documented high-risk machine learning lineage and Generative AI workflows, improving enterprise-wide consistency, traceability, and governance across model and AI-related processes.",
        "Built automated reconciliation processes across enterprise inventory data, ensuring accurate, complete, and accessible information for downstream reporting, controls, and decision-making.",
        "Supported the approved data source strategy by investigating enterprise applications, identifying source-system gaps, validating data ownership, and helping establish a stronger foundation for governed data usage.",
      ],
      tags: [
        { label: "ML Lineage", tone: "domain" },
        { label: "Generative AI", tone: "domain" },
        { label: "Data Governance", tone: "practice" },
        { label: "Automated Reconciliation", tone: "practice" },
        { label: "Python", tone: "language" },
        { label: "SQL", tone: "language" },
        { label: "Snowflake", tone: "infrastructure" },
        { label: "Enterprise Data", tone: "domain" },
      ],
    },
    {
      slug: "wells-fargo-mrm-extern-dsai",
      company: "Wells Fargo",
      role: "Model Risk Management Extern - Decision Science & Artificial Intelligence",
      shortRole: "MRM · DSAI",
      timeframe: "10/2024 – 06/2025",
      location: "Charlotte, NC",
      logo: wellsFargoLogo,
      logoAlt: "Wells Fargo emblem",
      summary:
        "8-month externship supporting MRM DSAI validators in the testing, review, and approval of LLM, AI, and ML models across multiple Lines of Business, while also developing internal AI tools and model governance workflows.",
      highlights: [
        "Evaluated model risk rankings using vendor model documentation and internal governance criteria, improving review consistency and helping reduce model approval cycle time.",
        "Recreated autonomous agent workflows using open-source LLMs, researching long-term memory design, and building a scalable memory store architecture for future AI tool development.",
        "Conducted QA reviews on model validation reports, ensuring documentation accuracy, compliance alignment, and adherence to model governance standards.",
      ],
      tags: [
        { label: "LLMs & Autonomous Agents", tone: "domain" },
        { label: "Model Risk Management", tone: "practice" },
        { label: "Decision Science & AI", tone: "domain" },
        { label: "Long-Term Memory Architecture", tone: "infrastructure" },
        { label: "Python", tone: "language" },
        { label: "Model Validation QA", tone: "practice" },
      ],
    },
    {
      slug: "alg-worldwide-logistics-freight-forwarder",
      company: "ALG Worldwide Logistics",
      role: "Freight Forwarder",
      shortRole: "Freight Forwarder",
      timeframe: "01/2022 – 01/2023",
      location: "Charlotte, NC",
      logo: algLogisticsLogo,
      logoAlt: "ALG Worldwide Logistics emblem",
      summary:
        "Logistics role at a Charlotte-based transportation company, balancing operational analytics work with full-time academic coursework.",
      highlights: [
        "Built Tableau dashboards for supervisors, displaying shipment cost trends, margin performance, and transportation options to support faster operational decision-making.",
        "Evaluated market trends across the transportation industry using R and Python, identifying opportunities to optimize carrier selection, routing, and shipment strategy.",
        "Queried shipment and pricing data using SQL and database management systems, supporting analysis across Ground, Expedited, Air, and Ocean transportation for domestic and international shipments.",
      ],
      tags: [
        { label: "Tableau", tone: "framework" },
        { label: "Python", tone: "language" },
        { label: "R", tone: "language" },
        { label: "SQL", tone: "language" },
        { label: "Pricing & Margin Analytics", tone: "practice" },
        { label: "Supply Chain & Routing", tone: "domain" },
      ],
    },
  ],
  projects: [
    {
      slug: "housing-scraper",
      title: "Housing Scraper",
      categoryLabel: "WEB SCRAPING · DATA AUTOMATION",
      summary:
        "Python-based web scraper that automates housing data extraction, cleaning, and structuring for downstream analysis.",
      description:
        "An automated Python data collection pipeline designed to extract housing listings from websites, parse raw HTML structures, and organize clean datasets ready for quantitative analysis.",
      highlights: [
        "Built a Python-based web scraper to automate data extraction from websites and organize collected information for analysis.",
        "Used scraping and parsing tools to retrieve, clean, and structure web data while reducing manual collection work.",
      ],
      stack: [
        "Python",
        "Web Scraping",
        "HTML Parsing",
        "Data Cleaning",
        "Data Automation",
      ],
      links: [
        {
          label: "View on GitHub",
          href: "https://github.com/EviIius/WebScraper",
        },
      ],
    },
    {
      slug: "flight-tracker",
      title: "FlightTracker",
      categoryLabel: "FLIGHT TRACKING · API INTEGRATION",
      summary:
        "Real-time flight tracking application integrating external aviation APIs for routes, schedules, status updates, and airport data.",
      description:
        "A flight tracking application that connects to external aviation data APIs to retrieve, normalize, and present live travel information across routes, schedules, and airports.",
      highlights: [
        "Developed a flight tracking application that integrates flight data from external APIs and displays relevant travel information to users.",
        "Built data retrieval and processing workflows to handle flight routes, schedules, status updates, and airport-related information.",
      ],
      stack: [
        "API Integration",
        "Data Workflows",
        "JavaScript",
        "Python",
        "Real-Time Travel Data",
      ],
      links: [
        {
          label: "View on GitHub",
          href: "https://github.com/EviIius/FlightTracker",
        },
      ],
    },
  ],
  education: [
    {
      slug: "uncc-ms-data-science-business-analytics",
      institution: "University of North Carolina at Charlotte",
      shortInstitution: "UNC Charlotte",
      degree: "Data Science and Business Analytics, M.S.",
      shortDegree: "M.S. Data Science & Analytics",
      timeframe: "06/2023 – 05/2025",
      location: "Charlotte, NC",
      gpa: "4.00",
      logo: uncCharlotteLogo,
      logoAlt: "UNC Charlotte emblem",
      summary:
        "Master of Science in Data Science and Business Analytics at UNC Charlotte, completed with a 4.00 GPA alongside enterprise AI & model risk work.",
      highlights: [
        "Graduated with a 4.00 cumulative GPA in UNC Charlotte’s interdisciplinary Data Science and Business Analytics M.S. program.",
        "Focused on machine learning, statistical modeling, large-scale data engineering, and applied decision science while working in Wells Fargo’s Decision Science & AI practice.",
      ],
      focusAreas: [
        "Machine Learning",
        "Decision Science",
        "Statistical Modeling",
        "Big Data Analytics",
        "Python & SQL",
        "AI Governance",
      ],
    },
    {
      slug: "uncc-bsba-business-analytics",
      institution: "University of North Carolina at Charlotte",
      shortInstitution: "UNC Charlotte",
      degree: "Bachelor of Science in Business Administration, Business Analytics",
      shortDegree: "B.S.B.A. Business Analytics",
      timeframe: "08/2019 – 06/2023",
      location: "Charlotte, NC",
      gpa: "3.74",
      logo: uncCharlotteLogo,
      logoAlt: "UNC Charlotte emblem",
      summary:
        "Undergraduate degree in Business Administration concentrating in Business Analytics at UNC Charlotte (3.74 GPA), paired with hands-on logistics analytics work.",
      highlights: [
        "Earned a 3.74 GPA in the Belk College of Business concentrating in Business Analytics.",
        "Balanced full-time undergraduate coursework with operational SQL, R, Python, and Tableau analytics at ALG Worldwide Logistics.",
      ],
      focusAreas: [
        "Business Analytics",
        "Quantitative Analysis",
        "Database Management",
        "Data Visualization",
        "Operations & Finance",
        "R, SQL & SAS",
      ],
    },
  ],
  skillClusters: [
    {
      slug: "languages",
      title: "Languages",
      shortLabel: "Languages",
      eyebrow: "SKILLS · LANGUAGES",
      summary:
        "Core programming, statistical, and query languages used across data pipelines, analytics, and full-stack applications.",
      evidence: [
        {
          label: "Wells Fargo · Data Management Analyst",
          context: "Automated enterprise inventory reconciliation and data lineage workflows",
          target: { kind: "experience", slug: "wells-fargo-data-management-analyst" },
        },
        {
          label: "ALG Worldwide Logistics",
          context: "Evaluated transportation market trends and queried pricing databases with Python, R, and SQL",
          target: { kind: "experience", slug: "alg-worldwide-logistics-freight-forwarder" },
        },
        {
          label: "Housing Scraper",
          context: "Python-based automated web scraping and data structuring",
          target: { kind: "project", slug: "housing-scraper" },
        },
      ],
      items: [
        "JavaScript",
        "Python",
        "Java",
        "Swift",
        "HTML",
        "OCaml",
        "SQL",
        "SAS",
        "CSS",
        "R",
      ],
    },
    {
      slug: "frameworks-libraries",
      title: "Frameworks & Libraries",
      shortLabel: "Frameworks",
      eyebrow: "SKILLS · FRAMEWORKS & LIBRARIES",
      summary:
        "Modern frontend, mobile, API, and backend application frameworks for building interactive interfaces and services.",
      evidence: [
        {
          label: "FlightTracker",
          context: "External API integration and travel information UI workflows",
          target: { kind: "project", slug: "flight-tracker" },
        },
      ],
      items: [
        "React",
        "Spring",
        "Spring Boot",
        "Angular",
        "Flutter",
        "GraphQL",
        "Next.js",
        "Node",
        "Svelte",
        "Vue.js",
        "Django",
        "Express",
      ],
    },
    {
      slug: "infrastructure-tools",
      title: "Infrastructure & Tools",
      shortLabel: "Infrastructure",
      eyebrow: "SKILLS · INFRASTRUCTURE & TOOLS",
      summary:
        "Cloud platforms, containerization, CI/CD automation, and cloud data warehousing.",
      evidence: [
        {
          label: "Wells Fargo · Data Management Analyst",
          context: "Enterprise application investigation, source-system ownership, and governed cloud data usage",
          target: { kind: "experience", slug: "wells-fargo-data-management-analyst" },
        },
      ],
      items: [
        "AWS",
        "GCP",
        "Terraform",
        "Bazel",
        "Docker",
        "Jenkins",
        "GCR",
        "Kubernetes",
        "Azure",
        "Snowflake",
      ],
    },
    {
      slug: "databases-data-systems",
      title: "Databases & Data Systems",
      shortLabel: "Data Systems",
      eyebrow: "SKILLS · DATABASES & DATA SYSTEMS",
      summary:
        "Streaming pipelines, analytical warehouses, relational & NoSQL stores, and observability dashboards.",
      evidence: [
        {
          label: "Wells Fargo · MRM Extern (DSAI)",
          context: "Designed a scalable long-term memory store architecture for autonomous LLM agent tools",
          target: { kind: "experience", slug: "wells-fargo-mrm-extern-dsai" },
        },
        {
          label: "ALG Worldwide Logistics",
          context: "Queried shipment and pricing DBMS systems and built operational dashboards",
          target: { kind: "experience", slug: "alg-worldwide-logistics-freight-forwarder" },
        },
      ],
      items: [
        "Kafka",
        "Apache Beam",
        "Pub/Sub",
        "Spanner",
        "BigQuery",
        "PostgreSQL",
        "Firebase",
        "MongoDB",
        "Grafana",
      ],
    },
    {
      slug: "domains",
      title: "Domains",
      shortLabel: "Domains",
      eyebrow: "SKILLS · DOMAINS",
      summary:
        "Problem spaces spanning artificial intelligence, enterprise data governance, distributed systems, and full-stack product delivery.",
      evidence: [
        {
          label: "Wells Fargo · Data Management Analyst",
          context: "High-risk ML lineage, Generative AI workflows, and enterprise data strategy",
          target: { kind: "experience", slug: "wells-fargo-data-management-analyst" },
        },
        {
          label: "UNC Charlotte · M.S. DSBA",
          context: "4.00 GPA graduate degree in Data Science and Business Analytics",
          target: { kind: "education", slug: "uncc-ms-data-science-business-analytics" },
        },
      ],
      items: [
        "Platform",
        "Distributed Systems",
        "Enterprise",
        "Mobile",
        "Web",
        "AI",
        "PL",
        "DevOps",
        "Big Data",
      ],
    },
  ],
};
