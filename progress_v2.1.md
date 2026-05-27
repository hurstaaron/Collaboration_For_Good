# CFG Internship — Progress & Game Plan

**Intern:** Aaron Hurst
**Client:** Collaboration for Good, LLC (CFG)
**Principal:** Tyler Butler, Founder & Principal
**Started:** Wednesday, May 13, 2026
**Budget:** 150 hours over 15 weeks (target: compress to 10–12 weeks based on Tyler's stated urgency)
**Compensation:** Unpaid, academic credit through UAT + formal recommendation on successful completion

---

## Client Snapshot (Verified Data)

- **Legal Entity:** Collaboration For Good, LLC — Arizona, founded January 2023
- **Predecessor:** 11Eleven Consulting (Tyler's prior firm, founded January 2016; domain still registered through Squarespace, last renewed June 18, 2025)
- **Address:** 3219 E. Camelback Rd. #299, Phoenix, AZ 85018
- **Industry codes:** SIC 87,874 / NAICS 54,541 (Management Consulting Services)
- **Headcount:** 1–10 (functionally solo + contractors)
- **Revenue:** Not publicly disclosed; broker estimates unreliable for entity at this scale
- **B-Corp Status:** In transition (driver behind the internship engagement)
- **Current website:** collaborationforgood.com (WordPress + Elementor, "consua" theme by validthemes, built by US Design Hub)

---

## Strategic Positioning

The single most important insight from discovery: **Tyler's personal brand is significantly stronger than CFG's company brand.**

- Featured Expert Contributor: Forbes, Fortune, Fast Company, US News, InBusiness Phoenix, Green Living
- MuckRack-listed journalist (`muckrack.com/tylerjbutler_`)
- Behance presence (`behance.net/tylerbutler`)
- Forbes "Outstanding Businesswomen 2019" recognition
- 9 years of independent CSR practice across two firms
- Documented client roster: Microsoft, GoDaddy, Lyft, UTI, Nissan, Bridgestone, Shell, WebPT, Weedmaps, Aventiv

**None of this is currently being deployed on the CFG website.** That gap is the central strategic opportunity. The redesign is not a "website project" — it is a **brand consolidation project** that surfaces Tyler's accumulated authority and migrates the equity from 11Eleven Consulting to CFG.

---

## KEY DECISIONS LOG

| Date | Decision | Context |
|------|----------|---------|
| May 21, 2026 | **Tyler selected "The Protagonist" as the CFG color scheme** | Presented 12 mockups across 4 concept groups. Tyler chose The Protagonist — a black/white/off-white + red editorial direction, consistent with her stated aesthetic preference ("chic, modern, streamlined with intentional pops of red"). |
| May 21, 2026 | **The Protagonist palette locked for Phase 3** | Near-black `#111111` · Logo Red `#C42B18` · Off-White `#F5F2EE` · Typography: Playfair Display (headlines) + DM Sans (body) |
| May 21, 2026 | **The Protagonist also recommended for Tyler's personal website** | tylerjbutler.com or equivalent personal brand site — separate from CFG, same visual direction but leads with Tyler's personal conviction rather than CFG's service framework |

---

## Game Plan — Phased Roadmap

> Original budget: 8–12 hours/week over 15 weeks. Aaron's compressed target: 12–18 hours/week over 10–12 weeks based on Tyler's urgency. Each phase below has flex; lock the schedule with Tyler at the Phase 2 strategy gate.

### Phase 1 — Audit & Discovery (Week 1–2) — IN PROGRESS

**Goal:** Establish complete baseline. Surface every finding before touching anything.

**Completed:**
- Performance audit (mobile 31/100, desktop 79/100 — full PageSpeed data captured)
- Page-by-page content audit (all primary pages reviewed)
- B-Corp competitive benchmarking (Cause Consulting, Planet+Purpose, Heather Paulsen, Impact Growth Partners, Way to B)
- Domain forensics (11elevenconsulting.com confirmed Tyler's, renewed 6/2025, 1,583 archived URLs in Wayback)
- WHOIS / ICANN registration data captured
- **Brand identity audit — COMPLETE**
  - Logo fully analyzed: woven heart mark, strong concept, weak system (no favicon variant, no stacked version, no source file confirmed)
  - Official brand book reviewed (Aidan Taylor Marketing): Bebas Neue headlines, DIN Alternate body, 6 official colors
  - Official palette: Rust Orange `#E63C2D`, Dark Red `#700F0F`, Orange `#F6922E`, Grey `#E0DACC`, Black `#231F1F`, Creme `#F5EDDE`
  - Typography recommendations: Playfair Display + DM Sans (Wix-compatible Google Fonts)
  - Iconography: Phosphor Icons recommended (community/people-focused line art, consistent weight)
  - 12 full-page HTML mockups built, deployed to GitHub (`hurstaaron.github.io/Collaboration_For_Good`)
  - Tyler's brand book, founder bio, CFG Brief v2, and explainer video script all reviewed and incorporated
  - **Tyler selected "The Protagonist" — decision logged above**

**Still to complete in Phase 1:**
- Local Arizona SEO audit (Google Business Profile, NAP consistency, AZ directory presence)
- Conversion infrastructure audit (newsletter, lead capture, booking tools)
- Analytics & measurement audit (GA4, Search Console, GTM status)
- Backlink profile audit (CFG current + 11Eleven recoverable links)
- Social media audit (the 4 footer icons — one already confirmed broken)
- Adjacent brand asset audit (Giving in Style, Brands Taking Stands, tylerjbutler.com)
- B-Corp readiness audit (PBC registration, BIA score status, mission/values doc status)
- Reputation audit (Google reviews, Clutch listing, LinkedIn recommendations)
- Personal brand consolidation audit (Forbes archive, MuckRack, Behance, press history)

**Deliverable:** Audit findings document — present to Tyler at end of Phase 1, get sign-off before proceeding.

---

### ✅ WEEKEND AUDIT SPRINT — Remaining Phase 1 Checklist

> Complete all 9 tracks before Phase 1 can close. Work through these in order — earlier tracks inform later ones.

---

#### 1. Local Arizona SEO Audit
- [ ] Search "Collaboration for Good Phoenix" — note what appears, position, and any knowledge panel
- [ ] Check Google Business Profile: does one exist? Is it claimed? (`google.com/business`)
- [ ] Verify NAP consistency (Name, Address, Phone) — `3219 E. Camelback Rd. #299, Phoenix, AZ 85018 · 480.431.8580`
- [ ] Check these AZ directories for CFG listings: Yelp, Better Business Bureau, Alignable, Arizona Commerce Authority, InBusiness Phoenix
- [ ] Check if 11Eleven Consulting has stale GBP or directory listings that conflict
- [ ] Note: is `collaborationforgood.com` appearing for branded searches? Any competitors ranking for it?

#### 2. Conversion Infrastructure Audit
- [ ] Check for newsletter/email capture — does one exist on the site? What platform (Mailchimp, ConvertKit, etc.)?
- [ ] Check the contact form — does it work end-to-end? (Note: "Send us a Massage" typo already confirmed)
- [ ] Is there a Calendly or booking link anywhere on the site?
- [ ] Is there a lead magnet (PDF download, guide, assessment) anywhere?
- [ ] Check what happens after form submit — confirmation page? Email response? Nothing?
- [ ] Note: any pop-ups, exit intent, or email capture banners?

#### 3. Analytics & Measurement Audit
- [ ] Check page source for Google Analytics / GA4 tag (`gtag.js` or `analytics.js`)
- [ ] Check for Google Tag Manager container (`gtm.js`)
- [ ] Search Google Search Console — is `collaborationforgood.com` verified? (requires Tyler's access)
- [ ] Note: ask Tyler in next communication for GA4 admin access + Search Console access
- [ ] Check if any conversion events are firing (contact form submit, button clicks)
- [ ] Is there a Facebook Pixel or LinkedIn Insight Tag present?

#### 4. Backlink Profile Audit
- [ ] Run `collaborationforgood.com` through Ahrefs free checker OR `moz.com/link-explorer` (free tier)
- [ ] Note total referring domains and top 5 linking sites
- [ ] Run `11elevenconsulting.com` through same tool — note referring domains still pointing to the dead domain
- [ ] Cross-reference with Wayback CDX data (1,583 archived URLs) — identify top linked pages on 11Eleven
- [ ] Flag the top 20 publications linking to 11Eleven for Phase 6 outreach list

#### 5. Social Media Audit
- [ ] Visit all 4 footer social icons on current CFG site — note which one is broken and which platform
- [ ] LinkedIn: check Tyler's personal profile (`linkedin.com/in/tylerjbutler`) — followers, activity, About section accuracy
- [ ] LinkedIn: check CFG company page if one exists — is it claimed? Up to date?
- [ ] Instagram: check `@collaborationforgood` or equivalent — does it exist? Post frequency? Follower count?
- [ ] Twitter/X: check `@collaborationforgood` or `@tylerjbutler` — active or dormant?
- [ ] Facebook: check for CFG page — exists? Active?
- [ ] Note: are social profiles consistent in bio, logo, contact info, and URL?

#### 6. Adjacent Brand Asset Audit
- [ ] Check `tylerjbutler.com` — does it exist? What's on it? Redirect? Parked?
- [ ] Search "Giving in Style" — what is it? Tyler's project? Still active?
- [ ] Search "Brands Taking Stands" — same questions
- [ ] Check `behance.net/tylerbutler` — what's posted? Last active?
- [ ] Check `muckrack.com/tylerjbutler_` — articles listed? Outlet coverage?
- [ ] Note any brand assets (logos, photos, graphics) from these properties that could be repurposed

#### 7. B-Corp Readiness Audit
- [ ] Search Arizona Secretary of State for CFG's PBC (Public Benefit Corporation) registration status — `azcc.gov`
- [ ] Check B Lab directory: `bcorporation.net` — is CFG listed as pending certification?
- [ ] Check if CFG's site currently has a mission statement, values, or transparency page
- [ ] Note: does the current site contain any B Impact Assessment language or score?
- [ ] Review CFG Brief v2 for any stated BIA score or certification timeline Tyler has referenced
- [ ] Flag: site must be certification-ready by launch day — what content is missing?

#### 8. Reputation Audit
- [ ] Google "Collaboration for Good Tyler Butler" — note reviews, sentiment, any negative results
- [ ] Check Google reviews on GBP listing (if one exists) — rating and count
- [ ] Check Clutch.co — is CFG listed? Any reviews?
- [ ] Check LinkedIn recommendations on Tyler's profile — count, quality, recency
- [ ] Search Tyler Butler in Arizona Business Journal, InBusiness Phoenix, AZ Big Media — any recent coverage?
- [ ] Note: any negative press, complaints, or reputation risks discovered

#### 9. Personal Brand Consolidation Audit
- [ ] Pull Tyler's Forbes contributor page — how many articles? Most recent? Topics covered?
- [ ] Check Fast Company contributor page — same questions
- [ ] Check Fortune contributor page — same questions
- [ ] Search MuckRack profile for full publication list and outlet reach
- [ ] Note: is any of this press currently linked from the CFG site? (Answer is likely no)
- [ ] Identify the 5 strongest Tyler bylines for immediate surfacing on the new site
- [ ] Check if Forbes articles are still live and indexable (some contributors get removed)
- [ ] Note: `tylerjbutler.com` status (from audit #6) — does she need a personal site or does CFG absorb her brand?

---

### Phase 2 — Strategy & Information Architecture (Week 2)

**Goal:** Lock decisions before any building starts.

**Tasks:**
- Platform recommendation finalized (Wix Studio expected — internship brief specifies Wix; benchmark Planet+Purpose runs on Wix successfully)
- Sitemap redesign (flat: Home / About / Capabilities / Impact / Insights / Contact)
- Content strategy and messaging hierarchy
- B-Corp readiness alignment (website designed to be "certification-ready on day one")
- Personal brand consolidation strategy (how to surface Tyler's press, Forbes column, MuckRack credentials)
- Customer acquisition strategy outline (feeds into parallel workstream — see below)
- Hour budget and timeline locked with Tyler

**Deliverable:** Strategy document + sitemap + approved scope. Get Tyler's sign-off at this gate.

---

### Phase 3 — Brand & Visual Identity (Week 2–3) — DIRECTION LOCKED ✓

**Goal:** Build the design system before building any pages.

> **DIRECTION LOCKED — May 21, 2026:** Tyler selected "The Protagonist" palette. All Phase 3 work executes against this system.

**Locked Design System:**
- **Color palette:** Near-black `#111111` (primary) · Logo Red `#C42B18` (accent) · Off-White `#F5F2EE` (light ground) · Mid Gray `#888888` (supporting) · Logo gradient mark retained as-is
- **Typography:** Playfair Display (display/headlines, Cormorant Garamond as alternative) + DM Sans (body, UI, labels)
- **Aesthetic direction:** Black/white/off-white dominant · red as intentional conviction marker · editorial, purpose-first · warm but authoritative
- **Content architecture note:** The Protagonist mockup leads with beliefs before services — Phase 3 build must layer CFG's service framework (Collaborate/Create/Report/Lead) into this structure without losing the conviction-led voice

**Remaining Phase 3 Tasks:**
- Logo system expansion: favicon variant, stacked variant, mono/reversed — get source file (AI/EPS/SVG) from Tyler
- Iconography system selection (Phosphor recommended — community/people-focused line art)
- Photography direction (real over stock — Tyler in her element, real client moments)
- Component library: buttons, cards, CTAs, section dividers — all in The Protagonist palette
- One-page visual style guide deliverable

> **Note for Phase 3 kickoff:** This is an Opus-worthy session. Open Phase 3 chat in Opus with the brand book, Tyler's bio, the selected mockup, and the locked palette in context.

**Deliverable:** Style guide + adapted mockup for Tyler's final approval.

---

### Phase 4 — Wix Build & Migration (Week 3–6)

**Goal:** Execute the rebuild.

**Build order:**
1. Contact page (fixes the "Send us a Massage" embarrassment immediately, forces familiarization with Wix)
2. About page (Tyler's bio is the strongest content asset — get this right)
3. Capabilities page (Collaborate / Create / Report / Lead framework)
4. Impact / Case Studies page (NEW — pull from documented client history)
5. Insights / Blog page (handle the Featured.com syndication question carefully)
6. Home page (built last — depends on all others being defined)

**Cross-cutting tasks:**
- Footer contact block on every page (mailto link, phone, address)
- WCAG AA accessibility on every component as it's built
- SEO meta titles + descriptions for every page (intentional keyword targeting)
- Schema markup (Organization, LocalBusiness, Person for Tyler, Article for blog posts)
- Mobile-first responsive testing throughout

**Deliverable:** Functional staging site for Tyler review before launch.

---

### Phase 5 — Explainer Video Production (Week 2–5, parallel)

**Goal:** 30-second explainer video — start early, don't leave for the end.

> **Reference material acquired (May 21, 2026):** Old explainer script reviewed. Key themes: "creating magic through the power of connection," Smarter/Sustainably/Collectively/Effectively/Creatively/Strategically, "your success is our success," "impact story that resonates in high decibels." New script should honor these themes while sharpening the hook and tightening to ~75 words.

**Tasks:**
- Script: 3 drafts, ~75 words final, structure of problem/solution/credibility/CTA
- Storyboard frame by frame before opening any production tool
- Visual style consistent with The Protagonist palette (black/white/red)
- Production in Canva (or Premiere if assets warrant)
- Export 1080p, host on YouTube/Vimeo, embed on home page (don't upload raw to Wix — kills load time)

**Deliverable:** Final video file + embed code + social-ready cut.

---

### Phase 6 — SEO Recovery & 11Eleven Migration (Week 6–7)

**Goal:** Capture 9 years of accumulated SEO authority that's currently rotting on a dead domain.

**Tasks:**
- Build full redirect map from Wayback CDX API (1,583 URLs to filter and map)
- Get Tyler's Squarespace registrar access for 11elevenconsulting.com
- Restore minimal hosting OR Cloudflare Workers for proper 301s (NOT registrar-level forwarding — that kills equity)
- Implement page-by-page 301 redirects via `.htaccess` or Cloudflare page rules
- Verify both domains in Google Search Console
- Submit "Change of Address" in Search Console (old → new)
- Resubmit sitemap for new domain
- Run outreach campaign to top 20 publications still linking to the dead domain (Forbes, VoyagePhoenix, IdeaMensch, Arizona Foothills Magazine, etc.)

**Deliverable:** Redirect map + implementation + outreach tracker. Tyler's 9 years of brand equity now flowing to CFG.

---

### Phase 7 — QA, Launch & Handoff (Week 8–9)

**Goal:** Clean launch with measurable proof of impact.

**Tasks:**
- Cross-browser testing (Chrome, Firefox, Safari, mobile iOS + Android)
- Re-run PageSpeed — capture the new mobile score (target: 31 → 80+)
- Re-run WAVE accessibility audit — document improvements
- Test every form submission end-to-end
- Walk every page as a first-time visitor — does the value prop land in <10 seconds?
- Google Search Console sitemap submission
- Analytics verification (GA4 firing, conversion events tracked)
- Update guide for Tyler (numbered steps, screenshots, plain language)
- Style guide deliverable
- Redirect map handoff
- "Future enhancements" recommendations doc

**Deliverable:** Live site + complete handoff package + before/after performance metrics.

---

### Phase 8 — Customer Acquisition Workstream (Week 4 onward, parallel)

**Goal:** Equip Tyler with a lead generation foundation, not just a prettier site.

This is the bonus workstream that turns the engagement from "website redesign" into "growth platform." Discussed in detail in its own dedicated chat.

**Tasks include:**
- Newsletter setup (Mailchimp/ConvertKit free tier)
- Lead magnet design (CSR Maturity Assessment, B-Corp Readiness Scorecard, or similar)
- Calendly booking link for discovery calls
- LinkedIn outreach templates for Tyler's network
- Email signature standardization for Tyler
- Google Business Profile claim + optimization
- Local citation cleanup (NAP consistency across AZ directories)
- Press credential surfacing (Forbes column, MuckRack, etc.)

**Deliverable:** Lead generation infrastructure + 90-day post-launch playbook for Tyler.

---

## Chat Structure for This Project

Create the following chats inside this project. Each chat has a focused purpose — keeps context tight and makes search-back useful later.

| # | Chat Name | Purpose |
|---|-----------|---------|
| 1 | **CFG — Project Hub & Tyler Comms** *(this chat)* | Master strategy, Tyler-facing communications, decisions, status updates |
| 2 | **CFG — Phase 1: Audit & Discovery** | Completing remaining audits (brand ✓, local SEO, conversion, analytics, social, B-Corp readiness, reputation) |
| 3 | **CFG — Phase 2: Strategy & IA** | Sitemap, content strategy, messaging hierarchy, B-Corp positioning |
| 4 | **CFG — Phase 3: Brand & Visual Identity** | The Protagonist system — logo expansion, component library, style guide (open in Opus) |
| 5 | **CFG — Phase 4: Wix Build** | Page-by-page implementation, component decisions, technical questions |
| 6 | **CFG — Phase 5: Explainer Video** | Script drafts, storyboard, production decisions |
| 7 | **CFG — Phase 6: SEO Recovery & 11Eleven Migration** | Redirect map, outreach campaign, Search Console work |
| 8 | **CFG — Phase 7: QA & Launch** | Testing, handoff package, update guide for Tyler |
| 9 | **CFG — Customer Acquisition** | Lead gen infrastructure, newsletter, lead magnets, local SEO, LinkedIn strategy |
| 10 | **CFG — Personal Portfolio & Case Study** | Aaron's career capture — before/after screenshots, metrics, case study write-up for portfolio |

**Why this structure works:** Chats 2–8 are time-bound and close out when the phase ships. Chats 1, 9, and 10 are evergreen and stay open through the whole engagement. When a phase wraps, screenshot or copy any decisions worth carrying forward into Chat 1.

---

## Model Usage Guidance (Sonnet vs Opus)

**Default: Claude Sonnet for 85–90% of work.** Sonnet handles the vast majority of what this internship requires:

- Daily research, audits, and competitor analysis
- Drafting documents, emails, reports, status updates
- Coding and build work (Wix interactions, HTML/CSS/JS for embeds)
- Image and asset search
- Writing copy, meta descriptions, alt text
- Most outreach prep
- Code reviews and debugging
- Phase-specific implementation work

**Switch to Claude Opus for ~10–15% of work — the strategic depth moments.** Use Opus when:

- **Kicking off a new phase** — the strategy session that sets direction
- **Synthesizing across multiple inputs** — e.g., taking 10 audit findings and turning them into a unified strategy doc for Tyler
- **Making multi-variable strategic decisions** — e.g., "should we phase the migration or big-bang launch?"
- **Pre-meeting prep for high-stakes Tyler conversations** — pitch deck logic, anticipated objections, decision frameworks
- **Brand identity synthesis** — translating audit findings + benchmark patterns + Tyler's voice into a coherent visual system
- **Final case study writing** — portfolio-worthy synthesis at the end
- **Critical debugging where reasoning depth matters** — complex SEO migration edge cases, redirect mapping logic

**I (Claude) will proactively alert you when to switch to Opus.** When I see one of these signals, I'll flag it explicitly: *"This is an Opus-worthy moment — recommend opening a new chat in Opus for this strategic synthesis."* If we're already in Opus and a task is overkill for it, I'll also flag that: *"This is straightforward — Sonnet handles this fine in the next chat, save the Opus budget."*

You stay in driver's seat. I just call out the moments where the model choice matters.

---

## Communication Rhythm with Tyler

**Weekly check-in:** Brief Friday status update (3–5 sentences max). What shipped, what's next, any blockers. Founders are busy; respect their time.

**Phase gate reviews:** Formal presentation at the end of Phases 1, 2, 3, 4. Tyler signs off before next phase starts. This is the discipline that keeps scope tight and prevents rework.

**Direct escalation:** Any blocker that costs more than 4 hours — surface it same-day. Don't sit on problems.

**Decision log:** Track major decisions in the Key Decisions Log above. Date, decision, reasoning, alternatives considered. Protects both sides if memory disputes arise.

---

## Success Metrics

What "good" looks like at the end of the engagement:

- **Mobile PageSpeed:** 31 → 80+ (proof of platform decision)
- **Total page weight:** 16,574 KiB → <2,000 KiB
- **Accessibility (WAVE errors):** Document baseline, achieve zero errors at launch
- **11Eleven redirect map:** 100+ high-value URLs mapped and live
- **B-Corp readiness:** Site contains all PBC-aligned messaging, mission/values, transparency commitments — ready to flip the certification switch the day Tyler hits 80 on BIA
- **Lead generation infrastructure:** Newsletter live, Calendly live, lead magnet live, GBP claimed and optimized
- **Tyler's personal brand integrated:** Forbes column, press credentials, client history all surfaced on the new site

---

## Risk Watch

- **Scope creep.** Tyler has urgency. Urgency drives "while you're at it..." requests. Hold scope gates firmly. Track everything new as Phase 2/3 candidates, not Phase 1 additions.
- **Video production.** Biggest unknown. Start early. Have a backup plan if production stalls. Old script acquired — new script drafting should begin Week 2.
- **11Eleven domain access.** Requires Tyler's Squarespace login or her cooperation to add Aaron as a delegate. Get this lined up by Week 4 at the latest.
- **Analytics access.** Need GA4 + Search Console admin access from Tyler. Ask early.
- **B-Corp certification timeline.** The site should be ready before Tyler hits 80 on BIA. If her certification timeline accelerates, Phase 7 needs to compress.
- **Phase 3 content adaptation.** The Protagonist was designed leading with personal conviction. Adapting it for CFG's service framework requires careful content architecture work — don't just skin-swap, re-structure.

---

## Weekly Progress Log

> Update at the end of each week. Keep entries short — bullets, not prose.

### Week 1 (May 13–17, 2026)
- Started Wednesday May 13
- Won internship pitch with Tyler
- Completed initial recon: site audit, PageSpeed data, domain forensics, B-Corp competitor benchmarks
- Confirmed 11Eleven domain still owned by Tyler (huge strategic finding)
- Built audit foundation; preparing remaining Phase 1 work

### Week 2 (May 18–21, 2026)
- Conducted full brand identity audit: logo analysis, official brand book review (Aidan Taylor Marketing), typography, iconography
- Reviewed key Tyler documents: founder bio, CFG Brief v2, explainer video script (old), brand book
- Built 12 full-page HTML color scheme mockups deployed to GitHub: `hurstaaron.github.io/Collaboration_For_Good`
  - Group 1: Ember Forest, Ember Earth, Ember Slate, Desert Authority, Electric Heart, Forbes Authority
  - Group 2: Crimson & Gold, Chic Noir, Carbon & Red, Ivory & Red (Tyler's stated aesthetic direction)
  - Group 3: Magic & Connection (official brand palette, Bebas Neue, real logo embedded)
  - Group 4: The Protagonist (personal site recommendation — now also selected for CFG)
- **Tyler selected "The Protagonist" as the CFG color scheme** — black/white/off-white + red, editorial, purpose-first
- Phase 3 direction locked; 9 Phase 1 audit tracks still outstanding

### Week 3
*(to be filled)*

---

## Reference Documents

- Resume: `Resume_CollaborationForGood.docx`
- Cover Letter: `CoverLetter_CollaborationForGood.docx`
- Internship Brief: `UAT_Website_Revamp__UX_Optimization___Explainer_Video_Internship__REMOTE___2_.pdf`
- Brand Book: `CFG_Brand_Book__1_.pdf` (Aidan Taylor Marketing)
- CFG Brief v2: `CFG_Brief_v2.pptx`
- Founder Bio: `Founder_Bio_CFG.docx`
- Old Explainer Script: `Old_Explainer_video_script.docx`
- CFG Heart Logo (standalone): `CFG_Final_Color_Heart_Only.png`
- This document: `progress.md`

---

*Built by Aaron Hurst, UAT Computer Science, with Claude (Sonnet + Opus as appropriate).*
*Last updated: May 21, 2026*
