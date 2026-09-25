/**
 * Starter content for a fresh database. The website never renders this file:
 * it only reads what is in Supabase.
 *
 * - `npm run seed:sql` turns this file into the numbered seed files in /supabase.
 *
 * After the database is seeded, everything here is edited from the admin panel.
 */
import type {
  CurriculumModule,
  FaqItem,
  Installment,
  LearningMode,
  ProgramAudience,
  SiteSettings,
} from "../../src/lib/types.ts";

export interface SeedCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface SeedCourse {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  fee: number;
  level: string;
  badge: string | null;
  is_ai_integrated: boolean;
  is_featured: boolean;
  icon: string;
  accent: string;
  tools: string[];
  outcomes: string[];
  prerequisites: string[];
  careers: string[];
  curriculum: CurriculumModule[];
  faqs: FaqItem[];
}

export const DEFAULT_DURATION = "3 Months";
export const ALL_MODES: LearningMode[] = ["online", "hybrid", "physical"];

export const DEFAULT_INSTALLMENTS: Installment[] = [
  { label: "First installment", percent: 50, note: "Payable at enrollment" },
  { label: "Second installment", percent: 50, note: "Payable when you are promoted to the internship" },
];

export const DEFAULT_INCLUDES: string[] = [
  "Live instructor-led classes",
  "Recorded video of every session",
  "Hands-on projects and assignments",
  "1:1 mentor support and doubt sessions",
  "Internship pathway after evaluation",
  "Verifiable completion certificate",
  "Learner community on Discord",
  "Career guidance and portfolio review",
];

export const seedSettings: SiteSettings = {
  site_name: "Leafclutch Academy",
  tagline: "Learn by building. Grow by doing.",
  announcement: "New batches are open. Online, Hybrid and Physical classes all cost the same.",
  hero_eyebrow: "Industry-led IT training in Nepal",
  hero_title: "Build job-ready skills for",
  hero_highlight: "the AI era",
  hero_subtitle:
    "Three-month, project-based programs in AI, data, development, security and design. Learn from working engineers, build real projects, and move into an internship.",
  phone: "+977-9766715768",
  whatsapp: "9779766715768",
  email: "info@leafclutch.com.np",
  address: "Siddharthanagar, Rupandehi, Nepal",
  office_hours: "Sun – Fri, 9:00 AM – 6:00 PM",
  map_embed_url: null,
  facebook_url: "https://www.facebook.com/profile.php?id=61584902195796",
  instagram_url: "https://www.instagram.com/leafclutch.technologies",
  linkedin_url: "https://www.linkedin.com/company/leafclutch-technologies",
  tiktok_url: "https://www.tiktok.com/@leafclutchtechnologies",
  youtube_url: null,
  discord_url: "https://discord.gg/4aDwcMZBPq",
  certificate_image_url: null,
  stats: [
    { value: "12", label: "Career programs" },
    { value: "3", label: "Learning modes, one fee" },
    { value: "50%", label: "Fee to get started" },
    { value: "100%", label: "Project-based learning" },
  ],
};

export const seedCategories: SeedCategory[] = [
  { slug: "ai-data", name: "AI & Data", description: "Agentic AI, generative AI, machine learning and data careers.", icon: "brain-circuit" },
  { slug: "programming", name: "Programming", description: "Strong programming foundations with Python.", icon: "code" },
  { slug: "web-development", name: "Web Development", description: "Frontend, backend and full-stack JavaScript.", icon: "layers" },
  { slug: "cyber-security", name: "Cyber Security", description: "Ethical hacking and defensive security.", icon: "shield-check" },
  { slug: "design", name: "Design", description: "UI/UX and graphic design with modern AI tools.", icon: "palette" },
];

