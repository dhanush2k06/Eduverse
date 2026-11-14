# Implementation Plan --- Research-Driven E-Learning Platform

**Build target:** Google Antigravity\
**Product name:** Working title --- to be finalized\
**Document status:** Revised MVP specification\
**Primary goal:** Build a modern, content-first e-learning platform with
learner CRM and activity analytics.

------------------------------------------------------------------------

## 1. Product vision

Create a modern e-learning platform that helps learners develop
practical, creative, communication, thinking, leadership, interpersonal,
and life skills through well-structured learning content.

The MVP is a **content-led learning management platform**, not a
video-course marketplace and not a simulation platform.

Learning content will primarily consist of: - Structured text lessons
and reading material. - Explanations, examples, case studies, and
practical applications. - Images, diagrams, infographics, and other
supporting visuals. - Downloadable worksheets, templates, notes, and
reference material. - Knowledge checks, quizzes, assignments, and
reflection activities.

Video tutorials may be introduced in a later product phase after the
platform has gained traction. The architecture may allow optional video
URLs in the future, but video hosting, streaming infrastructure, and
video-first learning flows must not be built for the MVP.

### Core product pillars

1.  **Knowledge** --- well-organized, research-informed learning
    content.
2.  **Practice** --- quizzes, assignments, worksheets, exercises, and
    real-world application tasks.
3.  **Development** --- measurable learning progress, activity history,
    feedback, and skill evidence.

### Product principles

-   Learning content is the primary teaching medium in the MVP.
-   Practice should reinforce the lesson; do not introduce simulations.
-   Research references should be traceable and reviewable.
-   Learners should always understand their progress and next learning
    step.
-   Admins need a useful CRM-style view of learner activity and
    engagement.
-   The interface should be clean, modern, premium, welcoming, and easy
    to navigate.
-   Build a maintainable MVP first, with clear paths for future scale.

------------------------------------------------------------------------

## 2. Target learners

The first release is intended for: - College students and recent
graduates. - Early-career professionals and job seekers. - Entrepreneurs
and independent learners. - People who want to improve practical,
interpersonal, creative, and thinking skills.

The MVP focuses on individual learners and an internal content/admin
team. Institutional and corporate account management can be added later.

------------------------------------------------------------------------

## 3. Course categories and learning areas

Categories must be manageable through the admin dashboard rather than
hard-coded into the frontend.

### Initial categories

1.  **Thinking & Intelligence**
    -   Critical thinking
    -   Analytical reasoning
    -   Creative thinking
    -   Problem-solving
    -   Decision-making
    -   Lateral thinking
2.  **Communication & Expression**
    -   Public speaking
    -   Storytelling
    -   Persuasive communication
    -   Active listening
    -   Professional communication
    -   Presentation skills
3.  **Social & Interpersonal Skills**
    -   Negotiation
    -   Conflict resolution
    -   Networking
    -   Relationship building
    -   Collaboration
    -   Emotional intelligence
4.  **Creativity & Innovation**
    -   Design thinking
    -   Idea generation
    -   Innovation
    -   Creative writing
    -   Visual storytelling
    -   Entrepreneurial thinking
5.  **Leadership & Management**
    -   Leadership
    -   Delegation
    -   Decision-making under pressure
    -   Team management
    -   Initiative
    -   Project management
6.  **Personal Development**
    -   Self-awareness
    -   Confidence
    -   Time management
    -   Adaptability
    -   Discipline
    -   Learning how to learn
7.  **Practical Life Skills**
    -   Financial literacy
    -   First-aid awareness
    -   Digital literacy
    -   Consumer awareness
    -   Everyday negotiation
8.  **Exploration & Expression**
    -   Debate
    -   Photography
    -   Creative writing
    -   Music appreciation
    -   Design exploration
    -   Other creative disciplines

Launch with a small number of flagship courses rather than attempting to
publish every topic. Suggested pilot courses: - Critical Thinking -
Public Speaking - Negotiation - Creative Problem Solving - Emotional
Intelligence

------------------------------------------------------------------------

## 4. Learning content model

### 4.1 Course hierarchy

Use this hierarchy consistently across the application:

`Category → Course → Module → Lesson → Content Blocks → Learning Activities`

A course contains modules. Each module contains ordered lessons. Each
lesson contains structured content blocks and optional learning
activities.

### 4.2 Supported lesson content blocks

The lesson editor and lesson renderer should support these block types:

-   Heading and subheading.
-   Paragraph / rich text.
-   Bulleted and numbered lists.
-   Highlighted key concept or takeaway.
-   Definition / terminology block.
-   Example or worked example.
-   Case study.
-   Tip / best-practice callout.
-   Warning / common mistake callout.
-   Image or infographic with caption and alternative text.
-   Diagram or embedded visual.
-   Comparison table.
-   Quote with source attribution.
-   Downloadable resource / attachment.
-   External reference link.
-   Lesson summary / key takeaways.
-   "Think about it" reflection prompt.

Build a controlled content-block editor. Do not allow arbitrary
executable HTML or JavaScript in lesson content. Sanitize supported rich
text before rendering.

### 4.3 Learning activities in the MVP

Implement standard e-learning activities only:

**Knowledge checks** - Multiple-choice questions. - Single correct
answer initially. - Optional multi-select only after the basic quiz flow
is stable. - Immediate or end-of-quiz feedback. - Explanation for the
correct answer. - Score and attempt history.

