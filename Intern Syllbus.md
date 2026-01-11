## Python & Full Stack (TypeScript, JavaScript, .NET, PostgreSQL)

This comprehensive program starts with Python for data analysis and web scraping, then transitions to full-stack development. Interns master front-end technologies including HTML, CSS, TypeScript, React, and Angular. On the back end, the curriculum covers C#, .NET Core, and PostgreSQL using Entity Framework Core. Key skills include building RESTful APIs, implementing JWT authentication, and managing state. The training culminates in a capstone project where learners create a secure Personal Finance Dashboard. This project integrates CRUD operations, data visualization, and responsive design, preparing Interns to build complete, data-driven web applications from scratch.

**Lang**
*   Python
*   C#
*   JavaScript
*   TypeScript
*   SQL

**Tech**
*   HTML5
*   CSS3
*   .NET
*   ASP.NET Core
*   PostgreSQL
*   pgAdmin
*   React
*   Angular
*   Docker
*   Docker Compose
*   JWT (JSON Web Tokens)

**Lib**
*   Pandas
*   NumPy
*   Requests
*   BeautifulSoup4
*   Matplotlib
*   Seaborn
*   openpyxl
*   os
*   shutil
*   schedule
*   Streamlit
*   Npgsql
*   Entity Framework Core
*   React Router
*   Chart.js
*   D3.js
*   Plotly

**Outcome:** Learners will be proficient in building end-to-end, data-driven web applications. They will master Python for data analysis and automation, .NET Core for robust back-end APIs, and React or Angular for dynamic front-end interfaces. The curriculum ensures practical expertise in relational database design with PostgreSQL, implementing secure authentication, and visualizing data. Graduates will be fully qualified for Full Stack Developer roles, capable of integrating complex data logic into scalable, user-friendly software products.

Table to content

