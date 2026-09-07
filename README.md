# Do Good Drive Marketplace

A modern, professional community marketplace connecting **Volunteers**, **Grassroots Non-Profits (NGOs)**, and **Corporate CSR Programs** to drive transparent social impact.

Built with an original **Purpose Plum** design system, featuring a feed-first architecture inspired by the information density and clean utility of professional networking platforms without social network bloat, algorithms, or vanity metrics.

---

## 1. Key Architectural Highlights

### 1.1 Professional 3-Column Community Feed (`/feed`)
The centerpiece of the platform is a clean, 3-column feed with a slim top navigation bar:
- **Top Navigation Bar (56px)**: Hairline border (`#E8E3E8`), brand mark, compact discovery search field, role-specific navigation items (Home, Hub, Discover, Saved, Applications, Impact), fast role switcher, in-app notifications, and account menu ("Me").
- **Left Column (240px)**: Compact Profile snapshot card (avatar, role badge, short bio, verified impact / drive metrics, profile edit link) and Marketplace Hub shortcuts.
- **Center Column (560–640px, Visually Dominant)**:
  - Post composer ("Start a post...") with quick triggers for Stories, Events, and Drives.
  - Category filter tabs (*All Updates*, *Community Drives*, *NGO Impact Stories*, *Followed NGOs*, *CSR Pledges*).
  - High-density feed cards with author metadata, badge tags, opportunity previews, 4-tier reaction picker (*Like*, *Celebrate*, *Support*, *Insightful*), threaded comments, and network shares.
- **Right Column (300px)**: Compact stacked white cards featuring Urgent Community Drives and Verified NGO Partners.
- **Responsive Adaptability**: On tablets, the right column stacks cleanly beneath the center feed; on mobile devices, a single focused feed column is paired with a fixed 5-tab thumb navigation bar.

### 1.2 Purpose Plum Visual Design System
- **Primary Plum**: `#6D3A70` (primary actions, active navigation indicator, brand mark)
- **Primary Hover / Active**: `#552C59`
- **Soft Lavender**: `#F1E7F3` (selected state backdrops, avatar containers, tag chips)
- **Subtle Lavender**: `#FAF5FA` (active navigation pills, callout highlights)
- **App Canvas**: `#FBFAF8` (warm, calm off-white background)
- **Card Surfaces**: `#FFFFFF` (white surface, 12px rounded-xl radius, 1px `#E8E3E8` hairline borders, restrained shadows)
- **Typography**: `#25232A` (main text & headings), `#6B6870` (secondary body), `#8B8790` (muted timestamps)
- **Strict Semantic Statuses**: `#15803D` (Verified / Attended), `#B45309` (Pending / Waitlist), `#B91C1C` (Rejected / Error)

---

## 2. Core MVP Scope & Capabilities by Role

| Role | Key Capabilities & Active Screens |
| :--- | :--- |
| **Community Member / All** | - **Professional Community Feed** (`/feed`) with real-time posts, filter tabs, reactions, comments, and shares<br>- **Public Discovery Landing** (`/`)<br>- **Role Onboarding & Authentication** (`/choose-role`, `/login`, `/sign-up`) |
| **Volunteer** | - **Volunteer Operations Hub** (`/volunteer/dashboard`)<br>- Multi-criteria community drive discovery (`/volunteer/opportunities`)<br>- Bookmark / Save drives for later review (`/volunteer/saved`)<br>- Direct drive application with custom questionnaires (`/volunteer/opportunities/[id]`)<br>- Application status tracking (`/volunteer/applications`)<br>- Official impact records computed strictly from NGO-certified hours (`/volunteer/impact`)<br>- Profile onboarding & credential setup (`/onboarding/volunteer`) |
| **NGO (Non-Profit)** | - **NGO Operations Hub** (`/ngo/dashboard`)<br>- Create, preview, edit, and publish volunteer drives (`/ngo/opportunities/new`, `/ngo/opportunities`)<br>- **Verification Publishing Gate**: Only verified non-profits can publish active drives<br>- Candidate dossier review with accept/reject decisions & private coordinator notes (`/ngo/opportunities/[id]/applications`)<br>- Participant attendance marking (`ATTENDED` / `ABSENT`) and activity hours logging (`/ngo/opportunities/[id]/participants`)<br>- Official hours verification (`PENDING_VERIFICATION` &rarr; `VERIFIED`) (`/ngo/volunteers`)<br>- Community dispatch broadcasts & impact story publishing (`/ngo/posts`)<br>- Corporate CSR inquiry management (`/ngo/corporate-partners`)<br>- Organization onboarding & governance registration (`/onboarding/ngo`) |
| **Corporate CSR** | - **Corporate CSR Hub** (`/corporate/dashboard`)<br>- NGO Discovery Directory by cause, region, and verification status (`/corporate/ngos`, `/corporate/ngos/[id]`)<br>- Partner shortlist management (`/corporate/shortlist`)<br>- Introductory connection requests with personalized notes (`/corporate/dashboard`)<br>- Corporate CSR profile setup (`/onboarding/corporate`) |