**Assignments** - Written response submission. - File attachment where
appropriate. - Submission status. - Instructor/admin feedback. -
Resubmission support if enabled for the assignment.

**Reflection activities** - Short written reflection prompts. - Save
draft and submit. - Learner can revisit their own response.

**Downloadable practice resources** - Worksheets. - Checklists. -
Templates. - Reading guides. - Practice plans.

Do not implement simulations, role-play engines, branching simulation
environments, virtual labs, or interactive scenario simulators in the
MVP.

### 4.4 Course completion rules

Course completion must be based on configurable requirements, for
example: - Required lessons marked complete. - Required quizzes
attempted or passed. - Required assignments submitted, where applicable.

Do not mark a learner as having mastered a skill merely because they
opened a lesson or watched content. Track learning activity and assessed
evidence separately.

------------------------------------------------------------------------

## 5. Research-backed content workflow

Research quality is a key product differentiator. Research records
should be managed within the platform and linked to the lessons they
support.

### Research-to-publication workflow

1.  Researcher collects relevant books, articles, academic publications,
    reports, and reliable web sources.
2.  Researcher records source details and the claims or concepts
    supported.
3.  Researcher evaluates source credibility, publication date, evidence
    quality, limitations, and possible bias.
4.  Researcher synthesizes information into an original lesson outline.
5.  Lesson content is written with clear explanations, examples,
    summaries, and practice activities.
6.  Reviewer checks factual accuracy, clarity, source traceability,
    copyright, and learner suitability.
7.  Approved content is published.
8.  Content is periodically reviewed and updated when evidence or
    guidance changes.

### Research source fields

-   Title.
-   Author or publishing organization.
-   Publication date.
-   Source type.
-   Publisher or journal.
-   URL, DOI, ISBN, or other identifier.
-   Key findings or useful notes.
-   Claims or lesson concepts supported.
-   Credibility and review notes.
-   Verification status.
-   Copyright or licensing notes.
-   Last reviewed date.

### Content governance

-   Write original explanations and examples.
-   Do not reproduce copyrighted books or articles without permission.
-   Distinguish established evidence from interpretation, opinion, and
    debated claims.
-   Record limitations and conflicting perspectives where relevant.
-   Do not publish unsupported factual claims as established facts.
-   Maintain lesson revision history.
-   A source being listed does not automatically verify every claim in a
    lesson.

### Content status lifecycle

`Draft → In Review → Approved → Published → Archived`

Only authorized reviewers/admins can approve and publish content.

------------------------------------------------------------------------

## 6. MVP feature scope

### 6.1 Public landing page

-   Product positioning and value proposition.
-   Clear explanation of the platform's learning approach.
-   Featured courses and categories.
-   Benefits and learning outcomes.
-   Research-informed content explanation.
-   Testimonials or learner stories when genuine testimonials exist.
-   Sign-up and course exploration calls to action.
-   Responsive layout.

### 6.2 Authentication and learner profile

Use Firebase Authentication for: - Email/password sign-up. -
Email/password sign-in. - Password reset. - Sign-out. - Optional Google
sign-in if configured.

Learner profile fields: - Display name. - Email. - Profile image
(optional). - Short introduction (optional). - Learning interests. -
Account creation date. - Account status.

### 6.3 Course discovery

-   Browse all published courses.
-   Browse by category.
-   Search by course title, topic, or keyword.
-   Filter by category and difficulty.
-   Course detail page with description, outcomes, duration, modules,
    prerequisites, and content format.
-   Enroll or start a course.
-   Show enrollment state and progress.

### 6.4 Course learning interface

The course-learning interface must use the previously generated
e-learning UI design as its main visual reference.

The reference was created from the user's hand-drawn e-learning layout.
Antigravity must inspect the original design image/asset if it is
present in the workspace or attached project resources. Preserve the
information hierarchy and layout intent. Do not substitute a generic LMS
template.

The learning page should include: - Course title and course-level
progress. - Module/lesson navigation. - Current lesson title and
estimated reading time. - Structured reading content with headings and
content blocks. - Images, diagrams, examples, tables, and callouts. -
Downloadable learning resources. - Research references for the current
lesson. - Previous and next lesson navigation. - Mark-as-complete
action. - Lesson completion state. - Related quiz or assignment entry
point. - Clear return-to-course navigation.

The reading area should be the primary focus. Avoid a video-player-first
layout. Do not show a large empty video placeholder.

### 6.5 Learner dashboard

Display: - Welcome area. - Enrolled courses. - Continue learning. -
Course progress indicators. - Recently accessed lessons. - Pending
assignments. - Recent quiz results. - Completed courses. - Learning
activity timeline. - Suggested next course or lesson based on simple
category/interests rules.

### 6.6 Learner CRM and activity tracking

Build a first-party, admin-facing **Learner CRM**. This is a core MVP
module, not an optional future feature.

The CRM should help the platform team understand learner acquisition,
enrollment, engagement, learning progress, completion, and follow-up
needs. It is for education operations and learner support---not a sales
CRM.

#### CRM overview dashboard

Show summary metrics: - Total registered learners. - New registrations
over a selected date range. - Active learners over a selected date
range. - Total course enrollments. - Course completion count and
completion rate. - Learners with pending assignments. - Quiz attempts
and average scores. - Learners inactive for a configurable period. -
Course-wise enrollment and completion.

