/**
 * Detailed curricula (Lesson → Section → Points) for the 12 starter courses.
 * Format: "# Lesson", "## Section", "- point". Parsed by src/lib/curriculum.ts.
 * After seeding, edit curricula in Admin → Courses → Curriculum.
 */
export const curriculumOutlines: Record<string, string> = {
  "agentic-ai": `
# Python for AI Engineering
## Python essentials
- Variables, data types and operators
- Lists, dictionaries, sets and comprehensions
- Functions, modules and packages
- Classes, objects and dataclasses
- Type hints and writing readable code
## Working environment
- Installing Python and VS Code
- Virtual environments with venv and uv
- Managing dependencies and requirements files
- Git and GitHub: commits, branches and pull requests
- Storing secrets safely with environment variables
## Async programming and APIs
- HTTP basics: requests, responses and status codes
- Calling REST APIs with httpx and requests
- async and await for concurrent API calls
- Parsing and validating JSON with Pydantic
- Handling timeouts, retries and rate limits

# LLM Foundations
## How large language models work
- Tokens, context windows and sampling parameters
- Pre-training, instruction tuning and RLHF in plain language
- Strengths, limitations and hallucinations
- Choosing models by quality, speed and cost
## Working with LLM APIs
- OpenAI, Anthropic Claude and Google Gemini SDKs
- System, user and assistant messages
- Streaming responses to the user interface
- Tracking token usage and cost
- Running open-source models locally with Ollama
## Prompt engineering for agents
- Clear instructions, roles and constraints
- Few-shot examples and output formats
- Structured output with JSON schemas
- Chain-of-thought and self-checking prompts
- Prompt versioning and testing

# Tool Use and Function Calling
## Designing tools
- What a tool is and when an agent needs one
- Writing tool names, descriptions and input schemas
- Returning useful results and errors to the model
- Keeping tools small, safe and testable
## The agent loop
- The tool-calling loop step by step
- Parallel and sequential tool calls
- Stopping conditions and maximum steps
- Handling tool failures and retries
- Project: calculator, web search and database agent
## Model Context Protocol (MCP)
- Why MCP: one standard for tools and data
- Building an MCP server in Python
- Connecting MCP servers to clients and IDEs
- Resources, prompts and tools in MCP
- Securing MCP servers

# Retrieval and Memory
## Embeddings and vector search
- What embeddings are and how similarity works
- Creating embeddings with API and open-source models
- Vector databases: ChromaDB and pgvector
- Metadata filters and hybrid search
## Retrieval-augmented generation (RAG)
- Loading PDFs, web pages and documents
- Chunking strategies and chunk size trade-offs
- Building a question-answering pipeline
- Citations and grounding answers in sources
- Re-ranking and query rewriting
## Agent memory
- Short-term conversation memory
- Long-term memory stores
- Summarising long conversations
- Measuring retrieval quality with test sets

# Agent Frameworks
## LangChain and LangGraph
- LangChain building blocks: models, prompts and tools
- LangGraph nodes, edges and state
- Conditional routing and loops
- Checkpoints and resuming long-running agents
## Agent design patterns
- ReAct: reasoning and acting
- Plan-and-execute agents
- Reflection and self-correction
- Router and supervisor patterns
## Human-in-the-loop
- Approval steps before risky actions
- Editing agent state mid-run
- Designing safe fallbacks
- Project: customer support agent with approvals

# Multi-Agent Systems and Automation
## Multi-agent teams
- When to split work across agents
- Orchestrator and worker architecture
- CrewAI roles, tasks and crews
- Agent-to-agent communication and hand-offs
## Workflow automation
- Automation with n8n: triggers, nodes and webhooks
- Connecting Gmail, Sheets, Slack and databases
- Scheduling and monitoring workflows
- Combining deterministic workflows with agents
## Browser and computer-use agents
- Browser automation with Playwright
- Computer-use agents: capabilities and risks
- Extracting data from websites responsibly
- Project: autonomous research assistant

# Evaluation, Safety and Deployment
## Evaluation and observability
- Tracing agent runs with LangSmith or Langfuse
- Building evaluation datasets
- LLM-as-judge and human review
- Regression testing prompts and agents
## Safety and guardrails
- Prompt injection and data exfiltration risks
- Input and output validation
- Permission scopes for tools
- Handling personal and sensitive data
## Deployment
- Serving agents with FastAPI
- Background jobs and streaming responses
- Containerising with Docker
- Deploying to a cloud server
- Monitoring cost, latency and failures

# Capstone Project
## Planning
- Choosing a real business problem
- Writing requirements and success criteria
- Architecture design review with your mentor
## Building
- Implementing tools, memory and the agent loop
- Adding evaluations and guardrails
- Deploying the agent with a simple UI
## Presentation
- Documentation and demo video
- Demo day presentation
- Internship readiness evaluation
`,

  "generative-ai": `
# Foundations of Generative AI
## Introduction to generative AI
- What generative AI is and where it is used
- A short history: from GANs to transformers
- Text, image, audio, video and code generation
- Generative AI in Nepal and global industries
## Responsible AI
- Bias, fairness and transparency
- Copyright and content ownership
- Privacy and data protection
- Using AI honestly at work and in study
## Setting up your toolkit
- Python, Jupyter Notebook and Google Colab
- Managing API keys safely
- Git and GitHub basics
- Installing and running open-source models with Ollama

# Python and Deep Learning Essentials
## Python for AI
- Data types, loops and functions
- NumPy arrays and vectorised operations
- Pandas DataFrames for loading and cleaning data
- Plotting with Matplotlib
## Neural network basics
- Neurons, layers and activation functions
- Loss functions and gradient descent
- Training, validation and test sets
- Overfitting and regularisation
## PyTorch fundamentals
- Tensors and automatic differentiation
- Building a model with nn.Module
- Writing a training loop
- Transfer learning with pre-trained models
- Training on free GPUs in Colab

# Transformers and Large Language Models
## Inside the transformer
- Tokenisation and embeddings
- Self-attention explained visually
- Encoder, decoder and encoder-decoder models
- Positional information and context length
## The LLM landscape
- GPT, Claude, Gemini, Llama and Mistral
- Open-source vs proprietary models
- Model sizes, speed and cost
- Reading model cards and benchmarks
## Hugging Face
- The Hugging Face Hub and model cards
- Pipelines for text, vision and audio tasks
- Tokenizers and model loading
- Running models locally vs through APIs

# Prompt Engineering
## Core techniques
- Zero-shot and few-shot prompting
- Role and system prompts
- Chain-of-thought and step-by-step reasoning
- Controlling tone, length and format
## Structured outputs
- Getting JSON reliably
- Extracting data from documents
- Classification and tagging tasks
- Validating outputs with Pydantic
## Prompt quality
- Building a prompt test set
- Comparing prompt versions
- Prompt injection and how to defend against it
- Prompt libraries and templates

# Building LLM Applications
## Working with LLM APIs
- OpenAI and Anthropic Claude SDKs
- Streaming responses
- Token usage, limits and cost control
- Error handling and retries
## Chatbots and assistants
- Conversation memory
- Personas and guardrails
- Function calling basics
- Project: domain-specific chatbot
## Retrieval-augmented generation
- Embeddings and vector databases
- Loading and chunking documents
- Question answering over your own PDFs
- Showing sources and citations
## User interfaces
- Building apps with Streamlit
- Quick demos with Gradio
- Sharing apps on Hugging Face Spaces

# Image, Audio and Multimodal Generation
## Image generation
- How diffusion models work
- Text-to-image with Stable Diffusion
- Image-to-image, inpainting and outpainting
- Prompting for images: style, composition and lighting
## Audio and speech
- Speech-to-text with Whisper
- Text-to-speech voices
- Transcribing and summarising meetings
## Vision-language models
- Describing and analysing images with LLMs
- Reading documents, charts and screenshots
- Project: multimodal assistant

# Fine-tuning and Optimisation
## Choosing an approach
- Prompting vs RAG vs fine-tuning
- When fine-tuning is worth it
- Estimating data needs and cost
## Fine-tuning in practice
- Preparing instruction datasets
- LoRA and QLoRA explained
- Fine-tuning an open-source model on Colab
- Evaluating the fine-tuned model
## Efficient inference
- Quantisation and model size
- Running models locally with Ollama
- Latency and throughput basics

# Capstone Project
## Planning
- Choosing a real-world use case
- Defining users, features and success criteria
- Design review with your mentor
## Building and shipping
- Building the generative AI product
- Testing quality and safety
- Deploying and sharing the app
## Presentation
- Demo video and documentation
- Demo day presentation
- Internship readiness evaluation
`,

  "ai-ml": `
# Python for Machine Learning
## Python essentials
- Variables, data types and operators
- Control flow and functions
- Lists, dictionaries and comprehensions
- Working in Jupyter Notebook and Google Colab
## NumPy
- Creating and indexing arrays
- Vectorised maths and broadcasting
- Random numbers and simulations
- Linear algebra with NumPy
## Pandas and visualisation
- Loading CSV and Excel data
- Selecting, filtering and grouping data
- Handling missing values
- Charts with Matplotlib and Seaborn

# Mathematics for ML
## Linear algebra
- Vectors, matrices and their operations
- Dot products and distances
- Matrix multiplication in ML models
- Eigenvectors intuition for PCA
## Probability and statistics
- Mean, median, variance and standard deviation
- Probability rules and conditional probability
- Normal and binomial distributions
- Sampling, confidence and hypothesis testing
## Calculus for optimisation
- Derivatives and slopes intuitively
- Partial derivatives and gradients
- Gradient descent step by step
- Learning rate and convergence

# Data Preprocessing and EDA
## Cleaning data
- Detecting and handling missing values
- Outlier detection and treatment
- Removing duplicates and fixing types
## Feature engineering
- Encoding categorical variables
- Scaling and normalisation
- Creating new features from dates and text
- Feature selection techniques
## Exploratory data analysis
- Univariate and bivariate analysis
- Correlation and heatmaps
- Finding patterns and telling the story
- Case study: real estate price data

# Supervised Learning
## Regression
- Linear regression and assumptions
- Polynomial regression
- Ridge and Lasso regularisation
- Regression metrics: MAE, RMSE and R²
## Classification
- Logistic regression
- K-nearest neighbours
- Support vector machines
- Naive Bayes
- Classification metrics: accuracy, precision, recall and F1
## Tree-based models
- Decision trees
- Random forests
- Gradient boosting and XGBoost
- Feature importance
## Model evaluation
- Train, validation and test splits
- Cross-validation
- Hyperparameter tuning with grid and random search
- Handling imbalanced data

# Unsupervised Learning
## Clustering
- K-means clustering and choosing K
- Hierarchical clustering and dendrograms
- DBSCAN for density-based clustering
- Customer segmentation project
## Dimensionality reduction
- Principal component analysis
- Visualising high-dimensional data
- t-SNE intuition
## Other techniques
- Anomaly detection
- Association rules and market basket analysis
- Recommendation system basics

# Deep Learning
## Neural networks
- Perceptrons and multi-layer networks
- Activation functions
- Backpropagation intuitively
- Optimisers: SGD, Adam and learning rates
## Frameworks
- Building models with TensorFlow and Keras
- Building models with PyTorch
- Saving, loading and reusing models
## Convolutional and recurrent networks
- Convolutional neural networks for images
- Pooling, padding and feature maps
- RNNs and LSTMs for sequences
- Dropout, batch normalisation and transfer learning

# Computer Vision and NLP
## Computer vision
- Image processing with OpenCV
- Image classification with CNNs
- Object detection with YOLO
- Face detection project
## Natural language processing
- Text cleaning and tokenisation
- Bag of words, TF-IDF and word embeddings
- Sentiment analysis
- Text classification project
## Transformers and LLMs
- Attention and transformers intuition
- Using pre-trained models from Hugging Face
- Adding LLM features to ML projects

# MLOps and Deployment
## Packaging models
- Saving models with joblib and pickle
- Building prediction APIs with FastAPI
- Input validation and error handling
## Apps and deployment
- Interactive apps with Streamlit
- Containerising with Docker
- Deploying to a cloud platform
## Maintaining models
- Experiment tracking basics
- Monitoring model performance and drift
- Retraining strategies

# Capstone Project
## Planning
- Problem definition and data collection
- Success metrics and baseline model
## Building
- Model development and experiments
- Deployment with an API or app
- Documentation and code review
## Presentation
- Demo day
- Internship readiness evaluation
`,

  "data-science": `
# Python Programming
## Python basics
- Variables, data types and operators
- Conditions and loops
- Functions and modules
- Lists, dictionaries and comprehensions
## Working with files
- Reading and writing CSV, Excel and JSON
- Error handling
- Jupyter Notebook and Google Colab workflow
## Clean code
- Naming and structuring notebooks
- Reusable functions
- Version control with Git and GitHub

# Statistics and Probability
## Descriptive statistics
- Mean, median, mode and spread
- Percentiles and box plots
- Skewness and outliers
## Probability
- Probability rules and conditional probability
- Normal, binomial and Poisson distributions
- Central limit theorem
## Inferential statistics
- Sampling and confidence intervals
- Hypothesis testing and p-values
- t-tests, chi-square and ANOVA
- A/B testing for business decisions
- Correlation vs causation

# Data Wrangling with Pandas
## Loading data
- CSV, Excel, JSON and SQL sources
- Reading data from APIs
- Web scraping with requests and BeautifulSoup
## Cleaning and transforming
- Missing values and duplicates
- Data types and string cleaning
- Merging, joining and concatenating
- Grouping and aggregation
- Pivot tables and reshaping
## Time series data
- Parsing dates and times
- Resampling and rolling windows
- Seasonal patterns

# Data Visualisation and Storytelling
## Charts in Python
- Matplotlib fundamentals
- Statistical charts with Seaborn
- Interactive charts with Plotly
## Dashboards
- Power BI: connecting and modelling data
- Building interactive Power BI reports
- Choosing the right chart for the message
## Storytelling
- Structuring a data story
- Writing clear insights and recommendations
- Presenting to non-technical audiences

# SQL for Data Science
## Querying data
- SELECT, WHERE, ORDER BY and LIMIT
- Aggregation with GROUP BY and HAVING
- Joins across multiple tables
## Advanced SQL
- Subqueries and common table expressions
- Window functions for ranking and running totals
- Date functions and CASE expressions
## SQL with Python
- Connecting Python to PostgreSQL
- Loading query results into Pandas
- Project: sales analysis with SQL

# Machine Learning
## The ML workflow
- Framing a business problem as an ML problem
- Train and test splits
- Baselines and evaluation metrics
## Supervised learning
- Linear and logistic regression
- Decision trees and random forests
- Gradient boosting
- Model evaluation and cross-validation
## Unsupervised learning
- K-means clustering
- Customer segmentation
- Principal component analysis
## Feature engineering
- Encoding and scaling
- Creating features from dates and text
- Feature importance and selection

# Applied Data Science
## Forecasting
- Time series components
- Moving averages and exponential smoothing
- Forecasting sales with Prophet
## Text and recommendations
- Text analysis basics and sentiment
- Recommendation systems
## AI-assisted analysis
- Using LLMs to explore and explain data
- Checking AI output for accuracy
- Building data apps with Streamlit

# Capstone Project
## Planning
- Choosing a dataset and business question
- Project plan and success criteria
## Delivery
- End-to-end analysis and modelling
- Dashboard and written report
- Presentation to a panel
## Career readiness
- Portfolio on GitHub
- Internship readiness evaluation
`,

  "data-analytics": `
# Introduction to Data Analytics
## The analytics lifecycle
- What data analysts do
- Descriptive, diagnostic, predictive and prescriptive analytics
- Roles in a data team
## Data fundamentals
- Types of data and data sources
- Data quality and common problems
- Asking the right business questions
## Tools overview
- Excel, SQL, Power BI, Tableau and Python
- Setting up your analytics toolkit

# Advanced Excel
## Formulas and functions
- Cell references and named ranges
- Logical functions: IF, IFS, AND and OR
- Lookup functions: XLOOKUP, VLOOKUP, INDEX and MATCH
- Text and date functions
## Analysing data
- Sorting, filtering and conditional formatting
- Pivot tables and pivot charts
- What-if analysis and Goal Seek
## Power Query and dashboards
- Cleaning and combining data with Power Query
- Building an interactive Excel dashboard
- Slicers and timelines

# SQL for Analysts
## Database basics
- Tables, rows, keys and relationships
- Installing MySQL and using a SQL client
## Querying data
- SELECT, WHERE, ORDER BY and LIMIT
- Aggregation with GROUP BY and HAVING
- Joins across multiple tables
## Advanced SQL
- Subqueries and CTEs
- Window functions
- CASE expressions and date functions
- Writing reporting queries

# Power BI
## Getting data
- Connecting to Excel, CSV and databases
- Transforming data with Power Query
## Data modelling
- Star schema and relationships
- Calculated columns vs measures
- DAX essentials: SUM, CALCULATE and FILTER
- Time intelligence with DAX
## Reports and dashboards
- Visuals, slicers and drill-through
- Designing clear dashboards
- Publishing and sharing reports
- Row-level security basics

# Tableau
## Tableau basics
- Connecting data sources
- Dimensions, measures and marks
## Analysis
- Calculated fields
- Filters and parameters
- Maps and geographic analysis
## Storytelling
- Dashboards and stories
- Publishing to Tableau Public

# Python for Analytics
## Python basics
- Variables, lists and loops
- Functions
## Pandas
- Loading and exploring data
- Cleaning and transforming data
- Grouping and pivoting
## Visualisation and automation
- Charts with Matplotlib and Seaborn
- Automating Excel reports with Python

# Business Statistics and AI-powered Analytics
## Business statistics
- Descriptive statistics for business
- KPIs and metrics
- Trends and simple forecasting
## AI in analytics
- Using Copilot and ChatGPT for analysis
- Writing formulas and SQL with AI
- Checking AI output for accuracy
## Communicating insights
- Data storytelling
- Presenting to managers and clients

# Capstone Project
## Delivery
- Working with a real business dataset
- Cleaning, modelling and analysis
- Executive dashboard
## Presentation
- Insight presentation
- Internship readiness evaluation
`,

  python: `
# Getting Started
## Introduction to Python
- What Python is and where it is used
- How programs run: interpreters and scripts
- Installing Python and VS Code
- Writing and running your first program
## Developer basics
- Using the terminal
- Google Colab and Jupyter Notebook
- Git and GitHub basics

# Python Basics
## Variables and data types
- Numbers, strings and booleans
- Variables and naming rules
- Type conversion
## Operators and input/output
- Arithmetic, comparison and logical operators
- Taking user input
- Printing and formatting output with f-strings
## Strings
- Indexing and slicing
- String methods
- Practice: text-based programs

# Control Flow and Data Structures
## Decisions and loops
- if, elif and else
- for and while loops
- break, continue and range
## Data structures
- Lists and list methods
- Tuples
- Dictionaries
- Sets
- List and dictionary comprehensions
## Practice
- Problem-solving exercises
- Mini project: quiz game

# Functions and Modules
## Functions
- Defining functions and parameters
- Return values and scope
- Default and keyword arguments
- Lambda functions, map and filter
## Modules and packages
- Importing standard library modules
- Creating your own modules
- Installing packages with pip
- Virtual environments

# Object-Oriented Programming
## Classes and objects
- Defining classes
- Attributes and methods
- Constructors
## OOP principles
- Inheritance
- Polymorphism
- Encapsulation
- Magic methods
## Practice
- Designing programs with OOP
- Mini project: library management system

# Files, Errors and Databases
## Files
- Reading and writing text files
- Working with CSV and JSON
## Errors
- Exceptions and try/except
- Raising custom errors
- Logging
## Databases
- SQL basics
- SQLite with Python
- Mini project: contact book with a database

# APIs, Automation and Testing
## APIs
- HTTP requests with the requests library
- Consuming public APIs
- Working with JSON responses
## Automation
- Automating files and folders
- Automating Excel with openpyxl
- Sending emails with Python
## Testing and AI tools
- Writing tests with pytest
- Debugging techniques
- AI-assisted coding and debugging

# Web Basics and Final Project
## Flask
- Routes and templates
- Forms and user input
- Connecting Flask to a database
## Final project
- Planning and building a web application
- Deploying a small app
- Code review
- Internship readiness evaluation
`,

  "mern-stack-development": `
# JavaScript with Git
## Introduction to web development and Git basics
- Overview of web development
- Key features and applications of the MERN stack
- MERN stack roadmap
- Environment setup: Node.js, MongoDB, VS Code and Git
- Git basics: commits, branches and GitHub
## JavaScript basics
- Variables: var, let and const
- Data types and operators
- Conditions and loops
- Functions: declarations, expressions and arrow functions
## Arrays and objects
- Array methods: map, filter, reduce and find
- Objects, destructuring and spread
- ES6 modules
## Asynchronous JavaScript
- Callbacks and the event loop
- Promises
- async and await
- Fetching data from APIs
## TypeScript
- Why TypeScript
- Types, interfaces and generics
- TypeScript in a JavaScript project

# Frontend Foundations
## HTML5
- Semantic structure
- Forms and accessibility
## CSS3
- Box model and positioning
- Flexbox and CSS Grid
- Responsive design and media queries
## Tailwind CSS and the DOM
- Utility-first styling with Tailwind CSS
- DOM selection and manipulation
- Events and event handling

# React Fundamentals with TypeScript
## React basics
- Components and JSX
- Props and composition
- State with useState
## Hooks and effects
- useEffect and data fetching
- useRef, useMemo and useCallback
- Custom hooks
## Forms and routing
- Controlled forms and validation
- Client-side routing
## State management
- Context API
- Redux Toolkit: slices, store and async thunks

# React with Next.js
## Next.js fundamentals
- App Router, layouts and pages
- Server and client components
- Dynamic routes
## Data and performance
- Data fetching and caching
- Server actions
- Image and font optimisation
## Production readiness
- SEO and metadata
- Building with AI tools like Cursor
- Deploying to Vercel

# Node.js with Express
## Node.js
- Node.js runtime and modules
- npm and package.json
- File system and environment variables
## Express
- Routing and controllers
- Middleware
- Error handling
## REST APIs
- REST API design
- Validation and file uploads
- Testing APIs with Postman

# Database and Usage
## MongoDB
- Documents and collections
- CRUD operations
- MongoDB Atlas setup
## Mongoose
- Schemas and models
- Relationships and population
- Aggregation pipeline
## Performance
- Indexes
- Pagination and filtering
- Introduction to SQL databases

# Authentication, Testing and Deployment
## Authentication and security
- Password hashing with bcrypt
- JWT and session authentication
- Role-based authorisation
- Security best practices
## Testing
- Unit tests with Jest
- API tests
## Deployment
- Environment configuration
- Deploying the backend to a cloud server
- Deploying the frontend to Vercel

# Project Modules
## Full-stack e-commerce project
- Product catalogue and search
- Cart and checkout
- Payment gateway integration (eSewa / Khalti test mode)
- Admin dashboard
## Delivery
- Code review
- Demo day
- Internship readiness evaluation
`,

  "frontend-development": `
# Web Fundamentals
## How the web works
- Browsers, servers, DNS and hosting
- HTTP requests and responses
## Developer setup
- VS Code and useful extensions
- Chrome DevTools
- Git and GitHub
## Design handoff
- Reading design files in Figma
- Measuring spacing, fonts and colours

# HTML5
## Document structure
- Semantic elements
- Headings, text, links and lists
- Images, audio and video
## Tables and forms
- Tables for data
- Form inputs and validation
## Accessibility and SEO
- Alt text, labels and landmarks
- SEO-friendly markup and metadata

# CSS3 and Responsive Design
## CSS basics
- Selectors and specificity
- Box model, units and colours
- Typography
## Layout
- Flexbox
- CSS Grid
- Positioning
## Responsive design
- Mobile-first design
- Media queries
- Animations and transitions

# Tailwind CSS
## Utility-first workflow
- Installing Tailwind CSS
- Spacing, colours and typography utilities
- Responsive and state variants
## Design systems
- Theming and design tokens
- Reusable component patterns
- Project: responsive landing page

# JavaScript
## Fundamentals
- Variables, types and operators
- Conditions, loops and functions
- Arrays and objects
## The DOM
- Selecting and changing elements
- Events and event delegation
- Form handling
## Modern JavaScript
- ES6+ features and modules
- Fetch API and async/await
- Local storage
- Project: interactive to-do app

# React and Next.js
## React
- Components, props and state
- Hooks and effects
- Lists, keys and conditional rendering
- Forms
## Next.js
- Routing and layouts
- Fetching data from APIs
- Images and metadata
- Deploying to Vercel

# TypeScript, Performance and Quality
## TypeScript
- Types and interfaces
- Typing React props and state
## Performance and accessibility
- Core Web Vitals
- Image and font optimisation
- Accessibility testing
## Professional workflow
- AI tools for frontend development
- Debugging with DevTools
- Code review practices

# Final Project
## Projects
- Multi-page responsive website from a Figma design
- React dashboard consuming a real API
- Portfolio website
## Delivery
- Code review
- Internship readiness evaluation
`,

  "backend-development": `
# Backend Fundamentals
## How backends work
- Client-server architecture
- HTTP methods, status codes and headers
- REST principles
- JSON and data formats
## Linux basics
- Command line essentials
- Files, permissions and processes
- SSH and remote servers

# Node.js and TypeScript
## Node.js
- Runtime and event loop
- Modules and npm
- File system and streams
- Environment configuration
## TypeScript
- Types, interfaces and generics
- Setting up a TypeScript Node.js project
- Linting and formatting

# Express.js APIs
## Express basics
- Routing and controllers
- Middleware
- Request validation with Zod
## Structure
- Error handling
- Project structure for large APIs
- Logging
## API design
- Resource naming and versioning
- Pagination, filtering and sorting

# Databases
## PostgreSQL
- SQL essentials
- Database design and normalisation
- Transactions and indexes
## Prisma ORM
- Schemas and migrations
- Relations and queries
## MongoDB
- Documents and collections
- Mongoose models and queries
- Choosing SQL vs NoSQL

# Authentication and Security
## Authentication
- Password hashing
- JWT access and refresh tokens
- Sessions and cookies
## Authorisation
- Role-based access control
- Protecting routes
## Security
- OWASP API security risks
- Rate limiting and CORS
- Secrets management

# Advanced Backend
## Performance
- Caching with Redis
- Background jobs and queues
## Real-time and files
- WebSockets and real-time features
- File storage and uploads
## AI integration
- Calling LLM APIs from a backend
- Streaming AI responses

# Testing, Documentation and Deployment
## Testing
- Unit tests
- Integration tests
## Documentation
- API documentation with Swagger
## DevOps basics
- Docker and Docker Compose
- CI/CD with GitHub Actions
- Deploying to a cloud VPS

# Capstone Project
## Build
- Production-style REST API
- Authentication, payments and notifications
- Load testing and monitoring
## Delivery
- Code review and demo day
- Internship readiness evaluation
`,

  "cyber-security-ethical-hacking": `
# Introduction to Cyber Security
## Security concepts
- The CIA triad
- Threats, vulnerabilities and risks
- Types of hackers and threat actors
## Law and ethics
- Cyber laws and ethics
- Nepal's Electronic Transactions Act
- Rules of engagement for security testing
## Getting started
- Career paths in security
- Setting up a safe virtual lab with VirtualBox

# Networking Fundamentals
## Network models
- OSI and TCP/IP models
- IP addressing and subnetting
- Ports, protocols and services
## Network traffic
- Packet analysis with Wireshark
- DNS, HTTP and HTTPS
## Network security
- Firewalls, VPNs and proxies
- Network segmentation

# Linux for Security
## Linux basics
- File system and permissions
- Essential commands
- Users, processes and services
## Scripting
- Bash scripting basics
- Automating tasks
## Kali Linux
- Kali Linux tools overview
- Updating and managing tools

# Reconnaissance and Scanning
## Footprinting
- Passive and active reconnaissance
- OSINT techniques
- DNS and WHOIS enumeration
## Scanning
- Network scanning with Nmap
- Service and version detection
- Enumeration of services
## Vulnerability assessment
- Vulnerability scanning with Nessus
- Prioritising findings

# System Hacking
## Exploitation
- Exploitation with Metasploit
- Payloads and sessions
## Passwords
- Password attacks and cracking
- Using John the Ripper and Hydra
## Post-exploitation
- Privilege escalation basics
- Malware types and analysis basics
- Covering tracks and how defenders detect them

# Web Application Security
## Web basics
- How web applications work
- Burp Suite setup and proxying
## OWASP Top 10
- SQL injection
- Cross-site scripting (XSS)
- Broken authentication and session attacks
- Security misconfiguration
## Testing
- Testing with Burp Suite and OWASP ZAP
- Practising on TryHackMe labs

# Wireless, Social Engineering and Defence
## Wireless and people
- Wireless security
- Social engineering and phishing awareness
## Defensive security
- Security monitoring and SOC basics
- Log analysis
- Incident response
- Hardening systems

# Reporting and Capstone
## Reporting
- Penetration testing methodology
- Writing vulnerability reports
## Capstone
- Capture-the-flag challenge
- Capstone assessment
- Internship readiness evaluation
`,

  "ui-ux-designing": `
# Introduction to UI/UX
## Foundations
- What UI and UX mean
- The design thinking process
- Roles in a product team
## Good design
- Great and poor design examples
- Usability heuristics
## Tools
- Setting up Figma and FigJam

# UX Research
## Planning research
- Research goals and questions
- Choosing research methods
## Understanding users
- User interviews and surveys
- Personas and empathy maps
- Customer journey maps
## Market research
- Competitive analysis
- Synthesising research findings

# Information Architecture and Wireframing
## Structure
- Sitemaps and user flows
- Card sorting
## Wireframes
- Low-fidelity sketches
- Wireframes in Figma
- Content-first design

# Visual Design
## Layout
- Grids and spacing
- Visual hierarchy
## Typography and colour
- Typography choices
- Colour theory and accessibility
## Imagery
- Iconography and imagery
- Consistency and style

# Figma Mastery
## Figma basics
- Frames, constraints and auto layout
- Components and variants
## Systems
- Variables and modes
- Styles and libraries
## Productivity
- Figma AI features
- Plugins and shortcuts

# Prototyping and Usability Testing
## Prototyping
- Interactive prototypes
- Micro-interactions and animation
## Testing
- Usability testing with Maze
- Analysing feedback
- Iterating on designs

# Design Systems and Handoff
## Design systems
- Building a design system
- Responsive and mobile design
## Handoff
- Developer handoff and Dev Mode
- Working with developers
- Designing with AI tools

# Portfolio Project
## Case studies
- End-to-end app design case study
- Website redesign case study
## Career
- Portfolio on Behance or Framer
- Design critique
- Internship readiness evaluation
`,

  "graphics-designing": `
# Design Fundamentals
## Principles
- Elements and principles of design
- Layout and composition
## Colour and type
- Colour theory
- Typography
## Creative process
- Gathering inspiration
- Understanding a design brief

# Adobe Photoshop
## Basics
- Interface and tools
- Layers, masks and selections
## Photo editing
- Photo retouching
- Colour correction
## Design work
- Compositing and manipulation
- Designing social media posts

# Adobe Illustrator
## Vector basics
- Vector graphics basics
- Pen tool and shapes
## Illustration
- Illustration techniques
- Icons and infographics
## Output
- Preparing files for print and web

# Logo and Brand Identity
## Brand strategy
- Brand research and strategy
- Logo design process
## Identity system
- Colour palettes and type systems
- Brand guidelines
- Mockups and presentation

# Print Design with InDesign
## Layout
- Document setup and grids
- Brochures and flyers
## Print projects
- Posters and banners
- Business cards and stationery
- Print production basics

# Social Media and Digital Design
## Social content
- Social media campaigns
- Ad creatives and thumbnails
## Quick tools
- Canva for quick content
- Basic motion graphics
- Designing for different platforms

# AI Tools for Designers
## Generative tools
- Adobe Firefly and Generative Fill
- Midjourney prompts
## Responsible use
- AI-assisted workflows
- Copyright and ethics of AI art
- Combining AI with manual design

# Portfolio and Freelancing
## Portfolio
- Building a portfolio on Behance
- Final brand project
## Freelancing
- Working with clients and briefs
- Pricing and freelancing platforms
- Internship readiness evaluation
`,
};
