import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import {
  usersTable,
  teamMembersTable,
  contentPagesTable,
  postsTable,
} from "@workspace/db";
import { sql, eq } from "drizzle-orm";
import { logger } from "./lib/logger";

export async function seed(): Promise<void> {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@pamliecoconnect.com";

    if (!adminPassword) {
      logger.warn(
        "ADMIN_PASSWORD env var is not set — skipping admin user seed. " +
        "Set ADMIN_PASSWORD (and optionally ADMIN_EMAIL) to bootstrap the admin account.",
      );
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await db
        .insert(usersTable)
        .values({
          name: "Admin",
          email: adminEmail,
          phone: "+1-555-000-0001",
          passwordHash,
          role: "admin",
          approvalStatus: "approved",
          ndaAccepted: true,
        })
        .onConflictDoUpdate({
          target: usersTable.email,
          set: {
            passwordHash,
            role: "admin",
            approvalStatus: "approved",
            ndaAccepted: true,
          },
        });
      logger.info({ adminEmail }, "Admin user seeded");
    }

    const [{ teamCount }] = await db
      .select({ teamCount: sql<number>`count(*)::int` })
      .from(teamMembersTable);

    // Migrate: if the DB still has the old placeholder team, replace with real members
    const hasPlaceholders = teamCount > 0 && (await db
      .select({ c: sql<number>`count(*)::int` })
      .from(teamMembersTable)
      .where(eq(teamMembersTable.name, "Dr. Elena Vasquez"))
      .then(([row]) => Number(row?.c ?? 0) > 0));

    if (hasPlaceholders) {
      await db.delete(teamMembersTable);
      logger.info("Removed placeholder team members — seeding real leadership team");
    }

    if (teamCount === 0 || hasPlaceholders) {
      await db
        .insert(teamMembersTable)
        .values([
          {
            name: "Jay M. Phillips",
            title: "CEO & Product Development",
            bio: "Jay has been immersed in the maritime industry since the age of 14, accumulating over 100,000 bluewater miles. His career spans ownership and management of sail lofts, boat building operations, and maritime web development firms. Jay currently serves as Chair of Hatteras Sailing, an educational maritime nonprofit, bringing decades of hands-on experience and passion for the sea to PamliEcoConnect.",
            headshotUrl: null,
            displayOrder: 1,
          },
          {
            name: "John Edward Elion",
            title: "CFO & Technology Professional",
            bio: "John has served as Chair of the Waterworks Foundation, a Chesapeake Bay environmental organization. He has owned and built several multihull brands across the United States and Canada, combining deep financial acumen with a lifelong commitment to environmental stewardship in the maritime sector.",
            headshotUrl: null,
            displayOrder: 2,
          },
          {
            name: "Alan Stewart",
            title: "Design Team Leader",
            bio: "Alan holds a degree in Aerospace Engineering and brings over a decade of partnership at B&B Boat Designs in Eastern North Carolina. His aerospace background directly informs PamliEcoConnect's hydrofoil engineering, where principles of lift, drag, and structural efficiency are as critical on the water as they are in the air.",
            headshotUrl: null,
            displayOrder: 3,
          },
        ]);
    }

    await db
      .insert(contentPagesTable)
      .values([
        {
          slug: "home",
          title: "PamliEcoConnect Home",
          content:
            "PamliEcoConnect engineers cutting-edge electric foiling boats. Aerospace precision meets maritime craft for a silent, zero-emission, high-speed experience.",
          metaData: {
            heroTitle: "Airborne above the water's surface.",
            heroTagline: "The Future of Waterborne Transport",
            introHeading: "Silent. Fast. Precision-Engineered.",
            introText:
              "We are revolutionizing marine mobility. By lifting the hull out of the water, our advanced hydrofoil technology reduces drag by up to 80%, enabling unprecedented range and speed on battery power alone.",
          },
        },
        {
          slug: "exec-summary",
          title: "Executive Summary",
          content: `<h2>Executive Summary</h2>
<p>PamliEcoConnect is a next-generation electric foiling boat manufacturer headquartered in the United States. We design, engineer, and manufacture high-performance electric hydrofoil vessels for passenger, military, and recreational applications.</p>
<h3>Mission</h3>
<p>To accelerate the transition to zero-emission maritime transport through advanced electric foiling technology that is faster, quieter, and more efficient than conventional vessels.</p>
<h3>Market Opportunity</h3>
<p>The global electric boat market is projected to exceed $20 billion by 2030, growing at a CAGR of 12%. PamliEcoConnect is positioned to capture a significant share of this rapidly expanding market across multiple verticals.</p>
<h3>Competitive Advantage</h3>
<ul>
  <li>Proprietary hydrofoil flight control algorithms derived from aerospace engineering</li>
  <li>Battery management system achieving class-leading energy density and cycle life</li>
  <li>Modular hull architecture enabling rapid adaptation across use cases</li>
  <li>Experienced leadership team with deep marine, aerospace, and defense expertise</li>
</ul>`,
          metaData: { section: "investor" },
        },
        {
          slug: "products",
          title: "Products",
          content: `<h2>Product Portfolio</h2>
<h3>PamliConnect P-40 Passenger Ferry</h3>
<p>The P-40 carries up to 40 passengers at sustained speeds of 35 knots with zero emissions. Designed for urban water transit, island connections, and eco-tourism operators seeking to replace aging diesel ferries.</p>
<h3>PamliConnect M-12 Maritime Patrol</h3>
<p>A military-grade fast response craft capable of 55+ knot sprint speed, minimal acoustic signature, and all-weather operation. Designed for coast guard, port security, and naval patrol applications.</p>
<h3>PamliConnect R-8 Recreational Foiler</h3>
<p>A premium recreational vessel for private buyers seeking the ultimate on-water experience. The R-8 accommodates 8 guests, foils silently at 28 knots, and represents the pinnacle of sustainable luxury watercraft.</p>`,
          metaData: { section: "investor" },
        },
        {
          slug: "services",
          title: "Services",
          content: `<h2>Service & Support</h2>
<p>PamliEcoConnect offers comprehensive lifecycle support across all product lines.</p>
<h3>Fleet Management Platform</h3>
<p>Our proprietary cloud-based fleet management platform provides real-time telemetry, predictive maintenance alerts, battery state analytics, and route optimization for commercial operators.</p>
<h3>Training & Certification</h3>
<p>Operator training programs and captain certification for all PamliEcoConnect vessels, delivered on-site or at our training centers.</p>
<h3>Maintenance & Overhaul</h3>
<p>Factory-authorized service centers and mobile service teams ensure maximum uptime for commercial clients. Extended warranty packages and service level agreements are available.</p>
<h3>Custom Engineering</h3>
<p>Bespoke hull configurations, propulsion layouts, and mission system integrations for government and defense clients with specialized requirements.</p>`,
          metaData: { section: "investor" },
        },
        {
          slug: "marketing-plan",
          title: "Marketing Plan",
          content: `<h2>Go-to-Market Strategy</h2>
<h3>Target Segments</h3>
<ul>
  <li><strong>Government & Defense:</strong> Coast guard, naval patrol, port authority contracts via direct sales and defense procurement channels</li>
  <li><strong>Commercial Operators:</strong> Ferry lines, water taxi services, and eco-tourism operators seeking emissions compliance and fuel savings</li>
  <li><strong>Private Buyers:</strong> High-net-worth individuals and charter operators in premium recreational markets</li>
</ul>
<h3>Distribution</h3>
<p>Direct sales for government and fleet contracts; authorized dealer network for recreational and charter markets across North America, Europe, and Asia Pacific.</p>
<h3>Marketing Channels</h3>
<p>Industry trade shows (METS, Miami International Boat Show, DSEI), digital marketing targeting maritime decision-makers, media partnerships with marine and sustainability publications, and strategic PR driving earned media coverage.</p>`,
          metaData: { section: "investor" },
        },
        {
          slug: "financial-plan",
          title: "Financial Plan",
          content: `<h2>Financial Projections</h2>
<h3>Revenue Model</h3>
<p>Primary revenue from vessel sales; secondary recurring revenue from service contracts, fleet management subscriptions, and spare parts. Government contracts typically include multi-year service agreements.</p>
<h3>5-Year Outlook</h3>
<ul>
  <li><strong>Year 1:</strong> $4.2M — Pilot deliveries, R&D completion, government procurement entry</li>
  <li><strong>Year 2:</strong> $11.8M — Commercial ferry contracts, dealer network activation</li>
  <li><strong>Year 3:</strong> $28.5M — Full production ramp, international expansion begins</li>
  <li><strong>Year 4:</strong> $52.1M — Defense contracts maturing, recreational market scaling</li>
  <li><strong>Year 5:</strong> $89.3M — Global operations, target profitability achieved</li>
</ul>
<h3>Use of Funds</h3>
<p>This funding round will be allocated: 45% production facility expansion, 30% R&D and certification, 15% sales and marketing, 10% working capital and operations.</p>`,
          metaData: { section: "investor" },
        },
        {
          slug: "grants",
          title: "Grant Opportunities",
          content: `<h2>Grant Opportunities</h2>
<p>PamliEcoConnect is positioned to pursue significant federal and state grant funding across clean maritime technology, shipbuilding, workforce development, and port electrification. This section covers our readiness checklist, prioritized action plan, and a curated list of currently active and upcoming funding programs.</p>
<p class="text-xs text-muted-foreground mt-1">Prepared by Jay Phillips / Phillips Boat Works — April 27, 2026</p>

<hr class="my-8 border-border"/>

<h2>Part 1 — Grant Readiness &amp; Action Plan</h2>

<h3>1. Readiness Checklist</h3>

<h4>Category 1: Registrations &amp; Identifiers</h4>
<ul>
  <li><strong>SAM.gov &amp; UEI:</strong> An active SAM registration and Unique Entity Identifier (UEI) is required to receive any federal funds. Requires sharing business bank account information. <em>Note: SAM.gov is currently experiencing significant processing backlogs — begin immediately.</em></li>
  <li><strong>Research.gov &amp; SBIR Company Registry:</strong> Required specifically for NSF SBIR/STTR proposals.</li>
  <li><strong>ARPA-E eXCHANGE:</strong> Required to apply for DOE maritime battery and electrification grants such as PROPEL-1K.</li>
</ul>

<h4>Category 2: Compliance &amp; Documentation</h4>
<ul>
  <li><strong>Foreign Risk &amp; Security Screening:</strong> Documented, transparent records of ownership structure, capital sources, key personnel affiliations, and cybersecurity safeguards are required to pass mandatory SBIR/STTR due diligence reviews.</li>
  <li><strong>DCAA/FAR Compliant Accounting:</strong> Phase II awards (up to $2M) require pre-award accounting surveys verifying financial systems meet Federal Acquisition Regulation (FAR) and Defense Contract Audit Agency (DCAA) standards.</li>
  <li><strong>Core Proposal Boilerplate:</strong> Prepare standard documents including budget justifications, organizational capability statements, and key personnel CVs.</li>
  <li><strong>Benefit-Cost Analyses:</strong> Many maritime infrastructure grants require a formal benefit-cost analysis comparing no-build versus build scenarios over a 25–50 year lifecycle.</li>
</ul>

<h4>Category 3: Partnerships</h4>
<ul>
  <li><strong>U.S. Shipyards:</strong> Participation by at least one U.S. shipyard is a strict requirement for all National Shipbuilding Research Program (NSRP) projects.</li>
  <li><strong>Universities &amp; Research Institutions:</strong> Required for STTR grants (minimum 30% of work by the institution), and strongly encouraged for NSF SBIR and workforce development (ATE) programs.</li>
  <li><strong>Local Stakeholders:</strong> Official letters of support from federal, state, and local policymakers or port authorities are required to secure infrastructure and transit grants.</li>
</ul>

<h4>Category 4: Technical &amp; Commercial Materials</h4>
<ul>
  <li><strong>Project Pitches / White Papers:</strong> Required to assess technical fit before being invited to submit full proposals for NSF and NSRP programs.</li>
  <li><strong>Commercialization Plan:</strong> Reviewers look for early market validation signals including customer discovery, acquisition pathways, and IP strategy (provisional patents, freedom-to-operate analyses).</li>
  <li><strong>Technology Readiness Level (TRL) Roadmaps:</strong> Must identify starting TRL and map a path to TRL 9 in a shipbuilding or operational environment.</li>
</ul>

<h4>Category 5: Financials &amp; Match</h4>
<ul>
  <li><strong>Accessible Cost-Share:</strong> Most discretionary federal grants (FTA ferry grants, Port Infrastructure Development Program) require a 20% local match documented as "ready and accessible."</li>
  <li><strong>Strategic Match Capital:</strong> Strategic Breakthrough Phase II awards require 100% matching from private capital, commercial revenue, or non-SBIR defense contracts.</li>
  <li><strong>Cost-Share Waivers:</strong> As a small business, PamliEcoConnect can claim waivers for the standard 50% cost-share requirement on NSRP Research Announcement projects.</li>
</ul>

<h4>Category 6: Repeated Evaluation Themes</h4>
<ul>
  <li><strong>Innovation &amp; Commercial Potential:</strong> Projects must prove scientific/technical merit and clear commercial viability.</li>
  <li><strong>Emissions &amp; Climate Benefits:</strong> Strong emphasis on reducing greenhouse gases, port electrification, and zero-emission technology deployment.</li>
  <li><strong>Workforce Development:</strong> Priority given to projects that train the next generation of maritime workers, support apprenticeships, and partner with educational institutions.</li>
</ul>

<hr class="my-8 border-border"/>

<h3>2. Prioritized Actions</h3>

<h4>Do These First — Next 30–60 Days</h4>
<ol>
  <li><strong>Register for SAM.gov</strong> to initiate UEI assignment immediately due to current processing backlogs.</li>
  <li><strong>Register for Research.gov and the SBA SBIR Company Registry</strong> to be legally ready to submit NSF proposals.</li>
  <li><strong>Register for ARPA-E eXCHANGE</strong> to access and review the active PROPEL-1K FOA for maritime battery systems.</li>
  <li><strong>Draft a 2-page Project Pitch</strong> for the NSF SBIR program (targeting the "Mobility" topic) and submit to receive an official invitation for a full proposal.</li>
  <li><strong>Audit ownership structure</strong> and foreign investment connections to prepare compliance documentation for mandatory SBIR security due diligence rules.</li>
  <li><strong>Identify a U.S. Shipyard partner</strong> and request a letter of commitment to satisfy the mandatory eligibility requirement for upcoming NSRP solicitations.</li>
</ol>

<h4>6–12 Month Roadmap</h4>
<ul>
  <li><strong>Months 3–4 (Partnerships &amp; Concept Refinement):</strong> Deepen relationships with university partners (NC State, UNC) to open STTR grant pathways and collaborate on engineering and battery challenges. Begin drafting NSRP White Papers ahead of spring/summer solicitation cycles.</li>
  <li><strong>Months 5–6 (Boilerplate &amp; Advocacy):</strong> Prepare boilerplate sections for technical narratives, commercialization plans, and budget justifications. Request letters of support from NC stakeholders (EDPNC, local economic development boards) to demonstrate community backing.</li>
  <li><strong>Months 7–9 (Financial Match Readiness):</strong> Line up and document non-federal cost-share sources. Ensure these funds are formally marked as "ready and accessible" for transit and manufacturing grant applications.</li>
  <li><strong>Months 10–12 (Phase II Readiness):</strong> Begin upgrading internal financial and accounting systems to meet DCAA and FAR standards — a critical hurdle to clear for Phase II funding (up to $2M) and future Strategic Breakthrough awards.</li>
</ul>

<hr class="my-8 border-border"/>

<h3>3. Gaps Requiring External Research</h3>
<ul>
  <li><strong>Exact NOFO Dates:</strong> Several major grants (MARAD Small Shipyard, EPA Clean Ports, FTA Electric Ferry Pilot) are listed as "Annual" but exact 2026 Notice of Funding Opportunity release dates and deadlines require verification.</li>
  <li><strong>NC State-Level Vendor Registrations:</strong> State support via NC Commerce and EDPNC is available, but specific state-level procurement portals and vendor registration steps needed for state matching funds or local contracts require confirmation.</li>
  <li><strong>Maritime Prosperity Zone Boundaries:</strong> Up to 100 Maritime Prosperity Zones (MPZs) were to be defined by July 8, 2025. The final map and geographic boundaries for North Carolina — and specifically whether Pamlico County qualifies — must be confirmed with the Department of Commerce.</li>
</ul>

<hr class="my-8 border-border"/>

<h2>Part 2 — Current &amp; Active Grant Programs</h2>
<p>Programs currently open or clearly active/recurring that align with PamliEcoConnect's profile in electric foiling ferries and maritime deep-tech.</p>

<div class="overflow-x-auto mt-6">
<table class="w-full text-sm border-collapse">
  <thead>
    <tr class="border-b border-border">
      <th class="text-left py-3 pr-4 font-semibold text-foreground">Program</th>
      <th class="text-left py-3 pr-4 font-semibold text-foreground">Agency</th>
      <th class="text-left py-3 pr-4 font-semibold text-foreground">Award Size</th>
      <th class="text-left py-3 pr-4 font-semibold text-foreground">Match</th>
      <th class="text-left py-3 font-semibold text-foreground">Status / Window</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">PROPEL-1K<br/><span class="font-normal text-muted-foreground text-xs">Pioneering Railroad, Oceanic, and Plane Electrification</span></td>
      <td class="py-3 pr-4 text-muted-foreground">DOE / ARPA-E</td>
      <td class="py-3 pr-4 text-muted-foreground">~15 awards expected</td>
      <td class="py-3 pr-4 text-muted-foreground">None required</td>
      <td class="py-3 text-muted-foreground">Active (DE-FOA-0003163)</td>
    </tr>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">NSF SBIR Phase I<br/><span class="font-normal text-muted-foreground text-xs">Mobility Topic — America's Seed Fund</span></td>
      <td class="py-3 pr-4 text-muted-foreground">NSF</td>
      <td class="py-3 pr-4 text-muted-foreground">Up to $275K–$305K</td>
      <td class="py-3 pr-4 text-muted-foreground">0% (no equity)</td>
      <td class="py-3 text-muted-foreground">Rolling (closes Feb 28, May 31, Aug 31, Nov 30)</td>
    </tr>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">NSRP Research Announcement<br/><span class="font-normal text-muted-foreground text-xs">National Shipbuilding Research Program</span></td>
      <td class="py-3 pr-4 text-muted-foreground">NSRP / U.S. Navy</td>
      <td class="py-3 pr-4 text-muted-foreground">Varies (multi-million total pool)</td>
      <td class="py-3 pr-4 text-muted-foreground">50% — waived for small biz</td>
      <td class="py-3 text-muted-foreground">Annual (spring/summer cycle)</td>
    </tr>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">Assistance to Small Shipyards<br/><span class="font-normal text-muted-foreground text-xs">MARAD Small Shipyard Grant Program</span></td>
      <td class="py-3 pr-4 text-muted-foreground">MARAD / DOT</td>
      <td class="py-3 pr-4 text-muted-foreground">$105M total FY27, ~20 awards</td>
      <td class="py-3 pr-4 text-muted-foreground">&gt;25% preferred</td>
      <td class="py-3 text-muted-foreground">Annual (exact 2026 dates TBD)</td>
    </tr>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">Title XI — Federal Ship Financing<br/><span class="font-normal text-muted-foreground text-xs">Federal Ship Financing Program</span></td>
      <td class="py-3 pr-4 text-muted-foreground">MARAD / DOT</td>
      <td class="py-3 pr-4 text-muted-foreground">$1.8B loan approval capacity</td>
      <td class="py-3 pr-4 text-muted-foreground">N/A (loan guarantee)</td>
      <td class="py-3 text-muted-foreground">Rolling / recurring</td>
    </tr>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">Electric or Low-Emitting Ferry Pilot<br/><span class="font-normal text-muted-foreground text-xs">FTA Electric Ferry Pilot Program</span></td>
      <td class="py-3 pr-4 text-muted-foreground">FTA</td>
      <td class="py-3 pr-4 text-muted-foreground">$50M available per year</td>
      <td class="py-3 pr-4 text-muted-foreground">20% match</td>
      <td class="py-3 text-muted-foreground">Annual (exact 2026 dates TBD)</td>
    </tr>
    <tr>
      <td class="py-3 pr-4 font-medium text-foreground">DoD SBIR / STTR<br/><span class="font-normal text-muted-foreground text-xs">Department of Defense across all components</span></td>
      <td class="py-3 pr-4 text-muted-foreground">DoD (Navy, DARPA, etc.)</td>
      <td class="py-3 pr-4 text-muted-foreground">Standard Phase I/II amounts</td>
      <td class="py-3 pr-4 text-muted-foreground">0% match</td>
      <td class="py-3 text-muted-foreground">Multiple per year (Feb, Apr, May closings)</td>
    </tr>
  </tbody>
</table>
</div>

<hr class="my-8 border-border"/>

<h2>Part 3 — Future &amp; Upcoming Programs (6–18 Months)</h2>
<p>Recurring or likely opportunities not necessarily open today, targeted for the next 6–18 months of our pipeline.</p>

<div class="overflow-x-auto mt-6">
<table class="w-full text-sm border-collapse">
  <thead>
    <tr class="border-b border-border">
      <th class="text-left py-3 pr-4 font-semibold text-foreground">Program</th>
      <th class="text-left py-3 pr-4 font-semibold text-foreground">Agency</th>
      <th class="text-left py-3 pr-4 font-semibold text-foreground">Typical Award</th>
      <th class="text-left py-3 pr-4 font-semibold text-foreground">Match</th>
      <th class="text-left py-3 font-semibold text-foreground">Timing</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">DOT SBIR Phase I<br/><span class="font-normal text-muted-foreground text-xs">Transportation R&amp;D — Mobility</span></td>
      <td class="py-3 pr-4 text-muted-foreground">DOT</td>
      <td class="py-3 pr-4 text-muted-foreground">Standard Phase I (0% equity)</td>
      <td class="py-3 pr-4 text-muted-foreground">0%</td>
      <td class="py-3 text-muted-foreground">Annual Q1 (historically closes early March)</td>
    </tr>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">Strategic Breakthrough Phase II<br/><span class="font-normal text-muted-foreground text-xs">Deep Tech Scaling — Bridge Valley of Death</span></td>
      <td class="py-3 pr-4 text-muted-foreground">DoD / NSF</td>
      <td class="py-3 pr-4 text-muted-foreground">Up to $30M over 4 years</td>
      <td class="py-3 pr-4 text-muted-foreground">100% private match required</td>
      <td class="py-3 text-muted-foreground">First solicitations expected Q4 2026</td>
    </tr>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">NSF Advanced Technological Education (ATE)<br/><span class="font-normal text-muted-foreground text-xs">STEM Workforce Development</span></td>
      <td class="py-3 pr-4 text-muted-foreground">NSF</td>
      <td class="py-3 pr-4 text-muted-foreground">Pool of $69M–$74M annually</td>
      <td class="py-3 pr-4 text-muted-foreground">Varies</td>
      <td class="py-3 text-muted-foreground">Annual — <strong>Next deadline: October 1, 2026</strong></td>
    </tr>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">EPA Clean Ports Program<br/><span class="font-normal text-muted-foreground text-xs">Port Electrification &amp; Zero-Emission Tech</span></td>
      <td class="py-3 pr-4 text-muted-foreground">EPA</td>
      <td class="py-3 pr-4 text-muted-foreground">$3B allocated FY24</td>
      <td class="py-3 pr-4 text-muted-foreground">10–20% match</td>
      <td class="py-3 text-muted-foreground">Annual (exact 2026 dates TBD)</td>
    </tr>
    <tr class="border-b border-border/50">
      <td class="py-3 pr-4 font-medium text-foreground">NSF STTR — Technology Transfer<br/><span class="font-normal text-muted-foreground text-xs">Collaborative R&amp;D with University Partners</span></td>
      <td class="py-3 pr-4 text-muted-foreground">NSF</td>
      <td class="py-3 pr-4 text-muted-foreground">$275K Phase I / $2M Phase II</td>
      <td class="py-3 pr-4 text-muted-foreground">0% equity</td>
      <td class="py-3 text-muted-foreground">Rolling windows — next opens July 15, 2026</td>
    </tr>
    <tr>
      <td class="py-3 pr-4 font-medium text-foreground">DoD SBIR/STTR — Defense Maritime<br/><span class="font-normal text-muted-foreground text-xs">Dual-use composites, guidance, propulsion</span></td>
      <td class="py-3 pr-4 text-muted-foreground">DoD (Navy, DARPA)</td>
      <td class="py-3 pr-4 text-muted-foreground">Standard Phase I/II</td>
      <td class="py-3 pr-4 text-muted-foreground">0%</td>
      <td class="py-3 text-muted-foreground">Multiple releases per year — monitor closely</td>
    </tr>
  </tbody>
</table>
</div>`,
          metaData: { section: "investor" },
        },
        {
          slug: "conclusion",
          title: "Conclusion",
          content: `<h2>Investment Thesis</h2>
<p>PamliEcoConnect represents a rare opportunity to invest at the ground floor of a high-growth clean technology company addressing a multi-billion dollar addressable market with a proprietary, defensible technology platform.</p>
<h3>Why Now</h3>
<p>Regulatory tailwinds (IMO 2030 emissions mandates, urban zero-emission ferry zones), falling battery costs, and rising fuel prices are converging to create an inflection point for electric marine adoption.</p>
<h3>Why PamliEcoConnect</h3>
<p>Our team combines rare expertise across aerospace engineering, naval architecture, defense procurement, and commercial maritime operations. We have the technology, the team, and the timing to define this emerging category.</p>
<h3>Join Us</h3>
<p>We invite accredited investors who share our vision of a cleaner, quieter, faster maritime future to join PamliEcoConnect as we scale from a pioneering startup to the world's leading electric foiling boat company.</p>`,
          metaData: { section: "investor" },
        },
      ])
      .onConflictDoNothing({ target: contentPagesTable.slug });

    // Migrate: delete any placeholder/fake press release posts seeded in dev
    // (identifiable by the fictional "P-40 Electric Foiling Ferry" title)
    await db
      .delete(postsTable)
      .where(eq(postsTable.title, "PamliEcoConnect Unveils P-40 Electric Foiling Ferry"));
    await db
      .delete(postsTable)
      .where(eq(postsTable.title, "Inside the PamliEcoConnect R&D Lab"));
    await db
      .delete(postsTable)
      .where(eq(postsTable.title, "PamliEcoConnect Secures $12M Series A Funding"));
    await db
      .delete(postsTable)
      .where(eq(postsTable.title, "2026 Innovation in Maritime Technology Investor Deck"));
    await db
      .delete(postsTable)
      .where(eq(postsTable.title, "PEC Shield Completes Successful Sea Trials with Coast Guard Observer"));
    await db
      .delete(postsTable)
      .where(eq(postsTable.title, "PamliEcoConnect Announces Series A Funding Round"));
    // Remove earlier incomplete version of the Vandemere article (no links)
    await db
      .delete(postsTable)
      .where(eq(postsTable.title, "Vandemere Community Roundtable Welcomes PamliEcoConnect as Passenger Ferry Vision Takes Shape"));

    // ── Real press releases ──────────────────────────────────────────────────
    const VANDEMERE_TITLE = "Vandemere Community Roundtable Explores Pamlico Sound Passenger Service with PamliEcoConnect";
    // Always delete then re-insert so content/links stay current on each deploy
    await db.delete(postsTable).where(eq(postsTable.title, VANDEMERE_TITLE));
    await db.insert(postsTable).values({
        title: VANDEMERE_TITLE,
        excerpt:
          "Vandemere Mayor Sandra Snipes and Pamlico Economic Development Director Beth Bucksot hosted the Annual Vandemere Community Roundtable on March 28, 2026 — inviting PamliEcoConnect to present a vision for electric passenger service connecting the Triangle to Ocracoke via the Pamlico Sound.",
        content: `<p>On March 28, 2026, Vandemere Mayor <strong>Sandra Snipes</strong> and Pamlico County Economic Development Director <strong>Beth Bucksot</strong> hosted the Annual Vandemere Community Roundtable. PamliEcoConnect was invited by Director Bucksot following Vandemere's extensive feasibility study for a passenger route between Vandemere and Ocracoke.</p>

<p>PamliEcoConnect CEO <strong>Jay Phillips</strong> and CFO <strong>John Elion</strong> attended the roundtable and presented the company's electric foiling vessel technology as a clean, quiet, and high-speed solution for the proposed crossing. Vandemere sits at an exceptional geographic position — a nearly ideal embarkation point for Triangle-area residents (a population of nearly 2 million) seeking weekend and week-long beach trips to the Outer Banks and Ocracoke Island via the Pamlico Sound.</p>

<p>The presentation was well received by community members and local officials. PamliEcoConnect expects to continue working with Vandemere stakeholders as planning for a Blue Economy passenger corridor develops.</p>

<h3>Presentations from the Roundtable</h3>
<ul>
  <li>
    <strong>Audio Podcast Presentation</strong><br/>
    <a href="https://drive.google.com/file/d/1dFmFx8udtVcVUU1f2mQWhWPIXxGOFvxH/viewlink" target="_blank" rel="noopener noreferrer">
      Listen to the Vandemere–Ocracoke Blue Economy Corridor podcast presentation
    </a>
  </li>
  <li>
    <strong>Video Presentation</strong><br/>
    <a href="https://app.heygen.com/videos/vandemere-ocracoke-buxton-a-blue-economy-corridor-21d3f5510b624dc0bbfc47789cd9cca0" target="_blank" rel="noopener noreferrer">
      Watch the Vandemere–Ocracoke–Buxton: A Blue Economy Corridor video presentation
    </a>
  </li>
</ul>`,
        type: "press_release",
        mediaUrl: null,
        featured: true,
        publishedAt: new Date("2026-03-28T12:00:00Z"),
      });
    logger.info("Seeded Vandemere Roundtable press release");

    logger.info("Database seed complete");
  } catch (err) {
    logger.error({ err }, "Seed error");
  }
}