Define metrics clearly. For example, an active learner should be someone
who performed a meaningful tracked learning action during the selected
period, not someone who merely loaded the landing page.

#### Learner directory

Provide a searchable, filterable learner table with: - Learner name. -
Email. - Registration date. - Account status. - Enrolled course count. -
Courses completed. - Last meaningful activity. - Overall learning
progress. - Support/follow-up status.

Filters: - Registration date range. - Account status. - Course
enrolled. - Course completion state. - Active / inactive period. -
Assignment pending. - Progress range.

#### Individual learner profile / 360-degree view

When an admin opens a learner record, show: - Basic profile and account
information. - Enrollment history. - Course-by-course progress. -
Lessons completed. - Quiz attempts, scores, and dates. - Assignment
submissions and review status. - Downloaded resources where tracking is
intentionally enabled. - Last meaningful activity. - Achievement
records. - Admin notes and follow-up history. - Learner support status.

Do not expose private learner records to other learners. Restrict this
view to authorized staff.

#### Activity timeline

Track meaningful events such as: - Account created. - Course viewed. -
Course enrolled. - Lesson opened. - Lesson completed. - Resource
downloaded, where relevant. - Quiz started. - Quiz submitted. -
Assignment submitted. - Assignment reviewed. - Course completed. -
Profile updated.

For every event, store: - User ID. - Event type. - Relevant
course/lesson/activity ID. - Timestamp. - Minimal contextual metadata
needed for reporting.

Do not collect unnecessary personal data or detailed device
fingerprints. Do not claim precise time-on-task from page-open events
alone. If measuring reading duration, use a clearly documented
active-session approximation and disclose its limitations.

#### CRM follow-up tools

For MVP, authorized admins should be able to: - Add internal notes to a
learner profile. - Set a simple follow-up status such as
`Needs Attention`, `Contacted`, or `Resolved`. - Record the date and
staff member responsible. - Filter learners needing follow-up.

Do not build bulk email campaigns or marketing automation in the MVP.
The CRM should provide visibility and basic operational follow-up first.

#### CRM privacy and access

-   Learners can view only their own learning records.
-   Content editors do not automatically receive access to all private
    learner records.
-   Only authorized admin/support roles can view CRM profiles and
    internal notes.
-   Log access to sensitive admin operations where appropriate.
-   Provide appropriate data retention and account deletion behavior.

### 6.7 Skill development record

Create a foundational skill record connected to courses and activities.

Track: - Skills associated with a course or lesson. - Quizzes attempted
and results. - Assignments submitted. - Courses completed. - Practical
resources and exercises completed.

Use transparent states such as `Learning`, `Practiced`, `Assessed`, and
`Completed`. A future Skill Passport can present verified evidence and a
downloadable portfolio.

### 6.8 Admin content management

Admin/research team capabilities: - Create and edit categories. - Create
and edit courses. - Create modules and lessons. - Build lesson content
using supported content blocks. - Add images, diagrams, attachments, and
resources. - Add and manage research sources. - Link sources to
lessons. - Create quizzes and assignments. - Preview content. - Submit
for review. - Approve, publish, unpublish, or archive content. - View
course and learner analytics.

External instructor onboarding and marketplace functionality are out of
scope for the MVP.

------------------------------------------------------------------------

## 7. Roles and permissions

Implement authorization on the backend.

  -----------------------------------------------------------------------
  Role                                Permissions
  ----------------------------------- -----------------------------------
  Guest                               View public pages and published
                                      course previews

  Learner                             Enroll, access own courses,
                                      complete lessons, submit
                                      activities, view own progress

  Researcher / Content Editor         Create and edit course content and
                                      research records

  Reviewer                            Review content, request changes,
                                      approve or reject

  Support Staff                       View permitted learner CRM records,
                                      add notes, update follow-up status

  Admin                               Manage users, roles, courses, CRM
                                      permissions, publication, and
                                      platform settings
  -----------------------------------------------------------------------

Do not trust role values supplied by the browser. Privileged role
assignments must be controlled through trusted server-side operations
and Firebase custom claims or protected role records.

------------------------------------------------------------------------

## 8. Recommended MVP technology stack

Use JavaScript throughout the MVP.

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                React                   Learner and admin
                                                  interfaces

  Build tooling           Vite                    Development and
                                                  production build

  Routing                 React Router            Navigation and
                                                  protected routes

  Styling                 Tailwind CSS            Responsive styling and
                                                  design tokens

  UI components           shadcn/ui or accessible Dialogs, menus, tabs,
                          reusable components     forms, tables

  Backend                 Node.js + Express       REST API and business
                                                  logic

  Authentication          Firebase Authentication User identity and
                                                  sign-in

  Database                Cloud Firestore         Users, courses,
                                                  lessons, enrollments,
                                                  CRM, activity records

  File storage            Firebase Storage        Images, diagrams,
                                                  worksheets, attachments

  Server-side Firebase    Firebase Admin SDK      Token verification and
                                                  privileged operations

  Validation              Zod or                  API and form validation
                          express-validator       

  Testing                 Vitest, React Testing   Unit and API tests
                          Library, Supertest      

  End-to-end testing      Playwright              Critical user journeys

  Version control         Git + GitHub            Source control
  -----------------------------------------------------------------------

### Architecture

Use a **React + Express API + Firebase** architecture.

-   React uses Firebase client SDK for authentication.
-   Firebase Authentication issues the user's ID token.
-   React sends the ID token to Express in the `Authorization: Bearer`
    header.