export const seedCourses: SeedCourse[] = [
  {
    slug: "agentic-ai",
    title: "Agentic AI",
    subtitle: "Design, build and deploy autonomous AI agents that plan, use tools and get work done.",
    category: "ai-data",
    description:
      "Agentic AI is the next step after chatbots: software that can reason about a goal, call tools and APIs, remember context and finish multi-step tasks on its own. This program takes you from Python and LLM fundamentals to production-grade agents built with LangGraph, CrewAI and the Model Context Protocol (MCP).\n\nYou will build retrieval-augmented assistants, tool-using agents, multi-agent teams and workflow automations, then learn how to evaluate, secure and deploy them. Every module ends with a working project, so you graduate with a portfolio that shows employers you can ship real AI systems.",
    fee: 12000,
    level: "Intermediate",
    badge: "New",
    is_ai_integrated: true,
    is_featured: true,
    icon: "bot",
    accent: "#072069",
    tools: ["Python", "LangChain", "LangGraph", "CrewAI", "OpenAI API", "Claude API", "MCP", "ChromaDB", "pgvector", "FastAPI", "n8n", "Docker"],
    outcomes: [
      "Explain how LLMs, tokens, context windows and tool calling work",
      "Build tool-using agents with function calling and MCP servers",
      "Create RAG pipelines with embeddings and vector databases",
      "Orchestrate multi-agent systems with LangGraph and CrewAI",
      "Add guardrails, tracing and evaluations to AI systems",
      "Deploy agents as APIs with FastAPI and Docker",
    ],
    prerequisites: [
      "Basic programming knowledge in any language",
      "Comfort using a computer and the internet",
      "A laptop with at least 8 GB RAM",
    ],
    careers: ["AI Agent Developer", "AI Engineer", "LLM Application Developer", "Automation Engineer"],
    curriculum: [
      { title: "Python for AI Engineering", topics: ["Python refresher: data types, functions and OOP", "Virtual environments and package management", "Async programming and calling APIs", "Working with JSON, environment variables and secrets", "Git and GitHub workflow"] },
      { title: "LLM Foundations", topics: ["How LLMs work: tokens, context windows and sampling", "Prompt engineering patterns", "Working with OpenAI, Anthropic Claude and Gemini APIs", "Structured output with JSON schemas", "Choosing models by cost, latency and quality"] },
      { title: "Tool Use and Function Calling", topics: ["Defining tools and input schemas", "The tool-calling loop", "Building search, calculator and database tools", "Error handling, retries and timeouts", "Model Context Protocol (MCP) servers and clients"] },
      { title: "Retrieval and Memory", topics: ["Embeddings and semantic search", "Chunking strategies for documents", "RAG pipelines with ChromaDB and pgvector", "Short-term and long-term agent memory", "Measuring retrieval quality"] },
      { title: "Agent Frameworks", topics: ["LangChain and LangGraph fundamentals", "Graph-based agents and state machines", "ReAct, planning and reflection patterns", "Multi-agent teams with CrewAI", "Human-in-the-loop approvals"] },
      { title: "Multi-Agent Systems and Automation", topics: ["Orchestrator and worker architectures", "Workflow automation with n8n", "Browser and computer-use agents", "Agent-to-agent communication", "Project: autonomous research assistant"] },
      { title: "Evaluation, Safety and Deployment", topics: ["Tracing and observability with LangSmith or Langfuse", "Guardrails and prompt-injection defence", "Serving agents with FastAPI", "Docker and cloud deployment", "Monitoring cost and performance"] },
      { title: "Capstone Project", topics: ["Scoping a real business problem", "Architecture design review with your mentor", "Build, test and deploy an end-to-end agent", "Documentation and demo day", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Is Agentic AI different from Generative AI?", answer: "Generative AI focuses on creating content such as text and images. Agentic AI builds on it: agents use LLMs to plan, call tools and complete multi-step tasks. If you are new to LLMs, either course works as a starting point." },
      { question: "Do I need to pay for AI APIs?", answer: "No. We use free tiers, open-source models through Ollama and shared practice credits wherever possible, so you can complete every project without extra cost." },
      { question: "What will I build?", answer: "A RAG assistant, a tool-using agent, an MCP server, a multi-agent research team, an automation workflow and a deployed capstone agent." },
    ],
  },
  {
    slug: "generative-ai",
    title: "Generative AI",
    subtitle: "Build real applications with LLMs, prompt engineering, RAG and image generation.",
    category: "ai-data",
    description:
      "Generative AI is changing how software, content and businesses work. This program teaches you how modern generative models work and, more importantly, how to build useful products with them.\n\nYou will start with deep learning and transformer fundamentals, master prompt engineering, then build chatbots, document assistants and multimodal apps using OpenAI, Claude, Hugging Face and open-source models. You will also learn when and how to fine-tune a model, and how to ship your work with Streamlit and Gradio.",
    fee: 12000,
    level: "Beginner to Intermediate",
    badge: "Popular",
    is_ai_integrated: true,
    is_featured: true,
    icon: "sparkles",
    accent: "#0EA5E9",
    tools: ["Python", "OpenAI API", "Claude API", "Hugging Face", "LangChain", "PyTorch", "Stable Diffusion", "Whisper", "Ollama", "ChromaDB", "Streamlit", "Gradio"],
    outcomes: [
      "Understand transformers, attention and how LLMs are trained",
      "Write reliable prompts using proven prompt engineering patterns",
      "Build chatbots and document Q&A apps with RAG",
      "Generate and edit images, speech and multimodal content",
      "Fine-tune open-source models with LoRA and QLoRA",
      "Deploy generative AI apps with Streamlit and Gradio",
    ],
    prerequisites: ["Basic computer skills", "High-school level mathematics", "Programming experience is helpful but not required"],
    careers: ["Generative AI Engineer", "Prompt Engineer", "LLM Application Developer", "AI Product Developer"],
    curriculum: [
      { title: "Foundations of Generative AI", topics: ["What generative AI is and where it is used", "From GANs to transformers: a short history", "Text, image, audio, video and code generation", "Responsible and ethical AI", "Setting up Python, Jupyter and Google Colab"] },
      { title: "Python and Deep Learning Essentials", topics: ["NumPy and Pandas quick tour", "Neural network basics", "PyTorch tensors and training loops", "Transfer learning", "Using GPUs on Colab"] },
      { title: "Transformers and Large Language Models", topics: ["The attention mechanism explained", "Tokenization and embeddings", "Encoder, decoder and encoder-decoder models", "The Hugging Face Transformers library", "Open-source vs proprietary models"] },
      { title: "Prompt Engineering", topics: ["Zero-shot, few-shot and chain-of-thought prompting", "System prompts and personas", "Structured outputs", "Testing and iterating on prompts", "Prompt injection awareness"] },
      { title: "Building LLM Applications", topics: ["Working with LLM APIs", "Chatbots with conversation memory", "Retrieval-augmented generation over documents", "LangChain building blocks", "Streamlit and Gradio interfaces"] },
      { title: "Image, Audio and Multimodal Generation", topics: ["How diffusion models work", "Text-to-image and image-to-image with Stable Diffusion", "Speech-to-text with Whisper and text-to-speech", "Vision-language models", "Building a multimodal app"] },
      { title: "Fine-tuning and Optimization", topics: ["Prompting vs RAG vs fine-tuning", "LoRA and QLoRA fine-tuning", "Preparing training datasets", "Quantization and local models with Ollama", "Evaluating generative models"] },
      { title: "Capstone Project", topics: ["Choosing a real-world use case", "Design review with your mentor", "Build and deploy a generative AI product", "Presentation and demo day", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "I have never coded before. Can I join?", answer: "Yes. The first two modules cover the Python you need. Expect to spend some extra practice time in the first weeks." },
      { question: "Will I learn to use ChatGPT or to build with it?", answer: "Both, but the focus is building. You will call models through APIs and create your own applications." },
      { question: "Do I need a powerful computer?", answer: "No. Heavy training runs on free cloud GPUs such as Google Colab." },
    ],
  },
  {
    slug: "ai-ml",
    title: "AI / ML",
    subtitle: "Master machine learning and deep learning, from the maths to deployed models.",
    category: "ai-data",
    description:
      "This Artificial Intelligence and Machine Learning program gives you a solid, practical grounding in how machines learn from data. You will learn the essential maths intuitively, prepare real datasets, and train classical machine learning and deep learning models.\n\nThe course covers supervised and unsupervised learning, neural networks, computer vision and natural language processing, then shows you how to package models as APIs and integrate them with modern generative AI tools. You will finish with an end-to-end ML project you can show employers.",
    fee: 12000,
    level: "Beginner to Intermediate",
    badge: null,
    is_ai_integrated: true,
    is_featured: true,
    icon: "brain-circuit",
    accent: "#11A4D4",
    tools: ["Python", "NumPy", "Pandas", "Matplotlib", "Scikit-learn", "TensorFlow", "Keras", "PyTorch", "OpenCV", "Jupyter", "FastAPI", "Streamlit"],
    outcomes: [
      "Apply linear algebra, probability and statistics to ML problems",
      "Clean, explore and engineer features from real datasets",
      "Train and evaluate regression, classification and clustering models",
      "Build neural networks, CNNs and RNNs with TensorFlow and PyTorch",
      "Solve computer vision and NLP problems",
      "Deploy models as APIs and interactive apps",
    ],
    prerequisites: ["Basic programming knowledge (Python preferred)", "High-school level mathematics", "A laptop with at least 8 GB RAM"],
    careers: ["Machine Learning Engineer", "AI Engineer", "Junior Data Scientist", "Computer Vision Engineer"],
    curriculum: [
      { title: "Python for Machine Learning", topics: ["Python essentials for data work", "NumPy arrays and vectorisation", "Pandas DataFrames", "Visualisation with Matplotlib and Seaborn", "Jupyter workflow"] },
      { title: "Mathematics for ML", topics: ["Vectors, matrices and linear algebra", "Probability and distributions", "Descriptive and inferential statistics", "Calculus intuition and derivatives", "Gradient descent"] },
      { title: "Data Preprocessing and EDA", topics: ["Handling missing values and outliers", "Encoding categorical data", "Scaling and normalisation", "Feature engineering and selection", "Exploratory data analysis case study"] },
      { title: "Supervised Learning", topics: ["Linear and logistic regression", "K-nearest neighbours and support vector machines", "Decision trees and random forests", "Gradient boosting with XGBoost", "Model evaluation, cross-validation and tuning"] },
      { title: "Unsupervised Learning", topics: ["K-means and hierarchical clustering", "DBSCAN", "Principal component analysis", "Anomaly detection", "Recommendation system basics"] },
      { title: "Deep Learning", topics: ["Artificial neural networks", "Training with TensorFlow/Keras and PyTorch", "Convolutional neural networks", "RNNs and LSTMs", "Regularisation, dropout and transfer learning"] },
      { title: "Computer Vision and NLP", topics: ["Image processing with OpenCV", "Image classification and object detection", "Text preprocessing and embeddings", "Sentiment analysis", "Introduction to transformers and LLMs"] },
      { title: "MLOps and Deployment", topics: ["Saving and versioning models", "Serving models with FastAPI", "Interactive apps with Streamlit", "Docker basics", "Adding generative AI to ML products"] },
      { title: "Capstone Project", topics: ["Problem definition and data collection", "Model development and experiments", "Deployment and documentation", "Demo day", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "How much maths do I need?", answer: "School-level maths is enough. We teach the linear algebra, statistics and calculus you need with visual, practical examples." },
      { question: "AI/ML or Data Science: which should I choose?", answer: "Choose AI/ML if you want to build models and AI products. Choose Data Science if you are more interested in analysing data and answering business questions with it." },
      { question: "Which deep learning framework is taught?", answer: "Both TensorFlow/Keras and PyTorch, so you can work with either in a job." },
    ],
  },
  {
    slug: "data-science",
    title: "Data Science",
    subtitle: "Turn raw data into insights and predictions with Python, statistics, SQL and ML.",
    category: "ai-data",
    description:
      "Data Science combines programming, statistics and business thinking to answer questions with data. This program trains you on the complete workflow: collecting and cleaning data, exploring it, building predictive models and communicating results clearly.\n\nYou will work with Python, SQL, Pandas, Scikit-learn and Power BI on realistic datasets from sectors like finance, retail and health. AI-assisted analysis is built into the course so you learn to work the way modern data teams do.",
    fee: 12000,
    level: "Beginner to Intermediate",
    badge: null,
    is_ai_integrated: true,
    is_featured: false,
    icon: "flask-conical",
    accent: "#3B82F6",
    tools: ["Python", "Jupyter", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "SQL", "PostgreSQL", "Power BI", "Streamlit", "Git"],
    outcomes: [
      "Write clean Python for data collection and analysis",
      "Apply statistics and hypothesis testing to real questions",
      "Query and join data with SQL",
      "Build and evaluate predictive machine learning models",
      "Create dashboards and data stories for decision makers",
      "Use AI assistants to speed up analysis responsibly",
    ],
    prerequisites: ["Basic computer skills", "Comfort with school-level mathematics", "No prior programming required"],
    careers: ["Data Scientist", "Data Analyst", "Junior ML Engineer", "Business Intelligence Analyst"],
    curriculum: [
      { title: "Python Programming", topics: ["Variables, data types and control flow", "Functions and modules", "Lists, dictionaries and comprehensions", "File handling", "Jupyter notebooks"] },
      { title: "Statistics and Probability", topics: ["Descriptive statistics", "Probability and distributions", "Sampling and confidence intervals", "Hypothesis testing and A/B tests", "Correlation and regression"] },
      { title: "Data Wrangling with Pandas", topics: ["Loading CSV, Excel and JSON data", "Cleaning and transforming data", "Grouping, merging and reshaping", "Working with dates and time series", "Web scraping and APIs"] },
      { title: "Data Visualization", topics: ["Principles of good charts", "Matplotlib and Seaborn", "Interactive charts with Plotly", "Power BI dashboards", "Storytelling with data"] },
      { title: "SQL for Data Science", topics: ["SELECT, WHERE, ORDER BY", "Joins and subqueries", "Aggregation and GROUP BY", "Window functions", "Connecting Python to databases"] },
      { title: "Machine Learning", topics: ["The ML workflow", "Regression and classification models", "Clustering and segmentation", "Model evaluation and tuning", "Feature engineering"] },
      { title: "Applied Data Science", topics: ["Time series forecasting", "Text analysis basics", "Recommendation systems", "AI-assisted analysis with LLMs", "Building data apps with Streamlit"] },
      { title: "Capstone Project", topics: ["Choosing a dataset and business question", "End-to-end analysis and modelling", "Dashboard and report", "Presentation to a panel", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Is this course suitable for non-IT graduates?", answer: "Yes. Many data scientists come from commerce, science and engineering backgrounds. We start from programming basics." },
      { question: "Will I learn Power BI as well?", answer: "Yes. The visualization module covers Power BI dashboards alongside Python charting libraries." },
      { question: "What kind of projects will I do?", answer: "Sales analysis, customer segmentation, price prediction, churn prediction and a capstone on a dataset of your choice." },
    ],
  },
  {
    slug: "data-analytics",
    title: "Data Analytics",
    subtitle: "Excel, SQL, Power BI, Tableau and Python for confident, data-driven decisions.",
    category: "ai-data",
    description:
      "Every organisation needs people who can turn data into clear answers. This Data Analytics program makes you confident with the tools analysts use every day: advanced Excel, SQL, Power BI, Tableau and Python.\n\nYou will clean messy data, build data models, write DAX, design interactive dashboards and present insights to decision makers. You will also learn to use AI copilots to speed up reporting. The course is practical from day one and ends with a portfolio of dashboards built on realistic business data.",
    fee: 10000,
    level: "Beginner",
    badge: "Popular",
    is_ai_integrated: true,
    is_featured: true,
    icon: "chart-no-axes-combined",
    accent: "#0F766E",
    tools: ["Excel", "Power Query", "Power BI", "DAX", "SQL", "MySQL", "Tableau", "Python", "Pandas", "Google Sheets", "Copilot"],
    outcomes: [
      "Use advanced Excel formulas, pivot tables and Power Query",
      "Write SQL queries to extract and summarise data",
      "Model data and write DAX measures in Power BI",
      "Design interactive dashboards in Power BI and Tableau",
      "Analyse data with Python and Pandas",
      "Present insights clearly to business stakeholders",
    ],
    prerequisites: ["Basic computer and Excel familiarity", "No programming experience required"],
    careers: ["Data Analyst", "Business Analyst", "BI Analyst", "MIS Executive", "Reporting Analyst"],
    curriculum: [
      { title: "Introduction to Data Analytics", topics: ["The analytics lifecycle", "Types of analytics", "Data types and data quality", "Roles in a data team", "Asking the right business questions"] },
      { title: "Advanced Excel", topics: ["Lookup functions: XLOOKUP, INDEX and MATCH", "Logical and text functions", "Pivot tables and pivot charts", "Power Query for data cleaning", "Excel dashboards"] },
      { title: "SQL for Analysts", topics: ["Database basics and MySQL setup", "Filtering, sorting and aggregation", "Joins across multiple tables", "CTEs and window functions", "Writing reporting queries"] },
      { title: "Power BI", topics: ["Power Query transformations", "Data modelling and relationships", "DAX measures and calculated columns", "Interactive reports and dashboards", "Publishing and sharing reports"] },
      { title: "Tableau", topics: ["Connecting data sources", "Calculated fields", "Maps, filters and parameters", "Dashboards and stories", "Tableau Public portfolio"] },
      { title: "Python for Analytics", topics: ["Python basics", "Pandas for data manipulation", "Data cleaning at scale", "Visualisation with Seaborn", "Automating reports"] },
      { title: "Business Statistics and AI-powered Analytics", topics: ["Descriptive statistics for business", "Trends, forecasting and KPIs", "Using Copilot and ChatGPT for analysis", "Checking AI output for accuracy", "Presenting insights"] },
      { title: "Capstone Project", topics: ["Real business dataset", "Cleaning, modelling and analysis", "Executive dashboard", "Insight presentation", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Do I need programming skills?", answer: "No. The course starts with Excel and SQL. Python is introduced gently later in the course." },
      { question: "Which is taught: Power BI or Tableau?", answer: "Both. Power BI is covered in more depth because it is the most requested tool in Nepal's job market." },
      { question: "Is this course good for people already working?", answer: "Yes. Many learners are accountants, bankers and administrators who want to automate reports and move into analytics roles." },
    ],
  },
  {
    slug: "python",
    title: "Python Programming",
    subtitle: "From zero to confident Python developer, with automation, APIs and a web project.",
    category: "programming",
    description:
      "Python is the most popular first language and the foundation for AI, data science, automation and backend development. This course teaches you to think like a programmer and write clean, working Python from the very first class.\n\nYou will cover the fundamentals, object-oriented programming, files, databases, APIs and automation, then build a small web application with Flask. You will also learn how to use AI coding assistants responsibly to learn faster and debug better.",
    fee: 8000,
    level: "Beginner",
    badge: null,
    is_ai_integrated: true,
    is_featured: true,
    icon: "code",
    accent: "#2563EB",
    tools: ["Python", "VS Code", "Git", "GitHub", "pip", "Jupyter", "SQLite", "Requests", "Flask", "Pandas", "pytest"],
    outcomes: [
      "Write Python programs using variables, loops and functions",
      "Use lists, dictionaries, sets and tuples effectively",
      "Apply object-oriented programming",
      "Work with files, exceptions, databases and APIs",
      "Automate everyday tasks with scripts",
      "Build and test a small Flask web application",
    ],
    prerequisites: ["Basic computer skills", "No prior programming experience required"],
    careers: ["Junior Python Developer", "Automation Engineer", "Junior Backend Developer", "QA Automation Engineer"],
    curriculum: [
      { title: "Getting Started", topics: ["How programs run", "Installing Python and VS Code", "Your first program", "Using the terminal", "Git and GitHub basics"] },
      { title: "Python Basics", topics: ["Variables and data types", "Operators and expressions", "Input and output", "String methods and formatting", "Type conversion"] },
      { title: "Control Flow and Data Structures", topics: ["Conditions with if, elif and else", "for and while loops", "Lists and tuples", "Dictionaries and sets", "Comprehensions"] },
      { title: "Functions and Modules", topics: ["Defining functions and parameters", "Scope and return values", "Lambda, map and filter", "Modules and packages", "Virtual environments and pip"] },
      { title: "Object-Oriented Programming", topics: ["Classes and objects", "Inheritance and polymorphism", "Encapsulation", "Magic methods", "Designing small programs with OOP"] },
      { title: "Files, Errors and Databases", topics: ["Reading and writing files", "CSV and JSON", "Exception handling", "SQLite with Python", "Logging"] },
      { title: "APIs, Automation and Testing", topics: ["HTTP requests with Requests", "Consuming public APIs", "Automating files, Excel and emails", "Writing tests with pytest", "AI-assisted coding and debugging"] },
      { title: "Web Basics and Final Project", topics: ["Flask routes and templates", "Forms and databases in Flask", "Deploying a small app", "Final project and code review", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Is Python a good first language?", answer: "Yes. Its readable syntax makes it the easiest language to start with, and it leads directly into AI, data and backend careers." },
      { question: "What can I do after this course?", answer: "You can continue into Data Science, AI/ML, Generative AI or Backend Development with a strong foundation." },
      { question: "Is this course suitable for school students?", answer: "Yes. Students from grade 9 onwards regularly join our Python batches." },
    ],
  },
  {
    slug: "mern-stack-development",
    title: "MERN Stack Development",
    subtitle: "Build full-stack web apps with MongoDB, Express, React, Node.js and Next.js.",
    category: "web-development",
    description:
      "The MERN stack lets you build complete web applications using one language, JavaScript. This program covers modern JavaScript, React with TypeScript and Next.js on the frontend, and Node.js, Express and MongoDB on the backend.\n\nYou will learn authentication, REST APIs, state management, testing and deployment, and use AI coding tools like Cursor and Copilot the way professional teams do. By the end you will have built and deployed several full-stack projects, including an e-commerce style capstone.",
    fee: 10000,
    level: "Beginner to Intermediate",
    badge: "Popular",
    is_ai_integrated: true,
    is_featured: true,
    icon: "layers",
    accent: "#16A34A",
    tools: ["JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "Tailwind CSS", "Redux Toolkit", "Git / GitHub", "Postman", "Jest", "Cursor"],
    outcomes: [
      "Write modern JavaScript and TypeScript confidently",
      "Build responsive interfaces with React, Next.js and Tailwind CSS",
      "Design REST APIs with Node.js and Express",
      "Model data with MongoDB and Mongoose",
      "Implement authentication, authorisation and testing",
      "Deploy full-stack applications to the cloud",
    ],
    prerequisites: ["Basic computer skills", "Familiarity with HTML is helpful but not required"],
    careers: ["MERN Stack Developer", "Full-Stack Developer", "React Developer", "Node.js Developer"],
    curriculum: [
      { title: "JavaScript with Git", topics: ["Web development overview and MERN roadmap", "Setting up Node.js, VS Code and Git", "JavaScript basics, functions and scope", "Arrays, objects and ES6+ features", "Async JavaScript: promises and async/await", "Introduction to TypeScript"] },
      { title: "Frontend Foundations", topics: ["Semantic HTML5", "CSS layout: Flexbox and Grid", "Responsive design", "Tailwind CSS", "DOM manipulation and events"] },
      { title: "React Fundamentals with TypeScript", topics: ["Components, props and JSX", "State and hooks", "Forms and validation", "Routing", "State management with Redux Toolkit"] },
      { title: "React with Next.js", topics: ["App Router, layouts and pages", "Server and client components", "Data fetching and caching", "SEO and metadata", "Building with AI tools like Cursor"] },
      { title: "Node.js with Express", topics: ["Node.js runtime and modules", "Express routing and middleware", "REST API design", "File uploads and validation", "API testing with Postman"] },
      { title: "Database and Usage", topics: ["MongoDB fundamentals", "Mongoose schemas and models", "Relationships and aggregation", "Indexes and performance", "Introduction to SQL databases"] },
      { title: "Authentication, Testing and Deployment", topics: ["JWT and session authentication", "Role-based authorisation", "Security best practices", "Unit and API testing with Jest", "Deploying to Vercel and cloud servers"] },
      { title: "Project Modules", topics: ["Full-stack e-commerce project", "Payment gateway integration (eSewa / Khalti)", "Admin dashboard", "Code review and demo day", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Why learn MERN?", answer: "It uses JavaScript across the whole stack, has a huge community and is widely used by companies in Nepal and abroad." },
      { question: "Is Next.js included?", answer: "Yes. A full module covers React with Next.js, which most modern React jobs now expect." },
      { question: "Will I integrate local payment gateways?", answer: "Yes. The capstone includes an eSewa or Khalti integration in a test environment." },
    ],
  },
  {
    slug: "frontend-development",
    title: "Frontend Development",
    subtitle: "Craft fast, responsive and accessible websites with HTML, CSS, JavaScript and React.",
    category: "web-development",
    description:
      "Frontend developers build everything users see and interact with. This course takes you from HTML and CSS through JavaScript, React, Next.js and TypeScript, with a strong focus on responsive layouts, accessibility and performance.\n\nYou will turn Figma designs into pixel-perfect pages, consume APIs, manage state, and deploy your projects to the web. You will also learn how to use AI tools to prototype faster while writing code you understand.",
    fee: 8000,
    level: "Beginner",
    badge: null,
    is_ai_integrated: true,
    is_featured: false,
    icon: "monitor-smartphone",
    accent: "#0891B2",
    tools: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Git", "Figma", "Vercel", "Chrome DevTools"],
    outcomes: [
      "Build semantic, accessible HTML pages",
      "Create responsive layouts with Flexbox, Grid and Tailwind CSS",
      "Write interactive features with modern JavaScript",
      "Build component-based apps with React and Next.js",
      "Convert Figma designs into production-ready code",
      "Optimise sites for performance and SEO",
    ],
    prerequisites: ["Basic computer skills", "No prior coding experience required"],
    careers: ["Frontend Developer", "React Developer", "UI Developer", "Web Developer"],
    curriculum: [
      { title: "Web Fundamentals", topics: ["How the web works", "Browsers, DNS and hosting", "Developer tools setup", "Git and GitHub", "Reading design files in Figma"] },
      { title: "HTML5", topics: ["Document structure and semantics", "Text, links, lists and media", "Tables and forms", "Accessibility basics", "SEO-friendly markup"] },
      { title: "CSS3 and Responsive Design", topics: ["Selectors, box model and units", "Flexbox", "CSS Grid", "Media queries and mobile-first design", "Animations and transitions"] },
      { title: "Tailwind CSS", topics: ["Utility-first workflow", "Responsive and state variants", "Theming and design tokens", "Component patterns", "Building a landing page"] },
      { title: "JavaScript", topics: ["Variables, types and operators", "Functions, arrays and objects", "DOM manipulation and events", "Fetch API and async/await", "ES6+ features and modules"] },
      { title: "React and Next.js", topics: ["Components, props and state", "Hooks and effects", "Routing with Next.js", "Fetching data from APIs", "Deploying to Vercel"] },
      { title: "TypeScript, Performance and Quality", topics: ["TypeScript for React", "Core Web Vitals and performance", "Accessibility testing", "AI tools for frontend development", "Debugging with DevTools"] },
      { title: "Final Project", topics: ["Multi-page responsive website from a Figma design", "React dashboard consuming a real API", "Code review", "Portfolio website", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Frontend or MERN: which is right for me?", answer: "Choose Frontend if you enjoy building interfaces and want to specialise. Choose MERN if you want to build complete applications including the backend and database." },
      { question: "Will I build a portfolio?", answer: "Yes. You will deploy your own portfolio website plus several projects to link from your CV." },
      { question: "Do I need a design background?", answer: "No. We teach you how to read and implement designs from Figma." },
    ],
  },
  {
    slug: "backend-development",
    title: "Backend Development",
    subtitle: "Design secure, scalable APIs and services with Node.js, databases and Docker.",
    category: "web-development",
    description:
      "Backend developers build the engines behind every app: APIs, databases, authentication and integrations. This course teaches you to build reliable backend services with Node.js, Express and TypeScript, backed by PostgreSQL and MongoDB.\n\nYou will learn API design, security, caching, real-time features, testing and deployment with Docker and CI/CD. You will also add AI features to your APIs, a skill that is increasingly expected from backend engineers.",
    fee: 8000,
    level: "Intermediate",
    badge: null,
    is_ai_integrated: true,
    is_featured: false,
    icon: "server",
    accent: "#4F46E5",
    tools: ["Node.js", "Express.js", "TypeScript", "PostgreSQL", "MongoDB", "Prisma", "Redis", "JWT", "Docker", "GitHub Actions", "Postman", "Swagger"],
    outcomes: [
      "Explain HTTP, REST and client-server architecture",
      "Build structured APIs with Node.js, Express and TypeScript",
      "Design relational and document databases",
      "Implement authentication, authorisation and security best practices",
      "Add caching, queues and real-time features",
      "Test, containerise and deploy backend services",
    ],
    prerequisites: ["Basic JavaScript or any programming language", "Comfort using the command line is helpful"],
    careers: ["Backend Developer", "Node.js Developer", "API Developer", "Junior DevOps Engineer"],
    curriculum: [
      { title: "Backend Fundamentals", topics: ["Client-server architecture", "HTTP methods, status codes and headers", "REST principles", "JSON and data formats", "Linux command line basics"] },
      { title: "Node.js and TypeScript", topics: ["Node.js runtime and event loop", "Modules and npm", "TypeScript essentials", "File system and streams", "Environment configuration"] },
      { title: "Express.js APIs", topics: ["Routing and controllers", "Middleware", "Validation with Zod", "Error handling", "Project structure for large APIs"] },
      { title: "Databases", topics: ["SQL and PostgreSQL", "Database design and normalisation", "Prisma ORM", "MongoDB and Mongoose", "Transactions and indexes"] },
      { title: "Authentication and Security", topics: ["Password hashing", "JWT and refresh tokens", "Role-based access control", "OWASP API security risks", "Rate limiting and CORS"] },
      { title: "Advanced Backend", topics: ["Caching with Redis", "Background jobs and queues", "WebSockets and real-time features", "File storage and uploads", "Adding AI features with LLM APIs"] },
      { title: "Testing, Documentation and Deployment", topics: ["Unit and integration testing", "API documentation with Swagger", "Docker and Docker Compose", "CI/CD with GitHub Actions", "Deploying to a cloud VPS"] },
      { title: "Capstone Project", topics: ["Production-style REST API", "Authentication, payments and notifications", "Load testing and monitoring", "Code review and demo day", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Do I need frontend knowledge first?", answer: "No. Basic JavaScript is enough. You will test your APIs with Postman rather than a frontend." },
      { question: "Which databases are covered?", answer: "PostgreSQL with Prisma and MongoDB with Mongoose, so you can work with both SQL and NoSQL." },
      { question: "Is DevOps included?", answer: "The essentials are: Docker, CI/CD with GitHub Actions and deploying to a cloud server." },
    ],
  },
  {
    slug: "cyber-security-ethical-hacking",
    title: "Cyber Security: Ethical Hacking",
    subtitle: "Learn to think like an attacker and defend like a professional, legally and ethically.",
    category: "cyber-security",
    description:
      "Cyber security skills are in high demand as more of Nepal's banks, businesses and government services move online. This ethical hacking program teaches you how attacks work so you can find and fix weaknesses before criminals do.\n\nWorking in safe lab environments, you will learn networking, Linux, reconnaissance, scanning, exploitation, web application security and defensive security operations. You will also learn to write professional vulnerability reports and understand the legal and ethical rules that govern security testing.",
    fee: 8000,
    level: "Beginner to Intermediate",
    badge: null,
    is_ai_integrated: false,
    is_featured: true,
    icon: "shield-check",
    accent: "#0F1729",
    tools: ["Kali Linux", "Nmap", "Wireshark", "Burp Suite", "Metasploit", "OWASP ZAP", "Nessus", "John the Ripper", "Hydra", "Python", "TryHackMe"],
    outcomes: [
      "Understand networking, protocols and common attack surfaces",
      "Use Linux and Kali tools confidently",
      "Perform reconnaissance, scanning and enumeration",
      "Identify and exploit vulnerabilities in lab environments",
      "Test web applications against the OWASP Top 10",
      "Write clear, professional vulnerability reports",
    ],
    prerequisites: ["Basic computer and internet knowledge", "Networking knowledge is helpful but not required", "A laptop with at least 8 GB RAM for virtual machines"],
    careers: ["Security Analyst", "Junior Penetration Tester", "SOC Analyst (L1)", "Vulnerability Assessment Analyst"],
    curriculum: [
      { title: "Introduction to Cyber Security", topics: ["The CIA triad and security concepts", "Types of hackers and threat actors", "Cyber laws, ethics and Nepal's Electronic Transactions Act", "Career paths in security", "Setting up a safe virtual lab"] },
      { title: "Networking Fundamentals", topics: ["OSI and TCP/IP models", "IP addressing and subnetting", "Ports, protocols and services", "Packet analysis with Wireshark", "Firewalls, VPNs and proxies"] },
      { title: "Linux for Security", topics: ["Linux file system and permissions", "Essential commands", "Users, processes and services", "Bash scripting basics", "Kali Linux tools overview"] },
      { title: "Reconnaissance and Scanning", topics: ["Passive and active footprinting", "OSINT techniques", "Network scanning with Nmap", "Enumeration of services", "Vulnerability scanning with Nessus"] },
      { title: "System Hacking", topics: ["Exploitation with Metasploit", "Password attacks and cracking", "Privilege escalation basics", "Malware types and analysis basics", "Covering tracks and detection"] },
      { title: "Web Application Security", topics: ["How web apps work", "OWASP Top 10", "SQL injection and XSS", "Authentication and session attacks", "Testing with Burp Suite and OWASP ZAP"] },
      { title: "Wireless, Social Engineering and Defence", topics: ["Wireless security", "Social engineering and phishing awareness", "Security monitoring and SOC basics", "Incident response", "Hardening systems"] },
      { title: "Reporting and Capstone", topics: ["Penetration testing methodology", "Writing vulnerability reports", "Capture-the-flag challenge", "Capstone assessment", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Is ethical hacking legal?", answer: "Yes, when you have permission. All practice happens in our own lab environments, and the course covers the laws and ethics you must follow." },
      { question: "Do I need to know programming?", answer: "No. Basic scripting is taught in the course. Programming knowledge helps as you advance." },
      { question: "Does this prepare me for certifications?", answer: "The content aligns well with entry-level certifications such as CompTIA Security+ and CEH, although exam fees are not included." },
    ],
  },
  {
    slug: "ui-ux-designing",
    title: "UI/UX Designing",
    subtitle: "Research, design and prototype digital products people love, using Figma and AI.",
    category: "design",
    description:
      "UI/UX designers shape how people experience apps and websites. This course teaches you the complete product design process: understanding users, structuring information, sketching ideas, designing polished interfaces and testing them with real people.\n\nYou will become fluent in Figma, including components, auto layout and variables, and learn how design systems and developer handoff work in real teams. AI design tools are built into the workflow, and you will finish with case studies ready for your portfolio.",
    fee: 7000,
    level: "Beginner",
    badge: null,
    is_ai_integrated: true,
    is_featured: true,
    icon: "pen-tool",
    accent: "#7C3AED",
    tools: ["Figma", "FigJam", "Figma AI", "Framer", "Miro", "Maze", "Notion", "Google Forms", "Photoshop"],
    outcomes: [
      "Apply the design thinking process to real problems",
      "Plan and run user research and usability tests",
      "Create user flows, wireframes and information architecture",
      "Design polished interfaces with strong visual hierarchy",
      "Build components, auto layout and design systems in Figma",
      "Create interactive prototypes and portfolio case studies",
    ],
    prerequisites: ["Basic computer skills", "No drawing or design background required"],
    careers: ["UI/UX Designer", "Product Designer", "UI Designer", "UX Researcher"],
    curriculum: [
      { title: "Introduction to UI/UX", topics: ["What UI and UX mean", "The design thinking process", "Roles in a product team", "Great and poor design examples", "Setting up Figma"] },
      { title: "UX Research", topics: ["Research goals and planning", "User interviews and surveys", "Personas and empathy maps", "Customer journey maps", "Competitive analysis"] },
      { title: "Information Architecture and Wireframing", topics: ["Sitemaps and user flows", "Card sorting", "Low-fidelity sketches", "Wireframes in Figma", "Content-first design"] },
      { title: "Visual Design", topics: ["Layout, grids and spacing", "Typography", "Colour theory and accessibility", "Iconography and imagery", "Visual hierarchy"] },
      { title: "Figma Mastery", topics: ["Frames, constraints and auto layout", "Components and variants", "Variables and modes", "Styles and libraries", "Figma AI features"] },
      { title: "Prototyping and Usability Testing", topics: ["Interactive prototypes", "Micro-interactions and animation", "Usability testing with Maze", "Analysing feedback", "Iterating on designs"] },
      { title: "Design Systems and Handoff", topics: ["Building a design system", "Responsive and mobile design", "Developer handoff and Dev Mode", "Designing with AI tools", "Working with developers"] },
      { title: "Portfolio Project", topics: ["End-to-end app design case study", "Website redesign case study", "Portfolio on Behance or Framer", "Design critique", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Do I need to be good at drawing?", answer: "No. UI/UX design is about solving problems and communicating clearly. Drawing skills are not required." },
      { question: "Which software will I use?", answer: "Mainly Figma, plus FigJam, Miro and Maze for research and testing." },
      { question: "Will I have a portfolio at the end?", answer: "Yes. You will complete at least two full case studies ready to share with employers." },
    ],
  },
  {
    slug: "graphics-designing",
    title: "Graphics Designing",
    subtitle: "Create logos, brand identities, social media and print designs with Adobe and AI tools.",
    category: "design",
    description:
      "Graphic designers communicate ideas visually for brands, businesses and campaigns. This course builds your foundation in design principles, colour and typography, then trains you on Adobe Photoshop, Illustrator and InDesign.\n\nYou will design logos, brand identities, social media campaigns, posters and print materials, and learn to use AI image tools like Adobe Firefly to work faster. The course ends with a professional portfolio and guidance on working with clients and freelancing.",
    fee: 7000,
    level: "Beginner",
    badge: null,
    is_ai_integrated: true,
    is_featured: false,
    icon: "palette",
    accent: "#DB2777",
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Adobe Firefly", "Canva", "Figma", "Lightroom", "Midjourney"],
    outcomes: [
      "Apply design principles, colour theory and typography",
      "Edit and composite images in Photoshop",
      "Create vector illustrations and logos in Illustrator",
      "Design brand identities and style guides",
      "Lay out print materials in InDesign",
      "Build a professional portfolio and work with clients",
    ],
    prerequisites: ["Basic computer skills", "Interest in visual design, no experience required"],
    careers: ["Graphic Designer", "Social Media Designer", "Brand Designer", "Freelance Designer"],
    curriculum: [
      { title: "Design Fundamentals", topics: ["Elements and principles of design", "Colour theory", "Typography", "Layout and composition", "Gathering inspiration"] },
      { title: "Adobe Photoshop", topics: ["Interface and tools", "Layers, masks and selections", "Photo retouching", "Compositing and manipulation", "Designing social media posts"] },
      { title: "Adobe Illustrator", topics: ["Vector graphics basics", "Pen tool and shapes", "Illustration techniques", "Icons and infographics", "Preparing files for print and web"] },
      { title: "Logo and Brand Identity", topics: ["Brand research and strategy", "Logo design process", "Colour palettes and type systems", "Brand guidelines", "Mockups and presentation"] },
      { title: "Print Design with InDesign", topics: ["Document setup and grids", "Brochures and flyers", "Posters and banners", "Business cards and stationery", "Print production basics"] },
      { title: "Social Media and Digital Design", topics: ["Social media campaigns", "Ad creatives and thumbnails", "Canva for quick content", "Basic motion graphics", "Designing for different platforms"] },
      { title: "AI Tools for Designers", topics: ["Adobe Firefly and Generative Fill", "Midjourney prompts", "AI-assisted workflows", "Copyright and ethics of AI art", "Combining AI with manual design"] },
      { title: "Portfolio and Freelancing", topics: ["Building a portfolio on Behance", "Working with clients and briefs", "Pricing and freelancing platforms", "Final brand project", "Internship readiness evaluation"] },
    ],
    faqs: [
      { question: "Graphic design or UI/UX: what is the difference?", answer: "Graphic design focuses on visual communication like logos, posters and branding. UI/UX focuses on designing how digital products work and feel." },
      { question: "Do I need my own Adobe licence?", answer: "You can practise on lab computers during physical classes. For home practice we guide you through free trials and free alternatives." },
      { question: "Can I freelance after this course?", answer: "Yes. The final module covers portfolios, pricing and finding clients on freelancing platforms." },
    ],
  },
];

export interface SeedMentor {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  expertise: string[];
  linkedin_url: string | null;
  courses: string[];
}

export const seedMentors: SeedMentor[] = [
  {
    slug: "rohan-aryal",
    name: "Rohan Aryal",
    role: "Mentor",
    bio: "Rohan mentors Leafclutch Academy's AI and data programs, guiding learners from their first lines of Python to building agents, generative AI applications, machine learning models and analytics dashboards, with a strong focus on hands-on projects.",
    photo_url: "/mentors/rohan.jpeg",
    expertise: ["Agentic AI", "Generative AI", "Data Science", "Data Analytics", "AI/ML"],
    linkedin_url: null,
    courses: ["agentic-ai", "generative-ai", "data-science", "data-analytics", "ai-ml"],
  },
];

export interface SeedFaq {
  question: string;
  answer: string;
  topic: string;
}

export const seedFaqs: SeedFaq[] = [
  { topic: "fees", question: "Do Online, Hybrid and Physical classes cost the same?", answer: "Yes. Every program has one fee whichever mode you choose, so you can pick the format that suits your schedule and location." },
  { topic: "fees", question: "How does the payment plan work?", answer: "You pay 50% of the fee at enrollment to reserve your seat and start learning. The remaining 50% is paid when you complete the training phase and are promoted to the internship." },
  { topic: "learning", question: "What is the difference between Online, Hybrid and Physical classes?", answer: "Online classes are live and interactive over video. Physical classes happen in person at our lab in Siddharthanagar. Hybrid lets you mix both, attending in person when you can and joining live online when you cannot." },
  { topic: "learning", question: "Will I get recordings of the classes?", answer: "Yes. Every live session is recorded and shared with your batch, so you can revise any topic or catch up on a class you missed." },
  { topic: "career", question: "What is the internship pathway?", answer: "After the three-month training, your projects are evaluated. Learners who meet the standard are promoted to an internship where they work on real projects with mentor supervision." },
  { topic: "career", question: "Will I receive a certificate?", answer: "Yes. You receive a completion certificate with a unique code that employers can check at verify.leafclutch.com.np." },
  { topic: "learning", question: "What do I need to join?", answer: "A laptop and a stable internet connection for online or hybrid learning. Each course page lists any specific requirements." },
  { topic: "general", question: "Do you run programs for schools, colleges and companies?", answer: "Yes. We run corporate upskilling, school and college campaigns, bootcamps and workshops. Visit the Corporate & Institutions page to request a proposal." },
];

export interface SeedProgram {
  slug: string;
  title: string;
  audience: ProgramAudience;
  duration: string;
  summary: string;
  highlights: string[];
  icon: string;
}

export const seedPrograms: SeedProgram[] = [
  {
    slug: "corporate-upskilling",
    title: "Corporate Upskilling",
    audience: "corporate",
    duration: "1 – 8 weeks",
    summary: "Customised training for your teams in AI adoption, data analytics, software development and cyber security awareness.",
    highlights: ["Curriculum tailored to your tools and goals", "On-site, online or hybrid delivery", "Hands-on work with your real use cases", "Progress reports for managers"],
    icon: "briefcase",
  },
  {
    slug: "school-ai-coding-campaign",
    title: "School AI & Coding Campaign",
    audience: "school",
    duration: "1 – 4 weeks",
    summary: "Short, fun and practical campaigns that introduce school students to AI, coding, design and safe internet use.",
    highlights: ["Age-appropriate content for grades 6 – 12", "Conducted at your school by our mentors", "Mini-projects and showcase day", "Certificates for every participant"],
    icon: "school",
  },
  {
    slug: "college-bootcamps",
    title: "College Bootcamps & Workshops",
    audience: "college",
    duration: "2 days – 4 weeks",
    summary: "Intensive bootcamps on Generative AI, MERN, data analytics and ethical hacking for +2 and bachelor students.",
    highlights: ["Industry-relevant, project-first sessions", "Scheduled around your academic calendar", "Hackathons and project competitions", "Internship pathway for top performers"],
    icon: "graduation-cap",
  },
  {
    slug: "institutional-partnership",
    title: "Institutional Partnership",
    audience: "institution",
    duration: "Semester or yearly",
    summary: "Run Leafclutch Academy programs at your institute with our curriculum, mentor support and train-the-trainer sessions.",
    highlights: ["Ready-to-teach curriculum and projects", "Train-the-trainer for your faculty", "Joint certificates", "Ongoing academic support"],
    icon: "building-2",
  },
];

export interface SeedTestimonial {
  name: string;
  role: string;
  organization: string | null;
  course: string;
  quote: string;
  rating: number;
}

/**
 * Sample testimonials so the carousel design can be previewed.
 * They are seeded UNPUBLISHED — replace them with real learner reviews from the admin panel.
 */
export const seedTestimonials: SeedTestimonial[] = [
  { name: "Sample Learner", role: "Data Analytics learner", organization: null, course: "data-analytics", quote: "The mentors explained every concept with real business data. Within weeks I was building Power BI dashboards for my own office reports.", rating: 5 },
  { name: "Sample Learner", role: "MERN Stack learner", organization: null, course: "mern-stack-development", quote: "The recorded classes helped me revise at my own pace, and building a full e-commerce project gave me real confidence for interviews.", rating: 5 },
  { name: "Sample Learner", role: "Generative AI learner", organization: null, course: "generative-ai", quote: "I joined in hybrid mode, attending the lab on weekends and online on weekdays. Same fee, total flexibility, and a great project at the end.", rating: 5 },
  { name: "Sample Learner", role: "UI/UX Designing learner", organization: null, course: "ui-ux-designing", quote: "From research to prototypes in Figma, every class was hands-on. I finished with two case studies for my portfolio.", rating: 4 },
];

export interface SeedBatch {
  course: string;
  startsInDays: number;
  mode: LearningMode;
  schedule: string;
  seats: number;
}

export const seedBatches: SeedBatch[] = [
  { course: "agentic-ai", startsInDays: 14, mode: "hybrid", schedule: "Sun – Thu, 7:00 – 8:30 AM", seats: 20 },
  { course: "generative-ai", startsInDays: 10, mode: "online", schedule: "Sun – Thu, 6:30 – 8:00 PM", seats: 25 },
  { course: "data-analytics", startsInDays: 7, mode: "physical", schedule: "Sun – Fri, 10:00 – 11:30 AM", seats: 18 },
  { course: "mern-stack-development", startsInDays: 12, mode: "hybrid", schedule: "Sun – Thu, 4:00 – 5:30 PM", seats: 20 },
  { course: "python", startsInDays: 5, mode: "online", schedule: "Sun – Fri, 7:00 – 8:00 PM", seats: 30 },
  { course: "ui-ux-designing", startsInDays: 21, mode: "physical", schedule: "Sun – Thu, 1:00 – 2:30 PM", seats: 15 },
];
