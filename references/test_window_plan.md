# Quiz Assessment Test Window — Implementation Plan

**File:** `test_window_plan.md`  
**Purpose:** Implementation specification for the quiz-only assessment window  
**Status:** MVP scope  
**Target implementation:** Google Antigravity  
**Initial assessment configuration:** 10 questions, 3-warning termination, maximum 3 attempts

---

## 1. Product objective

Build a professional, distraction-free, full-screen quiz assessment experience for learners.

The assessment window must support:
- A 10-question quiz per attempt.
- Single-answer and multiple-answer MCQs.
- A countdown timer.
- Free navigation between questions.
- Automatic answer saving.
- A question review screen before submission.
- Browser activity monitoring with a strict three-warning termination policy.
- A live connectivity indicator showing network latency in milliseconds, inspired by the ping display in online games.
- A maximum of three attempts per learner per assessment.
- Automatic evaluation and result storage.

### Explicit scope exclusions

This MVP is **quiz-only**. Do not implement:
- Coding questions or a coding IDE.
- Monaco Editor or other code editors.
- Code compilation or execution.
- Hidden coding test cases or judge services.
- Circuit, network or hardware simulators.
- Full remote proctoring, webcam monitoring or screen recording.

Keep the architecture modular so coding assessments could be introduced later as a separate feature, but do not build or scaffold those features now.

---

## 2. Fixed MVP rules and defaults

| Setting | MVP requirement |
|---|---|
| Questions per attempt | Exactly 10 |
| Question presentation | One question at a time |
| Question navigation | Free navigation between all questions |
| Question types | Single-select and multiple-select MCQs |
| Timer | One combined timer for the complete assessment |
| Timer duration | Configurable by an authorized admin |
| Answer saving | Automatic |
| Warning threshold | Exactly 3 warnings |
| Third warning | Immediately terminate the active attempt |
| Maximum attempts | 3 per learner per assessment |
| Attempt after termination | Counts as a consumed attempt |
| Connectivity indicator | Visible in the top header |
| Connectivity refresh | Approximately every 10 seconds |
| Results | Automatically evaluated and stored |
| Device support | Desktop and tablet optimized; responsive mobile support with a screen-size notice |

The initial learner-facing assessment must contain 10 questions. The data model and admin configuration may support other question counts in a future release, but do not let an ordinary learner change the count.

---

## 3. Learner assessment experience

### 3.1 Assessment launch screen

Before starting, show:
- Assessment title.
- Course and module name, where applicable.
- Number of questions: 10.
- Total duration.
- Total marks.
- Negative marking information, if enabled.
- Maximum attempts and attempts remaining.
- Assessment rules and browser-monitoring notice.
- A clear **Start Assessment** action.

Starting an assessment must create an attempt on the server. Do not create the attempt only in browser state.

### 3.2 Full-screen assessment layout

Use a dedicated assessment route and a clean, professional examination layout. Do not render the assessment as a small modal inside the course page.

**Header**
- Platform logo or compact brand mark.
- Assessment title.
- Connectivity indicator with ping in milliseconds.
- Countdown timer.
- Warning counter, for example `0/3`.
- Exit control, with a confirmation step where appropriate.

**Question navigation panel**
- Numbered buttons from 1 to 10.
- Current question highlight.
- Answered status.
- Unanswered status.
- Marked-for-review status.
- A compact summary of answered and unanswered questions.

**Main question panel**
- Question number.
- Marks for the question.
- Question text.
- Optional image, diagram or table.
- Answer choices.
- Clear-selection action where appropriate.
- Mark-for-review action.

**Footer navigation**
- Previous.
- Save and Next / Next.
- Review and Submit.

The layout must work at common desktop and tablet widths. On small screens, use a collapsible question navigator and keep the question and answer controls usable.

### 3.3 Visual design direction

Use a premium, minimal and accessible interface:
- Clear typography and readable question spacing.
- Consistent spacing and alignment.
- Neutral surfaces with the platform's existing brand palette.
- Strong contrast for selected answers and status indicators.
- Avoid excessive animations and decorative elements.
- Use color plus icons or text labels; do not communicate status through color alone.
- Provide visible keyboard focus states.
- Ensure controls have accessible names and adequate hit areas.

