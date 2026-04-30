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

    logger.info("Database seed complete");
  } catch (err) {
    logger.error({ err }, "Seed error");
  }
}