---

## 3. Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict type checking)
- **Styling**: Tailwind CSS with Purpose Plum design tokens
- **Data & Auth**: Supabase (PostgreSQL, Row-Level Security, Auth, Storage)
- **Forms & Validation**: React Hook Form with Zod schemas
- **Icons**: Lucide React

---

## 4. Local Development Setup

### 4.1 Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### 4.2 Installation & Run
```bash
# Clone repository
git clone https://github.com/bharathmaraboina-arch/do-good-drive.git
cd do-good-drive

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

Visit **[http://localhost:3000/feed](http://localhost:3000/feed)** to experience the 3-column professional community feed, or visit **[http://localhost:3000](http://localhost:3000)** for the public landing page.

---

## 5. Supabase Configuration & Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase API URL and Public Anon Key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (for administrative scripts/migrations only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 6. Database Migrations & Seed Data

Execute the migrations located in `supabase/migrations/` in sequential order:

1. `20260903_profiles_and_onboarding.sql` — Profiles and role onboarding schemas with base RLS.
2. `20260903_marketplace_opportunities.sql` — Opportunities, applications, answers, and bookmarks.
3. `20260903_activity_completion_and_hours.sql` — Attendance marking and verified hours schema.
4. `20260903_corporate_mvp.sql` — Corporate shortlists and connection requests.
5. `20260903_community_feed.sql` — NGO posts, dispatches, and follow relationships.
6. `20260907_interactive_community_feed.sql` — Feed reactions, threaded comments, and network shares.
7. `20260907_mvp_audit_and_hardening.sql` — Hardened RLS policies, note protection views, and publishing gates.

### Populating Seed Data
Load `supabase/seed.sql` into your Postgres instance to seed sample data:
```bash
# Using Supabase CLI
supabase db reset

# Or directly pipe into psql
psql -h db.your-project.supabase.co -U postgres -d postgres -f supabase/seed.sql
```

---

## 7. Test Personas & Seed Accounts

| Role | Persona / Name | Email | Verification Status | Key Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Volunteer** | Sarah Jenkins | `sarah.jenkins@example.com` | Verified Profile | Enrolled in Urban Reforestation drive; has 4.0 verified hours and 4.0 pending hours; active community feed contributor. |
| **NGO 1** | GreenCanopy Initiative | `contact@greencanopy.org` | `VERIFIED` | Verified partner; publishes drives, reviews candidate applications, logs attendance, and broadcasts impact stories. |
| **NGO 2** | CodeForward Foundation | `director@codeforward.org` | `VERIFICATION_PENDING` | Unverified non-profit; draft initiatives require verification before publishing. |
| **Corporate** | EcoTech Partners | `csr@ecotechpartners.com` | `VERIFIED` | Active CSR partner; shortlists GreenCanopy; has a pending connection request for urban forestry sponsorship. |

---

## 8. Security & Governance Principles

1. **Strict Profile Isolation**: Users can only modify their own profile record (`auth.uid() = id`).
2. **Opportunity Ownership**: NGOs can only create, edit, unpublish, and manage their own initiatives.
3. **Verified Publishing Gate**: Only NGOs whose profile verification status is `VERIFIED` can publish opportunities.
4. **Applicant Privacy & Protection**: Volunteers can only read their own submitted applications. Internal NGO coordinator notes (`ngo_private_notes`) are strictly omitted from volunteer views and API responses.
5. **No Self-Declared Attendance or Hours**: Attendance (`ATTENDED` / `ABSENT`) and service hours can only be recorded and certified by the host NGO.
6. **Official Impact Integrity**: Volunteer impact summaries compute totals using **only** records with status `VERIFIED`. Unverified hours are explicitly itemized as pending without inflating official numbers.
7. **Corporate Boundaries**: Corporates can access strictly their own shortlists and sent connection requests; NGOs only see connection requests sent to their specific organization.
