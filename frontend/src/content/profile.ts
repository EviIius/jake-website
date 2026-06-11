import type { ProfileContent } from "../types/content";

export const profileContent: ProfileContent = {
  name: "Jake Brulato",
  title: "Data Management Analyst focused on AI governance, data strategy, and analytics automation.",
  location: "Charlotte, NC",
  email: "jakebrulato@gmail.com",
  heroSummary:
    "I work at the intersection of **banking data management, model risk, Generative AI workflows, and analytics**. I like turning complex data environments into cleaner systems people can trust and use.",
  heroBullets: [
    "Currently a **Data Management Analyst at Wells Fargo**, focused on machine learning lineage, Generative AI workflows, enterprise inventory reconciliation, and approved data source strategy.",
    "Recently supported **Model Risk Management validators** across LLM, AI, and ML model review, governance, QA, and internal AI tool development.",
    "My background combines a **Data Science and Business Analytics MS**, business analytics education, dashboarding, Python, SQL, SAS, R, Tableau, and cloud/data platform tools."
  ],
  metrics: [
    { label: "Current role", value: "Data Management Analyst" },
    { label: "Domain", value: "Banking + AI governance" },
    { label: "Education", value: "MS Data Science" },
    { label: "Location", value: "Charlotte, NC" }
  ],
  links: [
    { label: "Email", href: "mailto:jakebrulato@gmail.com" },
    { label: "LinkedIn", href: "https://linkedin.com/in/jake-brulato" },
    { label: "GitHub", href: "https://github.com/EviIius" },
    { label: "Resume", href: "/files/resume.pdf" }
  ],
  sceneSections: [
    {
      id: "hero",
      label: "Intro",
      eyebrow: "Intro",
      title: "I turn governed banking data into traceable, decision-ready systems.",
      summary:
        "The city map is a visual shorthand for the work: data sources, lineage paths, AI workflows, risk signals, and the judgment needed to make them reliable.",
      position: [-8, 3, -1],
      camera: [-1, 1.8, 14],
      target: [-4, 1.4, 0],
      accent: "#5be7c4"
    },
    {
      id: "impact",
      label: "Focus",
      eyebrow: "Focus",
      title: "I look for the gaps, paths, and controls that make data easier to trust.",
      summary:
        "That can mean documenting machine learning lineage, reconciling inventory data, validating source ownership, reviewing model documentation, or building analytics that make operations easier to understand.",
      position: [-2, 0, 1],
      camera: [2, 1.2, 12],
      target: [0, 0.2, 0],
      accent: "#9ef0b8"
    },
    {
      id: "experience",
      label: "Experience",
      eyebrow: "Experience",
      title: "Banking data management, model risk, logistics analytics, and analytics education.",
      summary:
        "My experience has moved from operational analytics into model governance and enterprise data management, with a graduate foundation in data science and business analytics.",
      position: [4, 1.8, -2],
      camera: [5.5, 2.1, 11],
      target: [4.2, 1, -1.5],
      accent: "#ffbf5f"
    },
    {
      id: "projects",
      label: "Projects",
      eyebrow: "Projects",
      title: "Projects and case studies across automation, APIs, dashboards, and governance.",
      summary:
        "These show the practical side of the work: scraping data, integrating APIs, building dashboards, and turning complex enterprise processes into cleaner workflows.",
      position: [7, -1.6, 0],
      camera: [6.5, 0.6, 12.5],
      target: [6.2, -0.8, 0],
      accent: "#d77aff"
    },
    {
      id: "craft",
      label: "Craft",
      eyebrow: "How I work",
      title: "Good analysis needs governance, engineering, and communication.",
      summary:
        "I care about clean definitions, traceable workflows, repeatable analysis, and outputs that make the next decision easier.",
      position: [1, -3.4, -1],
      camera: [1.8, -1.1, 12.8],
      target: [1.5, -2, -0.5],
      accent: "#ff6f61"
    },
    {
      id: "contact",
      label: "Contact",
      eyebrow: "Contact",
      title: "Reach out about data management, analytics, model risk, or AI governance work.",
      summary:
        "Email, LinkedIn, GitHub, and the current resume are available here.",
      position: [-5, -2.4, 1],
      camera: [-3.6, -0.4, 13],
      target: [-3.6, -1.2, 0],
      accent: "#7dd87d"
    }
  ],
  experience: [
    {
      slug: "wells-fargo-data-management-analyst",
      company: "Wells Fargo",
      role: "Data Management Analyst",
      timeframe: "06/2025-Present",
      location: "Charlotte, NC",
      summary:
        "Data management role focused on machine learning lineage, Generative AI workflows, enterprise inventory reconciliation, and approved data source strategy.",
      highlights: [
        "Documented high-risk machine learning lineage and Generative AI workflows to improve enterprise-wide consistency, traceability, and governance across model and AI-related processes.",
        "Built automated reconciliation processes across enterprise inventory data so downstream reporting, controls, and decision-making had more accurate and accessible information.",
        "Supported approved data source strategy by investigating enterprise applications, identifying source-system gaps, validating data ownership, and strengthening governed data usage."
      ],
      tags: [
        { label: "Data management", tone: "practice" },
        { label: "Machine learning lineage", tone: "domain" },
        { label: "Generative AI", tone: "domain" },
        { label: "Data governance", tone: "practice" },
        { label: "Inventory reconciliation", tone: "practice" },
        { label: "Approved data sources", tone: "domain" },
        { label: "Enterprise data", tone: "domain" },
        { label: "Controls", tone: "practice" }
      ]
    },
    {
      slug: "wells-fargo-model-risk-management-extern",
      company: "Wells Fargo",
      role: "Model Risk Management Extern - Decision Science & Artificial Intelligence",
      timeframe: "10/2024-06/2025",
      location: "Charlotte, NC",
      summary:
        "Eight-month externship supporting MRM DSAI validators in the testing, review, and approval of LLM, AI, and ML models across multiple lines of business.",
      highlights: [
        "Evaluated model risk rankings using vendor model documentation and internal governance criteria, improving review consistency and helping reduce model approval cycle time.",
        "Recreated autonomous agent workflows using open-source LLMs, researched long-term memory design, and built a scalable memory store architecture for future AI tool development.",
        "Conducted QA reviews on model validation reports to improve documentation accuracy, compliance alignment, and adherence to model governance standards."
      ],
      tags: [
        { label: "Model risk", tone: "domain" },
        { label: "LLMs", tone: "domain" },
        { label: "AI validation", tone: "practice" },
        { label: "Machine learning", tone: "domain" },
        { label: "Autonomous agents", tone: "domain" },
        { label: "Governance", tone: "practice" },
        { label: "QA review", tone: "practice" },
        { label: "Open-source LLMs", tone: "infrastructure" }
      ]
    },
    {
      slug: "alg-worldwide-logistics-freight-forwarder",
      company: "ALG Worldwide Logistics",
      role: "Freight Forwarder",
      timeframe: "01/2022-01/2023",
      location: "Charlotte, NC",
      summary:
        "Logistics role balancing transportation operations with analytics work while completing full-time academic coursework.",
      highlights: [
        "Built Tableau dashboards for supervisors showing shipment cost trends, margin performance, and transportation options for faster operational decision-making.",
        "Evaluated transportation market trends using R and Python to identify opportunities for carrier selection, routing, and shipment strategy improvements.",
        "Queried shipment and pricing data using SQL and database management systems across Ground, Expedited, Air, and Ocean transportation."
      ],
      tags: [
        { label: "Tableau", tone: "framework" },
        { label: "Python", tone: "language" },
        { label: "R", tone: "language" },
        { label: "SQL", tone: "language" },
        { label: "Operational analytics", tone: "domain" },
        { label: "Logistics", tone: "domain" },
        { label: "Dashboarding", tone: "practice" },
        { label: "Market analysis", tone: "practice" }
      ]
    },
    {
      slug: "unc-charlotte-ms-data-science-business-analytics",
      company: "University of North Carolina at Charlotte",
      role: "MS, Data Science and Business Analytics",
      timeframe: "06/2023-05/2025",
      location: "Charlotte, NC",
      summary:
        "Graduate program focused on data science, business analytics, applied modeling, and analytics-driven decision support.",
      highlights: [
        "Completed graduate coursework with a 4.00 GPA.",
        "Built depth across data science, analytics, statistics, programming, and business-facing analysis."
      ],
      tags: [
        { label: "Data science", tone: "domain" },
        { label: "Business analytics", tone: "domain" },
        { label: "Python", tone: "language" },
        { label: "SQL", tone: "language" },
        { label: "Statistics", tone: "domain" },
        { label: "GPA 4.00", tone: "practice" }
      ]
    },
    {
      slug: "unc-charlotte-bs-business-analytics",
      company: "University of North Carolina at Charlotte",
      role: "BS, Business Administration - Business Analytics",
      timeframe: "08/2019-06/2023",
      location: "Charlotte, NC",
      summary:
        "Undergraduate business analytics foundation combining business administration, data analysis, and applied technical coursework.",
      highlights: [
        "Completed undergraduate coursework with a 3.74 GPA.",
        "Built an early foundation in analytics, business context, data systems, and decision support."
      ],
      tags: [
        { label: "Business analytics", tone: "domain" },
        { label: "Business administration", tone: "domain" },
        { label: "Decision support", tone: "practice" },
        { label: "Data systems", tone: "infrastructure" },
        { label: "GPA 3.74", tone: "practice" }
      ]
    }
  ],
  projects: [
    {
      slug: "housing-scraper",
      title: "Housing Scraper",
      description:
        "A Python-based web scraper that automates **data extraction, parsing, cleaning, and organization** from housing-related websites.",
      impact:
        "Reduces manual collection work and turns scattered web data into structured information that can be analyzed.",
      stack: [
        "Python",
        "Web scraping",
        "Data automation",
        "Parsing",
        "Data cleaning",
        "Analysis-ready datasets"
      ],
      links: [{ label: "Source", href: "https://github.com/EviIius/WebScraper" }]
    },
    {
      slug: "flighttracker",
      title: "FlightTracker",
      description:
        "A flight tracking application that integrates external APIs and displays **routes, schedules, status updates, and airport-related information**.",
      impact:
        "Shows API integration, data retrieval, processing workflows, and user-facing presentation of live travel information.",
      stack: [
        "API integration",
        "Data retrieval",
        "Data processing",
        "Flight data",
        "Application design",
        "Travel information"
      ],
      links: [{ label: "Source", href: "https://github.com/EviIius/FlightTracker" }]
    },
    {
      slug: "ml-lineage-genai-governance",
      title: "ML Lineage & GenAI Governance",
      description:
        "Professional work documenting high-risk **machine learning lineage and Generative AI workflows** across enterprise model and AI processes.",
      impact:
        "Improved traceability, consistency, and governance for processes that need clear ownership and review paths.",
      stack: [
        "Machine learning lineage",
        "Generative AI",
        "Data governance",
        "Traceability",
        "Enterprise inventory",
        "Risk controls"
      ],
      links: [{ label: "Resume", href: "/files/resume.pdf" }]
    },
    {
      slug: "enterprise-inventory-reconciliation",
      title: "Enterprise Inventory Reconciliation",
      description:
        "Automated reconciliation processes across enterprise inventory data to improve **accuracy, completeness, and accessibility**.",
      impact:
        "Helped downstream reporting, controls, and decision-making rely on cleaner enterprise data.",
      stack: [
        "Automation",
        "Data reconciliation",
        "Enterprise data",
        "Controls",
        "Reporting",
        "Data ownership"
      ],
      links: [{ label: "Resume", href: "/files/resume.pdf" }]
    },
    {
      slug: "logistics-analytics-dashboard",
      title: "Logistics Analytics Dashboard",
      description:
        "Tableau dashboard work for shipment cost trends, margin performance, transportation options, and operational decision support.",
      impact:
        "Gave supervisors a faster way to compare transportation options and understand margin and shipment-cost movement.",
      stack: [
        "Tableau",
        "SQL",
        "Python",
        "R",
        "Transportation analytics",
        "Operational dashboards"
      ],
      links: [{ label: "Resume", href: "/files/resume.pdf" }]
    }
  ],
  skillClusters: [
    {
      title: "Data Management & Governance",
      summary:
        "Experience with governed data usage, ownership validation, enterprise inventory reconciliation, and source-system analysis.",
      items: [
        "Machine learning lineage",
        "Generative AI workflow documentation",
        "Approved data source strategy",
        "Enterprise inventory reconciliation",
        "Data ownership and traceability"
      ]
    },
    {
      title: "Model Risk & AI Validation",
      summary:
        "Hands-on exposure to LLM, AI, and ML model review through model risk management and internal AI tooling work.",
      items: [
        "Model risk ranking review",
        "Vendor model documentation",
        "Model validation QA",
        "Autonomous agent workflows",
        "Long-term memory architecture"
      ]
    },
    {
      title: "Analytics & Engineering Toolkit",
      summary:
        "A broad toolkit across analytics languages, frameworks, cloud platforms, data systems, and dashboarding tools.",
      items: [
        "Python, SQL, SAS, R, JavaScript, Java, Swift",
        "React, Spring Boot, Angular, Next.js, Node, Django, Express",
        "AWS, GCP, Azure, Snowflake, Docker, Kubernetes, Terraform",
        "Kafka, Apache Beam, BigQuery, PostgreSQL, Firebase, MongoDB, Grafana",
        "Tableau dashboards and business-facing analytics"
      ]
    }
  ],
  jaggerscriptIntro: {
    headline: "Analytics workbench",
    summary:
      "A future interactive area for notebooks, dashboards, and explainable portfolio case studies.",
    bullets: [
      "Use public or synthetic data so private banking work stays private.",
      "Show the thinking path, not just the final chart.",
      "Keep each case study tied to a business decision."
    ]
  }
};