-   Express verifies the token using Firebase Admin SDK.
-   Express enforces roles, ownership, and business rules.
-   Firestore stores structured application data.
-   Firebase Storage stores uploaded files and learning assets.
-   Use backend routes for privileged data and CRM access.
-   Firebase Security Rules provide defense in depth.

Never include Firebase Admin credentials or service-account private keys
in frontend code.

### Scalability guidance

-   Keep Express stateless so it can scale horizontally.
-   Paginate learner directories, activity logs, courses, and
    submissions.
-   Avoid unbounded Firestore reads and excessive real-time listeners.
-   Create Firestore indexes for actual query patterns.
-   Use summary documents or scheduled aggregation for expensive
    dashboard metrics rather than repeatedly scanning every event.
-   Consider TTL/retention policies for raw activity events where
    appropriate.
-   Optimize images and serve static assets through a CDN.
-   Monitor Firebase reads/writes, storage, hosting, API latency, and
    error rates.
-   Load-test CRM dashboards and learner activity writes before a large
    launch.

Do not introduce microservices, Kubernetes, or a separate analytics
warehouse in the MVP.

------------------------------------------------------------------------

## 9. High-level application architecture

``` text
Learner / Admin Browser
        |
        v
React + Vite Frontend
        |
        +---- Firebase Authentication
        |       (sign-in and ID token)
        |
        v
Node.js + Express REST API
        |
        +---- Firebase Admin SDK
        |       (token verification / roles)
        |
        +---- Authorization and business logic
        |
        +----------------------+---------------------+
        |                      |                     |
        v                      v                     v
Cloud Firestore         Firebase Storage       Aggregated metrics
(core data, CRM,        (images, files,         (CRM dashboard
events, progress)       worksheets)             summaries)
```

------------------------------------------------------------------------

## 10. Suggested project structure

