# Comma - Agency Reporting & SEO Dashboard

Comma is a high-performance SaaS web application engineered to consolidate multi-channel search data into a single, white-labeled "source of truth". It allows marketing agencies to manage clients, track advanced SEO metrics, and deliver automated, white-labeled reports under their own subdomains.

## Core Features & Modules

1. **Dashboard (Multisite & CMS Integration)**
   - **Multisite Support:** Manage multiple websites from a single master dashboard.
   - **CMS Integrations:** Connect with open APIs for **WordPress, Wix, Framer, and Webflow** to push content and sync data automatically.
   - **Quick Insights:** Display site health scores, traffic trends, and domain authority. 
   - **UI Widgets:** Built with **Shadcn UI** for a sleek, modern, and accessible design.

2. **White-Label Infrastructure & 3-Tier Pricing**
   - **Standalone SaaS:** Comma will use fresh, standalone n8n webhooks and workflows (not shared with existing Pixels Studio automations) to operate completely independently.
   - **Pricing Tiers:** Features are gated across 3 tiers (e.g., Basic, Pro, Agency).
   - **Tiered Domain Access:**
     - Lower Tiers: Access via `[agency].wedreaminpixels.com`.
     - Highest Tier: Fully custom domain (e.g., `report.theirdomain.com`).

3. **Keywords Tracking & Categorization**
   - **Rank Tracker:** Monitor average position, visibility, and 30-day trends.
   - **Categorization:** Tag and filter keywords based on intent: *Geographical*, *Transactional*, *Local*, and *Research*.
   - Powered by DataForSEO API v3.

4. **Content Management (Kanban Board)**
   - **3-Column Grid:** Manage content calendars using draggable cards across "Keyword Research", "Writing", and "Published" columns.
   - **Direct CMS Posting:** Integration to push the finished content directly to the selected CMS.

5. **Bulk Indexation Tool**
   - Direct integration with the **Google Indexing API**.
   - Allows users to submit a bulk list of URLs to instantly notify Google of content changes.

6. **Reports Page**
   - Exportable, presentation-ready modules.
   - Historical performance summaries, AI insights, and PDF generation.

---

## Product Roadmap & Build Plan

### Phase 1: Foundation (Next.js) & Architecture (Weeks 1-2)
- [x] **Repo Setup:** Initialize the **Next.js (App Router)** application in the `Comma` GitHub repository.
- [x] **UI Framework:** Install Tailwind CSS, Lucide Icons, and **Shadcn UI**.
- [x] **Tenant Middleware:** Setup Next.js Middleware to handle the subdomains (`[agency].wedreaminpixels.com` vs `report.theirdomain.com`).
- [x] **Auth & DB Setup:** Configure Supabase (Postgres + Auth) and basic schema.
- [ ] **N8n Fresh Integration:** Create isolated, fresh n8n workflows for this app.
- [ ] **Dokploy Deployment:** Configure Dokploy settings (Docker/Nixpacks) to easily host the app.

### Phase 2: Content Calendar & CMS Integrations (Weeks 3-4)

#### 1. Content Page (Kanban Board)
- Develop `src/app/[domain]/content/page.tsx` as the main Content hub.
- Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
- Create a `KanbanBoard` component with three columns: "Keyword Research", "Writing", and "Published".
- Create `KanbanCard` components that display the content title, assigned keyword, and target CMS platform.

#### 2. CMS Integration APIs
- Set up Next.js API Routes (`app/api/cms/publish/route.ts`) to handle outgoing publish requests.
- Integrate with **WordPress REST API** (using Application Passwords).
- Integrate with **Webflow CMS API** (using Webflow Data API tokens).
- Integrate with **Wix** and **Framer** (where open APIs allow content pushing).
- When a card is moved to "Published" on the Kanban board, trigger the API to push the content to the designated CMS automatically.

### Phase 3: Keywords & Bulk Indexation (Weeks 5-6)
- **Keyword Module:** Build the keyword table with categorization tags.
- **Google Indexing API:** Integrate the Node.js batch processing script directly into Next.js API routes.

### Phase 4: Reports & Subscriptions (Weeks 7-8)
- **3-Tier Subscription Gating:** Implement auth and billing checks to restrict features (like custom domains) based on the 3 tiers.
- **PDF Export:** Implement PDF generation for the Reports page.

## Open Questions for Phase 2
> [!IMPORTANT]
> 1. Do you want to trigger the CMS publishing directly from the Next.js API route, or do you want to pass the data to **n8n** (using your new webhook `https://flows.wdip.work/webhook/comma-saas/`) and let n8n handle the actual API communication with WordPress/Webflow? (Using n8n is highly recommended for visual workflow management).
> 2. For the Dokploy deployment, does your Dokploy server use Nixpacks or a custom Dockerfile for Next.js 15+?

---
*Status: Awaiting Review for Phase 2.*