Do not invent a new brand palette if the existing platform design system is already present. Inspect and reuse the project's current tokens and components.

---

## 4. Question types and answer interaction

### 4.1 Supported question types

1. **Single-select MCQ:** learner selects exactly one option.
2. **Multiple-select MCQ:** learner may select more than one option.

The question schema should be extensible for image-based and diagram-based question content. For the MVP, render question media safely where present.

### 4.2 Answer behaviour

- Selecting or changing an answer must trigger autosave.
- A learner may change an answer while the attempt is active.
- A learner may move between questions freely.
- A learner may mark a question for review and return later.
- Clearing an answer must be supported if the question type allows it.
- Do not reveal correct answers during an active attempt.
- Do not send answer keys or explanations to the learner's browser before the attempt is submitted and result visibility rules permit disclosure.

### 4.3 Question status definitions

| Status | Meaning |
|---|---|
| Not visited | Learner has not opened the question |
| Current | Question currently displayed |
| Answered | A valid answer has been saved |
| Unanswered | Question visited but no answer saved |
| Marked for review | Learner wants to revisit the question |

A question can be both answered and marked for review. Preserve both facts in the UI.

---

## 5. Strict warning and termination system

### 5.1 Fixed rule

The assessment has a maximum of **three warnings**.

- Warning 1: show a warning notification and record the event.
- Warning 2: show a stronger final-warning notification and record the event.
- Warning 3: immediately terminate the active attempt.

The third warning must not merely show a dismissible message while allowing the learner to continue. The server must transition the attempt to `TERMINATED`, save the termination time and reason, and reject further answer changes or submissions for that attempt.

### 5.2 Initial warning triggers

For the MVP, monitor these observable browser events:
- Exiting browser fullscreen after the assessment has entered fullscreen.
- Switching to another browser tab or hiding the assessment document.
- Leaving the assessment page or navigating away from the active assessment route.

Debounce and deduplicate events so one physical action does not accidentally generate multiple warnings. Define and test the event rules carefully.

### 5.3 Events that are not warnings

The following must be logged separately and must **not** automatically increase the misconduct warning count:
- Internet disconnection.
- High latency.
- A heartbeat request timing out.
- Temporary server/network failure.
- A browser refresh or reconnect by itself.

A genuine connectivity failure must not be treated as proof of cheating.

### 5.4 Warning UI

Each warning should:
- Clearly state what observable event was detected.
- Show the current count, such as `Warning 2 of 3`.
- Explain that the third warning terminates the attempt.
- Be accessible and readable.
- Be recorded with a server timestamp and event type.

On the third warning, display a termination screen after the server confirms the attempt is terminated. Explain that the attempt has been consumed and show the remaining attempt count, if any.

### 5.5 Enforcement and limitations

- Warning count must be stored and enforced server-side.
- Do not trust a client-supplied warning count.
- Refreshing the page must not reset warnings.
- Opening another tab must not create a fresh attempt.
- A terminated attempt must not be resumed.
- The learner must not be able to create more than three attempts by manipulating requests.
- Admins may inspect the event history. Any administrative reset or override should require an authorized action and be audit-logged.

Browser APIs can detect common visibility, fullscreen and navigation events. They cannot reliably detect every operating-system app switch, external device, screenshot or other cheating method. Describe this feature as **browser activity monitoring**, not complete proctoring. Do not claim that the system prevents all cheating.

---

## 6. Maximum three attempts

Enforce a maximum of **three attempts per learner per assessment**.

### 6.1 Attempt lifecycle

Each newly started assessment creates one attempt record.

Possible attempt statuses:
- `IN_PROGRESS`
- `SUBMITTED`
- `TERMINATED`
- `EXPIRED`

A submitted, terminated or expired attempt is a completed/consumed attempt for the attempt limit.

### 6.2 Attempt rules

- Attempt numbers are 1, 2 and 3.
- A terminated attempt consumes one attempt.
- A normally submitted attempt consumes one attempt.
- An expired attempt consumes one attempt if the server has reached the deadline and finalized it.
- A learner with three consumed attempts cannot start a fourth attempt.
- The attempt limit must be checked atomically on the server when creating an attempt.
- Prevent multiple concurrent active attempts for the same learner and assessment unless a future admin policy explicitly allows them.
- Reopening the same active attempt should resume it only if it remains valid and has not been terminated or expired.
- Do not silently create a new attempt when the learner refreshes or reconnects.

