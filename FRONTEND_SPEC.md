# NIS2 Study App — Frontend Build Spec

## Overview
Build a complete NIS2 certification study platform with landing page, auth, payment gate, study content, quiz engine, and progress dashboard. Use the existing React + Tailwind + shadcn/ui template.

## Color Theme
- Primary: teal (#01696F / hsl 174 97% 22%) — already set in index.css
- Dark mode support via class toggle on documentElement
- Use `window.matchMedia("(prefers-color-scheme: dark)")` for initial detection
- Font: DM Sans (loaded via Google Fonts CDN already in index.html)

## CRITICAL RULES
1. Use `useHashLocation` from `wouter/use-hash-location` in Router
2. NEVER use localStorage/sessionStorage/cookies — they crash in sandboxed iframe
3. Use React state/context for transient data, backend API for persistent data
4. Use `@tanstack/react-query` for data fetching
5. Use `apiRequest` from `@/lib/queryClient` for mutations
6. Add `data-testid` attributes to all interactive elements
7. Include `<PerplexityAttribution />` at bottom of layout

## Pages & Routes

### 1. Landing Page (`/`)
Public page visible to everyone. Sales-focused, conversion-optimized.

**Layout:**
- Hero section with headline: "Pass the NIS2 Certification Exam" with subtext about the course
- Key stats: "80+ Quiz Questions", "4 Domains Covered", "Case Studies", "Exam Simulation"
- Feature grid: Study Materials, Interactive Quiz, Progress Tracking, PDF Textbook
- Pricing section: Single plan — suggest ~€299 or similar competitive price (IAPP charges $1,195 for training + $799 for exam)
- CTA button "Get Started" → navigates to register page
- Disclaimer footer: "NIS2 Study is not affiliated with, endorsed by, or sponsored by the International Association of Privacy Professionals (IAPP). NIS2® is a registered trademark of IAPP."
- SEO: structured data, descriptive headings, keyword-rich content

### 2. Auth Pages
**Register** (`/register`): Name, Email, Password fields + submit → POST /api/auth/register
**Login** (`/login`): Email, Password fields + submit → POST /api/auth/login
Both redirect to `/dashboard` on success. Show errors on failure.
Clean card-based layout centered on page.

### 3. Payment Gate (`/payment`)
For authenticated users who haven't paid. Shows:
- Course overview, what's included
- Price display
- "Complete Purchase" button → POST /api/payment/simulate-success (demo mode)
- Note: In production this would integrate Stripe Checkout
After payment success → redirect to /dashboard

### 4. Dashboard (`/dashboard`) — Requires auth + payment
Shows:
- Welcome message with user name
- Overall progress ring/percentage
- Domain progress cards (4 domains with individual %)
- Recent quiz results
- Quick actions: "Continue Studying", "Take Quiz", "Download PDF"
- Stats: total chapters read, quizzes taken, average score

### 5. Study View (`/study`) — Requires auth + payment
Left sidebar: Domain list → Chapter list (collapsible)
Main content: Chapter content with:
- Expandable sections/accordion for subtopics
- "Mark as Complete" button per chapter → POST /api/progress
- Case study blocks (styled differently, with scenario + analysis)
- Key takeaway boxes
- Exam tip callouts

**Case Studies to add (as new content, in addition to existing study material):**
- Domain I: "A healthcare company deploys an AI diagnostic tool — what governance structure is needed?"
- Domain II: "A multinational trains an LLM on web-scraped EU data — what laws apply?"
- Domain III: "An HR AI tool shows demographic bias in hiring — what testing/remediation steps?"
- Domain IV: "A financial institution's credit-scoring AI experiences data drift — what monitoring actions?"

### 6. Quiz View (`/quiz`) — Requires auth + payment
**Setup screen:**
- Domain selection (checkboxes, all selected by default)
- Question count: 10, 20, 30, All
- Mode: Practice (with explanations after each question) or Exam Simulation (100 questions, 3h timer, results at end)
- Start Quiz button

**Question screen:**
- Question number / total
- Question text
- 4 answer options (radio buttons)
- In Practice mode: "Check Answer" → show correct/incorrect + explanation
- In Exam mode: "Next" → move to next question. Timer visible.
- Progress bar at top

**Scenario questions (new format):**
Embed 8-10 scenario-based case questions. These present a situation (2-3 paragraph description of a company/situation) and ask what the best course of action is. They should test application of knowledge, not just recall.

Example scenario question:
"A European bank is deploying an AI system to automate loan approvals. The system was trained on historical lending data from 2010-2023. During testing, the team discovers that the model approves loans at a 15% lower rate for applicants from certain postal codes that correlate with minority neighborhoods. The bank's AI governance committee is reviewing the situation. Which action should the committee prioritize FIRST?"
Options testing different governance approaches.

**Results screen:**
- Score: X/Y correct (percentage)
- Domain breakdown chart (bar chart using recharts)
- Weak areas identified
- "Save Results" → POST /api/quiz-results
- "Try Again" / "Back to Dashboard"

### 7. PDF Download
- Button on dashboard (and maybe study view)
- GET /api/download/textbook → returns download URL
- Use fetch + blob + createObjectURL + anchor download (iframe constraint)

## Study Content Data
The study content and quiz questions from the previous app are at:
- `/home/user/workspace/aigp-study-app/domain-data-raw.js` — Domain structure with study material HTML
- `/home/user/workspace/aigp-study-app/quiz-questions-raw.js` — 83 quiz questions

Import these as TypeScript data files in the client.

## API Endpoints (already implemented in server/routes.ts)
- POST /api/auth/register — { email, password, name }
- POST /api/auth/login — { email, password }
- POST /api/auth/logout
- GET /api/auth/me — returns current user
- POST /api/payment/simulate-success — marks user as paid
- GET /api/progress — get study progress
- POST /api/progress — { chapterId, completed }
- GET /api/quiz-results — get quiz history
- POST /api/quiz-results — { domains, totalQuestions, correctAnswers, answers }
- GET /api/download/textbook — returns PDF URL

## Components to Build
1. `ThemeProvider` — dark mode with useState + matchMedia (NO localStorage)
2. `AuthProvider` — context for current user, login/logout/register functions
3. `ProtectedRoute` — wrapper that checks auth + payment status
4. `AppSidebar` — navigation sidebar (shadcn sidebar component)
5. `LandingPage` — public marketing page
6. `LoginPage` / `RegisterPage` — auth forms
7. `PaymentPage` — payment gate
8. `DashboardPage` — progress overview
9. `StudyPage` — study content with sidebar navigation
10. `QuizPage` — quiz engine with setup/question/results screens
11. Various UI pieces: ProgressRing, DomainCard, QuizQuestion, etc.

## Auth Flow
1. User visits / → sees landing page
2. Clicks "Get Started" → /register
3. Registers → auto-logged in, redirected to /payment (since hasPaid=false)
4. Completes payment → redirected to /dashboard
5. On subsequent visits: /login → /dashboard (if paid) or /payment (if not)
6. All /dashboard, /study, /quiz routes check auth+payment

## Quality Standards
- Responsive: works at 375px mobile and 1280px+ desktop
- Dark mode: full support, toggled via button
- No text overflow or truncation issues
- Consistent spacing using Tailwind tokens
- All buttons/inputs have data-testid attributes
- Error states for API failures
- Loading skeletons while fetching data