``` text
learning-platform/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── course/
│       │   ├── lesson/
│       │   ├── activity/
│       │   ├── dashboard/
│       │   └── crm/
│       ├── pages/
│       │   ├── public/
│       │   ├── auth/
│       │   ├── learner/
│       │   ├── admin/
│       │   └── crm/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── routes/
│       ├── utils/
│       ├── styles/
│       ├── firebase/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── categories/
│   │   │   ├── courses/
│   │   │   ├── modules/
│   │   │   ├── lessons/
│   │   │   ├── content/
│   │   │   ├── research/
│   │   │   ├── enrollments/
│   │   │   ├── activities/
│   │   │   ├── submissions/
│   │   │   ├── progress/
│   │   │   ├── learner-crm/
│   │   │   └── analytics/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── firestore-data-model.md
│   ├── api-reference.md
│   └── design-system.md
│
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

## 11. Firestore data model

Use stable document IDs and design collections around the application's
query patterns.

### `users/{userId}`

-   `displayName`
-   `email`
-   `photoURL`
-   `bio`
-   `interests`
-   `role`
-   `accountStatus`
-   `createdAt`
-   `updatedAt`

Protect role and account status fields. Never trust client-side role
changes.

### `categories/{categoryId}`

-   `name`
-   `slug`
-   `description`
-   `imageURL`
-   `displayOrder`
-   `isActive`

### `courses/{courseId}`

-   `title`
-   `slug`
-   `shortDescription`
-   `description`
-   `categoryId`
-   `difficulty`
-   `learningOutcomes`
-   `thumbnailURL`
-   `estimatedDuration`
-   `prerequisites`
-   `status`
-   `createdBy`
-   `reviewedBy`
-   `publishedAt`
-   `createdAt`
-   `updatedAt`

### `courses/{courseId}/modules/{moduleId}`

-   `title`
-   `description`
-   `displayOrder`
-   `estimatedDuration`

### `courses/{courseId}/modules/{moduleId}/lessons/{lessonId}`

-   `title`
-   `summary`
-   `readingTimeEstimate`
-   `contentBlocks`
-   `resourceIds`
-   `researchSourceIds`
-   `displayOrder`
-   `status`
-   `updatedAt`

### `researchSources/{sourceId}`

-   `title`
-   `authorOrOrganization`
-   `publicationDate`
-   `sourceType`
-   `publisher`
-   `url`
-   `doiOrIdentifier`
-   `summary`
-   `credibilityNotes`
-   `verificationStatus`
-   `copyrightNotes`
-   `lastReviewedAt`
-   `createdBy`
-   `createdAt`
-   `updatedAt`

### `enrollments/{enrollmentId}`

-   `userId`
-   `courseId`
-   `status`
-   `enrolledAt`
-   `completedAt`
-   `lastAccessedAt`

Use a deterministic ID or transaction-safe strategy to prevent duplicate
active enrollments.

### `lessonProgress/{progressId}`

-   `userId`
-   `courseId`
-   `moduleId`
-   `lessonId`
-   `status`
-   `startedAt`
-   `completedAt`
-   `updatedAt`

### `activities/{activityId}`

-   `courseId`
-   `moduleId`
-   `lessonId`
-   `type` (`quiz`, `assignment`, `reflection`)
-   `title`
-   `instructions`
-   `questionsOrPrompt`
-   `rubric`
-   `status`
-   `createdAt`
-   `updatedAt`

Keep quiz answer keys server-controlled. Do not expose correct answers
before an attempt is submitted.

### `submissions/{submissionId}`

-   `userId`
-   `activityId`
-   `courseId`
-   `response`
-   `attachmentURLs`
-   `score` (only for objectively scored work)
-   `feedback`
-   `status`
-   `submittedAt`
-   `reviewedAt`
-   `reviewedBy`

### `activityEvents/{eventId}`

-   `userId`
-   `eventType`
-   `courseId`
-   `lessonId`
-   `activityId`
-   `occurredAt`
-   `metadata` (minimal and schema-validated)

Use append-only event records for important learning actions. Avoid
storing sensitive or unnecessary metadata.

### `learnerCRM/{userId}`

-   `followUpStatus`
-   `assignedStaffId`
-   `lastReviewedAt`
-   `internalSummary`
-   `updatedAt`

Keep internal CRM notes separate from learner-visible profile data.
Restrict reads and writes to authorized staff.

### `learnerCRM/{userId}/notes/{noteId}`

-   `note`
-   `createdBy`
-   `createdAt`
-   `updatedAt`

### `courseMetrics/{courseId}` and `platformMetrics/{periodId}`

Store derived summary metrics such as enrollments, completions, active
learners, and quiz aggregates. Update them through trusted backend logic
or scheduled aggregation. Clearly document how each metric is
calculated.

### Data-model rules

-   Store timestamps consistently.
-   Paginate all potentially large collections.
-   Use transactions or batched writes when multiple records must remain
    consistent.
-   Store files in Firebase Storage, not Firestore documents.
-   Define account deletion and data retention workflows.
-   Avoid full activity-history scans for every CRM dashboard load.

------------------------------------------------------------------------

## 12. API design

Use versioned endpoints under `/api/v1`.

### Public endpoints

-   `GET /api/v1/categories`
-   `GET /api/v1/courses`
-   `GET /api/v1/courses/:courseId`
-   `GET /api/v1/courses/:courseId/outline`

### Learner endpoints

-   `GET /api/v1/me`
-   `PATCH /api/v1/me`
-   `POST /api/v1/courses/:courseId/enroll`
-   `GET /api/v1/me/enrollments`
-   `GET /api/v1/me/progress`
-   `GET /api/v1/lessons/:lessonId`
-   `POST /api/v1/lessons/:lessonId/start`
-   `POST /api/v1/lessons/:lessonId/complete`
-   `GET /api/v1/activities/:activityId`
-   `POST /api/v1/activities/:activityId/attempts`
-   `POST /api/v1/activities/:activityId/submissions`
-   `GET /api/v1/me/submissions`
-   `GET /api/v1/me/activity`

### Admin/content endpoints

-   `POST /api/v1/admin/categories`
-   `PATCH /api/v1/admin/categories/:categoryId`
-   `POST /api/v1/admin/courses`
-   `PATCH /api/v1/admin/courses/:courseId`
-   `POST /api/v1/admin/courses/:courseId/modules`
-   `POST /api/v1/admin/lessons`
-   `POST /api/v1/admin/research-sources`
-   `PATCH /api/v1/admin/research-sources/:sourceId`
-   `POST /api/v1/admin/courses/:courseId/submit-review`
-   `POST /api/v1/admin/courses/:courseId/approve`
-   `POST /api/v1/admin/courses/:courseId/publish`

### Learner CRM endpoints

-   `GET /api/v1/admin/crm/overview`
-   `GET /api/v1/admin/crm/learners`
-   `GET /api/v1/admin/crm/learners/:userId`
-   `GET /api/v1/admin/crm/learners/:userId/activity`
-   `POST /api/v1/admin/crm/learners/:userId/notes`
-   `PATCH /api/v1/admin/crm/learners/:userId/follow-up`

Every endpoint must authenticate where required, authorize the action,
validate input, paginate list responses, and return consistent errors.

------------------------------------------------------------------------

## 13. UI design system and visual direction

The platform should feel like a **premium, modern learning product**:
minimal, editorial, spacious, calm, and focused on reading and progress.
It should not look like a generic corporate LMS, a gaming dashboard, or
a video streaming service.

### 13.1 Color palette

Use this defined palette as the implementation baseline. If the original
design reference asset contains clearly different exact colors, inspect
it and update the tokens to match that reference before implementing.

  -----------------------------------------------------------------------
  Token                   Hex                     Usage
  ----------------------- ----------------------- -----------------------
  Primary / deep navy     `#172554`               Primary buttons, active
                                                  navigation, important
                                                  headings

  Primary hover           `#1E3A8A`               Hover and pressed
                                                  states

  Accent / clear blue     `#3B82F6`               Links, progress,
                                                  selected states, focus
                                                  accents

  Accent soft             `#DBEAFE`               Selected backgrounds,
                                                  information panels

  Page background         `#F8FAFC`               Main app background

  Surface / card          `#FFFFFF`               Cards, panels, menus,
                                                  content surfaces

  Main text               `#0F172A`               Main headings and body
                                                  text

  Secondary text          `#64748B`               Metadata, descriptions,
                                                  helper text

  Border                  `#E2E8F0`               Dividers, card borders,
                                                  input borders

  Success                 `#16A34A`               Completed lessons,
                                                  success feedback

  Success soft            `#DCFCE7`               Completion backgrounds

  Warning                 `#D97706`               Pending review,
                                                  attention states

  Warning soft            `#FEF3C7`               Warning backgrounds

  Error                   `#DC2626`               Validation errors and
                                                  destructive actions

  Error soft              `#FEE2E2`               Error backgrounds
  -----------------------------------------------------------------------