### 6.3 Attempt summary

Show the learner:
- Attempts used, for example `1 of 3`.
- Attempts remaining.
- Previous attempt status, where result visibility permits.
- Whether another attempt is available.

Do not expose private warning-event details to other learners.

---

## 7. Connectivity indicator — game-style ping display

### 7.1 Purpose

Display a compact live network-latency indicator in the top assessment header, visually inspired by the ping indicator in online multiplayer games.

Example presentation:

`[Wi-Fi icon] 42 ms`

When requests repeatedly time out or the connection is unavailable:

`[Disconnected icon] 999+`

The indicator measures **round-trip latency to the assessment service**, not the learner's internet bandwidth or general Wi-Fi speed.

### 7.2 Measurement method

- Provide a lightweight authenticated or attempt-scoped heartbeat endpoint.
- Send a small request approximately every 10 seconds while the assessment is active.
- Measure elapsed time in the browser using a monotonic timer such as `performance.now()`.
- Calculate round-trip time from request start to response.
- Do not include large response payloads.
- Avoid overlapping heartbeat requests.
- Stop or reduce polling when the assessment is no longer active.
- Use a request timeout. A timeout or failed request should display `999+` / unavailable.
- After connectivity returns, update the display when a successful heartbeat is received.

### 7.3 Initial display thresholds

| Round-trip latency | Display state |
|---|---|
| 0–100 ms | Excellent — green |
| 101–200 ms | Good — green |
| 201–400 ms | Moderate — yellow |
| 401–999 ms | Poor — red |
| Timeout / unavailable | `999+` — red / disconnected |

These are initial UI thresholds, not guarantees of a particular learner experience. Keep thresholds in one configuration location so they can be tuned.

### 7.4 Connectivity behaviour

- Show the latest latency in milliseconds.
- Show a tooltip or accessible label such as `Connection latency`.
- Distinguish `Checking`, `Connected`, `Poor connection` and `Disconnected`.
- Do not terminate an attempt solely because latency is high.
- Do not count connectivity loss as a warning.
- Keep answer autosave resilient to temporary failures.
- Queue unsent answer changes locally for retry, but do not treat local state as authoritative.
- Confirm successful persistence with the server before presenting an answer as saved.
- On reconnection, reconcile pending changes safely and avoid overwriting newer server data with stale local data.

### 7.5 Data minimization

Do not collect or display the learner's public IP address for this feature. Store only the minimal connectivity telemetry needed for debugging, if retention is required.

---

## 8. Timer, autosave and recovery

### 8.1 Timer

Use one combined timer for the full 10-question assessment.

- Duration is set by an authorized admin.
- The server stores `started_at` and `expires_at`.
- The server is authoritative for the deadline.
- The browser countdown is a display, not the source of truth.
- Refreshing must not reset the timer.
- Changing the device clock must not extend the assessment.
- Warn the learner shortly before expiry.
- At the deadline, the server finalizes the attempt as `EXPIRED` or applies the documented auto-submit policy.

Recommended default: automatically finalize the attempt at the deadline using the latest answers successfully persisted on the server. Make this policy explicit in the assessment configuration.

### 8.2 Autosave

- Save after every answer change.
- Use authenticated, attempt-scoped APIs.
- Use idempotent updates or version numbers to prevent duplicate writes.
- Show `Saving`, `Saved` and `Not synced` states.
- Retry transient failures with bounded backoff.
- Do not claim an answer is saved until the server confirms it.
- Keep a short-lived local recovery copy only as a convenience; server data remains authoritative.

### 8.3 Refresh and reconnection

When a learner refreshes:
1. Authenticate the learner.
2. Fetch the existing active attempt.
3. Verify its status and server deadline.
4. Restore saved answers, question status, marked-for-review flags and warning count.
5. Resume only if the attempt remains active and valid.

If the attempt has been terminated, submitted or expired, show the corresponding completion state instead of reopening it.

---

## 9. Review and final submission

Before final submission, show a review page or panel with:
- Total questions: 10.
- Answered count.
- Unanswered count.
- Marked-for-review count.
- A question-by-question status summary.
- A final submission confirmation.

