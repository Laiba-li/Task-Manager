# Smart Student Dashboard — Software Requirements Specification (SRS)

**Document Version:** 1.0.0
**Date:** April 15, 2026
**Author:** Development Team
**Status:** Released

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Stakeholders](#3-stakeholders)
4. [Functional Requirements](#4-functional-requirements)
   - 4.1 [Task Management](#41-task-management)
   - 4.2 [Dashboard Overview](#42-dashboard-overview)
   - 4.3 [Weekly Tracker](#43-weekly-tracker)
   - 4.4 [Monthly Tracker](#44-monthly-tracker)
   - 4.5 [Notifications](#45-notifications)
   - 4.6 [Theme & UI Controls](#46-theme--ui-controls)
5. [Non-Functional Requirements](#5-non-functional-requirements)
   - 5.1 [Performance](#51-performance)
   - 5.2 [Usability](#52-usability)
   - 5.3 [Reliability](#53-reliability)
   - 5.4 [Maintainability](#54-maintainability)
   - 5.5 [Scalability](#55-scalability)
   - 5.6 [Security](#56-security)
   - 5.7 [Accessibility](#57-accessibility)
   - 5.8 [Compatibility](#58-compatibility)
6. [System Architecture](#6-system-architecture)
7. [Data Model](#7-data-model)
8. [Component Inventory](#8-component-inventory)
9. [Technology Stack](#9-technology-stack)
10. [Constraints & Assumptions](#10-constraints--assumptions)
11. [Glossary](#11-glossary)
12. [Use Cases](#12-use-cases)
13. [UI/UX Specifications](#13-uiux-specifications)
14. [Testing Requirements](#14-testing-requirements)
15. [Deployment & Environment Setup](#15-deployment--environment-setup)
16. [Future Roadmap](#16-future-roadmap)
17. [Revision History](#17-revision-history)

---

## 1. Introduction

### 1.1 Purpose

This document defines the complete software requirements for the **Smart Student Dashboard** — a single-page web application that helps students organize, track, and analyze their academic tasks. It serves as the authoritative reference for developers, testers, and stakeholders throughout the project lifecycle.

### 1.2 Scope

The Smart Student Dashboard enables students to:

- Create, update, and delete academic tasks with priority levels and due dates.
- Monitor task completion progress through a real-time dashboard.
- Visualize productivity trends through weekly and monthly chart-based trackers.
- Receive contextual notifications about upcoming or overdue tasks.
- Toggle between light and dark visual themes for comfortable usage in any environment.

The application operates entirely on the client side (browser) with no backend server or external database in its current version. All state is held in React component memory during a session.

### 1.3 Intended Audience

| Audience | Usage |
|---|---|
| **Students** | Primary end users managing their academic workload |
| **Frontend Developers** | Building, maintaining, and extending the codebase |
| **QA Engineers** | Verifying features against defined requirements |
| **Project Managers** | Tracking scope, progress, and feature delivery |

### 1.4 Definitions & Acronyms

| Term | Definition |
|---|---|
| **SPA** | Single-Page Application |
| **CRUD** | Create, Read, Update, Delete |
| **SRS** | Software Requirements Specification |
| **UI** | User Interface |
| **UX** | User Experience |
| **JSX** | JavaScript XML — React's HTML-in-JS syntax |
| **Context API** | React's built-in global state management mechanism |

---

## 2. System Overview

The Smart Student Dashboard is a **React 19** SPA built with **Vite** as the build tool and **Tailwind CSS v4** for styling. Navigation between pages is implemented via in-memory state (no URL routing), and global application state is distributed through React's Context API.

### 2.1 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                       Browser (Client)                               │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐        │
│  │                      App.jsx (Root)                      │        │
│  │   ┌────────────┐  ┌─────────┐  ┌──────────┐  ┌───────┐  │        │
│  │   │  Dashboard │  │  Tasks  │  │ Weekly   │  │Monthly│  │        │
│  │   │   (page)   │  │  (page) │  │ Tracker  │  │Tracker│  │        │
│  │   └────────────┘  └─────────┘  └──────────┘  └───────┘  │        │
│  │                                                          │        │
│  │   ┌──────────────────────────────────────────────────┐   │        │
│  │   │               TaskContext (Global State)         │   │        │
│  │   │  tasks │ notifications │ weeklyData │ monthlyData│   │        │
│  │   └──────────────────────────────────────────────────┘   │        │
│  └──────────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 Navigation Model

The application uses a **tab-based single-page navigation** model. A persistent header contains four navigation buttons that conditionally render one page at a time without any URL route changes.

| Tab | Component | Description |
|---|---|---|
| Dashboard | `Dashboard.jsx` | Overview of tasks, notifications, and weekly chart |
| Tasks | `Tasks.jsx` | Full CRUD task manager with filtering and sorting |
| Weekly Tracker | `WeeklyTracker.jsx` | Daily task activity bar chart and progress summary |
| Monthly Tracker | `MonthlyTracker.jsx` | Multi-week line + bar charts with monthly summary |

---

## 3. Stakeholders

| Stakeholder | Role | Interest |
|---|---|---|
| **Students** | End User | Efficiently manage academic tasks and deadlines |
| **Developers** | Builder | Clean, maintainable, and extensible codebase |
| **QA Engineers** | Tester | Verifiable, deterministic behavior across all features |
| **Project Owner** | Sponsor | Timely delivery, feature completeness, quality |

---

## 4. Functional Requirements

Functional requirements describe **what the system must do**. Each requirement is identified with a unique ID and categorized by feature area.

---

### 4.1 Task Management

The Task Manager page (`Tasks.jsx`) is the core of the application, providing full CRUD operations and advanced filtering capabilities.

#### FR-TM-01 — Create Task

- The system **shall** provide an "Add Task" button that opens a modal dialog.
- The modal **shall** include the following input fields:
  - **Task Name** (text input, required)
  - **Description** (textarea, optional)
  - **Due Date** (date picker, required)
  - **Priority** (dropdown: High / Medium / Low, default: Medium)
- The system **shall** validate that Task Name and Due Date are not empty before saving.
- On successful submission, the new task **shall** be appended to the task list with a `pending` status and a unique `id` generated via `Date.now()`.
- The modal **shall** close automatically after a successful save.

#### FR-TM-02 — Read / Display Tasks

- The system **shall** display all tasks in a tabular layout with the following columns:
  - Checkbox (for selection)
  - Task Name & Description
  - Priority Badge (color-coded)
  - Status Toggle Button
  - Due Date & Urgency Label
  - Edit & Delete Actions
- Tasks **shall** display a contextual urgency label indicating:
  - **Overdue** (red) — due date has passed
  - **Due Today** (amber) — due date is today
  - **Due Tomorrow** (amber) — due date is tomorrow
  - **In N days** (gray) — all other future due dates
- Completed tasks **shall** render with reduced opacity and a strikethrough on the task name.

#### FR-TM-03 — Update Task

- Each task row **shall** include an edit (✏️) button that opens the edit modal pre-populated with the task's current values.
- The edit modal **shall** include an additional **Status** dropdown (Pending / Completed) not present in the add modal.
- On save, the task's fields **shall** be updated in place while preserving its `id`.

#### FR-TM-04 — Delete Task

- Each task row **shall** include a delete (🗑️) button.
- Clicking delete **shall** open a confirmation modal before any data is removed.
- The confirmation modal **shall** display the number of tasks being deleted.
- On confirmation, the task **shall** be permanently removed from the task list.

#### FR-TM-05 — Toggle Task Status

- Clicking the status badge in any task row **shall** toggle the task's status between `pending` and `completed` without opening a modal.

#### FR-TM-06 — Bulk Selection & Bulk Delete

- A master checkbox in the table header **shall** select or deselect all currently displayed tasks.
- Individual task checkboxes **shall** allow granular row selection.
- When one or more tasks are selected, a **"Delete (N)"** bulk-action button **shall** appear.
- Clicking bulk delete **shall** trigger the same confirmation modal, showing the count of selected tasks.
- On confirmation, all selected tasks **shall** be deleted and the selection state cleared.

#### FR-TM-07 — Search Tasks

- The task toolbar **shall** include a real-time search input.
- Search **shall** filter the task list by matching the query against both the task name and description (case-insensitive).
- A clear (✕) button **shall** appear inside the search box when a query is active, resetting the filter instantly.

#### FR-TM-08 — Filter Tasks

- The task toolbar **shall** provide two dropdown filters:
  1. **Priority Filter**: All Priorities / High / Medium / Low
  2. **Status Filter**: All Statuses / Pending / Completed
- Filters **shall** be combinable with each other and with the search query simultaneously.

#### FR-TM-09 — Sort Tasks

- The task toolbar **shall** provide a sort dropdown with the following options:
  - **Sort by Due Date** (ascending, default)
  - **Sort by Priority** (High → Medium → Low)
  - **Sort by Name** (alphabetical A–Z)
- Sorting **shall** apply to the already filtered/searched result set.

#### FR-TM-10 — Task Statistics Summary

- The task page **shall** display four stat cards at the top:
  - **Total Tasks** — count of all tasks
  - **Completed** — count of completed tasks
  - **High Priority** — count of incomplete high-priority tasks
  - **Overdue** — count of incomplete tasks past their due date
- Statistics **shall** update in real-time as tasks are added, edited, or deleted.

#### FR-TM-11 — Task Table Footer

- The table footer **shall** display "Showing X of Y tasks" reflecting the current filtered count vs total count.
- When items are selected, it **shall** also show "N selected".

---

### 4.2 Dashboard Overview

The Dashboard page (`Dashboard.jsx`) provides an at-a-glance summary of the student's workload.

#### FR-DB-01 — Quick Add Task Form

- The dashboard **shall** include the `AddTaskForm` component, allowing users to add tasks directly from the dashboard without navigating to the Tasks page.
- The form **shall** include Task Name, Due Date, and Priority fields.

#### FR-DB-02 — Task List Widget

- The dashboard **shall** include a compact `TaskList` widget displaying a summary of tasks.

#### FR-DB-03 — Notification Widget

- The dashboard **shall** include the `NotificationPanel` component showing active alerts.

#### FR-DB-04 — Progress Ring

- The dashboard **shall** display a circular SVG progress ring showing the percentage of completed tasks (`weeklyProgress`).
- The ring **shall** animate smoothly when the completion percentage changes.

#### FR-DB-05 — Weekly Activity Bar Chart

- The dashboard **shall** include a `BarChart` component visualizing task activity for each day of the current week (Mon–Sun).

#### FR-DB-06 — Summary Stat Cards

- The dashboard **shall** display four stat cards:
  - Tasks Completed
  - Total Tasks
  - Progress (percentage)
  - Study Streak (days)

---

### 4.3 Weekly Tracker

#### FR-WT-01 — Weekly Bar Chart

- The Weekly Tracker **shall** render a `BarChart` component displaying the number of tasks tracked per day of the week.

#### FR-WT-02 — Study Streak Card

- The page **shall** display a card showing the user's current study streak in days (e.g., "5 Days 🔥").

#### FR-WT-03 — Weekly Task Count Card

- The page **shall** display a card showing the total tasks completed in the current week.

#### FR-WT-04 — Weekly Progress Bar

- The page **shall** display a horizontal progress bar showing the percentage of weekly tasks completed.

#### FR-WT-05 — Monthly Summary Snapshot

- The page **shall** display a summary panel with:
  - Total tasks completed in the month
  - Best week (highest task count)
  - Monthly progress percentage as a progress bar
  - A `DonutChart` SVG showing completion percentage

---

### 4.4 Monthly Tracker

#### FR-MT-01 — Weekly Line Chart (within Monthly view)

- The Monthly Tracker **shall** render a `LineChart` component plotting weekly task counts across four weeks, sourced from `monthlyData` in `TaskContext`.

#### FR-MT-02 — Monthly Bar Chart

- The page **shall** render a `BarChart` for a more granular per-week breakdown of task activity.

#### FR-MT-03 — Monthly Progress Summary

- The page **shall** display:
  - Total tasks completed for the month
  - Monthly progress percentage with a horizontal progress bar
  - A `DonutChart` SVG showing the same percentage

---

### 4.5 Notifications

#### FR-NT-01 — Notification Display

- The system **shall** display a list of notifications sourced from `TaskContext`, each having a `type` (warning / info / success) and a `message`.

#### FR-NT-02 — Dismiss Notification

- Each notification **shall** include a dismiss mechanism.
- Dismissed notifications **shall** be hidden from the panel (`dismissed: true`).

---

### 4.6 Theme & UI Controls

#### FR-UI-01 — Light / Dark Mode Toggle

- The application **shall** provide a theme toggle button in the header.
- The button **shall** display "🌙 Dark Mode" in light mode and "☀️ Light Mode" in dark mode.
- Toggling **shall** apply the `dark` CSS class to the root container, activating all Tailwind dark-mode variants instantly across the entire application.

#### FR-UI-02 — Navigation

- The header **shall** display four navigation tabs (Dashboard, Tasks, Weekly Tracker, Monthly Tracker).
- The active tab **shall** be visually highlighted with a blue background pill.
- Clicking a tab **shall** render the corresponding page component and highlight the active tab.

---

## 5. Non-Functional Requirements

Non-functional requirements define **quality attributes** — how the system must perform and behave beyond mere feature delivery.

---

### 5.1 Performance

| ID | Requirement |
|---|---|
| **NFR-PERF-01** | The application **shall** achieve a First Contentful Paint (FCP) of under **1.5 seconds** on a modern desktop browser with a standard broadband connection. |
| **NFR-PERF-02** | All in-page navigation transitions (switching tabs) **shall** complete in under **100 milliseconds** with no visible loading indicators. |
| **NFR-PERF-03** | Task list filtering, searching, and sorting operations **shall** produce results in under **50 milliseconds** for up to 500 tasks, leveraging React's `useMemo` hook for memoized computation. |
| **NFR-PERF-04** | Modal dialogs (Add Task, Edit Task, Delete Confirm) **shall** appear with a smooth animation completing within **200 milliseconds**. |
| **NFR-PERF-05** | The production build bundle size **shall** not exceed **500 KB** (gzipped) unless explicitly approved. |

---

### 5.2 Usability

| ID | Requirement |
|---|---|
| **NFR-USE-01** | The interface **shall** follow a consistent visual language: rounded cards (`rounded-2xl`), shadow depth (`shadow-sm`), and a neutral-gray base palette with blue accent colors. |
| **NFR-USE-02** | All interactive elements (buttons, dropdowns, inputs) **shall** provide hover, focus, and active visual states to communicate interactivity clearly. |
| **NFR-USE-03** | Form validation errors **shall** appear inline beneath their respective fields with descriptive messages (e.g., "Task name is required"). |
| **NFR-USE-04** | The empty state for the task list (no results after filtering) **shall** display a recognizable icon, a short message, and a suggestion to the user. |
| **NFR-USE-05** | The application layout **shall** be responsive, adapting gracefully from mobile (1-column) to tablet (2-column) to desktop (3-column) using Tailwind's `md:` and `lg:` breakpoints. |
| **NFR-USE-06** | The application **shall** use emoji icons to reinforce meaning in labels, status badges, and navigation tabs, reducing reliance on text-only cues. |
| **NFR-USE-07** | All destructive actions (delete) **shall** be gated behind a confirmation dialog to prevent accidental data loss. |

---

### 5.3 Reliability

| ID | Requirement |
|---|---|
| **NFR-REL-01** | The application **shall** function correctly within the browser session for the duration of use without crashes or unhandled errors under normal operating conditions. |
| **NFR-REL-02** | The task list state **shall** remain consistent after any sequence of add, edit, delete, and toggle operations. No ghost tasks or inconsistent IDs shall be produced. |
| **NFR-REL-03** | Unique task IDs **shall** be generated using `Date.now()`, which provides sufficient uniqueness for in-session use. |
| **NFR-REL-04** | The application **shall** gracefully handle an empty task list by rendering an informative empty-state UI instead of errors. |

---

### 5.4 Maintainability

| ID | Requirement |
|---|---|
| **NFR-MAIN-01** | The codebase **shall** follow a clearly defined folder structure: `src/pages/` for top-level pages, `src/components/` for reusable UI elements, and `src/context/` for global state. |
| **NFR-MAIN-02** | All global application state **shall** be managed through a single `TaskContext`, exposing a well-defined API (`addTask`, `updateTask`, `deleteTask`, `toggleTask`, `dismissNotification`). |
| **NFR-MAIN-03** | Components **shall** be single-responsibility: each component addresses one UI concern (e.g., `BarChart` only renders a bar chart; `NotificationPanel` only handles notifications). |
| **NFR-MAIN-04** | The codebase **shall** be linted using ESLint with the `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` plugins to enforce React best practices. |
| **NFR-MAIN-05** | No business logic **shall** be embedded directly in JSX. Derived computations (e.g., urgency labels, priority ordering) **shall** be extracted into helper functions. |

---

### 5.5 Scalability

| ID | Requirement |
|---|---|
| **NFR-SCAL-01** | The component architecture **shall** allow new pages to be added as additional entries in the navigation array in `App.jsx` and new page components in `src/pages/`. |
| **NFR-SCAL-02** | The `TaskContext` API **shall** be extendable to support additional task fields (e.g., tags, attachments, recurrence) without breaking existing consumers. |
| **NFR-SCAL-03** | Chart components (`BarChart`, `LineChart`) **shall** accept generic `data`, `xKey`, `yKey`, and `height` props, making them reusable for any dataset without modification. |
| **NFR-SCAL-04** | Should the task count grow beyond in-memory performance limits, the architecture **shall** be ready to integrate a persistence layer (e.g., `localStorage`, IndexedDB, or a REST API) with minimal refactoring, as all state is centralized in `TaskContext`. |

---

### 5.6 Security

| ID | Requirement |
|---|---|
| **NFR-SEC-01** | No sensitive user data (passwords, personal IDs, financial data) **shall** be collected or stored by this application in its current version. |
| **NFR-SEC-02** | All task inputs **shall** be rendered using React's built-in JSX escaping, preventing XSS (Cross-Site Scripting) vulnerabilities from user-supplied text. |
| **NFR-SEC-03** | No external API calls or third-party scripts **shall** be loaded without explicit developer review and approval. |
| **NFR-SEC-04** | The production build **shall** not expose source maps or debug tooling to end users. |

---

### 5.7 Accessibility

| ID | Requirement |
|---|---|
| **NFR-ACC-01** | All form inputs **shall** have associated `<label>` elements for screen reader compatibility. |
| **NFR-ACC-02** | All interactive buttons **shall** be keyboard-focusable and operable via the Enter/Space keys as per HTML default behavior. |
| **NFR-ACC-03** | Status badge buttons in the task table **shall** include a `title` attribute providing a plain-text description of the action (e.g., "Click to toggle status"). |
| **NFR-ACC-04** | Color **shall not** be the sole indicator of meaning; text labels **shall** always accompany colored badges (e.g., "High", "Pending"). |
| **NFR-ACC-05** | The application **shall** provide sufficient color contrast ratios between text and backgrounds to satisfy WCAG 2.1 Level AA guidelines in both light and dark modes. |

---

### 5.8 Compatibility

| ID | Requirement |
|---|---|
| **NFR-COMP-01** | The application **shall** be compatible with the latest stable versions of Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari. |
| **NFR-COMP-02** | The application **shall** render correctly at viewport widths from **375px** (mobile) to **1440px** (wide desktop) without horizontal overflow or broken layouts. |
| **NFR-COMP-03** | The application **shall** use CSS features and JavaScript APIs that are supported in browsers with **>= 95% global usage** (based on the Browserslist defaults). |
| **NFR-COMP-04** | The application **shall not** require any browser plugins or extensions to function correctly. |
| **NFR-COMP-05** | The build toolchain **shall** use **Vite 8** with the `@vitejs/plugin-react` plugin and **PostCSS** with Autoprefixer for vendor-prefixed CSS compatibility. |

---

## 6. System Architecture

### 6.1 Directory Structure

```
my-app/
├── index.html                    # HTML entry point
├── vite.config.js                # Vite build configuration
├── tailwind.config.cjs           # Tailwind CSS configuration
├── postcss.config.cjs            # PostCSS configuration (autoprefixer)
├── eslint.config.js              # ESLint rules
├── package.json                  # Dependencies and scripts
│
└── src/
    ├── main.jsx                  # React DOM root render
    ├── App.jsx                   # Root component: layout, navigation, theme
    ├── App.css                   # Global application styles
    ├── index.css                 # CSS reset and base Tailwind directives
    │
    ├── context/
    │   └── TaskContext.jsx       # Global state: tasks, notifications, analytics
    │
    ├── pages/
    │   ├── Dashboard.jsx         # Dashboard overview page
    │   ├── Tasks.jsx             # Full CRUD task manager page
    │   ├── WeeklyTracker.jsx     # Weekly analytics page
    │   └── MonthlyTracker.jsx    # Monthly analytics page
    │
    └── components/
        ├── AddTaskForm.jsx       # Quick-add task form (used on Dashboard)
        ├── TaskList.jsx          # Compact task list widget
        ├── NotificationPanel.jsx # Dismissable notification feed
        ├── BarChart.jsx          # Reusable SVG bar chart
        └── LineChart.jsx         # Reusable SVG line chart
```

### 6.2 State Management Flow

```
TaskContext (Provider in App.jsx)
│
├── State: tasks[]              ← core task array
├── State: notifications[]      ← alert messages
├── Derived: completedTasks     ← computed from tasks
├── Derived: totalTasks         ← computed from tasks
├── Derived: weeklyProgress     ← completedTasks / totalTasks * 100
├── Static: weeklyData[]        ← daily task activity data
├── Static: monthlyData[]       ← weekly task activity data
├── Static: studyStreak         ← days of consecutive activity
│
├── addTask(task)               ← appends new task
├── updateTask(id, fields)      ← patches existing task
├── deleteTask(id)              ← removes task by id
├── toggleTask(id)              ← flips pending ↔ completed
└── dismissNotification(id)     ← marks notification dismissed
```

### 6.3 Page Rendering Strategy

The application does not use a router library. Page rendering is controlled by the `activePage` state in `App.jsx`:

```jsx
{activePage === "dashboard" && <Dashboard />}
{activePage === "tasks"     && <Tasks />}
{activePage === "weekly"    && <WeeklyTracker />}
{activePage === "monthly"   && <MonthlyTracker />}
```

---

## 7. Data Model

### 7.1 Task Object

```json
{
  "id":          1,              // number — unique identifier (Date.now() on create)
  "name":        "string",       // string — required, task title
  "description": "string",       // string — optional, task details
  "dueDate":     "YYYY-MM-DD",   // string — required, ISO date format
  "status":      "pending",      // enum: "pending" | "completed"
  "priority":    "high"          // enum: "high" | "medium" | "low"
}
```

### 7.2 Notification Object

```json
{
  "id":        1,          // number — unique identifier
  "type":      "warning",  // enum: "warning" | "info" | "success"
  "message":   "string",   // string — human-readable alert text
  "dismissed": false       // boolean — whether the user has dismissed it
}
```

### 7.3 Weekly Data Object

```json
{
  "day":   "Mon",  // string — abbreviated day name
  "tasks": 4       // number — tasks logged on that day
}
```

### 7.4 Monthly Data Object

```json
{
  "week":  "Week 1",  // string — week label
  "tasks": 23         // number — tasks logged in that week
}
```

---

## 8. Component Inventory

| Component | File | Type | Purpose |
|---|---|---|---|
| `App` | `App.jsx` | Root | Layout shell, navigation, theme toggle |
| `TaskProvider` | `TaskContext.jsx` | Context | Global state management |
| `Dashboard` | `pages/Dashboard.jsx` | Page | Overview: quick-add, task list, notifications, chart |
| `Tasks` | `pages/Tasks.jsx` | Page | Full CRUD task manager with filters and sorting |
| `WeeklyTracker` | `pages/WeeklyTracker.jsx` | Page | Weekly activity charts and progress summary |
| `MonthlyTracker` | `pages/MonthlyTracker.jsx` | Page | Monthly activity charts and completion summary |
| `AddTaskForm` | `components/AddTaskForm.jsx` | UI | Quick task creation form for the dashboard |
| `TaskList` | `components/TaskList.jsx` | UI | Compact task display widget |
| `NotificationPanel` | `components/NotificationPanel.jsx` | UI | Dismissable alerts feed |
| `BarChart` | `components/BarChart.jsx` | UI | Generic reusable SVG bar chart |
| `LineChart` | `components/LineChart.jsx` | UI | Generic reusable SVG line chart |
| `TaskModal` | (inline in `Tasks.jsx`) | UI | Add / Edit task modal dialog |
| `DeleteConfirmModal` | (inline in `Tasks.jsx`) | UI | Delete confirmation modal |
| `StatCard` | (inline in `Dashboard.jsx`) | UI | Colored metric display card |
| `ProgressRing` | (inline in `Dashboard.jsx`) | UI | SVG circular progress indicator |
| `DonutChart` | (inline in `WeeklyTracker.jsx`, `MonthlyTracker.jsx`) | UI | SVG donut chart for completion % |

---

## 9. Technology Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **UI Framework** | React | 19.2.4 | Component-based SPA rendering |
| **Build Tool** | Vite | 8.0.0 | Dev server, HMR, production bundling |
| **Styling** | Tailwind CSS | 4.2.1 | Utility-first responsive styling |
| **CSS Processing** | PostCSS + Autoprefixer | 8.5.8 / 10.4.27 | Vendor prefixing and CSS transforms |
| **Linting** | ESLint | 9.39.4 | Code quality enforcement |
| **React Lint Plugins** | eslint-plugin-react-hooks, eslint-plugin-react-refresh | 7.0.1 / 0.5.2 | React-specific lint rules |
| **Language** | JavaScript (ESM) | ES2022+ | Application logic |
| **Rendering** | React DOM | 19.2.4 | DOM binding for React |

### 9.1 Development Scripts

| Script | Command | Description |
|---|---|---|
| Start Dev Server | `npm run dev` | Launches Vite dev server with HMR at `localhost:5173` |
| Production Build | `npm run build` | Compiles and bundles the app into `dist/` |
| Preview Build | `npm run preview` | Serves the production `dist/` locally |
| Lint | `npm run lint` | Runs ESLint across all source files |

---

## 10. Constraints & Assumptions

### 10.1 Constraints

| ID | Constraint |
|---|---|
| **CON-01** | The application has no backend server; all data exists only in browser memory for the duration of the session. Refreshing the page resets all tasks to the initial seed data. |
| **CON-02** | Task IDs are generated via `Date.now()`, which is suitable for single-user in-session uniqueness but would require a UUID library or server-side ID generation in a multi-user environment. |
| **CON-03** | Chart data (`weeklyData`, `monthlyData`) and study streak values are currently static seed data in `TaskContext`. They do not automatically derive from real task history. |
| **CON-04** | The application requires a modern browser with JavaScript enabled. It does not provide a server-side rendered fallback. |
| **CON-05** | There is no user authentication or authorization. The application treats all users as the same single student account. |

### 10.2 Assumptions

| ID | Assumption |
|---|---|
| **ASM-01** | The student is the sole user of their own instance of the application (no multi-tenancy). |
| **ASM-02** | Academic tasks are relatively few (< 200 active tasks) in any given session, keeping in-memory operations fast. |
| **ASM-03** | Due dates are entered in the browser's local timezone and compared against the user's local system clock. |
| **ASM-04** | The target device has sufficient screen real estate to render the two-panel dashboard layout on tablet and desktop. Mobile usage is supported but is a secondary concern. |

---

## 11. Glossary

| Term | Definition |
|---|---|
| **Task** | An academic unit of work (e.g., an assignment, exam preparation item, or project milestone) with a name, due date, priority, and completion status. |
| **Priority** | A three-level urgency classification: `high` (🔴), `medium` (🟡), and `low` (🟢). |
| **Status** | The completion state of a task: `pending` (in progress) or `completed` (done). |
| **Study Streak** | The number of consecutive days on which the student has logged or completed at least one task. |
| **Weekly Progress** | The percentage of all tasks that have been marked as completed: `(completedTasks / totalTasks) × 100`. |
| **Notification** | A contextual alert message related to upcoming deadlines, overdue tasks, or completion milestones. |
| **Context** | React Context — a global state container that provides data and functions to any descendent component tree without prop drilling. |
| **Modal** | A dialog overlay that appears above the main content, requiring user interaction before returning to the page beneath. |
| **HMR** | Hot Module Replacement — Vite's feature that instantly applies code changes in the browser without a full page reload during development. |

---

*End of Document — Smart Student Dashboard SRS v1.0.0*
