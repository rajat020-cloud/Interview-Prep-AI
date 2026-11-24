# 📘 Interview Prep AI — Comprehensive Technical Documentation & Architecture Manual

> **Production-Grade Architecture, REST API Specification, AI Engine Pipeline, Database Schemas, and Development Handbook**

---

## Table of Contents

1. [Executive Overview & Platform Capabilities](#1-executive-overview--platform-capabilities)
2. [End-to-End System Architecture](#2-end-to-end-system-architecture)
3. [Technology Stack & Dependency Matrix](#3-technology-stack--dependency-matrix)
4. [Complete Project & Directory Structure](#4-complete-project--directory-structure)
5. [Database Architecture & Mongoose Models](#5-database-architecture--mongoose-models)
6. [Advanced AI Interview Engine & Prompts](#6-advanced-ai-interview-engine--prompts)
7. [Automated PDF Resume Generation (Puppeteer)](#7-automated-pdf-resume-generation-puppeteer)
8. [Security Hardening & Middlewares](#8-security-hardening--middlewares)
9. [Complete REST API Reference](#9-complete-rest-api-reference)
10. [Frontend Architecture, Routes & Design System](#10-frontend-architecture-routes--design-system)
11. [Configuration & Environment Variables](#11-configuration--environment-variables)
12. [Local Setup, Build & Production Deployment](#12-local-setup-build--production-deployment)
13. [Production Readiness & Verification Checklist](#13-production-readiness--verification-checklist)

---

## 1. Executive Overview & Platform Capabilities

**Interview Prep AI** is an AI-powered interview preparation and career accelerator platform built for software engineers, product managers, and technical candidates. Inspired by top-tier SaaS design standards (Linear, Notion, Vercel), Interview Prep AI delivers an all-in-one preparation experience:

1. **AI Strategy Generator**: Ingests candidate PDF resumes and target Job Descriptions (JDs) to formulate an explainable 0–100% Match Score, detailed match breakdown (Technical, Experience, Education, Projects, Keywords), key insights, and overall executive assessment.
2. **Curated Question Bank**: Technical questions with interviewer intentions, comprehensive model answers, key concepts, follow-ups, and common mistakes; Behavioral questions structured with the **STAR** (Situation, Task, Action, Result) methodology.
3. **Interactive AI Mock Interview**: Timed interview simulator with video avatar, speech-to-text dictation, and instant AI scoring on Technical Accuracy, Communication Clarity, and Problem Solving.
4. **Algorithm Coding Practice**: Topic-based algorithm problems (Arrays, Dynamic Programming, Graphs) with progressive hints, optimal approaches, reference code, and AI code reviews.
5. **7-Day Actionable Roadmap**: Interactive daily study schedule with persistent task checkboxes to eliminate preparation anxiety.
6. **ATS Resume Builder & PDF Export**: Single-click PDF export using headless Puppeteer with automated system Chrome/Edge binary detection fallback.
7. **Saved Questions & Revision Deck**: Bookmark tricky questions and model answers into a searchable personal revision list.
8. **Interactive AI Coach**: In-report AI assistant answering contextual questions ("Simpler explanation", "Code snippet", "Probable follow-up").
9. **Preparation Analytics & History**: Visual SVG match score trend chart, preparation progress gauge, active streaks, and in-app notifications.

---

## 2. End-to-End System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React 19 + Vite 7 + SCSS)"]
        LandingPage[Marketing Landing Page]
        AuthSplit[Split-Screen Auth (Login / Register)]
        DashboardView[Personalized Dashboard & Metrics]
        CreateWorkflow[3-Step Interview Plan Generator]
        ReportViewer[Report Viewer: Overview, Questions, Gaps, Roadmap]
        MockSimulator[Interactive Mock Interview (Audio/Text)]
        CodingModule[Algorithm Coding Practice & AI Review]
        ResumeStudio[ATS Resume Optimizer & PDF Generator]
        AnalyticsView[Trend Charts & Preparation Analytics]
        SettingsView[Profile, Password & Data Export]
    end

    subgraph Backend["Backend API Layer (Node.js + Express 5)"]
        SecMiddleware[Helmet Headers + Express Rate Limiter]
        AuthMiddleware[JWT Cookie Guard + Blacklist TTL]
        FileMiddleware[Multer In-Memory Storage (3MB limit)]
        Router[Modular REST API Routes]
        AIService[AI Engine: Gemini 2.5 Flash + Zod Validation]
        PDFEngine[Headless Puppeteer PDF Converter]
    end

    subgraph DataLayer["Persistence & Cloud Services"]
        MongoDB[(MongoDB: Users, Reports, Mocks, Codings, SavedQs, Notifications)]
        GeminiAPI[Google Gemini API]
        ChromeRuntime[Host Chromium / Chrome / Edge Engine]
    end

    Client --> SecMiddleware
    SecMiddleware --> Router
    Router --> AuthMiddleware
    Router --> FileMiddleware
    AuthMiddleware --> MongoDB
    Router --> AIService
    AIService -- "Zod Structured JSON Schema" --> GeminiAPI
    Router --> PDFEngine
    PDFEngine --> ChromeRuntime
```

---

## 3. Technology Stack & Dependency Matrix

### 3.1 Backend Stack
- **Runtime**: Node.js v18+ / v22+
- **Framework**: Express.js `5.2.1`
- **Database**: MongoDB via Mongoose `9.2.1`
- **AI Engine**: Google GenAI SDK (`@google/genai` `1.42.0`)
- **Schema Validation**: Zod `3.25.76` + `zod-to-json-schema` `3.25.1`
- **Security**: `helmet` `8.1.0`, `express-rate-limit` `8.3.0`, `bcryptjs` `3.0.3`, `jsonwebtoken` `9.0.3`
- **PDF & Document Processing**: `pdf-parse` `2.4.5`, `puppeteer` `24.37.5`, `multer` `2.0.2`
- **Utilities**: `cookie-parser` `1.4.7`, `cors` `2.8.6`, `dotenv` `17.3.1`

### 3.2 Frontend Stack
- **Framework**: React `19.2.0`
- **Build Tool**: Vite `7.3.1`
- **Routing**: React Router `7.13.0`
- **HTTP Client**: Axios `1.13.5`
- **Styles**: Dart Sass `1.97.3` with modular CSS variables and responsive breakpoints
- **Icons**: Lucide React (`lucide-react`)

---

## 4. Complete Project & Directory Structure

```
interview-ready-ai-main/
├── DOCUMENTATION.md                  # Comprehensive Technical Manual
├── README.md                         # Root Quickstart Guide
└── interview-ready-ai-main/
    ├── README.md                     # Subdirectory Documentation
    ├── Backend/
    │   ├── .env.example              # Template environment configuration
    │   ├── package.json              # Backend dependencies
    │   ├── server.js                 # HTTP listener & DB connection
    │   └── src/
    │       ├── app.js                # Express app, Helmet, Rate limiting, CORS, Routes
    │       ├── config/
    │       │   └── database.js       # Mongoose connection logic
    │       ├── controllers/
    │       │   ├── auth.controller.js          # User auth, profile, password, deletion
    │       │   ├── interview.controller.js     # Interview generation, roadmap toggle, AI coach
    │       │   ├── mockInterview.controller.js # Start, submit answers, session history
    │       │   ├── codingPractice.controller.js# Generate problems, AI code review
    │       │   ├── savedQuestion.controller.js # Bookmark & retrieve questions
    │       │   ├── analytics.controller.js     # Aggregated dashboard metrics & charts
    │       │   └── notification.controller.js  # In-app notifications & read markers
    │       ├── middlewares/
    │       │   ├── auth.middleware.js          # JWT verification & blacklist check
    │       │   └── file.middleware.js          # Multer memory storage & size validation
    │       ├── models/
    │       │   ├── user.model.js               # User accounts & preferences
    │       │   ├── blacklist.model.js          # Invalidated tokens with 7-day TTL index
    │       │   ├── interviewReport.model.js    # Comprehensive interview preparation plan
    │       │   ├── mockInterview.model.js      # Timed mock interview sessions & evaluations
    │       │   ├── codingPractice.model.js     # Algorithmic coding problems & reviews
    │       │   ├── savedQuestion.model.js      # User bookmarked revision questions
    │       │   └── notification.model.js       # In-app alerts & milestones
    │       ├── routes/
    │       │   ├── health.routes.js            # GET /api/health monitoring endpoint
    │       │   ├── auth.routes.js              # Auth & profile management routes
    │       │   ├── interview.routes.js         # Interview report & PDF routes
    │       │   ├── mockInterview.routes.js     # Mock interview routes
    │       │   ├── codingPractice.routes.js    # Coding challenge routes
    │       │   ├── savedQuestion.routes.js     # Saved question routes
    │       │   ├── analytics.routes.js         # Analytics routes
    │       │   └── notification.routes.js      # Notification routes
    │       └── services/
    │           └── ai.service.js               # Gemini AI engine & Puppeteer PDF exporter
    │
    └── Frontend/
        ├── .env.example              # Frontend environment variables
        ├── index.html                # Vite entry page with Inter typography
        ├── package.json              # Frontend dependencies
        ├── vite.config.js            # Vite build configuration
        ├── vercel.json               # SPA routing rewrite rule
        └── src/
            ├── main.jsx              # React 19 mount point
            ├── App.jsx               # AuthProvider, InterviewProvider & RouterProvider
            ├── app.routes.jsx        # Route tree (Landing, Split Auth, Protected Layout)
            ├── style.scss            # Global design tokens, dark SaaS theme, variables
            ├── components/
            │   ├── Layout.jsx        # Persistent sidebar navigation & mobile drawer
            │   └── layout.scss       # Sidebar & viewport styles
            └── features/
                ├── auth/
                │   ├── auth.context.jsx        # Auth state context
                │   ├── auth.form.scss          # Split-screen styling
                │   ├── components/Protected.jsx# Route guard redirecting to /landing
                │   ├── hooks/useAuth.js        # Auth actions hook
                │   ├── pages/Login.jsx         # Split login with password visibility toggle
                │   ├── pages/Register.jsx      # Split register with target role
                │   └── services/auth.api.js    # Axios auth endpoints
                └── interview/
                    ├── interview.context.jsx   # Interview state context
                    ├── hooks/useInterview.js   # Interview actions & services hook
                    ├── services/interview.api.js# Axios API client
                    ├── pages/
                    │   ├── Landing.jsx         # Marketing landing page with hero & laptop mockup
                    │   ├── Dashboard.jsx       # Personalized metrics, progress ring, recent activity
                    │   ├── CreateInterview.jsx # 3-step creation workflow with animated loading
                    │   ├── Interview.jsx       # 5-tab report viewer (Overview, Qs, Gaps, Roadmap, Resume)
                    │   ├── MockInterview.jsx   # Live timed mock interview with speech recognition
                    │   ├── CodingPractice.jsx  # Algorithmic coding practice & AI review
                    │   ├── ResumeBuilder.jsx   # ATS resume builder & preview
                    │   ├── InterviewHistory.jsx# Combined history & saved questions
                    │   ├── Analytics.jsx       # SVG trend charts & readiness checklist
                    │   ├── Notifications.jsx   # Notifications center
                    │   └── Settings.jsx        # Profile, security, export & danger zone
                    └── style/
                        ├── button.scss
                        ├── create.scss
                        ├── dashboard.scss
                        ├── interview.scss
                        ├── mock.scss
                        ├── coding.scss
                        ├── resumebuilder.scss
                        ├── history.scss
                        ├── analytics.scss
                        ├── notifications.scss
                        └── settings.scss
```

---

## 5. Database Architecture & Mongoose Models

### 5.1 `users`
- `username`: String, unique, lowercase, trimmed
- `email`: String, unique, lowercase, trimmed, indexed
- `password`: String (bcrypt 10-round hash)
- `fullName`: String
- `targetRole`: String (e.g. "Senior Software Engineer")
- `streak`: Number (default: 1, updated automatically based on activity)
- `lastActiveAt`: Date
- `preferences`: `{ theme: "dark"|"light", emailNotifications: Boolean, inAppReminders: Boolean }`
- `timestamps`: `createdAt`, `updatedAt`

### 5.2 `blacklistTokens`
- `token`: String, indexed
- `createdAt`: Date, expires in 7 days (`expires: 604800` TTL index)

### 5.3 `InterviewReport`
- `user`: ObjectId ref `users` (indexed)
- `title`: String (e.g. "Software Engineer")
- `company`: String (e.g. "Google")
- `jobDescription`: String
- `resume`: String (extracted text)
- `selfDescription`: String
- `matchScore`: Number (0–100)
- `matchBreakdown`: `{ technicalSkills: Number, experience: Number, education: Number, projectRelevance: Number, keywordAlignment: Number }`
- `keyInsights`: `[ String ]`
- `overallAssessment`: String
- `technicalQuestions`: `[ { question, difficulty, intention, answer, keyConcepts, followUps, commonMistakes } ]`
- `behavioralQuestions`: `[ { question, intention, answer, evaluationCriteria, followUps } ]`
- `skillGaps`: `[ { skill, severity: "low"|"medium"|"high", whyItMatters, recommendedAction } ]`
- `preparationPlan`: `[ { day: Number, focus: String, tasks: [ { text: String, completed: Boolean } ] } ]`
- `isBookmarked`: Boolean

### 5.4 `MockInterview`
- `user`: ObjectId ref `users`
- `role`: String
- `company`: String
- `difficulty`: String ("Easy", "Medium", "Hard")
- `status`: String ("in_progress", "completed")
- `durationMinutes`: Number
- `currentQuestionIndex`: Number
- `questions`: `[ { questionText, type, difficulty, userAnswer, feedback: { score, technicalAccuracy, communication, problemSolving, keyStrengths, improvements, modelAnswer }, answeredAt } ]`
- `overallScore`: Number
- `summary`: String

### 5.5 `CodingPractice`
- `user`: ObjectId ref `users`
- `title`: String
- `topic`: String
- `difficulty`: String
- `description`: String
- `examples`: `[ { input, output, explanation } ]`
- `hints`: `[ String ]`
- `approach`: String
- `solutionCode`: String
- `timeComplexity`: String
- `spaceComplexity`: String
- `userCode`: String
- `aiReview`: `{ correctnessScore, feedback, optimizations: [ String ] }`
- `isCompleted`: Boolean

### 5.6 `SavedQuestion`
- `user`: ObjectId ref `users`
- `question`: String
- `type`: String ("technical", "behavioral", "coding")
- `difficulty`: String
- `intention`: String
- `answer`: String
- `company`: String
- `sourceReportId`: ObjectId ref `InterviewReport`
- `tags`: `[ String ]`
- `notes`: String

### 5.7 `Notification`
- `user`: ObjectId ref `users`
- `title`: String
- `message`: String
- `type`: String ("report_ready", "mock_completed", "streak", "practice", "system")
- `link`: String
- `isRead`: Boolean (default: false)

---

## 6. Advanced AI Interview Engine & Prompts

The engine is encapsulated inside `Backend/src/services/ai.service.js` utilizing `@google/genai` with model `gemini-2.5-flash` (and automatic fallback to `gemini-1.5-flash`):

- **Zod Schema Compilation**: Output formats are enforced directly at the model level via `zodToJsonSchema(schema)` and `responseMimeType: "application/json"`.
- **Match Score Breakdown**: Calculates specific dimensions ($0-100\%$) for Technical Skills, Experience, Education, Projects, and Keywords.
- **STAR Behavioral Answers**: Ensures behavioral questions feature structured Situation, Task, Action, and Result frameworks.
- **Skill Gap Categorization**: Prioritizes gaps into high, medium, and low severity with practical remedial actions.
- **In-Report AI Coach**: Answers interactive follow-up questions about concepts, simpler analogies, or code implementations.

---

## 7. Automated PDF Resume Generation (Puppeteer)

1. The candidate profile and target job description are processed through Gemini to yield clean, semantic HTML5 styling.
2. Puppeteer renders the HTML with `waitUntil: "networkidle0"`.
3. **Cross-Platform Resilience**: The engine first tries Puppeteer's bundled Chrome, then automatically falls back to system installations of Google Chrome or Microsoft Edge on Windows (`Program Files`, `Program Files (x86)`) or Linux (`/usr/bin/google-chrome`, `/usr/bin/chromium`).
4. Output is generated as an A4 document with 15mm margins and streamed to the client as an attachment.

---

## 8. Security Hardening & Middlewares

1. **Helmet HTTP Headers**: Secures against clickjacking, MIME sniffing, and standard HTTP header attacks.
2. **Express Rate Limiting**:
   - General API limiter: 300 requests per 15 minutes per IP.
   - Authentication limiter: 50 requests per 15 minutes per IP on `/login` and `/register`.
3. **Password Security**: Passwords hashed with `bcryptjs` using 10 salt rounds. Minimum 6-character length enforced.
4. **JWT Cookie Lifecycle**:
   - Set as `httpOnly: true`.
   - `secure: true` in production (enforcing HTTPS).
   - `sameSite: "none"` in production (supporting cross-origin Vercel/Render hosting) and `"lax"` in development.
5. **Token Blacklist Cleanup**: Invalidation tokens automatically expire from MongoDB after 7 days via native TTL index.
6. **Strict Ownership Verification**: All report, mock interview, coding challenge, and saved question queries strictly scope by `user: req.user.id`.

---

## 9. Complete REST API Reference

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime, database connectivity & version | Public |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate and issue JWT cookie | Public |
| `GET` | `/api/auth/logout` | Invalidate token and clear cookie | Public |
| `GET` | `/api/auth/get-me` | Get logged-in user profile | **Required** |
| `PATCH` | `/api/auth/profile` | Update user name, target role & preferences | **Required** |
| `PATCH` | `/api/auth/change-password` | Verify current password and set new password | **Required** |
| `DELETE` | `/api/auth/account` | Permanently delete user and cascade data | **Required** |
| `POST` | `/api/interview/` | Generate interview report from resume & JD | **Required** |
| `GET` | `/api/interview/` | List all historical reports (with `q` & `sort`) | **Required** |
| `GET` | `/api/interview/report/:interviewId` | Retrieve complete details of an interview report | **Required** |
| `DELETE` | `/api/interview/report/:interviewId` | Delete an interview report | **Required** |
| `PATCH` | `/api/interview/report/:interviewId/task` | Toggle completion status of roadmap task | **Required** |
| `POST` | `/api/interview/report/:interviewId/assistant` | Interactive AI Coach follow-up question | **Required** |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Generate & download tailored ATS PDF resume | **Required** |
| `POST` | `/api/mock/start` | Start timed mock interview session | **Required** |
| `POST` | `/api/mock/:sessionId/answer` | Submit answer & receive instant AI evaluation | **Required** |
| `GET` | `/api/mock/:sessionId` | Retrieve active mock interview session | **Required** |
| `GET` | `/api/mock/` | Get historical mock interview sessions | **Required** |
| `POST` | `/api/coding/generate` | Generate algorithm coding challenge | **Required** |
| `POST` | `/api/coding/:challengeId/review` | Submit user code for AI review & score | **Required** |
| `GET` | `/api/coding/` | Get historical coding practice challenges | **Required** |
| `POST` | `/api/saved-questions` | Bookmark question to revision deck | **Required** |
| `GET` | `/api/saved-questions` | List bookmarked questions with filtering | **Required** |
| `DELETE` | `/api/saved-questions/:id` | Remove question from revision deck | **Required** |
| `GET` | `/api/analytics/dashboard` | Aggregated metrics, trend charts & streaks | **Required** |
| `GET` | `/api/notifications` | List in-app notifications & unread count | **Required** |
| `PATCH` | `/api/notifications/:id/read` | Mark individual notification as read | **Required** |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read | **Required** |

---

## 10. Frontend Architecture, Routes & Design System

The frontend is built on **React 19** and styled with **Dart Sass** using a cohesive dark SaaS theme.

### Route Map
- `/landing`: Public marketing page showcasing features, live laptop preview, workflow, and FAQs.
- `/login`: Split-screen login with branding on left and password visibility toggle.
- `/register`: Split-screen registration with career role selection.
- `/` (Protected Layout):
  - Index (`/`): Dashboard with greeting, 4 stat cards, circular progress ring, and recent activity.
  - `/create-interview`: 3-step creation wizard (Job Details, Resume upload, Review & multi-stage generation).
  - `/interview/:interviewId`: Comprehensive 5-tab viewer (Overview, Questions with AI Coach, Skill Gaps, Roadmap with task checks, Resume preview).
  - `/mock-interview`: Live timed mock interview simulator with speech recognition.
  - `/coding-practice`: Algorithmic practice with Hints, Approach, Solution, and AI Code Review.
  - `/resume-builder`: ATS resume optimizer with template picker and PDF download.
  - `/interview-history`: Searchable history and bookmarked question revision deck.
  - `/saved-questions`: Quick alias to bookmarked question revision deck.
  - `/analytics`: Preparation analytics with SVG match score trend chart.
  - `/notifications`: Notifications center with unread counters.
  - `/settings`: Profile updates, password changes, data export, and danger zone.

---

## 11. Configuration & Environment Variables

### Backend (`Backend/.env`)
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/interview_ready_ai
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
FRONTEND_URLS=http://localhost:5173,https://interview-ready-ai-wheat.vercel.app
```

### Frontend (`Frontend/.env`)
```ini
VITE_API_URL=http://localhost:5000
```

---

## 12. Local Setup, Build & Production Deployment

### 12.1 Backend Setup
```bash
cd interview-ready-ai-main/Backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and GOOGLE_GENAI_API_KEY
npm run dev
```

### 12.2 Frontend Setup
```bash
cd interview-ready-ai-main/Frontend
npm install
cp .env.example .env
npm run dev
```

### 12.3 Production Build Verification
```bash
cd interview-ready-ai-main/Frontend
npm run build
```
Generates an optimized, bundled single-page app in `Frontend/dist/` ready for Vercel.

---

## 13. Production Readiness & Verification Checklist

- [x] Full Project Audit conducted and all missing features documented.
- [x] Database models created with schema validation, typing, ownership refs, and TTL indexes.
- [x] Security headers mounted via `helmet`.
- [x] Rate limiting configured on general API and authentication endpoints.
- [x] CORS properly configured with origin check and Vercel wildcard support.
- [x] Sensitive tokens stored in `httpOnly` cookies with cross-domain support.
- [x] Gemini AI Engine upgraded with structured Zod outputs and model fallback.
- [x] Puppeteer PDF export configured with cross-platform Chrome/Edge fallback paths.
- [x] Premium SaaS design system matching uploaded mockup implemented.
- [x] Marketing Landing page (`/landing`) created.
- [x] Split-screen Auth (`/login` & `/register`) with password toggle created.
- [x] Dashboard with circular progress ring and real data stats implemented.
- [x] 3-Step Create Interview plan workflow with animated generation stages built.
- [x] 5-Tab Interview Report viewer with AI Coach modal completed.
- [x] AI Mock Interview simulator with speech dictation completed.
- [x] Algorithm Coding Practice with AI code review built.
- [x] ATS Resume Builder with template picker and PDF download built.
- [x] Interview History & Saved Questions revision deck built.
- [x] Preparation Analytics with SVG match score trend chart built.
- [x] In-app Notifications center and User Settings completed.
- [x] Frontend `npm run build` verified with 0 errors.
- [x] Backend syntax and module initialization verified with 0 errors.
