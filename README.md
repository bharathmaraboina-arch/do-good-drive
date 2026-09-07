# Do Good Drive Marketplace

A purposeful, minimal discovery and collaboration marketplace uniting **Volunteers**, **Grassroots Non-Profits (NGOs)**, and **Corporate CSR Programs** to drive transparent social impact.

Inspired by the functional utility of professional discovery platforms, built with a warm, restrained aesthetic (warm off-white backgrounds, crisp white content cards, charcoal typography, and deep teal primary actions) without social network bloat, feed algorithms, chat, or gamified tokens.

---

## 1. Technology Stack

- **Framework**: Next.js 16 (App Router & Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom HSL tokens
- **Data & Auth**: Supabase (PostgreSQL, Row-Level Security, Auth, Storage)
- **Validation**: Zod & React Hook Form
- **Icons**: Lucide React

---

## 2. Core MVP Scope & Capabilities

| Role | Key Capabilities & Active Screens |
| :--- | :--- |
| **Volunteer** | - Complete structured volunteer profile credentials (`/onboarding/volunteer`)<br>- Discover community drives with multi-criteria filters (`/volunteer/opportunities`)<br>- Bookmark drives without triggering applications (`/volunteer/saved`)<br>- Apply to drives with data disclosure and custom question review (`/volunteer/opportunities/[id]`)<br>- Track application statuses: `PENDING`, `ACCEPTED`, `REJECTED` (`/volunteer/applications`)<br>- View official impact totals computed strictly from verified hours (`/volunteer/impact`)<br>- Operations Hub (`/volunteer/dashboard`) |
| **NGO** | - Organization onboarding & legal governance registration (`/onboarding/ngo`)<br>- Operations Hub (`/ngo/dashboard`)<br>- Create, preview, edit, and publish drives (`/ngo/opportunities/new`, `/ngo/opportunities`)<br>- **Verification Publishing Gate**: Only `VERIFIED` NGOs can publish drives<br>- Candidate dossier review with `ACCEPTED` / `REJECTED` decisions & private notes (`/ngo/opportunities/[id]/applications`)<br>- Mark volunteer attendance (`ATTENDED` / `ABSENT`) and log activity hours (`/ngo/opportunities/[id]/participants`)<br>- Verify recorded hours (`PENDING_VERIFICATION` &rarr; `VERIFIED`) (`/ngo/volunteers`)<br>- Review, accept, or decline corporate connection inquiries (`/ngo/corporate-partners`) |
| **Corporate** | - Corporate CSR profile setup (`/onboarding/corporate`)<br>- Corporate Operations Hub (`/corporate/dashboard`)<br>- Discover NGOs by cause, location, and verification status (`/corporate/ngos`, `/corporate/ngos/[id]`)<br>- Maintain a dedicated partner shortlist (`/corporate/shortlist`)<br>- Send introductory connection requests to NGOs with custom notes (`PENDING` &rarr; `ACCEPTED` / `DECLINED`) |

> **Intentional Boundaries**: Intentionally excludes public social feeds, likes, comments, volunteer-generated posts, chat, groups, events modules, certificates, grant applications, budgets, milestones, and complex analytics.

---

## 3. Local Development Setup

### 3.1 Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### 3.2 Installation & Run
```bash
# Clone repository
git clone https://github.com/example/do-good-drive.git
cd do-good-drive

# Install dependencies
npm install

# Start development server
npm run dev -- -p 3000

# Build production bundle
npm run build
```
Visit [http://localhost:3000](http://localhost:3000) to access the application.

---

## 4. Supabase Configuration & Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase API URL and Public Anon Key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (for administrative scripts/migrations only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 5. Database Migrations & Seed Data

Execute the following migrations located in `supabase/migrations/` in sequential order:

1. `20260903_profiles_and_onboarding.sql` — Profiles and role onboarding schemas with base RLS.
2. `20260903_marketplace_opportunities.sql` — Opportunities, applications, answers, and bookmarks.
3. `20260903_activity_completion_and_hours.sql` — Attendance marking and verified hours schema.
4. `20260903_corporate_mvp.sql` — Corporate shortlists and connection requests.
5. `20260907_mvp_audit_and_hardening.sql` — Hardened RLS policies, note protection views, and publishing gates.

### Populating Seed Data
Load `supabase/seed.sql` into your Postgres instance to seed sample data:
```bash
# Using Supabase CLI
supabase db reset
# Or directly pipe into psql
psql -h db.your-project.supabase.co -U postgres -d postgres -f supabase/seed.sql
```

---

## 6. Seed Test Accounts & Personas

| Role | Persona / Name | Email | Verification Status | Key Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Volunteer** | Sarah Jenkins | `sarah.jenkins@example.com` | Verified Profile | Enrolled in Urban Reforestation drive; has 4.0 verified hours and 4.0 pending hours. |
| **NGO 1** | GreenCanopy Initiative | `contact@greencanopy.org` | `VERIFIED` | Can publish drives; manages riparian planting initiatives, participant rosters, and corporate connections. |
| **NGO 2** | CodeForward Foundation | `director@codeforward.org` | `VERIFICATION_PENDING` | Unverified NGO; draft initiatives require verification before publishing. |
| **Corporate** | EcoTech Partners | `csr@ecotechpartners.com` | `VERIFIED` | Shortlists GreenCanopy; has a pending connection request for urban forestry sponsorship. |

---

## 7. Security & Row-Level Security (RLS) Principles

1. **Strict Profile Isolation**: Users can only modify their own profile record (`auth.uid() = id`).
2. **Opportunity Ownership**: NGOs can only create, edit, unpublish, and manage their own initiatives.
3. **Verified Publishing Gate**: Only NGOs whose profile verification status is `VERIFIED` can set `is_published = true`.
4. **Applicant Privacy & Protection**: Volunteers can only read their own submitted applications. Internal NGO coordinator notes (`ngo_private_notes`) are strictly omitted from volunteer views and API responses.
5. **No Self-Declared Attendance or Hours**: Attendance (`ATTENDED` / `ABSENT`) and service hours can only be recorded and certified by the host NGO.
6. **Official Impact Integrity**: Volunteer impact summaries compute totals using **only** records with status `VERIFIED`. Unverified hours are explicitly itemized as pending without inflating official numbers.
7. **Corporate Boundaries**: Corporates can access strictly their own shortlists and sent connection requests; NGOs only see connection requests sent to their specific organization.

---

## 8. Accessibility & Global Fallback States

- **Keyboard Support**: Universal `:focus-visible` styling (`outline: 2px solid #0D5C5B; outline-offset: 2px`) across all buttons, inputs, and links.
- **Color-Independent Status**: `StatusBadge` incorporates distinct geometric glyph icons (`CheckCircle2`, `Clock`, `AlertTriangle`, `XCircle`), `role="status"`, and accessible `aria-label` text.
- **Fallback Screens**:
  - `loading.tsx`: Accessible loading indicator during page transitions.
  - `error.tsx`: Client-side error boundary with error digest and retry trigger.
  - `not-found.tsx`: Clean 404 screen with return routes.
  - `unauthorized/page.tsx`: 403 access control screen with role navigation.