| Week                       | Python & Data Analysis                                                                 | Front-End (JS/TS/React/Angular)                              | Back-End & Database (.NET/C#/PostgreSQL)                   |
| :------------------------- | :------------------------------------------------------------------------------------- | :----------------------------------------------------------- | :--------------------------------------------------------- |
| 1                          | Python refresher (data types, control flow), Pandas (Series, DataFrames), NumPy basics | -                                                            | -                                                          |
| 2                          | Web Scraping (Requests, BeautifulSoup), Data Cleaning with Pandas                      | -                                                            | -                                                          |
| Task A1 (Web Scraper)      |                                                                                        |                                                              |                                                            |
| 3                          | Data Aggregation, Grouping, Merging; Intro to Matplotlib & Seaborn                     | -                                                            | -                                                          |
| 4                          | Workflow Automation (openpyxl, os, shutil); Intro to Streamlit for quick dashboards    | -                                                            | -                                                          |
| Task A2 (Python Streamlit) |                                                                                        |                                                              |                                                            |
| 5                          | Advanced Pandas (Time-series, Pivot tables); Seaborn for statistical plots             | HTML5, CSS3, JavaScript (ES6+) Fundamentals                  | -                                                          |
| 6                          | Connecting Python to PostgreSQL (psycopg2); Basic SQL queries                          | TypeScript Fundamentals; DOM Manipulation                    | C# Fundamentals; .NET Environment Setup                    |
| Task A3 (C# & PostgreSQL)  |                                                                                        |                                                              |                                                            |
| 7                          | Building data pipelines in Python; Error handling & logging                            | React Fundamentals (Components, JSX, State, Props)           | .NET Core: Building a minimal Web API                      |
| 8                          | Sending automated reports via email; Scheduling tasks with `schedule`                  | React Hooks (useState, useEffect); Routing with React Router | C# & .NET: Connecting to PostgreSQL; Entity Framework Core |
| Task A4 (Advanced SQL)     |                                                                                        |                                                              |                                                            |
| 9                          | -                                                                                      | State Management (Context API); Fetching data from APIs      | Building a complete CRUD API with .NET & PostgreSQL        |
| 10                         | -                                                                                      | Angular Fundamentals (Modules, Components, Templates)        | Advanced SQL (Joins, Subqueries, Window Functions)         |
| 11                         | -                                                                                      | Angular Services & Dependency Injection; HTTP Client         | Data Modeling & Database Design for FinTech apps           |
| 12                         | -                                                                                      | Angular Forms (Reactive & Template-driven); Routing          | Securing APIs (Authentication & Authorization basics)      |
| Capstone Project           |                                                                                        |                                                              |                                                            |

### Detailed Plan
#### Month 1: Python Foundations for Data Analysis
##### **Week 1: Python Core and Pandas Fundamentals**
- **Topics:**
	- Python refresher: Variables, data types, data structures (lists, tuples, dicts, sets).
	- Control flow: Conditional statements (`if`, `elif`, `else`), loops (`for`, `while`).
	- Functions: Defining and calling functions, scope, arguments, and return values.
	- Introduction to NumPy: Arrays, array operations, indexing, and universal functions.
	- Introduction to Pandas: Series and DataFrame objects.
	- Data ingestion: Reading CSV files into DataFrames.
	- Data inspection: `.head()`, `.tail()`, `.info()`, `.describe()`, `.shape`, `.dtypes`.
	- Data selection and filtering: `.loc`, `.iloc`, boolean indexing.
- **Resources:**
    - Pandas Official "10 minutes to pandas" guide (https://pandas.pydata.org/docs/user_guide/10min.html)
    - Real Python Pandas Tutorial (https://www.datacamp.com/tutorial/pandas)
##### **Week 2: Data Acquisition and Cleaning**
- **Topics:**
	- Web Scraping: HTTP requests, HTML structure.
	- Libraries: `requests` for HTTP, `BeautifulSoup4` for parsing HTML.
	- Finding elements by tags, classes, and IDs.
	- Extracting text and attributes from HTML elements.
	- Handling pagination in web scraping.
	- Data Cleaning with Pandas: Identifying and handling missing values (`.isnull()`, `.fillna()`, `.dropna()`).
	- Data type conversion (`.astype()`).
	- Removing duplicate rows (`.drop_duplicates()`).
	- String methods for data cleaning (`.str.lower()`, `.str.strip()`, `.str.replace()`).
- **Resources:**
	- Python Web Scraping: Step-by-Step Guide [[51](https://bootcampai.medium.com/python-web-scraping-step-by-step-4a263d2801e6)]
	- Python's Requests Library Guide (https://realpython.com/python-requests)
	- BeautifulSoup Tutorial (https://www.geeksforgeeks.org/python/implementing-web-scraping-python-beautiful-soup)
- **Task A1 (Web Scraper):**
	- "Financial News Scraper." Build a Python script that scrapes the headlines and publication dates from a financial news website (e.g., Finviz, Yahoo Finance). Store the extracted data in a Pandas DataFrame. Clean the data by ensuring dates are in a consistent `datetime` format and headlines are free of extra whitespace. Save the cleaned DataFrame to a new CSV file.
##### **Week 3: Data Manipulation and Visualization**
- **Topics:**
	- Advanced Pandas: `groupby()` operations, aggregation functions (`.sum()`, `.mean()`, `.count()`, `.agg()`).
	- Reshaping data: `pivot_table()`, `melt()`.
	- Combining DataFrames: `merge()`, `join()`, `concat()`.
	- Introduction to Matplotlib: Figures, axes, plotting basic plots (line, bar, scatter).
	- Customizing plots: Titles, labels, legends, colors.
	- Introduction to Seaborn: Statistical plotting.
	- Creating common Seaborn plots: `histplot()`, `boxplot()`, `violinplot()`, `heatmap()`, `pairplot()`.
	- Using Seaborn with Pandas DataFrames.
- **Resources:**
	- Complete Python Pandas Data Science Tutorial (https://www.youtube.com/watch?v=2uvysYbKdjM)
	- Python Data Visualization Tutorial: Matplotlib & Seaborn (https://www.nobledesktop.com/learn/python/data-visualization-matplotlib)
	- Seaborn Tutorial (https://www.geeksforgeeks.org/python/python-seaborn-tutorial)
##### **Week 4: Workflow Automation and UI**
- **Topics:**
	- Automating Excel with `openpyxl`: Reading and writing `.xlsx` files, modifying cell values, styling.
	- File and folder automation with `os` and `shutil` modules.
	- Scheduling Python scripts with the `schedule` library.
	- Introduction to Streamlit: Core concepts, layout, and widgets.
	- Displaying data and plots in Streamlit apps.
	- Adding interactivity with sliders, buttons, and text inputs.
- **Resources:**
	- Automate Excel with Python: A Practical Guide (https://excelmatic.ai/blog/openpyxl)
	- Simplify Your Workflow with Python Automation Hacks (https://blog.devgenius.io/simplify-your-workflow-with-python-automation-hacks-in-2025-1a3fd68d114e)
	- Streamlit Tutorial for Data Scientists (https://medium.com/data-science-collective/how-to-build-your-data-science-dashboard-in-30-minutes-with-streamlit-7757352fed67)
- **Task A2 (Python Streamlit):** 
	- "Dashboard with Streamlit." Build a simple, interactive Streamlit application for the "News Data" from *Task A1 - Week 2*. The app should allow users to select a date from a date picker and display relevant chart.
#### Month 2: Introduction to Full-Stack Development
##### **Week 5: Client-Side Fundamentals (HTML, CSS, JavaScript)**
- **Topics:**
	- HTML5: Semantic tags, forms, tables, media elements.
	- CSS3: Selectors, box model, colors, typography.
	- CSS Layout: Flexbox, Grid.
	- Responsive Design: Media queries, mobile-first approach.
	- JavaScript (ES6+): Variables, data types, operators, arrays, objects.
	- JavaScript Functions: Declaration, arrow functions, scope.
	- DOM Manipulation: Selecting elements, modifying content and attributes.
	- Event Handling: `addEventListener`, common events (`click`, `submit`, `load`).
- **Resources:**
    - MDN Web Docs (HTML, CSS, JavaScript tutorials) - A comprehensive and authoritative resource.
    - freeCodeCamp's Responsive Web Design Certification - A free, interactive curriculum.
##### **Week 6: Type-Safe Scripting and Server-Side Basics**
- **Topics:**
	- TypeScript Fundamentals: Why TypeScript?, type system.
	- Types: Primitives, arrays, tuples, enums, `any`, `unknown`.
	- Interfaces and type aliases for defining object shapes.
	- Classes and constructors in TypeScript.
	- C# Fundamentals: Syntax, variables, data types, operators, control flow.
	- Methods and classes in C#.
	- .NET SDK and CLI (Command Line Interface).
	- Introduction to SQL and Relational Databases.
	- PostgreSQL: Installation and setup (using pgAdmin or Docker).
	- Basic SQL Queries: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `WHERE`, `CREATE TABLE`.
- **Resources:**
	- TypeScript Fundamentals: A Beginner's Guide (https://dev.to/sweetpapa/typescript-fundamentals-a-beginners-guide-2025-3ej9)
	- Learn C# - free tutorials, courses, videos (https://dotnet.microsoft.com/en-us/learn/csharp)
	- PostgreSQL Tutorial For Beginners (https://www.youtube.com/watch?v=evJuky1ZtD8&vl=en)
- **Task A3 (HTML, JS):**
	- "Interactive To-Do List." Build a to-do list application using HTML, CSS, and vanilla JavaScript. Users should be able to add new tasks, mark tasks as complete (with a strikethrough), and delete tasks. All interactivity must be handled with JavaScript DOM manipulation.
##### **Week 7: Building APIs and Front-End Components**
- **Topics:**
	- .NET Core: Building a minimal Web API project.
	- Controllers and routing in ASP.NET Core.
	- HTTP methods and status codes.
	- Returning JSON responses from API endpoints.
	- Data Transfer Objects (DTOs).
	- React Fundamentals: Components, JSX syntax.
	- Props: Passing data to components.
	- State Management with `useState` Hook.
	- Side Effects with `useEffect` Hook.
	- Fetching data from an API in React using the `fetch` API.
- **Resources:**
	- React Tutorial Full Course - Beginner to Pro (React 19, 2025) (https://www.youtube.com/watch?v=TtPXvEcE11E)
	- How to Build Your First Web App with ASP.NET Core and .NET 8 (https://medium.com/@solomongetachew112/how-to-build-your-first-web-app-with-asp-net-core-and-net-8-a-beginners-guide-94183e922adc)
##### **Week 8: Database Integration and Advanced Front-End Logic**
- **Topics:**
	- Entity Framework Core: What is an ORM?
	- Setting up EF Core with PostgreSQL (`Npgsql` provider).
	- `DbContext` and DbSets.
	- Code-First or Database-First approach.
	- Performing CRUD operations using EF Core.
	- React Router: Setting up routes, `Route`, `Routes`, `Link`, `NavLink` components.
	- Programmatic navigation with `useNavigate` hook.
	- Conditional rendering in JSX.
	- Handling forms in React: Controlled components, form submission.
- Resources:
	- C# & .NET: Connecting to PostgreSQL; Entity Framework Core (Tutorials on Microsoft Learn)
	- React Router v6 Documentation (https://reactrouter.com)
- **Task A4 (C# & PostgreSQL):** 
	- Write a simple C# console application that connects to a local PostgreSQL database. The application should be able to:
		1. Create a table for storing financial transactions (e.g., `id`, `description`, `amount`, `date`).
		2. Insert a few sample transactions into the table.
		3. Query and display all transactions from the table.
#### Month 3: Advanced Full-Stack and Data Application Development
##### **Week 9: Comprehensive CRUD Operations and State Management**
- **Topics:**
	- Building full CRUD APIs in .NET: `HttpPut` and `HttpDelete` methods.
	- Handling route parameters in controllers (e.g., `int id`).
	- EF Core: Updating and deleting entities.
	- React: Implementing Edit and Delete functionality on the front-end.
	- React Context API: `createContext`, `useContext`.
	- Creating a context provider and consumer to manage global state.
	- When to use Context API vs. local state.
- **Resources:**
    - React Documentation on Context (https://react.dev)
##### **Week 10: Introducing Angular and Advanced SQL**
- **Topics:**
	- Angular Fundamentals: Architecture, modules, components.
	- Templates and data binding in Angular.
	- Dependency Injection in Angular.
	- Services for encapsulating business logic.
	- Advanced SQL: `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`.
	- Subqueries (correlated and non-correlated).
	- Common Table Expressions (CTEs).
	- Window Functions: `OVER()`, `PARTITION BY`, `ROW_NUMBER()`, `RANK()`, `LEAD()`, `LAG()`.
- - **Resources:**
    - Learn Angular Tutorial (https://angular.dev/tutorials/learn-angular)
    - The Ultimate Guide to Advanced PostgreSQL SQL (https://mayursurani.medium.com/the-ultimate-guide-to-advanced-postgresql-sql-from-theory-to-real-world-business-scenarios-e6ffbba048bc)
- **Task A4 (Advanced SQL):** 
	- "Financial Data Analysis." Using a more complex financial dataset (e.g., one with stock prices, company financials, and sector information), write SQL queries to:
		1. Find the top 5 performing stocks in each sector using window functions.
		2. Calculate the 3-day moving average for a stock's closing price.
		3. Use a CTE to find companies whose P/E ratio is above the average P/E ratio of their sector.
##### **Week 11: Angular Services, HTTP, and Database Design**
- **Topics:**
	- Angular Services: Creating and injecting services.
	- Angular HTTP Client: Making GET, POST, PUT, DELETE requests.
	- Handling Observables with `.subscribe()` and the `async` pipe.
	- Database Design Principles: Normalization (1NF, 2NF, 3NF).
	- Entity-Relationship Diagrams (ERDs).
	- Designing a database schema for a FinTech application (e.g., personal finance manager).
	- Defining primary keys, foreign keys, and constraints in PostgreSQL.
- **Resources:**
	- Angular HTTP Client Guide (https://angular.dev)
##### **Week 12: Angular Forms and API Security**
- **Topics:**
	- Angular Forms: Template-driven vs. Reactive forms.
	- Building Reactive forms with `FormBuilder`, `FormGroup`, and `FormControl`.
	- Form validation: Built-in validators, custom validators.
	- Displaying validation errors to the user.
	- API Security Fundamentals: Authentication vs. Authorization.
	- Introduction to JSON Web Tokens (JWT).
	- Implementing JWT authentication in a .NET API.
	- Securing API endpoints with the `[Authorize]` attribute.
- **Resources:**
	- Angular Forms Guide (https://angular.dev)
	- Authentication and Authorization in ASP.NET Core (Microsoft Learn)
#### Month 4: Capstone Project
##### **Personal Finance Dashboard**  
A web application that allows users to manage their finances, track spending, visualize their financial health, and get insights into their habits.

**Features to Implement:**
- **User Authentication:** Secure user sign-up, login, and logout.
- **Transaction Management:** Users can add, edit, categorize, and delete income and expense transactions.
- **Account Management:** Users can manage multiple bank accounts or credit cards.
- **Data Visualization:** Interactive charts and graphs (e.g., pie chart for spending by category, line chart for net worth over time, bar chart for monthly spending comparison).
- **Budgeting:** Users can set budgets for different categories and track their progress.
- **(Advanced) Goal Setting:** Users can set financial goals (e.g., save $10,000) and track their progress towards them.

**Technology Stack:**
- **Frontend:** Choose either React or Angular.
- **Backend:** .NET 8 with C#.
- **Database:** PostgreSQL.
- **Data Analysis (Optional but recommended):** A Python script that runs periodically (e.g., via a scheduled task or an AWS Lambda function) to analyze user data and generate insights (e.g., "You spent 20% more on dining out this month").

**Breakdown:**
- **Phase 1: Planning and Backend Setup.**
    - Finalize project scope and features.
    - Design the database schema (ERD).
    - Set up the .NET Web API project.
    - Implement user authentication (JWT).
    - Create the database tables in PostgreSQL using EF Core migrations.
    - Build the initial API endpoints for user management and transactions.
- **Phase 2: Frontend Development and API Integration.**
    - Set up the React or Angular project.
    - Implement user registration and login UI, connecting to the backend API.
    - Create the main dashboard layout.
    - Build components for viewing, adding, editing, and deleting transactions, integrating with the backend API.
- **Phase 3: Data Visualization and Advanced Features.**
    - Integrate a charting library (e.g., Chart.js, D3.js, or Plotly) to create the financial visualizations.
    - Implement the budgeting feature, allowing users to create budgets and see their spending against them.
    - Polish the UI/UX, ensuring the application is responsive and user-friendly.
- **Phase 4: Final Touches, and Presentation.**
    - Containerize both the frontend and backend applications using Docker. *(if applicable)*
    - Use `docker-compose` to define and run the multi-container application locally. *(if applicable)*
    - Write a `README.md` file with setup instructions and a description of the project.
    - Prepare a final presentation demonstrating the application, the challenges faced, and the technologies used.

---
## Python + DevOps (AWS)

This track begins with Python for data analysis before shifting to cloud engineering with AWS. Interns learn to manage storage with S3, build serverless ETL pipelines with AWS Glue and Lambda, and visualize data with QuickSight. The curriculum emphasizes DevOps practices, covering containerization with Docker and multi-container orchestration with Docker Compose. It also includes Infrastructure as Code using CloudFormation and CI/CD automation via GitHub Actions and AWS CodePipeline. The course prepares learners to design secure, scalable cloud architectures and automate deployment workflows for data-intensive applications in a professional AWS environment.

**Lang**
*   Python
*   SQL

**Tech**
*   PostgreSQL
*   AWS IAM
*   Amazon S3
*   AWS CLI
*   AWS Glue
*   Amazon Athena
*   AWS Lambda
*   Amazon SQS
*   Amazon API Gateway
*   AWS CloudWatch
*   Amazon QuickSight
*   Docker
*   Amazon ECR
*   AWS Step Functions
*   Amazon States Language (ASL)
*   AWS CloudFormation
*   Docker Compose
*   GitHub Actions
*   AWS KMS
*   Amazon VPC
*   AWS Cost Explorer
*   AWS CodePipeline

**Lib**
*   Pandas
*   NumPy
*   Requests
*   BeautifulSoup4
*   Matplotlib
*   Seaborn
*   openpyxl
*   os
*   shutil
*   schedule
*   Streamlit
*   psycopg2
*   Boto3
*   PySpark

**Outcome:** Learners will be equipped to architect and deploy modern cloud-native data solutions on AWS. They will gain expertise in building serverless ETL pipelines, managing storage, and automating workflows using Python and AWS services like Lambda and Glue. The training ensures proficiency in containerization with Docker, Infrastructure as Code with CloudFormation, and CI/CD practices. Graduates will be prepared for roles as Cloud Data Engineers or DevOps Engineers, capable of managing secure, scalable, and automated cloud infrastructure.

Table to content

|Week|Python & Data Analysis|AWS Cloud & DevOps|Containerization & CI/CD|
|:--|:--|:--|:--|
|1|Python refresher (data types, control flow), Pandas (Series, DataFrames), NumPy basics|-|-|
|2|Web Scraping (Requests, BeautifulSoup), Data Cleaning with Pandas|-|-|
| Task A1 (Web Scraper)|
|3|Data Aggregation, Grouping, Merging; Intro to Matplotlib & Seaborn|-|-|
|4|Workflow Automation (openpyxl, os, shutil); Intro to Streamlit for quick dashboards|-|-|
| Task A2 (Python Streamlit)|
|5|Advanced Pandas (Time-series, Pivot tables); Seaborn for statistical plots|AWS Fundamentals: IAM, S3 (Storage, Buckets, Objects)|-|
|6|Connecting Python to PostgreSQL (psycopg2); Basic SQL queries|AWS Glue (Crawlers, ETL Jobs); AWS Athena (Serverless Querying)|-|
| Task B1|
|7|Building data pipelines in Python; Error handling & logging|AWS Lambda (Serverless Python functions); S3 Event Notifications|-|
|8|Sending automated reports via email; Scheduling tasks with `schedule`|Amazon QuickSight (Data Visualization, Dashboards)|-|
| Task B2|
|9|-|AWS Glue for complex ETL; Data Catalog best practices|Introduction to Docker: Images, Containers, Dockerfile|
|10|-|AWS Step Functions for orchestrating workflows|Docker Compose for multi-container apps|
|11|-|AWS CloudFormation (Infrastructure as Code)|CI/CD with GitHub Actions: Build, Test, Push to ECR|
|12|-|AWS Security best practices for data; KMS, VPCs|CI/CD with AWS CodePipeline: Deploy Lambda functions|
| Capstone Project|

### Detailed Plan
#### Month 1: Python Foundations for Data Analysis
##### **Week 1: Python Core and Pandas Fundamentals**
- **Topics:**
	- Python refresher: Variables, data types, data structures (lists, tuples, dicts, sets).
	- Control flow: Conditional statements (`if`, `elif`, `else`), loops (`for`, `while`).
	- Functions: Defining and calling functions, scope, arguments, and return values.
	- Introduction to NumPy: Arrays, array operations, indexing, and universal functions.
	- Introduction to Pandas: Series and DataFrame objects.
	- Data ingestion: Reading CSV files into DataFrames.
	- Data inspection: `.head()`, `.tail()`, `.info()`, `.describe()`, `.shape`, `.dtypes`.
	- Data selection and filtering: `.loc`, `.iloc`, boolean indexing.
- **Resources:**
    - Pandas Official "10 minutes to pandas" guide (https://pandas.pydata.org/docs/user_guide/10min.html)
    - Real Python Pandas Tutorial (https://www.datacamp.com/tutorial/pandas)
##### **Week 2: Data Acquisition and Cleaning**
- **Topics:**
	- Web Scraping: HTTP requests, HTML structure.
	- Libraries: `requests` for HTTP, `BeautifulSoup4` for parsing HTML.
	- Finding elements by tags, classes, and IDs.
	- Extracting text and attributes from HTML elements.
	- Handling pagination in web scraping.
	- Data Cleaning with Pandas: Identifying and handling missing values (`.isnull()`, `.fillna()`, `.dropna()`).
	- Data type conversion (`.astype()`).
	- Removing duplicate rows (`.drop_duplicates()`).
	- String methods for data cleaning (`.str.lower()`, `.str.strip()`, `.str.replace()`).
- **Resources:**
	- Python Web Scraping: Step-by-Step Guide [[51](https://bootcampai.medium.com/python-web-scraping-step-by-step-4a263d2801e6)]
	- Python's Requests Library Guide (https://realpython.com/python-requests)
	- BeautifulSoup Tutorial (https://www.geeksforgeeks.org/python/implementing-web-scraping-python-beautiful-soup)
- **Task A1 (Web Scraper):**
	- "Financial News Scraper." Build a Python script that scrapes the headlines and publication dates from a financial news website (e.g., Finviz, Yahoo Finance). Store the extracted data in a Pandas DataFrame. Clean the data by ensuring dates are in a consistent `datetime` format and headlines are free of extra whitespace. Save the cleaned DataFrame to a new CSV file.
##### **Week 3: Data Manipulation and Visualization**
- **Topics:**
	- Advanced Pandas: `groupby()` operations, aggregation functions (`.sum()`, `.mean()`, `.count()`, `.agg()`).
	- Reshaping data: `pivot_table()`, `melt()`.
	- Combining DataFrames: `merge()`, `join()`, `concat()`.
	- Introduction to Matplotlib: Figures, axes, plotting basic plots (line, bar, scatter).
	- Customizing plots: Titles, labels, legends, colors.
	- Introduction to Seaborn: Statistical plotting.
	- Creating common Seaborn plots: `histplot()`, `boxplot()`, `violinplot()`, `heatmap()`, `pairplot()`.
	- Using Seaborn with Pandas DataFrames.
- **Resources:**
	- Complete Python Pandas Data Science Tutorial (https://www.youtube.com/watch?v=2uvysYbKdjM)
	- Python Data Visualization Tutorial: Matplotlib & Seaborn (https://www.nobledesktop.com/learn/python/data-visualization-matplotlib)
	- Seaborn Tutorial (https://www.geeksforgeeks.org/python/python-seaborn-tutorial)
##### **Week 4: Workflow Automation and UI**
- **Topics:**
	- Automating Excel with `openpyxl`: Reading and writing `.xlsx` files, modifying cell values, styling.
	- File and folder automation with `os` and `shutil` modules.
	- Scheduling Python scripts with the `schedule` library.
	- Introduction to Streamlit: Core concepts, layout, and widgets.
	- Displaying data and plots in Streamlit apps.
	- Adding interactivity with sliders, buttons, and text inputs.
- **Resources:**
	- Automate Excel with Python: A Practical Guide (https://excelmatic.ai/blog/openpyxl)
	- Simplify Your Workflow with Python Automation Hacks (https://blog.devgenius.io/simplify-your-workflow-with-python-automation-hacks-in-2025-1a3fd68d114e)
	- Streamlit Tutorial for Data Scientists (https://medium.com/data-science-collective/how-to-build-your-data-science-dashboard-in-30-minutes-with-streamlit-7757352fed67)
- **Task A2 (Python Streamlit):** 
	- "Dashboard with Streamlit." Build a simple, interactive Streamlit application for the "News Data" from *Task A1 - Week 2*. The app should allow users to select a date from a date picker and display relevant chart.
#### Month 2: Introduction to AWS Cloud Services
##### **Week 5: AWS Fundamentals and Core Data Storage**
- **Topics:**
	- AWS Global Infrastructure.
	- AWS Identity and Access Management (IAM): Users, Groups, Roles, Policies.
	- Principle of Least Privilege.
	- Amazon S3: Buckets, Objects, Keys.
	- S3 Features: Versioning, Lifecycle Policies, Encryption.
	- Interacting with S3: AWS Console, AWS CLI, Boto3 (Python SDK).
	- S3 Storage Classes (Standard, Intelligent-Tiering, Glacier).
- **Resources:**
    - Getting started with Amazon S3 (https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html)
    - AWS S3 Full Tutorial for Beginners (https://www.youtube.com/watch?v=LTik9Gqrj-M)]
    - Boto3 S3 Documentation (AWS SDK for Python)
##### **Week 6: Data Warehousing, ETL, and Serverless Querying**
- **Topics:**
	- AWS Glue: Data Catalog, Crawlers, Classifiers.
	- AWS Glue ETL Jobs: Serverless Apache Spark.
	- Building and monitoring Glue Jobs.
	- Amazon Athena: Serverless interactive query service.
	- Querying data in S3 with standard SQL.
	- Creating databases and tables in Athena.
	- Partitioning data for performance.
	- Integrating Glue Data Catalog with Athena.
- **Resources:**
	- Serverless Data Integration – Getting Started With AWS Glue (https://aws.amazon.com/glue/getting-started)
	- Getting started with Amazon Athena (https://docs.aws.amazon.com/athena/latest/ug/getting-started.html)
##### **Week 7: Serverless Computing and Event-Driven Architectures**
- **Topics:**
    - AWS Lambda: What is serverless computing?
    - Creating Lambda functions with Python.
    - Lambda execution environment and limits.
    - IAM Roles for Lambda.
    - Event sources for Lambda (e.g., S3, SQS, API Gateway).
    - Configuring S3 Event Notifications to trigger Lambda.
    - Reading and processing files from S3 within a Lambda function.
    - Logging and debugging with AWS CloudWatch.
- **Resources:**
	- AWS Lambda Developer Guide (AWS Documentation
##### **Week 8: Business Intelligence and Data Visualization**
- **Topics:**
	- Introduction to Amazon QuickSight.
	- Creating a QuickSight account and signing in.
	- Connecting to data sources: Athena, S3, PostgreSQL.
	- Data preparation in QuickSight: SPICE (Super-fast, Parallel, In-memory Calculation Engine).
	- Creating visualizations: Different chart types and their use cases.
	- Formatting and customizing visuals.
	- Creating and publishing QuickSight Dashboards.
	- Sharing dashboards with other users.
- **Resources:**
	- Amazon QuickSight: A Hands-On Guide for Data (https://www.datacamp.com/tutorial/amazon-quicksight)
#### Month 3: Advanced AWS and Infrastructure as Code
##### **Week 9: Advanced ETL and Data Orchestration with AWS Glue**
- **Topics:**
	- Writing custom PySpark scripts in AWS Glue.
	- Using Glue DynamicFrames for flexible data handling.
	- Advanced data transformations: Joins, aggregations, window functions in PySpark.
	- Managing incremental data loads with Job Bookmarks.
	- Data quality validation in Glue ETL jobs.
	- Optimizing Glue job performance (e.g., DPU allocation, partitioning).
	- Best practices for the AWS Glue Data Catalog.
	- What is containerization? Why use Docker?
	- Docker Engine, Images, Containers.
	- The `Dockerfile`: Instructions, `FROM`, `RUN`, `COPY`, `CMD`, `ENTRYPOINT`, `WORKDIR`.
	- Building Docker images: `docker build`.
	- Running containers: `docker run`, ports, volumes, environment variables.
	- Managing containers: `docker ps`, `docker stop`, `docker logs`.
	- Container registries: Docker Hub, Amazon ECR.
	- **Capstone:** Finalize project idea, define architecture, identify data sources, and list required AWS resources.
- **Resources:**
	- AWS Glue Developer Guide (https://docs.aws.amazon.com/)
	- Docker 101 Tutorial (https://www.docker.com/101-tutorial)
	- Docker Tutorial for Beginners (https://www.knowledgehut.com/blog/devops/docker-for-beginners)
##### **Week 10: Workflow Orchestration with AWS Step Functions**
- **Topics:**
	- Introduction to AWS Step Functions.
	- State Machines and States (Task, Choice, Parallel, Succeed, Fail).
	- Amazon States Language (ASL).
	- Integrating Step Functions with AWS Lambda, AWS Glue, and Amazon Athena.
	- Handling errors and retries in workflows.
	- Monitoring and visualizing workflow executions in the Step Functions console.
- **Resources:**
    - AWS Step Functions Developer Guide (https://docs.aws.amazon.com/)
##### **Week 11: Infrastructure as Code with AWS CloudFormation**
- **Topics:**
	- What is Infrastructure as Code (IaC) and its benefits?
	- Introduction to AWS CloudFormation.
	- CloudFormation Templates: YAML vs. JSON.
	- Template anatomy: Resources, Parameters, Mappings, Conditions, Outputs.
	- CloudFormation Stacks: Creating, updating, and deleting.
	- Intrinsic Functions (e.g., `Ref`, `GetAtt`, `Sub`).
	- Change Sets for safe stack updates.
	- Drift detection.
	- Docker Compose: `docker-compose.yml` file, `services`, `build`, `ports`, `volumes`.
	- Managing multi-container applications with `docker-compose up` and `down`.
	- CI/CD Fundamentals: What is Continuous Integration and Continuous Delivery?
	- GitHub Actions: Workflows, jobs, steps, actions, runners.
	- Triggering workflows on events (e.g., `push`).
	- Writing a workflow to lint and test Python code.
	- Building and pushing Docker images to ECR in a GitHub Action.
- **Resources:**
	- AWS CloudFormation User Guide (https://docs.aws.amazon.com/)
	- Docker Compose Quickstart (https://docs.docker.com/compose/gettingstarted)
	- GitHub Actions Tutorial: Complete CI/CD Guide for Beginners (https://cloudelevate.ai/blog/github-actions-tutorial)
##### **Week 12: Security, Monitoring, and Cost Management on AWS**
- **Topics:**
	- Data Security in AWS: Encryption at rest and in transit.
	- AWS Key Management Service (KMS): Customer Master Keys (CMKs), envelope encryption.
	- Amazon Virtual Private Cloud (VPC) basics: Public and private subnets.
	- Monitoring with Amazon CloudWatch: Logs, Metrics, Alarms, Dashboards.
	- Creating custom metrics and alarms for data pipelines.
	- AWS Cost Explorer: Analyzing and visualizing AWS spending.
	- Cost optimization best practices for data services (e.g., S3, Glue, Athena).
- **Resources:**
    - AWS Security Best Practices (https://docs.aws.amazon.com/)
    - Amazon CloudWatch User Guide (https://docs.aws.amazon.com/)
    - CodePipeline Getting Started (https://aws.amazon.com/codepipeline/getting-started)

---

