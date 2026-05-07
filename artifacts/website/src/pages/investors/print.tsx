import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useListContentPages, getListContentPagesQueryKey } from "@workspace/api-client-react";
import { Printer } from "lucide-react";

// ─── DB section order ────────────────────────────────────────────────────────

const DB_SECTIONS = [
  { slug: "exec-summary",     label: "Executive Summary" },
  { slug: "company-overview", label: "Company Overview" },
  { slug: "market-analysis",  label: "Market Analysis" },
  { slug: "services",         label: "Service Model" },
  { slug: "products",         label: "Vessel & Technology" },
  { slug: "marketing-plan",   label: "P3 Partnership" },
  { slug: "operations",       label: "Operations Plan" },
  { slug: "financial-plan",   label: "Financial Plan" },
  { slug: "economic-impact",  label: "Economic Impact" },
  { slug: "risk-analysis",    label: "Risk Analysis" },
  { slug: "timeline",         label: "Implementation Timeline" },
  { slug: "conclusion",       label: "Investors & Funding" },
  { slug: "grants",           label: "Grant Opportunities" },
];

// ─── Static: Management Team prose ───────────────────────────────────────────

const CORE_TEAM = [
  {
    name: "Jay M. Phillips",
    title: "Chief Executive Officer & Project Manager",
    bio: "Founder; responsible for overall company leadership, program management, route and service design, and stakeholder relationships. Jay has been immersed in the maritime industry since the age of 14, accumulating over 100,000 bluewater miles. His career spans ownership and management of sail lofts, boat building operations, and maritime web development firms. Jay currently serves as Chair of Hatteras Sailing, an educational maritime nonprofit.",
  },
  {
    name: "John Edward Elion",
    title: "Chief Financial Officer",
    bio: "Responsible for capital strategy, financial planning & analysis, investor relations, and oversight of grant/loan structures. John has served as Chair of the Waterworks Foundation, a Chesapeake Bay environmental organization. He has owned and built several multihull brands across the United States and Canada, combining deep financial acumen with a lifelong commitment to environmental stewardship.",
  },
];

const ADVISORY_CANDIDATES = [
  { name: "Alan Stewart",          area: "Design & Naval Architecture",      role: "Design Team Leader",               description: "Holds a degree in Aerospace Engineering and brings over a decade of partnership at B&B Boat Designs in Eastern North Carolina. His background in aerodynamics and structural efficiency is directly applicable to foiling vessel design." },
  { name: "Larry Ward",            area: "Mechanical & Electrical Engineering", role: "M/E Engineering Lead",            description: "Has deep experience in propulsion systems, systems integration, and control architectures for high-performance marine platforms." },
  { name: "Role to be filled",     area: "Battery & Powerplant Technology",  role: "Battery/Powerplant Technology Lead", description: "Seeking an expert in energy storage, powertrain architecture, and marine charging systems." },
  { name: "Robert Norton",         area: "Investment & Grant Strategy",       role: "Investment & Grant Acquisition Lead", description: "Has a strong track record in capital raising, investor outreach, and navigating public grant programs." },
  { name: "Jim Gardiner / Compmillenia", area: "Advanced Boatbuilding Technology", role: "Strategic Technology Partner", description: "A recognized authority in advanced composite construction and high-performance hull manufacturing." },
  { name: "Role to be filled",     area: "USCG & Insurance Compliance",      role: "Compliance Lead",                  description: "Seeking an experienced maritime regulatory specialist to guide USCG approval processes and insurer expectations." },
  { name: "Role to be filled",     area: "Production Management",            role: "Production Management Lead",       description: "Seeking an experienced production leader to guide tooling, supply chain management, quality systems, and manufacturing scale-up." },
];