Color rules: - Use deep navy as the primary brand anchor. - Use clear
blue sparingly for active states and important actions. - Keep most page
surfaces white or very light grey. - Use semantic colors only for status
and feedback. - Avoid large saturated gradient backgrounds. - Maintain
accessible text contrast; never use pale blue text for body copy. - Do
not use color alone to communicate status; pair it with labels or icons.

### 13.2 Typography

Use **Inter** as the primary interface font, with a system sans-serif
fallback.

Suggested type scale: - Page title: 28--32 px, semibold. - Section
heading: 20--24 px, semibold. - Card heading: 16--18 px, semibold. -
Body text: 15--16 px, regular. - Supporting text: 13--14 px. - Small
metadata: 12 px.

For lesson reading: - Body line-height around 1.65--1.8. - Comfortable
content width; avoid very long text lines. - Clear heading hierarchy. -
Use bold emphasis sparingly. - Provide enough spacing between
paragraphs, lists, examples, and callouts.

### 13.3 Layout and spacing

-   Use a 12-column desktop grid where appropriate.
-   Use a centered content container with a maximum width around
    1200--1280 px.
-   Use a consistent 4 px spacing scale.
-   Common spacing values: 8, 12, 16, 24, 32, and 48 px.
-   Cards should have 12--16 px corner radii.
-   Inputs and buttons should have consistent heights and corner radii.
-   Use subtle borders and very light shadows; avoid heavy elevation.
-   Maintain generous whitespace around lesson content.

### 13.4 Navigation

Public website: - Simple top navigation. - Product logo/name on the
left. - Explore courses and key informational links. - Sign in and
primary sign-up action on the right.

Authenticated learner area: - Persistent, compact navigation. -
Dashboard. - My Learning. - Explore. - Progress / Achievements. -
Profile and settings.

Course learning page: - Course identity and return navigation. - Module
and lesson navigation in a left-side panel or the arrangement shown in
the supplied reference. - Main reading/content column. - Contextual
lesson resources and progress information in a secondary panel only when
the reference layout supports it. - On mobile, collapse navigation into
a drawer or accessible expandable panel.

Admin and CRM: - Separate admin shell with a left navigation sidebar. -
Overview. - Courses and content. - Research library. - Learners / CRM. -
Activity and reports. - User and role management.

### 13.5 Page-specific UI descriptions

**Landing page** - Light background. - Strong, concise hero heading. -
Short supporting paragraph. - One primary blue action and one secondary
action. - Featured course cards. - Category exploration section. -
Research-informed learning explanation. - Clean footer.

**Course discovery** - Search field near the top. - Category filters and
difficulty filters. - Consistent course-card grid. - Course cards show
thumbnail, category, title, short description, difficulty, and estimated
duration. - Avoid excessive badges and clutter.

**Course detail** - Course title, category, overview, outcomes,
duration, and difficulty. - Clear enrollment/start button. - Module
outline and lesson count. - Explain what the learner will be able to do
after completion.

**Lesson learning screen** - Reading-first layout. - Visible
course/module context. - Clear lesson title and reading-time estimate. -
Structured content blocks with generous spacing. - Images and diagrams
should be responsive and captioned. - Distinct but restrained callout
styles for definitions, examples, tips, and key takeaways. - Research
references in a clearly labeled section. - Previous/next and
mark-complete controls. - No simulation panels and no video-player-first
layout.

**Learner dashboard** - Welcome and continue-learning section. -
Progress summaries. - Enrolled course cards. - Pending work and recent
activity. - Simple visualizations only where they make progress easier
to understand.

**Learner CRM** - Data-dense but readable admin interface. - Summary
metric cards at the top. - Searchable learner table with filters. -
Learner detail page with profile summary, progress, course enrollments,
activity timeline, quiz/assignment records, internal notes, and
follow-up status. - Use tables for operational data and charts for
trends; avoid decorative charts without a clear purpose.

### 13.6 Component styling

Create reusable components and design tokens for: - Buttons: primary,
secondary, outline, ghost, destructive. - Inputs, selects, text areas,
checkboxes, and search. - Course cards and category cards. - Lesson
content blocks. - Progress bars and status labels. - Tabs, accordions,
dialogs, dropdowns, and drawers. - Tables, pagination, filters, and
empty states. - Toast notifications and form validation. - CRM metric
cards, activity timeline, learner profile panels.

Use consistent hover, focus, active, disabled, loading, and error
states. All controls must be keyboard accessible.

### 13.7 Responsive behavior

-   Desktop: full navigation and multi-column layouts.
-   Tablet: reduce side-panel widths and simplify grids.
-   Mobile: single-column reading layout, collapsible navigation,
    touch-friendly controls, and horizontally scrollable tables only
    where necessary.
-   Ensure lesson text and interactive controls remain comfortable on
    small screens.

------------------------------------------------------------------------

## 14. Security, privacy, and reliability

-   Verify Firebase ID tokens on protected API routes.
-   Enforce role and ownership checks on the backend.
-   Use least-privilege Firestore and Storage Security Rules.
-   Keep service-account credentials on the server only.
-   Validate and sanitize all user input.
-   Restrict file type and size for uploads.
-   Configure CORS for known frontend origins.
-   Apply rate limits to sensitive endpoints.
-   Keep private learner submissions and CRM notes restricted.
-   Log important administrative actions.
-   Provide account deletion and data-removal workflows.
-   Use HTTPS in deployed environments.
-   Avoid unnecessary personal-data collection.
-   Document what activity events are collected and why.

