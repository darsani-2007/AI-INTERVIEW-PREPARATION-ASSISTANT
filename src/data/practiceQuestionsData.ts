import { PracticeQuestion } from "../types";

export const practiceQuestionsData: PracticeQuestion[] = [
  // SQL
  {
    id: "sql-1",
    category: "SQL",
    topic: "Joins & Filtering",
    difficulty: "Easy",
    question: "What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN in SQL?",
    idealAnswer:
      "An INNER JOIN returns only records that have matching values in both tables. A LEFT JOIN returns all rows from the left table and matched records from the right table (with NULL for non-matching right columns). A RIGHT JOIN returns all rows from the right table and matched records from the left table.",
    keyPoints: [
      "INNER JOIN: intersection only",
      "LEFT JOIN: preserve all left table rows, NULL on right misses",
      "Crucial for combining transactional records with lookup dimensions",
    ],
    targetRoles: ["Data Analyst", "Software Developer", "Data Scientist", "Web Developer"],
  },
  {
    id: "sql-2",
    category: "SQL",
    topic: "Aggregation & Grouping",
    difficulty: "Medium",
    question: "What is the difference between WHERE and HAVING clauses?",
    idealAnswer:
      "The WHERE clause filters rows BEFORE any grouping or aggregate calculation takes place, whereas the HAVING clause filters groups AFTER the GROUP BY operation and aggregation calculations (like SUM, COUNT, AVG) have completed.",
    keyPoints: [
      "WHERE cannot contain aggregate functions directly (e.g., WHERE COUNT(*) > 5 is invalid)",
      "HAVING operates on aggregated results",
      "Best practice: filter raw rows with WHERE first to optimize query performance",
    ],
    targetRoles: ["Data Analyst", "Data Scientist", "Software Developer"],
  },
  {
    id: "sql-3",
    category: "SQL",
    topic: "Window Functions",
    difficulty: "Hard",
    question: "How do ROW_NUMBER(), RANK(), and DENSE_RANK() differ when dealing with duplicate values?",
    idealAnswer:
      "ROW_NUMBER() assigns a unique, strictly incremental number to each row regardless of duplicates (e.g. 1, 2, 3, 4). RANK() gives identical values the same rank but skips subsequent positions (e.g. 1, 2, 2, 4). DENSE_RANK() assigns identical values the same rank and does NOT skip numbers (e.g. 1, 2, 2, 3).",
    keyPoints: [
      "OVER (PARTITION BY ... ORDER BY ...)",
      "Essential for finding Top N records per department or category",
      "Notice rank gap difference between RANK and DENSE_RANK",
    ],
    targetRoles: ["Data Analyst", "Data Scientist"],
  },

  // Python
  {
    id: "py-1",
    category: "Python",
    topic: "Data Structures",
    difficulty: "Easy",
    question: "What are the key differences between a Python List and a Tuple?",
    idealAnswer:
      "Lists are mutable (elements can be added, removed, or changed in place) and declared with square brackets []. Tuples are immutable (cannot be modified after creation) and declared with parentheses (). Tuples are typically faster, memory-efficient, and can be used as dictionary keys when their contents are hashable.",
    keyPoints: [
      "Mutability: List is mutable, Tuple is immutable",
      "Syntax: [] vs ()",
      "Tuples allow immutability guarantees and memory optimization",
    ],
    targetRoles: ["Software Developer", "Data Analyst", "AI/ML Engineer", "Data Scientist"],
  },
  {
    id: "py-2",
    category: "Python",
    topic: "Pandas & Data Manipulation",
    difficulty: "Medium",
    question: "How do you handle missing values in a Pandas DataFrame, and how do .loc and .iloc differ?",
    idealAnswer:
      "Missing values can be detected with df.isnull().sum() and handled using df.dropna() (to drop rows/columns) or df.fillna(value) (using mean, median, forward-fill, or mode). For selection, .loc is label-based (using column names and index labels), while .iloc is integer position-based (0-indexed numerical slicing).",
    keyPoints: [
      "Handling nulls: dropna vs fillna (mean/median imputation)",
      ".loc[row_label, col_label] vs .iloc[row_idx, col_idx]",
      "Always inspect distribution before imputing numbers",
    ],
    targetRoles: ["Data Analyst", "Data Scientist", "AI/ML Engineer"],
  },
  {
    id: "py-3",
    category: "Python",
    topic: "Memory & Performance",
    difficulty: "Hard",
    question: "What is a Python Generator and how does the 'yield' keyword help with large dataset processing?",
    idealAnswer:
      "A generator is a function that returns an iterator which produces a sequence of values lazily on-the-fly instead of storing the entire collection in memory at once. When a generator encounters 'yield', it pauses execution and yields the current value, resuming from that exact spot on the next iteration. This prevents out-of-memory errors on massive data streams.",
    keyPoints: [
      "Lazy evaluation: compute values one at a time",
      "Minimal RAM footprint compared to large lists",
      "Used extensively in data pipelines, file streaming, and batching",
    ],
    targetRoles: ["Software Developer", "AI/ML Engineer", "Data Scientist"],
  },

  // Excel
  {
    id: "xl-1",
    category: "Excel",
    topic: "Formulas & Lookups",
    difficulty: "Easy",
    question: "Why is XLOOKUP considered superior to traditional VLOOKUP in modern Excel?",
    idealAnswer:
      "XLOOKUP searches in both directions (left and right), whereas VLOOKUP can only search from left to right. XLOOKUP defaults to an exact match, handles missing values cleanly with an optional 'if_not_found' argument, does not break when columns are inserted or deleted, and uses two clean range arguments instead of a table index number.",
    keyPoints: [
      "Left lookup support without INDEX/MATCH workarounds",
      "Exact match by default",
      "Robust against column structure modifications",
    ],
    targetRoles: ["Data Analyst", "Data Scientist"],
  },
  {
    id: "xl-2",
    category: "Excel",
    topic: "Pivot Tables & Analysis",
    difficulty: "Medium",
    question: "How do you use Pivot Tables to summarize transaction data and what is a Calculated Field?",
    idealAnswer:
      "A Pivot Table quickly aggregates large datasets without formulas by dragging dimensions into Rows, Columns, and Values (aggregating with SUM, COUNT, AVERAGE, etc.). A Calculated Field allows you to perform custom mathematical formulas across existing Pivot fields (e.g. Total Revenue - Total Cost = Profit) that update dynamically.",
    keyPoints: [
      "Drag-and-drop aggregation into Rows, Columns, Values, Filters",
      "Calculated fields add dynamic calculated metrics",
      "Slicers and Timelines create interactive dashboard views",
    ],
    targetRoles: ["Data Analyst"],
  },

  // Power BI
  {
    id: "pbi-1",
    category: "Power BI",
    topic: "Data Modeling",
    difficulty: "Medium",
    question: "What is the difference between Star Schema and Snowflake Schema in Power BI data modeling?",
    idealAnswer:
      "A Star Schema features a central Fact table directly connected to denormalized Dimension tables via single relationships, resembling a star. It is the recommended best practice in Power BI because it delivers faster DAX performance and simpler relationships. A Snowflake Schema normalizes dimension tables into sub-tables, which saves storage but increases relationship complexity and query overhead.",
    keyPoints: [
      "Star schema is optimal for Power BI VertiPaq engine performance",
      "Fact tables contain numerical measurements, Dimension tables contain attributes",
      "Snowflake normalizes dimensions, creating multi-tier relationships",
    ],
    targetRoles: ["Data Analyst", "Data Scientist"],
  },
  {
    id: "pbi-2",
    category: "Power BI",
    topic: "DAX Calculations",
    difficulty: "Hard",
    question: "What is the difference between Calculated Columns and Measures in DAX?",
    idealAnswer:
      "A Calculated Column evaluates row-by-row during data refresh and is stored permanently in RAM, increasing model file size. A Measure evaluates dynamically at query time based on the active user filter context (e.g., visual slicers, page filters) and consumes no static RAM. Best practice: use Measures whenever possible for metrics like totals, averages, and ratios.",
    keyPoints: [
      "Calculated Column: row context, stored in memory, static",
      "Measure: filter context, dynamic calculation on visual render",
      "Measures optimize memory and respond to visual slicers",
    ],
    targetRoles: ["Data Analyst"],
  },

  // Machine Learning
  {
    id: "ml-1",
    category: "Machine Learning",
    topic: "Model Evaluation",
    difficulty: "Medium",
    question: "Explain the Bias-Variance Tradeoff and how Overfitting occurs.",
    idealAnswer:
      "High Bias results from an overly simplistic model that underfits the data and fails to capture underlying patterns, leading to high training and test error. High Variance results from an overly complex model that memorizes training data noise (overfitting), performing great on training data but poorly on unseen test data. The tradeoff is finding the sweet spot where total test error is minimized.",
    keyPoints: [
      "Underfitting = high bias; Overfitting = high variance",
      "Techniques to reduce variance: Regularization (L1/L2), cross-validation, pruning, dropout, more data",
      "Techniques to reduce bias: Increase model complexity, feature engineering",
    ],
    targetRoles: ["AI/ML Engineer", "Data Scientist"],
  },

  // HR & Behavioral
  {
    id: "hr-1",
    category: "HR",
    topic: "Introduction",
    difficulty: "Easy",
    question: "Tell me about yourself, your educational background, and why you are interested in this role.",
    idealAnswer:
      "Give a 90-second structured pitch: 1) Present: Current academic standing, degree, and primary technical passion. 2) Past: 1 or 2 key projects or internships where you applied these skills practically. 3) Future: Why this specific role and organization aligns with your career goals and how you are eager to contribute as an enthusiastic learner.",
    keyPoints: [
      "Keep it between 60 to 90 seconds",
      "Do not just recite your resume line by line",
      "Connect your enthusiasm directly to the company's domain",
    ],
    targetRoles: ["Data Analyst", "Software Developer", "AI/ML Engineer", "Web Developer", "Data Scientist"],
  },
  {
    id: "hr-2",
    category: "Behavioral",
    topic: "Conflict & Teamwork",
    difficulty: "Medium",
    question: "Describe a time you faced a disagreement with a teammate during a college or coding project. How did you handle it?",
    idealAnswer:
      "Use the STAR method: Situation (describe the group project and deadline), Task (the objective you were trying to reach), Action (how you actively listened to their viewpoint, evaluated objective pros and cons with data/testing, and reached a constructive consensus), Result (the project was delivered on time with great grade/feedback and maintained good team camaraderie).",
    keyPoints: [
      "Focus on collaboration and objective problem solving, not blaming",
      "Demonstrate emotional intelligence and active listening",
      "Highlight the positive resolution and team outcome",
    ],
    targetRoles: ["Data Analyst", "Software Developer", "AI/ML Engineer", "Web Developer", "Data Scientist"],
  },
  {
    id: "hr-3",
    category: "Behavioral",
    topic: "Failure & Resilience",
    difficulty: "Hard",
    question: "Tell me about a time you made a significant mistake or missed a deadline. What did you learn?",
    idealAnswer:
      "Be honest: choose a real but manageable mistake. Outline how you took immediate accountability rather than deflecting, communicated transparently with your professor or team, took corrective action to fix the issue, and implemented a systemic habit (like checklists, unit tests, or time-boxing) to ensure it never happened again.",
    keyPoints: [
      "Take 100% accountability immediately",
      "Showcase corrective initiative and transparent communication",
      "Emphasize the permanent preventive lesson learned",
    ],
    targetRoles: ["Data Analyst", "Software Developer", "AI/ML Engineer", "Web Developer", "Data Scientist"],
  },
];

export const PRACTICE_QUESTIONS = practiceQuestionsData;