function ManagementTeamContent() {
  return (
    <>
      <p style={{ marginBottom: "1.2rem", lineHeight: "1.7" }}>
        PamliEcoConnect is led by its founding team and is in the process of carefully identifying and
        inviting a select group of maritime engineers, regulatory specialists, and industry veterans
        into advisory and eventual management roles as the company and its financing mature.
      </p>

      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.6rem", marginTop: "1.5rem" }}>Committed Executive Leadership</h3>
      {CORE_TEAM.map((m) => (
        <div key={m.name} style={{ marginBottom: "1.2rem", paddingLeft: "1rem", borderLeft: "3px solid #2a5f8f" }}>
          <p style={{ fontWeight: 700, marginBottom: "0.15rem" }}>{m.name}</p>
          <p style={{ fontStyle: "italic", fontSize: "0.9rem", marginBottom: "0.4rem", color: "#555" }}>{m.title}</p>
          <p style={{ lineHeight: "1.7", fontSize: "0.95rem" }}>{m.bio}</p>
        </div>
      ))}

      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.6rem", marginTop: "1.8rem" }}>Hand-Picked Candidates & Open Roles</h3>
      <p style={{ marginBottom: "1rem", lineHeight: "1.7", fontSize: "0.95rem", fontStyle: "italic" }}>
        The following individuals have been specifically identified for the expertise they would bring
        to PamliEcoConnect. They are interested parties at this stage — not yet formally committed —
        and will be selectively invited into advisory or management roles as the company and its
        financing mature.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f4f8" }}>
            <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "2px solid #2a5f8f" }}>Name</th>
            <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "2px solid #2a5f8f" }}>Focus Area</th>
            <th style={{ textAlign: "left", padding: "6px 10px", borderBottom: "2px solid #2a5f8f" }}>Target Role (if invited)</th>
          </tr>
        </thead>
        <tbody>
          {ADVISORY_CANDIDATES.map((c, i) => (
            <tr key={c.name + i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
              <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: c.name.startsWith("Role") ? "normal" : 600, fontStyle: c.name.startsWith("Role") ? "italic" : "normal", color: c.name.startsWith("Role") ? "#888" : "inherit" }}>{c.name}</td>
              <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0" }}>{c.area}</td>
              <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0" }}>{c.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ─── Static: The Offering prose ──────────────────────────────────────────────

function TheOfferingContent() {
  return (
    <>
      <p style={{ lineHeight: "1.7", marginBottom: "1rem" }}>
        PamliEcoConnect is raising growth capital to commercialize a new class of high-speed, low-wake,
        Jones Act–compliant passenger vessels. Our initial focus is on deploying 20-passenger R&D ferries
        to prove routes, technology, and regulatory pathways, and then scaling to 50-passenger foiling
        vessels across the U.S. coastal and inland maritime transportation network.
      </p>

      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "1.5rem 0 0.6rem" }}>Stage 1 — Seed / Series Seed: R&D &amp; 20-Passenger Platform</h3>
      <p style={{ fontWeight: 600, marginBottom: "0.6rem", color: "#2a5f8f" }}>Target Raise: approximately $1,000,000</p>
      <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.3rem" }}>Use of Proceeds:</p>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8", fontSize: "0.95rem", marginBottom: "1rem" }}>
        <li>Design and engineering for the 20-passenger R&D vessels.</li>
        <li>USCG approval and insurance validation for the 20-passenger platform.</li>
        <li>Initial fleet deployment on the Pamlico ecosystem routes (e.g., Vandemere–Ocracoke–Buxton loop).</li>
        <li>Data collection to demonstrate safety, reliability, passenger demand, and economics.</li>
        <li>Preparation of the 50-passenger vessel specification and regulatory road map.</li>
      </ul>
      <p style={{ lineHeight: "1.7", fontSize: "0.95rem", marginBottom: "1rem" }}>
        This initial round is expected to be issued as <strong>Series Seed Preferred Stock</strong> in PamliEcoConnect
        (final structure subject to legal and tax advice). Early investors are positioning alongside the founding team
        and key advisors at a stage when the company is moving from concept and prototypes to live commercial operations.
      </p>
      <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.5rem" }}>Illustrative Terms for Early Investors:</p>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8", fontSize: "0.95rem", marginBottom: "1rem" }}>
        <li>Preferred equity in the form of Series Seed shares.</li>
        <li>1× non-participating liquidation preference, conversion into common.</li>
        <li>Pro-rata participation rights to maintain ownership in future financing rounds (subject to minimum check sizes).</li>
        <li>Information rights and structured reporting on vessel performance, route economics, and pipeline development.</li>
      </ul>

      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "1.5rem 0 0.6rem" }}>Stage 2 — Series A / Expansion: 50-Passenger Fleet Deployment</h3>
      <p style={{ fontWeight: 600, marginBottom: "0.6rem", color: "#555" }}>Target Raise: approximately $20,000,000 (future round)</p>
      <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.3rem" }}>Anticipated Use of Proceeds:</p>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8", fontSize: "0.95rem", marginBottom: "1rem" }}>
        <li>Final design, engineering, and USCG approval for 50-passenger foiling vessels.</li>
        <li>Tooling, molds, and production ramp-up for multiple 50-passenger vessels.</li>
        <li>Deployment of vessels across priority domestic routes in U.S. maritime transportation hubs.</li>
        <li>Build-out of charging and support infrastructure in key ports.</li>
        <li>Expansion of the operations and maintenance organization to support a national fleet.</li>
      </ul>

      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "1.5rem 0 0.6rem" }}>Early Investor Opportunity</h3>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8", fontSize: "0.95rem", marginBottom: "1rem" }}>
        <li><strong>Favorable entry timing:</strong> The $1M R&D round values the company prior to full commercialization of the 20-passenger platform and prior to any contracted 50-passenger fleet deployments.</li>
        <li><strong>Attractive unit economics:</strong> Pro forma Year 1 operations for the 20-passenger vessels in a single region indicate multi-million-dollar annual ticket revenue and strong operating margins.</li>
        <li><strong>Scalable platform:</strong> Once proven in one region, the same vessel and route model can be replicated across multiple U.S. coastal and inland waterways.</li>
        <li><strong>Multiple value-creation pathways:</strong> Upside from ferry operations, vessel sales, institutional contracts, and corporate Title Sponsorships.</li>
        <li><strong>Strategic exit potential:</strong> The company is being structured to be attractive to large strategic acquirers in transportation, energy, and defense.</li>
      </ul>

      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "1.5rem 0 0.6rem" }}>Investment Process &amp; Subscription</h3>
      <p style={{ lineHeight: "1.7", fontSize: "0.95rem", marginBottom: "0.8rem" }}>
        Participation in the Seed / Series Seed round will be governed by a standard Subscription Agreement and Series Seed
        Preferred Stock financing documents. The Company anticipates setting a minimum individual investment amount of
        approximately $25,000–$50,000, with larger tickets for institutional or lead investors.
      </p>
      <p style={{ lineHeight: "1.7", fontSize: "0.95rem" }}>
        All investors in the round will receive the same class of Series Seed Preferred shares on the same economic terms,
        with any differences limited to board representation or information rights for lead or anchor investors.
      </p>

      <div style={{ marginTop: "1.5rem", padding: "0.75rem 1rem", border: "1px solid #ccc", fontSize: "0.8rem", color: "#666", fontStyle: "italic" }}>
        This section is a summary of a proposed private securities offering and does not constitute an offer to sell or the
        solicitation of an offer to buy any securities. Any such offering will be made only through formal offering documents
        and in compliance with applicable securities regulations.
      </div>
    </>
  );
}

