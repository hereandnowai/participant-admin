---
mode: 'agent'
model: gpt-4
description: 'Build an Angular Participant Admin (CRUD + List + Dashboard) that consumes a Laravel REST API with API-key auth'
---

# Angular Participant Admin Application

## Project Overview
Build a complete Angular web application called **Participant Admin** that manages "participants" (trainees) via a Laravel 8 API. The app requires full CRUD operations, search/sort/pagination, and a dashboard with charts.

**Backend API Details:**
- Base URL: `https://api.hereandnowai.com/public/api`
- Endpoints: GET/POST/PUT/DELETE on `/participants` and `/participants/{id}`
- Auth: API key in header `X-API-KEY: <value>` (configurable)
- Fields: name, whatsapp, email, linkedin, github_id, python_skill, angular_skill, javascript_skill, html_skill, css_skill, java_skill, outcome, id, created_at, updated_at

## Task Breakdown

### TASK 1: Project Setup & Configuration
**Goal:** Initialize Angular project with proper structure and configuration

**Requirements:**
- Create new Angular 17+ project with routing
- Set up project structure with proper module-based architecture (not standalone)
- Install required dependencies: Angular Material, ng2-charts, chart.js
- Create environment files with API configuration
- Set up TypeScript interfaces and models

**Deliverables:**
- `angular.json`, `package.json` with all dependencies
- `src/environments/environment.ts` and `environment.prod.ts` with API config
- `src/app/models/participant.model.ts` with complete interface
- `src/app/app.module.ts` with all imports configured
- `src/app/app-routing.module.ts` with route definitions

**Specific Instructions:**
- Use Angular Material for UI components
- Configure environment with: apiBaseUrl, apiKeyHeaderName, apiKeyValue
- Create Participant interface with all fields properly typed
- Set up routes: /participants, /participants/new, /participants/:id, /dashboard

---

### TASK 2: Core Services & HTTP Interceptor  
**Goal:** Create API service layer and authentication interceptor

**Requirements:**
- Build ParticipantsService with all CRUD methods
- Create HTTP interceptor for API key authentication
- Implement proper error handling and typing
- Add loading states and user-friendly error messages

**Deliverables:**
- `src/app/services/participants.service.ts` with methods: list(), get(id), create(dto), update(id, dto), remove(id)
- `src/app/interceptors/auth.interceptor.ts` that adds API key headers
- Proper TypeScript typing for all service methods
- Centralized error handling with meaningful user messages

**Specific Instructions:**
- Interceptor must read from environment config
- Add headers: Content-Type, Accept, and custom API key header
- Use Observables with proper error handling
- Include loading indicators for async operations

---

### TASK 3: Participants List Component
**Goal:** Build comprehensive list view with search, sort, and pagination

**Requirements:**
- Create responsive table displaying all participants
- Implement client-side search by name, email, github_id
- Add sorting by name and created_at (ascending/descending)
- Include client-side pagination with configurable page size
- Add delete functionality with confirmation dialog
- Include "Add Participant" navigation button

**Deliverables:**
- `src/app/components/participants-list/participants-list.component.ts|html|css`
- Material table with sticky headers
- Search input with real-time filtering
- Sort controls on table headers
- Pagination controls at bottom
- Delete confirmation dialog with success/error feedback

**Specific Instructions:**
- Use MatTableDataSource for built-in search/sort/pagination
- Show columns: Name, Email, WhatsApp, LinkedIn, GitHub, Created At, Actions
- Actions column should have View/Edit/Delete buttons
- Implement confirmation dialog before delete
- Show snackbar messages for success/failure operations

---

### TASK 4: Participant Form Component (Create/Edit)
**Goal:** Build reactive form for creating and editing participants

**Requirements:**
- Single component handling both create and edit modes
- Reactive forms with comprehensive validation
- Skills fields using select dropdowns (1-10 scale)
- URL validation for LinkedIn field
- WhatsApp format validation
- Proper form state management and error display

**Deliverables:**
- `src/app/components/participant-form/participant-form.component.ts|html|css`
- Reactive form with all fields and validators
- Validation error messages for each field
- Save/Cancel functionality with navigation
- Loading states during API calls

**Specific Instructions:**
- Use Angular Reactive Forms (FormBuilder, FormGroup)
- Validators: required for name, email format, URL format for LinkedIn
- Skills dropdowns with options 1-10
- WhatsApp pattern: digits, plus, minus, spaces allowed
- Outcome as textarea field
- Show field-level validation errors
- Navigate to list after successful save