Learners may return to questions before confirming submission because navigation is free.

On confirmation:
- Validate the active attempt on the server.
- Prevent duplicate submission.
- Evaluate answers using server-side answer keys.
- Save score and response summary.
- Transition the attempt to `SUBMITTED`.
- Reject subsequent answer changes for that attempt.

If the deadline is reached or the third warning occurs while the learner is reviewing, the corresponding server-side termination/expiry rule takes precedence.

---

## 10. Result screen

After submission, display the result according to the assessment's result-visibility setting.

Potential result fields:
- Score.
- Maximum marks.
- Percentage.
- Correct answers.
- Incorrect answers.
- Unanswered questions.
- Time taken.
- Topic-wise performance, if questions have topic tags.
- Question explanations, only when release is permitted.

For a terminated attempt, show:
- Attempt status: `TERMINATED`.
- A clear explanation that the third warning ended the attempt.
- Attempt number and attempts remaining.
- Score/result availability according to the platform's policy.

Do not automatically reveal correct answers or explanations if the assessment is configured to withhold them.

---

## 11. Admin CMS requirements

The admin CMS must support creating and managing quiz assessments.

### 11.1 Assessment settings

| Setting | MVP behaviour |
|---|---|
| Assessment title | Required |
| Course/module association | Optional association with a course or module |
| Instructions | Editable rich text or plain text |
| Question bank | Select existing questions or create new ones |
| Question count | 10 for the initial assessment |
| Duration | Configurable |
| Marks | Configurable per question |
| Negative marking | Enable/disable and configure value |
| Question randomization | Enable/disable |
| Option randomization | Enable/disable |
| Navigation | Free navigation in this MVP |
| Warning limit | Fixed at 3 in this MVP |
| Warning action | Terminate on third warning |
| Attempt limit | Fixed at 3 in this MVP |
| Result visibility | Immediate or delayed |
| Availability window | Optional start/end date and time |
| Status | Draft, published, archived |

Do not build a complicated rule builder for the MVP. Keep the three-warning and three-attempt policies fixed in the first release, while structuring the data model so future versions can make them configurable.

### 11.2 Question management

Each question should support:
- Question text.
- Question type.
- Options.
- Correct answer or correct answer set.
- Marks.
- Optional negative marks.
- Optional image/media reference.
- Topic or skill tag.
- Explanation.
- Difficulty label.
- Draft/published status.

Answer keys and explanations must never be exposed through learner-facing APIs before permitted release.

### 11.3 Admin attempt monitoring

Authorized admins should be able to inspect:
- Learner and assessment.
- Attempt number.
- Attempt start and end times.
- Attempt status.
- Score, if available.
- Warning count.
- Termination reason.
- Warning/activity event timeline.
- Connectivity failures, if retained.

Restrict access to this information using backend authorization and role checks.

---

## 12. Free MVP technology stack

Use the simplest practical stack. Do not introduce paid infrastructure or unnecessary services before the product has validated usage.

| Layer | MVP technology | Purpose |
|---|---|---|
| Frontend and server routes | Next.js + TypeScript | Learner UI, CMS UI and server endpoints |
| Styling | Tailwind CSS | Responsive styling |
| UI components | shadcn/ui | Accessible UI primitives |
| Database | Supabase PostgreSQL | Questions, attempts, answers, results and logs |
| Authentication | Supabase Auth | Learner/admin authentication |
| Database access | Supabase JavaScript client with server-side authorization | Query and persist data |
| Client state | React state; Zustand only if needed | Current question and UI state |
| Hosting | Cloudflare Workers with OpenNext adapter, or another currently eligible free deployment target | Host the Next.js application |
| Version control | GitHub | Source control and deployment workflow |
| Testing | Vitest + Playwright | Unit and browser-flow tests |

### 12.1 Keep the MVP lean

Do not add these unless a measured requirement justifies them:
- NestJS as a separate backend.
- Redis.
- Socket.IO.
- Microservices.
- Kubernetes.
- Separate analytics warehouse.
- Paid proctoring software.
- A dedicated message queue.
- A separate code execution service.

The heartbeat and autosave requests can use ordinary server endpoints for this MVP.

### 12.2 Free-tier cautions