// ─── Static: Subscription Agreement prose ────────────────────────────────────

function SubscriptionAgreementContent() {
  const sections = [
    { n: "1. Subscription", items: [
      { t: "1.1 Subscription for Shares.", b: 'Subject to the terms and conditions of this Agreement, each Investor hereby subscribes for and agrees to purchase, and the Company agrees to issue and sell to such Investor, that number of Shares set forth on the Investor\'s signature page hereto (the "Subscribed Shares") at a purchase price of $[PRICE] per Share (the "Purchase Price").' },
      { t: "1.2 Purchase Amount.", b: 'The aggregate purchase price for the Subscribed Shares (the "Purchase Amount") is set forth on the Investor\'s signature page and shall be paid in cash by wire transfer of immediately available funds to the account designated by the Company on or before the closing of the Offering applicable to such Investor.' },
      { t: "1.3 Acceptance of Subscription.", b: "The Company reserves the right to accept or reject any subscription, in whole or in part, in its sole discretion." },
    ]},
    { n: "2. The Offering", items: [
      { t: "2.1 Offering Size.", b: 'The Company is seeking to raise an aggregate of approximately $1,000,000 (the "Target Raise") in this Offering, but may increase or decrease the Target Raise in its sole discretion.' },
      { t: "2.2 Use of Proceeds.", b: "The Company intends to use the net proceeds of the Offering substantially as described in the Company's business plan and offering materials, including research and development of 20-passenger R&D vessels, U.S. Coast Guard approval processes, initial route deployment, and preparatory work for 50-passenger vessel design and regulatory approval." },
      { t: "2.3 Private Offering.", b: "The Offering is being made in reliance upon exemptions from registration under applicable securities laws." },
    ]},
    { n: "3. Closing", items: [
      { t: "3.1 Closing.", b: "The closing or closings of the purchase and sale of the Shares shall occur on such date or dates as determined by the Company." },
      { t: "3.2 Deliveries at Closing.", b: "The Company shall deliver evidence of issuance of the Subscribed Shares; the Investor shall have previously paid the Purchase Amount in full by wire transfer." },
    ]},
    { n: "4. Investor Representations and Warranties", items: [
      { t: "4.1 Authority.", b: "The Investor has full legal capacity (or corporate authority, if an entity) to execute and perform this Agreement." },
      { t: "4.2 Investment Intent.", b: "The Investor is acquiring the Subscribed Shares for its own account, for investment purposes only, and not with a view to distribution in violation of applicable securities laws." },
      { t: "4.3 Sophistication; Investigation.", b: "The Investor has such knowledge and experience in financial and business matters that the Investor is capable of evaluating the merits and risks of an investment in the Shares." },
      { t: "4.4 Accredited Investor Status.", b: 'The Investor is an "accredited investor" as defined in Rule 501(a) of Regulation D, or otherwise meets the eligibility requirements under applicable securities laws.' },
      { t: "4.5 No General Solicitation.", b: "The Investor acknowledges that the Offering has not been made by means of any general solicitation or general advertising." },
      { t: "4.6 Restricted Securities.", b: "The Investor understands that the Shares are restricted securities that may not be sold or transferred without registration or an available exemption." },
      { t: "4.7 Ability to Bear Risk.", b: "The Investor is able to bear the economic risk of this investment for an indefinite period and can afford a complete loss." },
      { t: "4.8 No Reliance on Unwritten Representations.", b: "The Investor has not relied on any representation of the Company except as expressly set forth in this Agreement and any written offering documents." },
    ]},
    { n: "5. Company Representations and Warranties", items: [
      { t: "5.1 Organization and Good Standing.", b: "The Company is duly organized, validly existing, and in good standing under the laws of its jurisdiction of incorporation." },
      { t: "5.2 Authority.", b: "The Company has full corporate power and authority to execute and deliver this Agreement, which constitutes a valid and binding obligation of the Company." },
      { t: "5.3 Valid Issuance of Shares.", b: "The Shares, when issued and delivered against payment, will be duly authorized, validly issued, fully paid, and non-assessable." },
    ]},
    { n: "6. Restrictions on Transfer", items: [
      { t: "6.1 No Public Market.", b: "No public market for the Shares currently exists and there is no assurance that one will develop." },
      { t: "6.2 Transfer Restrictions.", b: "The Investor shall not transfer any Shares except in compliance with this Agreement, applicable securities laws, and any other applicable agreements." },
    ]},
    { n: "7. Miscellaneous", items: [
      { t: "7.1 Governing Law.", b: "This Agreement shall be governed by the laws of the State of [GOVERNING LAW STATE], without regard to conflict of laws principles." },
      { t: "7.2 Entire Agreement.", b: "This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof." },
      { t: "7.3 Amendments.", b: "This Agreement may be amended only by a written instrument executed by the Company and the Investor (or a requisite majority of Investors)." },
      { t: "7.4 Counterparts.", b: "This Agreement may be executed in counterparts, including via electronic signatures." },
      { t: "7.5 Severability.", b: "If any provision is held invalid or unenforceable, the remaining provisions shall remain in full force and effect." },
      { t: "7.6 No Tax or Legal Advice.", b: "The Company has not provided, and does not provide, tax, legal, or investment advice. Each Investor has been advised to consult its own advisors." },
    ]},
  ];

  return (
    <>
      <div style={{ padding: "0.6rem 1rem", border: "1px solid #d97706", backgroundColor: "#fef3c7", marginBottom: "1.2rem", fontSize: "0.82rem" }}>
        <strong style={{ color: "#92400e" }}>Template Notice:</strong>{" "}
        <span style={{ color: "#78350f" }}>This document is a template only and must be reviewed and modified by legal counsel prior to use.</span>
      </div>

      <p style={{ lineHeight: "1.7", marginBottom: "1rem", fontSize: "0.95rem" }}>
        This Omnibus Subscription Agreement (this "Agreement") is made and entered into by and between{" "}
        <strong>PamliEcoConnect, Inc.</strong>, a [jurisdiction] corporation (the "Company"), and each undersigned
        investor (each, an "Investor" and collectively, the "Investors"). This Agreement sets forth the terms under
        which the Investors will subscribe for shares of the Company's{" "}
        <strong>Series Seed Preferred Stock</strong> in a private offering exempt from registration under applicable
        securities laws (the "Offering").
      </p>

      {sections.map((sec) => (
        <div key={sec.n} style={{ marginBottom: "1.4rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.6rem", paddingBottom: "0.3rem", borderBottom: "1px solid #e2e8f0" }}>{sec.n}</h3>
          {sec.items.map(({ t, b }) => (
            <p key={t} style={{ fontSize: "0.9rem", lineHeight: "1.7", marginBottom: "0.6rem" }}>
              <strong>{t}</strong> {b}
            </p>
          ))}
        </div>
      ))}

      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", paddingBottom: "0.3rem", borderBottom: "1px solid #e2e8f0" }}>8. Investor Signature</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
          {["Investor Name:", "Address:", "Email:", "Phone:", "Purchase Amount (USD): $", "Number of Shares Subscribed:"].map((f) => (
            <div key={f}>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>{f}</p>
              <div style={{ borderBottom: "1px solid #888", height: "1.4rem" }} />
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.85rem", marginBottom: "1rem", fontStyle: "italic" }}>By signing below, the Investor agrees to be bound by all terms and conditions of this Omnibus Subscription Agreement.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.2rem", marginBottom: "1.2rem" }}>
          {["Investor Signature:", "Name (print):", "Title (if entity):"].map((f) => (
            <div key={f}>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>{f}</p>
              <div style={{ borderBottom: "1px solid #888", height: "1.4rem" }} />
            </div>
          ))}
        </div>
        <div style={{ width: "200px" }}>
          <p style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>Date:</p>
          <div style={{ borderBottom: "1px solid #888", height: "1.4rem" }} />
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", paddingBottom: "0.3rem", borderBottom: "1px solid #e2e8f0" }}>9. Company Acceptance</h3>
        <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>PamliEcoConnect, Inc. hereby accepts the foregoing subscription, subject to the terms and conditions of this Omnibus Subscription Agreement.</p>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.8rem" }}>Company: PamliEcoConnect, Inc.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.2rem", marginBottom: "1.2rem" }}>
          {["By:", "Name:", "Title:"].map((f) => (
            <div key={f}>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>{f}</p>
              <div style={{ borderBottom: "1px solid #888", height: "1.4rem" }} />
            </div>
          ))}
        </div>
        <div style={{ width: "200px" }}>
          <p style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>Date:</p>
          <div style={{ borderBottom: "1px solid #888", height: "1.4rem" }} />
        </div>
      </div>
    </>
  );
}