Use Firebase Emulator Suite to test Firestore and Storage rules before
deployment.

------------------------------------------------------------------------

## 15. Development phases

Build and verify one milestone at a time.

### Phase 0 --- Repository and design inspection

-   Inspect the existing repository and dependencies.
-   Locate and inspect the previously generated e-learning UI reference.
-   Record the reference's layout, colors, typography, navigation, and
    components.
-   Compare it with the design tokens in this plan and update tokens if
    needed.
-   Return an implementation checklist before coding.

**Deliverable:** repository assessment, design-reference analysis,
architecture plan, and milestones.

### Phase 1 --- Project foundation

-   Create React + Vite frontend.
-   Create Node.js + Express backend.
-   Configure Firebase client and Admin SDK.
-   Set up environment variables.
-   Add routing, layouts, Tailwind, and design tokens.
-   Add linting and test setup.

**Deliverable:** local frontend and API health check work.

### Phase 2 --- Authentication and roles

-   Implement Firebase sign-up, sign-in, reset, and sign-out.
-   Initialize learner profiles.
-   Add token-verification middleware.
-   Add backend role and ownership checks.
-   Build protected learner and admin routes.

**Deliverable:** authenticated and role-protected application.

### Phase 3 --- Design system and public pages

-   Implement global layout and reusable components.
-   Implement landing page.
-   Implement course categories, discovery, search, and filters.
-   Implement course details.
-   Match the supplied UI reference.

**Deliverable:** responsive public-facing learning site.

### Phase 4 --- Course and content management

-   Implement categories, courses, modules, and lessons.
-   Implement structured lesson content blocks.
-   Implement research-source management and lesson references.
-   Implement review and publication workflow.
-   Upload images, diagrams, and downloadable resources to Firebase
    Storage.

**Deliverable:** content team can build and publish reading-based
courses.

### Phase 5 --- Learner learning experience

-   Implement enrollment.
-   Implement reading-first lesson page.
-   Implement lesson navigation and completion.
-   Implement learner dashboard.
-   Persist course and lesson progress.

**Deliverable:** learner can enroll, study lessons, and track progress.

### Phase 6 --- Quizzes and assignments

-   Implement quizzes and attempts.
-   Implement written assignments and reflections.
-   Implement file attachments where required.
-   Implement feedback and review states.
-   Connect activities to lessons and courses.

**Deliverable:** learners can practice and submit work.

### Phase 7 --- Learner CRM and analytics

-   Implement CRM overview dashboard.
-   Implement learner directory, filters, and search.
-   Implement learner 360-degree profile.
-   Implement activity timeline.
-   Implement internal notes and follow-up statuses.
-   Implement course and platform metric summaries.
-   Add role restrictions and audit logging for CRM operations.

**Deliverable:** authorized staff can track learner activity and manage
follow-up.

### Phase 8 --- QA and launch

-   Test authentication and role permissions.
-   Test Firestore and Storage rules.
-   Test learner and admin flows.
-   Test CRM privacy and pagination.
-   Test responsive layouts and accessibility.
-   Load-test important API and CRM queries.
-   Configure production deployment and monitoring.
-   Prepare admin onboarding and sample course content.

**Deliverable:** deployable MVP ready for a controlled pilot.

------------------------------------------------------------------------

## 16. Suggested routes

  ---------------------------------------------------------------------------------
  Route                             Access                  Purpose
  --------------------------------- ----------------------- -----------------------
  `/`                               Public                  Landing page

  `/explore`                        Public                  Course discovery

  `/categories/:slug`               Public                  Category page

  `/courses/:slug`                  Public                  Course details

  `/login`                          Public                  Sign in

  `/signup`                         Public                  Create account

  `/forgot-password`                Public                  Password reset

  `/learn`                          Learner                 Dashboard

  `/learn/my-courses`               Learner                 Enrolled courses

  `/learn/courses/:courseId`        Learner                 Course overview

  `/learn/lessons/:lessonId`        Enrolled learner        Reading lesson

  `/learn/activities/:activityId`   Enrolled learner        Quiz or assignment

  `/learn/profile`                  Learner                 Profile and progress

  `/admin`                          Admin                   Admin overview

  `/admin/courses`                  Content team            Course management

  `/admin/research`                 Research team           Research library

  `/admin/review`                   Reviewer                Content review

  `/admin/crm`                      Admin/support           Learner CRM overview

  `/admin/crm/learners/:userId`     Admin/support           Learner profile
  ---------------------------------------------------------------------------------

Backend authorization must independently enforce the same restrictions.

------------------------------------------------------------------------

## 17. Explicit MVP exclusions

Do not implement these in the MVP:

-   Simulations of any kind.
-   Role-play simulation engines.
-   Branching scenario simulators.
-   Virtual labs or hardware simulations.
-   Video tutorial hosting or streaming infrastructure.
-   Live classes or video conferencing.
-   Instructor marketplace.
-   Public discussion community or social feed.
-   AI tutor or AI-generated lesson content.
-   Automated AI grading of subjective assignments.
-   Native mobile apps.
-   Institutional multi-tenant portals.
-   Corporate learning administration.
-   Subscription billing or complex coupon systems.
-   Microservices, Kubernetes, or multi-region infrastructure.
-   Advanced predictive analytics.