Free plans have quotas, service restrictions, possible project pausing and changing terms. Check current provider documentation before deployment. A free plan is suitable for development and early validation, but is not automatically suitable for a high-stakes or high-traffic production exam.

Never expose Supabase service-role credentials or database secrets in browser code. Use server-side authorization and database Row Level Security (RLS). If using Cloudflare Workers, verify the current Next.js/OpenNext compatibility and deployment limits before implementation.

---

## 13. Suggested database design

The following is a logical MVP schema. Antigravity should inspect the existing project and adapt naming and relationships to its conventions rather than creating duplicate tables.

### 13.1 `assessments`

- `id`
- `title`
- `description`
- `instructions`
- `duration_seconds`
- `question_count` — 10 for this initial assessment
- `attempt_limit` — 3
- `warning_limit` — 3
- `negative_marking_enabled`
- `result_visibility`
- `available_from`
- `available_until`
- `status`
- `created_by`
- `created_at`
- `updated_at`

### 13.2 `questions`

- `id`
- `assessment_id` or association through a question-bank join table
- `question_text`
- `question_type`
- `marks`
- `negative_marks`
- `media_url`
- `topic_tag`
- `difficulty`
- `explanation`
- `status`
- `created_at`
- `updated_at`

### 13.3 `question_options`

- `id`
- `question_id`
- `option_text`
- `media_url`
- `display_order`

Keep correct-answer data in a protected server-only structure or protected columns that learner queries cannot select. Never return answer-key fields in the active assessment payload.

### 13.4 `assessment_attempts`

- `id`
- `assessment_id`
- `user_id`
- `attempt_number`
- `status`
- `started_at`
- `expires_at`
- `submitted_at`
- `terminated_at`
- `warning_count`
- `termination_reason`
- `score`
- `max_score`
- `created_at`
- `updated_at`

Add appropriate unique constraints and indexes. Enforce attempt creation transactionally so concurrent requests cannot create attempt 4 or duplicate active attempts.

### 13.5 `quiz_responses`

- `id`
- `attempt_id`
- `question_id`
- `selected_option_ids` or a normalized response relation
- `is_marked_for_review`
- `saved_at`
- `version` or equivalent concurrency field

Ensure one logical response per question per attempt.

### 13.6 `warning_events`

- `id`
- `attempt_id`
- `event_type`
- `event_description`
- `occurred_at`
- `server_recorded_at`
- `metadata` — minimal, non-sensitive diagnostic details

The server must validate and count eligible warning events. Do not let the browser directly set `warning_count`.

### 13.7 `connectivity_logs` (optional for MVP)

If operational diagnostics are needed, store minimal records such as:
- `attempt_id`
- `measured_latency_ms`
- `connection_state`
- `recorded_at`

Avoid storing every heartbeat indefinitely. Prefer aggregate or sampled diagnostics with a defined retention period. The UI can calculate and display ping without persisting every measurement.

### 13.8 `assessment_results`

This may be a separate table or fields on the attempt record, depending on the existing schema:
- `attempt_id`
- `score`
- `max_score`
- `percentage`
- `correct_count`
- `incorrect_count`
- `unanswered_count`
- `evaluated_at`

---

## 14. API behaviour

Use authenticated server endpoints. Exact routes may follow existing project conventions.

Suggested endpoint responsibilities:

| Endpoint | Responsibility |
|---|---|
| `GET /assessments/:id/overview` | Return learner-safe assessment details and attempts remaining |
| `POST /assessments/:id/attempts` | Atomically create an attempt if eligible |
| `GET /attempts/:id` | Return active attempt state and safe question payload |
| `PUT /attempts/:id/responses/:questionId` | Save or update an answer |
| `POST /attempts/:id/heartbeat` | Return a lightweight response for latency measurement |
| `POST /attempts/:id/warnings` | Submit a detected browser event for server validation |
| `GET /attempts/:id/review` | Return the learner's saved response statuses |
| `POST /attempts/:id/submit` | Finalize and evaluate an attempt |
| `GET /attempts/:id/result` | Return permitted result information |

### Server-side invariants

Every mutation must verify:
- The authenticated user owns the attempt, or has an authorized admin role.
- The attempt belongs to the requested assessment.
- The attempt is still `IN_PROGRESS`.
- The server deadline has not passed.
- The attempt has not already been terminated or submitted.
- The request is valid and within configured limits.