// ─── Print page ───────────────────────────────────────────────────────────────

export default function PrintBusinessPlan() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const isApproved = !!user && user.approvalStatus === "approved";

  const { data: allPages, isLoading: pagesLoading } = useListContentPages({
    query: { enabled: isApproved, queryKey: getListContentPagesQueryKey() },
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) setLocation("/login");
      else if (user.approvalStatus === "pending") setLocation("/investors/pending");
      else if (user.approvalStatus === "denied") setLocation("/investors/denied");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || !user || user.approvalStatus !== "approved") return null;

  const pageMap = Object.fromEntries((allPages ?? []).map((p) => [p.slug, p]));

  const allSections = [
    ...DB_SECTIONS.map((s) => ({ ...s, type: "db" as const })),
    { slug: "management-team",        label: "Management Team",         type: "static" as const },
    { slug: "the-offering",           label: "The Offering",            type: "static" as const },
    { slug: "subscription-agreement", label: "Subscription Agreement",  type: "static" as const },
  ];

  return (
    <>
      <style>{`
        /* ── Page setup ──────────────────────────────── */
        @page {
          margin: 2.2cm 2.5cm;
          size: letter;
        }
        body {
          font-family: Georgia, "Times New Roman", serif;
          background: #f4f5f7;
        }

        /* ── Print overrides ─────────────────────────── */
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: #fff; }
          .print-page { box-shadow: none !important; }
          .print-section { page-break-before: always; }
          .print-section:first-of-type { page-break-before: avoid; }
        }

        /* ── Document typography (applies inside .doc-content) ── */
        .doc-content h1 {
          font-family: system-ui, sans-serif;
          font-size: 1.55rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 1.2rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid #dde3ea;
          letter-spacing: -0.01em;
        }
        .doc-content h2 {
          font-family: system-ui, sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1e4a7a;
          margin: 1.8rem 0 0.65rem;
          padding-left: 0.6rem;
          border-left: 3px solid #1e4a7a;
        }
        .doc-content h3 {
          font-family: system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #2d3748;
          margin: 1.4rem 0 0.5rem;
        }
        .doc-content h4 {
          font-family: system-ui, sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #4a5568;
          margin: 1rem 0 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .doc-content p {
          margin: 0 0 0.85rem;
          line-height: 1.78;
          font-size: 0.95rem;
          color: #1a1a1a;
        }
        .doc-content ul,
        .doc-content ol {
          margin: 0.5rem 0 1rem;
          padding-left: 2rem;
        }
        .doc-content ul { list-style-type: disc; }
        .doc-content ol { list-style-type: decimal; }
        .doc-content li {
          margin-bottom: 0.45rem;
          line-height: 1.72;
          font-size: 0.95rem;
          color: #1a1a1a;
        }
        .doc-content li > ul,
        .doc-content li > ol {
          margin-top: 0.3rem;
          margin-bottom: 0;
        }
        .doc-content strong { color: #111; font-weight: 700; }
        .doc-content em { font-style: italic; color: #444; }
        .doc-content blockquote {
          margin: 1rem 0;
          padding: 0.6rem 1rem;
          border-left: 4px solid #1e4a7a;
          background: #f0f5fb;
          color: #2d3748;
          font-style: italic;
        }

        /* Tables */
        .doc-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0 1.5rem;
          font-size: 0.88rem;
        }
        .doc-content th {
          background: #1e4a7a;
          color: #fff;
          padding: 7px 12px;
          text-align: left;
          font-family: system-ui, sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }
        .doc-content td {
          padding: 7px 12px;
          border-bottom: 1px solid #dde3ea;
          vertical-align: top;
        }
        .doc-content tr:nth-child(even) td { background: #f7f9fc; }

        /* Callout / note divs sometimes used in content */
        .doc-content div[style*="overflow-x:auto"] {
          overflow-x: auto;
          margin: 1rem 0;
        }
      `}</style>

      {/* Print button — hidden when printing */}
      <div className="no-print" style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 50, display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => window.history.back()}
          style={{ padding: "0.5rem 1rem", border: "1px solid #ccc", borderRadius: "6px", background: "#fff", cursor: "pointer", fontSize: "0.85rem" }}
        >
          ← Back to Portal
        </button>
        <button
          onClick={() => window.print()}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1.2rem", background: "#1e4a7a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
        >
          <Printer size={15} /> Print / Save as PDF
        </button>
      </div>

      <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "4rem 1rem 6rem" }}>
      <div className="print-page" style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 3.5rem 5rem", fontFamily: "Georgia, 'Times New Roman', serif", color: "#1a1a1a", lineHeight: "1.6", background: "#fff", boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}>

        {/* Cover page */}
        <div style={{ textAlign: "center", minHeight: "85vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderBottom: "3px solid #1e4a7a", paddingBottom: "3rem", marginBottom: "0" }}>
          <div style={{ fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#1e4a7a", marginBottom: "1.5rem", fontFamily: "system-ui, sans-serif" }}>Confidential — Investor Business Plan</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 700, margin: "0 0 0.5rem", letterSpacing: "-0.02em", fontFamily: "system-ui, sans-serif" }}>PamliEcoConnect</h1>
          <p style={{ fontSize: "1.25rem", color: "#444", margin: "0 0 3rem" }}>A Phillips Boatworks Initiative</p>
          <div style={{ width: "60px", height: "3px", background: "#1e4a7a", margin: "0 auto 3rem" }} />
          <p style={{ fontSize: "1.1rem", fontStyle: "italic", color: "#555", maxWidth: "480px", margin: "0 auto 3rem" }}>
            "Fly Above the Water. Zero Emissions. Pure Speed."
          </p>
          <p style={{ fontSize: "0.9rem", color: "#666", margin: "0 0 0.4rem" }}>High-Speed Electric Foiling Passenger Vessels</p>
          <p style={{ fontSize: "0.9rem", color: "#666", margin: "0 0 0.4rem" }}>Jones Act–Compliant · U.S. Coastal & Inland Routes</p>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>Seed / Series Seed — $1,000,000 Target Raise</p>
          <div style={{ marginTop: "4rem", fontSize: "0.8rem", color: "#999" }}>
            <p style={{ margin: "0" }}>Prepared {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            <p style={{ margin: "0.3rem 0 0" }}>This document is strictly confidential and intended solely for the named recipient.</p>
          </div>
        </div>

        {/* Table of contents */}
        <div className="print-section" style={{ paddingTop: "3rem", paddingBottom: "2rem", borderBottom: "1px solid #e2e8f0", marginBottom: "0" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem", fontFamily: "system-ui, sans-serif", color: "#1e4a7a" }}>Table of Contents</h2>
          <ol style={{ paddingLeft: "1.5rem", lineHeight: "2" }}>
            {allSections.map(({ label }, i) => (
              <li key={label} style={{ fontSize: "0.95rem" }}>
                <span style={{ fontWeight: i < 13 ? "normal" : 600 }}>{label}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        {pagesLoading ? (
          <p style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Loading content…</p>
        ) : (
          allSections.map(({ slug, label, type }) => {
            const page = pageMap[slug];
            return (
              <div key={slug} className="print-section" style={{ paddingTop: "3rem", paddingBottom: "2.5rem", borderBottom: "1px solid #e2e8f0" }}>
                {/* Section header */}
                <div style={{ marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "2px solid #1e4a7a" }}>
                  <p style={{ margin: "0 0 0.2rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#1e4a7a", fontFamily: "system-ui, sans-serif" }}>
                    PamliEcoConnect Confidential Business Plan
                  </p>
                  <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>{label}</h2>
                </div>

                {/* Content */}
                {type === "static" ? (
                  <div className="doc-content">
                    {slug === "management-team" ? <ManagementTeamContent /> :
                     slug === "the-offering" ? <TheOfferingContent /> :
                     <SubscriptionAgreementContent />}
                  </div>
                ) : page ? (
                  <div
                    className="doc-content"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                ) : (
                  <p style={{ color: "#888", fontStyle: "italic" }}>Content for this section is coming soon.</p>
                )}
              </div>
            );
          })
        )}

        {/* Back matter */}
        <div className="print-section" style={{ paddingTop: "3rem", textAlign: "center", color: "#888", fontSize: "0.8rem" }}>
          <div style={{ width: "60px", height: "2px", background: "#1e4a7a", margin: "0 auto 1.5rem" }} />
          <p style={{ margin: "0 0 0.4rem", fontWeight: 600, color: "#444" }}>PamliEcoConnect, Inc. — A Phillips Boatworks Initiative</p>
          <p style={{ margin: "0 0 0.4rem" }}>This document is strictly confidential. Unauthorized reproduction or distribution is prohibited.</p>
          <p style={{ margin: "0" }}>
            Nothing in this document constitutes an offer to sell or solicitation of an offer to buy any securities.
            Any offering will be made only through formal offering documents in compliance with applicable securities laws.
          </p>
        </div>

      </div>
      </div>
    </>
  );
}