Video tutorials may be introduced later as an additional lesson content
type. Do not make the current data model dependent on video.

### Payment readiness

Keep course access and enrollment structures extensible for future paid
courses, but defer payment integration until the product owner approves
monetization. The MVP can launch with free pilot courses or controlled
access.

------------------------------------------------------------------------

## 18. Testing and acceptance criteria

### Learner flow

-   Visitor can browse published courses.
-   Learner can create an account, sign in, reset password, and sign
    out.
-   Learner can enroll in a course.
-   Learner can read lessons and navigate modules.
-   Learner can mark lessons complete.
-   Progress persists across sessions.
-   Learner can attempt a quiz and view appropriate feedback.
-   Learner can submit an assignment or reflection.
-   Learner can view their own progress and activity history.

### Content-team flow

-   Authorized editor can create a course, modules, and lessons.
-   Editor can add supported content blocks and resources.
-   Researcher can add sources and link them to lessons.
-   Reviewer can approve or reject content.
-   Only approved content can be published.
-   Published content appears in course discovery.

### CRM flow

-   Authorized staff can view CRM overview metrics.
-   Staff can search and filter learners.
-   Staff can open a learner profile and see enrollments, progress, and
    activity.
-   Staff can add internal notes and update follow-up status.
-   Learners cannot access CRM pages, internal notes, or another
    learner's records.
-   Large tables and timelines are paginated.
-   CRM metrics are calculated consistently and documented.

### Security and quality

-   No secrets in frontend bundles or repository.
-   No unauthorized role escalation.
-   Firestore and Storage rules are tested.
-   No unbounded queries for large collections.
-   Forms have validation and useful error states.
-   Loading, empty, and error states exist.
-   Responsive layouts work on mobile, tablet, and desktop.
-   Critical journeys pass automated tests.

### MVP completion definition

The MVP is ready for pilot users when learners can discover courses,
register, enroll, read structured lessons, complete quizzes and
assignments, and track progress---and the internal team can create
research-linked content, publish it through review, and use the learner
CRM to monitor engagement and follow up appropriately.

------------------------------------------------------------------------

## 19. Deployment and operations

Suggested MVP hosting: - React frontend: Vercel or equivalent
static/React hosting. - Express API: Render, Railway, or a managed
Node.js host. - Authentication, Firestore, and Storage: Firebase. -
Source control: GitHub.

Before launch: 1. Create separate development and production Firebase
projects. 2. Configure authorized domains and sign-in providers. 3.
Configure Firestore indexes and security rules. 4. Configure Storage
rules and upload limits. 5. Configure backend secrets securely. 6.
Configure CORS for the frontend domain. 7. Enable API error logging and
service monitoring. 8. Test sign-in, enrollment, lesson progress,
submissions, and CRM permissions in production. 9. Set Firebase and
hosting budget alerts. 10. Back up critical content and document
recovery procedures.

Do not assume free-tier hosting is suitable for high traffic. Upgrade
based on observed demand, load testing, and reliability needs.

------------------------------------------------------------------------

## 20. Future roadmap

### Version 2

-   Video lessons as an optional content format.
-   Full Skill Passport with evidence-backed competencies.
-   Learner notes and bookmarks.
-   More assignment formats, including audio/video submissions.
-   Peer feedback and moderated learning groups.
-   Workshops and live practice sessions.
-   More detailed learner engagement analytics.
-   Email notifications and learner follow-up automation.

### Version 3

-   Instructor onboarding and course marketplace.
-   Institutional dashboards and cohort management.
-   Corporate learning programs.
-   Advanced personalized learning paths.
-   Verified credentials based on meaningful assessment.
-   Native mobile applications if demand justifies them.

------------------------------------------------------------------------

## 21. Instructions for Google Antigravity

Treat this document as the source of truth for the MVP.

### Required workflow

1.  Inspect the existing repository before changing files.
2.  Locate and inspect the original e-learning UI reference image.
3.  Extract its actual layout, palette, typography, spacing, and
    component patterns.
4.  If the reference image is unavailable, ask the user to provide it.
    Do not claim a pixel-accurate match without inspecting it.
5.  Use the color tokens in Section 13 as the baseline only when the
    reference does not specify different values.
6.  Implement the product as a content-first e-learning platform.
7.  Do not build simulations or video-first learning features.
8.  Implement learner CRM and activity tracking as a core MVP module.
9.  Propose the Firestore model, API contracts, routes, and milestone
    checklist before implementation.
10. Implement one phase at a time and test it before moving on.
11. Enforce security in Express and Firebase rules, not only in frontend
    UI.
12. Keep code modular, readable, and maintainable in JavaScript.
13. Do not add major features outside the MVP scope without approval.
14. Update README and technical documentation as implementation
    decisions are made.
15. At the end of each phase, report changed files, completed features,
    tests run, results, known issues, and the next phase.

### Initial instruction

Begin with **Phase 0 --- Repository and design inspection**. Do not
generate the entire application in one attempt.

First return: - Repository assessment. - Availability and analysis of
the earlier UI design reference. - Finalized design tokens. - Proposed
architecture. - Firestore data model. - API plan. - CRM activity-event
plan. - Development milestone checklist.

Wait for review before beginning the next implementation phase.