Use transactions for attempt creation, warning escalation, final submission and score persistence. Make submission idempotent so retries cannot create duplicate results.

---

## 15. Security and privacy requirements

- Enforce authorization on the server, not only by hiding UI controls.
- Enable and test Supabase Row Level Security.
- Never expose service-role keys or database credentials to the browser.
- Keep correct answers and explanations out of learner-facing active-test responses.
- Validate all incoming question IDs and option IDs against the active assessment.
- Calculate marks on the server.
- Enforce attempt and warning limits on the server.
- Rate-limit heartbeat and mutation endpoints appropriately.
- Prevent duplicate submissions and replayed mutations.
- Use secure session handling and HTTPS.
- Avoid collecting unnecessary device or network information.
- Define retention and deletion policies for attempts and activity logs.
- Record admin overrides in an audit trail.
- Do not claim the browser monitoring system is tamper-proof.

---

## 16. Failure handling

### Network loss

- Show a visible disconnected state and `999+` ping.
- Do not add a misconduct warning.
- Keep the last confirmed saved state visible.
- Retry pending saves safely after reconnection.
- Re-fetch authoritative attempt state after reconnecting.
- Do not extend the server deadline because of a client-side outage unless an explicit future policy allows it.

### Server failure

- Show a clear error state.
- Do not falsely show that an answer was saved.
- Retry safe operations with bounded backoff.
- Use idempotency for answer saves and submission.
- Preserve the attempt record and recover from the server state.

### Browser refresh

- Restore the same valid active attempt.
- Restore timer from the server deadline.
- Restore answers and review flags.
- Restore warning count from the server.
- Never create a new attempt just because the page reloaded.

### Third warning

- Submit the warning event.
- Have the server atomically increment the eligible warning count.
- On count 3, transition the attempt to `TERMINATED`.
- Reject further answer changes and submission.
- Display the termination state and attempts remaining.

---

## 17. Development milestones

### Milestone 1 — Project inspection and foundation
- Inspect the existing repository and stack.
- Reuse current authentication, design tokens and UI components.
- Identify existing assessment or course data models.
- Propose schema changes before implementation.

### Milestone 2 — Admin question management
- Create assessment configuration.
- Create and edit MCQ questions.
- Support single-select and multiple-select answers.
- Protect answer keys.

### Milestone 3 — Learner assessment UI
- Build launch screen.
- Build full-screen assessment layout.
- Build question navigator.
- Build answer selection and mark-for-review interactions.

### Milestone 4 — Attempt and timer engine
- Create attempts on the server.
- Enforce the three-attempt limit.
- Implement server-authoritative timer.
- Implement autosave and refresh recovery.

### Milestone 5 — Warning system
- Detect supported browser events.
- Implement warning notifications.
- Enforce third-warning termination on the server.
- Persist warning history.

### Milestone 6 — Connectivity indicator
- Implement heartbeat endpoint.
- Measure round-trip latency.
- Show latency states and `999+` timeout state.
- Verify network failures do not increase warning count.

### Milestone 7 — Review, submission and results
- Build review screen.
- Implement idempotent submission.
- Evaluate answers server-side.
- Store and display permitted results.

### Milestone 8 — QA and deployment
- Test security and authorization.
- Test concurrent attempt creation.
- Test refresh and network recovery.
- Test warning escalation and termination.
- Test desktop, tablet and mobile layouts.
- Verify deployment configuration and free-tier limits.

---

## 18. Acceptance test checklist

### Assessment setup
- [ ] Admin can create and publish a quiz assessment.
- [ ] The initial assessment presents exactly 10 questions.
- [ ] Assessment duration is configurable.
- [ ] Single-select and multiple-select questions work.
- [ ] Correct answers are not exposed to the learner before permitted release.

### Assessment UI
- [ ] Assessment opens in a dedicated, distraction-free interface.
- [ ] Header shows title, timer, warning counter and connectivity indicator.
- [ ] Question navigator displays all 10 questions.
- [ ] Current, answered, unanswered and review states are distinct.
- [ ] Previous and next navigation work.
- [ ] Learner can mark and revisit questions.
- [ ] Layout works on supported desktop and tablet sizes.

