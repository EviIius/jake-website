import type { ProfileContent } from "../types/content";

export const profileContent: ProfileContent = {
  name: "Jake Brulato",
  title: "Data scientist and analyst turning banking data into clearer decisions.",
  location: "United States",
  email: "your.email@example.com",
  heroSummary:
    "I work where **finance, analytics, and decision-making** meet: finding signal in messy data, building useful models, and turning analysis into something teams can act on.",
  heroBullets: [
    "I focus on **banking analytics, reporting, forecasting, segmentation, and operational insight**.",
    "I like projects that connect the raw data layer to the final decision: **SQL, Python, dashboards, stakeholder questions, and measurable business impact**.",
    "This portfolio is shaped like a city map because good analysis feels like that too: routes, signals, bottlenecks, movement, and patterns hiding in plain sight."
  ],
  metrics: [
    { label: "Main lane", value: "Data science" },
    { label: "Domain", value: "Banking" },
    { label: "Toolkit", value: "Python + SQL" },
    { label: "Strength", value: "Insight to action" }
  ],
  links: [
    { label: "Email", href: "mailto:your.email@example.com" }
  ],
  sceneSections: [
    {
      id: "hero",
      label: "Intro",
      eyebrow: "Intro",
      title: "I turn banking data into decisions people can actually use.",
      summary:
        "The city map is a visual shorthand for the work: complex systems, moving signals, risk corridors, customer paths, and the judgment needed to make sense of it.",
      position: [-8, 3, -1],
      camera: [-1, 1.8, 14],
      target: [-4, 1.4, 0],
      accent: "#5be7c4"
    },
    {
      id: "impact",
      label: "Focus",
      eyebrow: "Focus",
      title: "I look for the patterns that change the conversation.",
      summary:
        "That might be a dashboard, a model, a trend break, a data quality issue, or a sharper way to frame the business question.",
      position: [-2, 0, 1],
      camera: [2, 1.2, 12],
      target: [0, 0.2, 0],
      accent: "#9ef0b8"
    },
    {
      id: "experience",
      label: "Experience",
      eyebrow: "Experience",
      title: "My work sits inside banking analytics and decision support.",
      summary:
        "The through-line is practical analysis: data you can trust, models you can explain, and outputs that help teams move.",
      position: [4, 1.8, -2],
      camera: [5.5, 2.1, 11],
      target: [4.2, 1, -1.5],
      accent: "#ffbf5f"
    },
    {
      id: "projects",
      label: "Projects",
      eyebrow: "Projects",
      title: "Selected analytics projects and case studies.",
      summary:
        "These are portfolio-ready lanes for the kind of work a banking data scientist and analyst can show without exposing private company data.",
      position: [7, -1.6, 0],
      camera: [6.5, 0.6, 12.5],
      target: [6.2, -0.8, 0],
      accent: "#d77aff"
    },
    {
      id: "craft",
      label: "Craft",
      eyebrow: "How I work",
      title: "Good analysis needs structure before it needs polish.",
      summary:
        "I care about clean definitions, explainable methods, repeatable workflows, and visuals that make the next step obvious.",
      position: [1, -3.4, -1],
      camera: [1.8, -1.1, 12.8],
      target: [1.5, -2, -0.5],
      accent: "#ff6f61"
    },
    {
      id: "contact",
      label: "Contact",
      eyebrow: "Contact",
      title: "Reach out about analytics, reporting, or data science work.",
      summary:
        "I am interested in projects where data has to become a decision, not just a chart.",
      position: [-5, -2.4, 1],
      camera: [-3.6, -0.4, 13],
      target: [-3.6, -1.2, 0],
      accent: "#7dd87d"
    }
  ],
  experience: [
    {
      slug: "banking-analytics-data-scientist-analyst",
      company: "Banking Analytics",
      role: "Data Scientist & Analyst",
      timeframe: "Current",
      location: "United States",
      summary:
        "Analytics role focused on making banking data easier to understand, monitor, explain, and use in business decisions.",
      highlights: [
        "Translate stakeholder questions into analysis plans, data pulls, model-ready datasets, and decision-focused summaries.",
        "Work across SQL, Python, spreadsheets, dashboards, and statistical methods to identify patterns, risks, customer segments, and operational trends.",
        "Build repeatable reporting and analysis workflows so recurring decisions are based on consistent definitions instead of one-off data pulls.",
        "Communicate findings in plain language, with enough technical detail for review and enough context for action."
      ],
      tags: [
        { label: "Python", tone: "language" },
        { label: "SQL", tone: "language" },
        { label: "Banking analytics", tone: "domain" },
        { label: "Forecasting", tone: "domain" },
        { label: "Dashboards", tone: "practice" },
        { label: "Data storytelling", tone: "practice" },
        { label: "Stakeholder reporting", tone: "practice" },
        { label: "Risk signals", tone: "domain" },
        { label: "Data quality", tone: "practice" }
      ]
    }
  ],
  projects: [
    {
      slug: "banking-signal-dashboard",
      title: "Banking Signal Dashboard",
      description:
        "A dashboard concept for tracking **portfolio health, risk movement, customer behavior, and operational changes** in one scan-friendly view.",
      impact:
        "Designed to show how I would turn scattered banking metrics into a daily decision surface with clear priorities and drill-down paths.",
      stack: [
        "SQL",
        "Python",
        "Power BI",
        "Banking analytics",
        "Risk indicators",
        "Dashboard design"
      ],
      links: [{ label: "Contact", href: "/#contact" }]
    },
    {
      slug: "customer-segment-map",
      title: "Customer Segment Map",
      description:
        "A segmentation case study that groups customers by **behavior, product usage, lifecycle stage, and engagement patterns**.",
      impact:
        "Useful for targeting outreach, understanding churn risk, and explaining how different customer groups move through the bank.",
      stack: [
        "Python",
        "pandas",
        "Clustering",
        "Customer analytics",
        "Feature engineering",
        "Data visualization"
      ],
      links: [{ label: "Contact", href: "/#contact" }]
    },
    {
      slug: "forecast-variance-tracker",
      title: "Forecast & Variance Tracker",
      description:
        "A forecasting workflow for comparing actuals against expected trends and highlighting where results are drifting.",
      impact:
        "Built around the question leaders usually ask next: what changed, how much does it matter, and where should we look first?",
      stack: [
        "Python",
        "Time series",
        "Forecasting",
        "Variance analysis",
        "Excel",
        "Executive reporting"
      ],
      links: [{ label: "Contact", href: "/#contact" }]
    },
    {
      slug: "transaction-pattern-monitor",
      title: "Transaction Pattern Monitor",
      description:
        "A monitoring concept for surfacing **volume shifts, unusual transaction behavior, and emerging account-level patterns**.",
      impact:
        "The goal is not just anomaly detection, but a clean explanation path from signal to investigation to follow-up action.",
      stack: [
        "SQL",
        "Python",
        "Anomaly detection",
        "Transaction data",
        "Monitoring",
        "Alert logic"
      ],
      links: [{ label: "Contact", href: "/#contact" }]
    },
    {
      slug: "executive-kpi-brief",
      title: "Executive KPI Brief",
      description:
        "A reporting format that turns dense metric packs into **short, visual, decision-ready summaries** for non-technical audiences.",
      impact:
        "Built for faster alignment: the key movement, the likely cause, the confidence level, and the recommended next question.",
      stack: [
        "Tableau",
        "Power BI",
        "KPI design",
        "Data storytelling",
        "Business analytics",
        "Stakeholder communication"
      ],
      links: [{ label: "Contact", href: "/#contact" }]
    },
    {
      slug: "data-quality-radar",
      title: "Data Quality Radar",
      description:
        "A data reliability layer for checking **missingness, duplicates, freshness, definition drift, and outlier behavior** before analysis goes out.",
      impact:
        "A practical guardrail for banking analytics work, where trust in the input data is part of the final recommendation.",
      stack: [
        "SQL",
        "Python",
        "Data validation",
        "Data quality",
        "Automation",
        "Analytics engineering"
      ],
      links: [{ label: "Contact", href: "/#contact" }]
    }
  ],
  skillClusters: [
    {
      title: "Banking Analytics",
      summary:
        "I am strongest when the data connects to a real financial decision, operational question, or risk signal.",
      items: [
        "Portfolio and customer analytics",
        "Risk and performance indicators",
        "Trend, variance, and behavior analysis",
        "Executive-ready reporting",
        "Data quality checks"
      ]
    },
    {
      title: "Data Science Workflow",
      summary:
        "I like repeatable analysis paths: clear inputs, careful transformations, explainable models, and outputs people can review.",
      items: [
        "Python and SQL analysis",
        "Feature engineering",
        "Forecasting and segmentation",
        "Model interpretation",
        "Reusable reporting pipelines"
      ]
    },
    {
      title: "Decision Communication",
      summary:
        "The final mile matters: a good insight should make the tradeoff, risk, and next action easier to see.",
      items: [
        "Dashboard and KPI design",
        "Stakeholder storytelling",
        "Plain-language summaries",
        "Visual hierarchy",
        "Recommendation framing"
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