---

### TASK 5: Dashboard Component with Charts
**Goal:** Create analytics dashboard with KPIs and visualizations

**Requirements:**
- Fetch all participants and compute statistics
- Display KPI cards: Total Participants, Average skills for each technology
- Create bar chart showing average skill levels across all technologies
- Build pie chart showing skill level distribution (1-3, 4-6, 7-10) for selected skill
- Optional: Radar chart comparing average skills
- Handle empty state gracefully

**Deliverables:**
- `src/app/components/dashboard/dashboard.component.ts|html|css`
- KPI cards section with computed statistics
- Bar chart using ng2-charts for average skills
- Pie chart for skill distribution
- Responsive layout for charts
- Empty state handling when no data

**Specific Instructions:**
- Use ng2-charts with chart.js for all visualizations
- Compute averages only for participants with skill values > 0
- KPI cards should show: Total count, Avg Angular, Avg JavaScript, Avg Python
- Bar chart x-axis: skill names, y-axis: average values
- Pie chart: group skill levels into Low (1-3), Medium (4-6), High (7-10)
- Use Material cards for layout structure

---

### TASK 6: Navigation & Layout
**Goal:** Create app shell with navigation and consistent layout

**Requirements:**
- Build main shell component with top navigation
- Add navigation links to Participants List and Dashboard
- Implement responsive design
- Add app branding and title
- Ensure consistent styling across components

**Deliverables:**
- `src/app/components/layout/shell.component.ts|html|css` (or integrate into app.component)
- Top navigation bar with app title "Participant Admin"
- Navigation menu with active route highlighting
- Responsive layout that works on mobile/tablet/desktop
- Consistent Material Design theming

**Specific Instructions:**
- Use Angular Material toolbar and navigation components
- App title: "Participant Admin"
- Navigation items: "Participants" (links to /participants), "Dashboard" (links to /dashboard)
- Highlight active navigation item
- Use router-outlet for component rendering
- Implement responsive navigation (hamburger menu on mobile)

---

### TASK 7: Material Module & Styling Setup
**Goal:** Configure Angular Material and create consistent styling

**Requirements:**
- Create Material module with all needed imports
- Set up global Material theme
- Implement responsive design patterns
- Create consistent spacing and typography
- Add loading indicators and feedback messages

**Deliverables:**
- `src/app/shared/material.module.ts` with all Material imports
- Global theme configuration in `src/styles.css`
- Responsive CSS classes and utilities
- Snackbar service for notifications
- Loading spinner component or service

**Specific Instructions:**
- Import required Material modules: MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatSelectModule, MatProgressSpinnerModule
- Use Material Design color palette
- Implement consistent spacing using Material's spacing system
- Create reusable CSS classes for common layouts
- Set up global typography using Material typography

---

### TASK 8: Final Integration & Documentation
**Goal:** Complete integration testing and create comprehensive documentation

**Requirements:**
- Ensure all components work together seamlessly
- Test all CRUD operations end-to-end
- Create comprehensive README
- Add code comments and documentation
- Verify responsive design across devices

**Deliverables:**
- Complete `README.md` with setup instructions
- Code comments explaining key functionality
- Final testing and bug fixes
- Build verification (`ng build --prod`)
- Deployment-ready code

**Specific Instructions:**
README should include:
- Prerequisites (Node.js version, Angular CLI)
- Installation steps (`npm install`, `ng serve`)
- API configuration instructions (how to set API URL and key in environment files)
- Feature overview and navigation guide
- Notes about switching to server-side pagination
- Troubleshooting section

Add comments for:
- Service methods and their parameters
- Form validation logic
- Chart configuration and data processing
- Interceptor functionality
- Complex component logic

---

## Technical Requirements for All Tasks
- Angular 17+ with TypeScript
- Use Angular Material for UI components
- Implement proper TypeScript interfaces
- Use Reactive Forms for all form handling  
- Follow Angular best practices and style guide
- Responsive design for mobile/tablet/desktop
- Proper error handling and user feedback
- Clean, maintainable, well-commented code

## Acceptance Criteria
- App builds successfully with `ng build`
- All CRUD operations work with Laravel API
- Search, sort, and pagination function correctly
- Forms validate properly with helpful error messages
- Dashboard displays accurate data and charts
- API interceptor adds authentication headers
- Responsive design works across device sizes
- Code is clean, typed, and well-documented