### Warnings
- [ ] Fullscreen exit is detected where browser APIs permit.
- [ ] Tab visibility changes are detected.
- [ ] Leaving the assessment route is detected where possible.
- [ ] Duplicate events are debounced.
- [ ] Warning 1 is recorded and displayed.
- [ ] Warning 2 is recorded and displayed as final warning.
- [ ] Warning 3 terminates the attempt.
- [ ] Terminated attempt cannot be resumed or submitted.
- [ ] Refreshing does not reset warning count.
- [ ] Connectivity failures do not count as warnings.

### Attempts
- [ ] First attempt can be created.
- [ ] Second attempt can be created when eligible.
- [ ] Third attempt can be created when eligible.
- [ ] Fourth attempt is rejected.
- [ ] A terminated attempt consumes an attempt.
- [ ] An expired attempt follows the configured consumption policy.
- [ ] Concurrent requests cannot exceed the attempt limit.
- [ ] Refreshing resumes the same active attempt rather than creating a new one.

### Connectivity
- [ ] Ping is measured against the assessment service.
- [ ] Ping refreshes approximately every 10 seconds.
- [ ] Latency thresholds map to the correct UI states.
- [ ] Timeout displays `999+` / disconnected.
- [ ] Reconnection restores the live indicator.
- [ ] High latency alone does not terminate an attempt.
- [ ] No IP address is exposed in the learner UI.

### Timer and persistence
- [ ] Timer is based on the server deadline.
- [ ] Browser clock changes do not extend the attempt.
- [ ] Answers autosave.
- [ ] UI distinguishes saved from unsaved answers.
- [ ] Network recovery reconciles pending saves safely.
- [ ] Deadline finalizes the attempt correctly.

### Submission and results
- [ ] Review screen counts answered and unanswered questions correctly.
- [ ] Submission confirmation works.
- [ ] Duplicate submissions do not create duplicate results.
- [ ] Scores are calculated on the server.
- [ ] Result visibility settings are respected.
- [ ] Termination reason and attempt history are available to authorized admins.

### Security
- [ ] Learners cannot read another learner's attempts.
- [ ] Learners cannot modify another learner's answers.
- [ ] Learners cannot change warning or attempt counts directly.
- [ ] Hidden answer keys are not present in learner API responses.
- [ ] Supabase RLS policies are tested.
- [ ] Secrets are not exposed in client bundles.

---

## 19. Instructions for Google Antigravity

1. Read this complete specification before changing the repository.
2. Inspect the existing project structure, framework, dependencies, database schema, authentication and design system.
3. Do not replace working project infrastructure without a clear technical reason.
4. If the current project differs from the suggested MVP stack, report the difference and propose the smallest compatible implementation.
5. First produce an implementation proposal covering:
   - Existing files and modules to reuse.
   - New files and modules required.
   - Database migrations and RLS policies.
   - API routes and authorization.
   - UI routes and components.
   - Deployment compatibility and free-tier constraints.
6. Do not begin a broad rewrite. Implement in the milestones in this document.
7. Keep the scope quiz-only. Do not add a coding IDE, code execution, hardware simulators or unrelated features.
8. Enforce warning termination, attempt limits, timer deadlines, answer validation and scoring on the server.
9. Do not trust client-side state for security-sensitive decisions.
10. Add automated tests for the acceptance checklist, especially the third-warning termination and three-attempt limit.
11. Use realistic seed data only in development. Do not ship mock assessment results or fake connectivity readings in production.
12. Do not hardcode secrets. Use environment variables and document required configuration.
13. Update project documentation and report completed work, tests run, known limitations and deployment steps at each milestone.
14. If a requirement conflicts with the existing architecture or cannot be implemented reliably in a browser, explain the limitation and propose a safe alternative instead of silently weakening the requirement.

---

## 20. MVP completion criteria

The MVP is complete when an authorized admin can publish a 10-question quiz and an authenticated learner can:

1. Start an eligible attempt.
2. Answer and navigate through all questions.
3. See autosave status, timer, warning count and live connectivity latency.
4. Review answers before submission.
5. Submit and receive a correctly calculated result.
6. Be terminated on the third eligible warning, with the attempt consumed.
7. Use no more than three attempts for that assessment.

All critical rules must be enforced and tested server-side. The learner interface must never be the sole enforcement mechanism.
