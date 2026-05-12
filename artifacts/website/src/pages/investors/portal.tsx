import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useListContentPages, getListContentPagesQueryKey } from "@workspace/api-client-react";
import {
  Phone, Lock, ChevronRight, Ship, Wrench, Zap, TrendingUp, Shield, Factory, Briefcase, FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// ─── Helper: parse H2s from content HTML, inject IDs ─────────────────────────
function extractH2s(html: string, slug: string): { html: string; headings: { id: string; text: string }[] } {
  const headings: { id: string; text: string }[] = [];
  const processed = html.replace(/<h2>([^<]+)<\/h2>/g, (_, text) => {
    const id = `${slug}--${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 42)}`;
    headings.push({ id, text });
    return `<h2 id="${id}">${text}</h2>`;
  });
  return { html: processed, headings };
}

// ─── Static section: Management Team ────────────────────────────────────────

const coreTeam = [
  {
    name: "Jay M. Phillips",
    title: "Chief Executive Officer & Project Manager",
    initials: "JP",
    bio: "Founder; responsible for overall company leadership, program management, route and service design, and stakeholder relationships. Jay has been immersed in the maritime industry since the age of 14, accumulating over 100,000 bluewater miles. His career spans ownership and management of sail lofts, boat building operations, and maritime web development firms. Jay currently serves as Chair of Hatteras Sailing, an educational maritime nonprofit.",
  },
  {
    name: "John Edward Elion",
    title: "Chief Financial Officer",
    initials: "JE",
    bio: "John Edward Elion serves as Chief Financial Officer of PamliEcoConnect. He is responsible for capital strategy, financial planning and analysis, investor relations, and oversight of grant and loan structures. John is the Director of the Waterworks Foundation, an Annapolis-based environmental nonprofit with over 30 years of active work on Chesapeake Bay ecological and maritime conservation. In that capacity, he has been a central figure in the region's clean maritime and environmental community, and was instrumental in stimulating the discussions that led to the formation of the five-county Chesapeake Bay Passenger Ferry Consortium — the federally funded initiative that has validated demand for exactly the vessel class PamliEcoConnect is developing. John has owned and built several multimaran brands across the United States and Canada, combining deep financial acumen with a lifelong commitment to environmental stewardship and coastal community development.",
  },
];

const advisors = [
  {
    icon: Ship,
    area: "Design & Naval Architecture",
    prospective: "Design Team Leader",
    name: "Alan Stewart",
    description:
      "Holds a degree in Aerospace Engineering and brings over a decade of partnership at B&B Boat Designs in Eastern North Carolina. His background in aerodynamics and structural efficiency is directly applicable to foiling vessel design — making him an ideal candidate to guide concept development, foiling integration, and hull optimization.",
    identified: true,
  },
  {
    icon: Wrench,
    area: "Mechanical & Electrical Engineering",
    prospective: "M/E Engineering Lead",
    name: "Larry Ward",
    description:
      "Has deep experience in propulsion systems, systems integration, and control architectures for high-performance marine platforms. His background positions him well to contribute to the technical development of PamliEcoConnect's electric drivetrain and foil control systems.",
    identified: true,
  },
  {
    icon: Zap,
    area: "Battery & Powerplant Technology",
    prospective: "Battery/Powerplant Technology Lead",
    name: "Role to be filled",
    description:
      "Seeking an expert in energy storage, powertrain architecture, and marine charging systems to guide battery management and electric propulsion as vessel development progresses.",
    identified: false,
  },
  {
    icon: TrendingUp,
    area: "Investment & Grant Strategy",
    prospective: "Investment & Grant Acquisition Lead",
    name: "Robert Norton",
    description:
      "Has a strong track record in capital raising, investor outreach, and navigating public grant programs. His strategic perspective on financing structures and institutional relationships would be invaluable as PamliEcoConnect moves toward securing its initial funding round.",
    identified: true,
  },
  {
    icon: Shield,
    area: "USCG & Insurance Compliance",
    prospective: "Compliance Lead",
    name: null,
    description:
      "We are seeking an experienced maritime regulatory specialist to guide USCG approval processes and insurer expectations — from 20-passenger R&D vessels through to 50-passenger commercial certification. This is a critical role for the company's path to commercialization.",
    identified: false,
  },
  {
    icon: Factory,
    area: "Production Management",
    prospective: "Production Management Lead",
    name: null,
    description:
      "We are seeking an experienced production leader to guide tooling, supply chain management, quality systems, and manufacturing scale-up across multiple hull programs. This role becomes increasingly critical as vessel production ramps.",
    identified: false,
  },
  {
    icon: Briefcase,
    area: "Advanced Boatbuilding Technology",
    prospective: "Strategic Technology Partner",
    name: "Jim Gardiner / Compmillenia",
    description:
      "A recognized authority in advanced composite construction and high-performance hull manufacturing. Compmillenia's capabilities in precision composite fabrication represent a potential strategic fit for PamliEcoConnect's vessel production goals.",
    identified: true,
  },
];

function ManagementTeamSection() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">Management Team</h2>
        <p className="text-muted-foreground">
          PamliEcoConnect is led by its founding team and is in the process of carefully identifying
          and inviting a select group of maritime engineers, regulatory specialists, and industry
          veterans into advisory and eventual management roles as the company and its financing mature.
        </p>
      </div>

      {/* Core Management */}
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">
          Committed Executive Leadership
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {coreTeam.map((member) => (
            <div key={member.name} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg font-display shrink-0">
                  {member.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.title}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory Candidates */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Prospective Advisory & Leadership Team
        </p>
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          Hand-Picked Candidates & Open Roles
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          The following individuals have been specifically identified for the expertise they would
          bring to PamliEcoConnect. They are interested parties at this stage — not yet formally
          committed — and will be selectively invited into advisory or management roles as the
          company and its financing mature.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {advisors.map((advisor) => {
            const Icon = advisor.icon;
            return (
              <div
                key={advisor.area}
                className={`rounded-xl border p-5 flex flex-col gap-3 ${
                  advisor.identified
                    ? "bg-card border-border"
                    : "bg-card/40 border-dashed border-border/60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${advisor.identified ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                    {advisor.identified ? "Identified" : "Seeking"}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{advisor.area}</p>
                  {advisor.name ? (
                    <p className="font-semibold text-foreground text-sm">{advisor.name}</p>
                  ) : (
                    <p className="font-semibold text-muted-foreground/60 italic text-sm">Role to be filled</p>
                  )}
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <ChevronRight className="h-3 w-3 shrink-0" /> Target role if invited: {advisor.prospective}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{advisor.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Static section: The Offering ───────────────────────────────────────────

function TheOfferingSection() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">The Offering</h2>
        <p className="text-muted-foreground">
          PamliEcoConnect is raising growth capital to commercialize a new class of high-speed,
          low-wake, Jones Act–compliant passenger vessels. Our initial focus is on deploying
          20-passenger R&D ferries to prove routes, technology, and regulatory pathways, and then
          scaling to 50-passenger foiling vessels across the U.S. coastal and inland maritime
          transportation network.
        </p>
      </div>

      {/* Stage 1 */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Stage 1</span>
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          Seed / Series Seed — R&D & 20-Passenger Platform
        </h3>
        <p className="text-sm font-semibold text-primary mb-4">Target Raise: approximately $1,000,000</p>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Use of Proceeds</p>
        <ul className="space-y-2 mb-5">
          {[
            "Design and engineering for the 20-passenger R&D vessels.",
            "USCG approval and insurance validation for the 20-passenger platform.",
            "Initial fleet deployment on the Pamlico ecosystem routes (e.g., Vandemere–Ocracoke–Buxton loop).",
            "Data collection to demonstrate safety, reliability, passenger demand, and economics.",
            "Preparation of the 50-passenger vessel specification and regulatory road map.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>

        <p className="text-sm text-muted-foreground mb-5">
          This initial round is expected to be issued as <strong className="text-foreground">Series Seed Preferred Stock</strong> in
          PamliEcoConnect (final structure subject to legal and tax advice). Early investors in this round are positioning alongside
          the founding team and key advisors at a stage when the company is moving from concept and prototypes to live commercial operations.
        </p>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Illustrative Terms for Early Investors</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "Security Type", value: "Preferred equity — Series Seed shares" },
            { label: "Preferred Rights", value: "1× non-participating liquidation preference, conversion into common" },
            { label: "Pro-Rata Rights", value: "Participation rights to maintain ownership in future rounds (subject to minimum check sizes)" },
            { label: "Information Rights", value: "Structured reporting on vessel performance, route economics, and pipeline development" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs font-semibold text-primary mb-0.5">{label}</p>
              <p className="text-xs text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stage 2 */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stage 2 (Future Round)</span>
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          Series A / Expansion — 50-Passenger Fleet Deployment
        </h3>
        <p className="text-sm font-semibold text-muted-foreground mb-4">Target Raise: approximately $20,000,000</p>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Anticipated Use of Proceeds</p>
        <ul className="space-y-2 mb-4">
          {[
            "Final design, engineering, and USCG approval for 50-passenger foiling vessels.",
            "Tooling, molds, and production ramp-up for multiple 50-passenger vessels.",
            "Deployment of vessels across priority domestic routes in U.S. maritime transportation hubs.",
            "Build-out of charging and support infrastructure in key ports.",
            "Expansion of the operations and maintenance organization to support a national fleet.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>

        <p className="text-sm text-muted-foreground">
          The Series A / expansion round is designed for institutional and strategic investors who wish to participate in the growth phase
          of a proven platform: a Jones Act–compliant, high-speed, low-emission vessel fleet with demonstrated route economics and regulatory approval.
          Early seed investors are expected to benefit from any valuation step-up between the initial R&D phase and this fleet expansion phase.
        </p>
      </div>

      {/* Early Investor Opportunity */}
      <div>
        <h3 className="font-display text-xl font-bold text-foreground mb-4">Early Investor Opportunity</h3>
        <p className="text-sm text-muted-foreground mb-5">
          The combination of proven route demand, strong unit economics, and strategic positioning in the decarbonization and modernization
          of domestic maritime transport creates a compelling opportunity for early investors:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Favorable Entry Timing",
              body: "The $1M R&D round values the company prior to full commercialization of the 20-passenger platform and prior to any contracted 50-passenger fleet deployments.",
            },
            {
              title: "Attractive Unit Economics",
              body: "Pro forma Year 1 operations for the 20-passenger vessels in a single region indicate multi-million-dollar annual ticket revenue and strong operating margins, even before additional upside from boat sales, institutional contracts, and corporate sponsorships.",
            },
            {
              title: "Scalable Platform",
              body: "Once proven in one region, the same vessel and route model can be replicated across multiple U.S. coastal and inland waterways, creating a pipeline of deployment opportunities.",
            },
            {
              title: "Multiple Value-Creation Pathways",
              body: "Potential upside not only from ferry operations but also from vessel sales into commercial, defense, and recreational markets, and from corporate Title Sponsorships.",
            },
            {
              title: "Strategic Exit Potential",
              body: "The company is being structured to be attractive to large strategic acquirers in transportation, energy, and defense, as well as to later-stage venture and infrastructure investors.",
            },
          ].map(({ title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold text-foreground text-sm mb-1">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Process */}
      <div className="rounded-xl border border-border bg-card/50 p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-3">Investment Process & Subscription</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Participation in the Seed / Series Seed round will be governed by a standard Subscription Agreement and Series Seed Preferred Stock
          financing documents, tailored to the company's jurisdiction and applicable securities regulations.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          The Company anticipates setting a minimum individual investment amount (for example, $25,000–$50,000), with larger tickets for
          institutional or lead investors. All investors in the round will receive the same class of Series Seed Preferred shares on the
          same economic terms, with any differences limited to board representation or information rights for lead or anchor investors.
        </p>
        <p className="text-sm text-muted-foreground">
          Interested parties may request access to the detailed business plan, financial model, and draft subscription documents through
          the secure section of the PamliEcoConnect website, subject to NDA and accreditation requirements under applicable securities laws.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          This section is a summary of a proposed private securities offering and does not constitute an offer to sell or the solicitation
          of an offer to buy any securities. Any such offering will be made only through formal offering documents and in compliance with
          applicable securities regulations.
        </p>
      </div>
    </div>
  );
}

// ─── Static section: Omnibus Subscription Agreement ─────────────────────────

function SubscriptionAgreementSection() {
  const clauses: { number: string; title: string; content: ReactNode }[] = [
    {
      number: "1",
      title: "Subscription",
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">1.1 Subscription for Shares.</p>
            <p className="text-sm text-muted-foreground">Subject to the terms and conditions of this Agreement, each Investor hereby subscribes for and agrees to purchase, and the Company agrees to issue and sell to such Investor, that number of Shares set forth on the Investor's signature page hereto (the "Subscribed Shares") at a purchase price of $[PRICE] per Share (the "Purchase Price").</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">1.2 Purchase Amount.</p>
            <p className="text-sm text-muted-foreground">The aggregate purchase price for the Subscribed Shares (the "Purchase Amount") is set forth on the Investor's signature page and shall be paid in cash by wire transfer of immediately available funds to the account designated by the Company on or before the closing of the Offering applicable to such Investor.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">1.3 Acceptance of Subscription.</p>
            <p className="text-sm text-muted-foreground">The Company reserves the right to accept or reject any subscription, in whole or in part, in its sole discretion. The subscription shall be deemed accepted by the Company only when this Agreement is countersigned by an authorized officer of the Company or when the Company records the issuance of the Subscribed Shares to the Investor.</p>
          </div>
        </div>
      ),
    },
    {
      number: "2",
      title: "The Offering",
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">2.1 Offering Size.</p>
            <p className="text-sm text-muted-foreground">The Company is seeking to raise an aggregate of approximately $1,000,000 (the "Target Raise") in this Offering, but may increase or decrease the Target Raise in its sole discretion.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">2.2 Use of Proceeds.</p>
            <p className="text-sm text-muted-foreground">The Company intends to use the net proceeds of the Offering substantially as described in the Company's business plan and offering materials, including, without limitation, research and development of 20-passenger R&D vessels, U.S. Coast Guard approval processes, initial route deployment, and preparatory work for 50-passenger vessel design and regulatory approval.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">2.3 Private Offering.</p>
            <p className="text-sm text-muted-foreground">The Offering is being made in reliance upon exemptions from registration under applicable securities laws. The Company is offering the Shares only to investors who qualify under such exemptions and who make the representations and warranties set forth herein.</p>
          </div>
        </div>
      ),
    },
    {
      number: "3",
      title: "Closing",
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">3.1 Closing.</p>
            <p className="text-sm text-muted-foreground">The closing or closings of the purchase and sale of the Shares (each, a "Closing") shall occur on such date or dates as determined by the Company. At each Closing, the Company shall issue the Subscribed Shares to each Investor whose subscription has been accepted and whose Purchase Amount has been received by the Company.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">3.2 Deliveries at Closing.</p>
            <p className="text-sm text-muted-foreground">At each applicable Closing: (a) the Company shall deliver to the Investor evidence of the issuance of the Subscribed Shares (which may be in the form of book-entry, electronic record, or physical certificate, as determined by the Company); and (b) the Investor shall have previously paid the Purchase Amount in full by wire transfer, subject to any arrangements agreed with the Company in advance.</p>
          </div>
        </div>
      ),
    },
    {
      number: "4",
      title: "Investor Representations and Warranties",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Each Investor hereby represents and warrants to the Company, as of the date hereof and as of the applicable Closing, that:</p>
          {[
            { n: "4.1", t: "Authority.", b: "If the Investor is an individual, the Investor has full legal capacity to execute and deliver this Agreement and to perform the Investor's obligations hereunder. If the Investor is an entity, it is duly organized, validly existing, and in good standing under the laws of its jurisdiction of organization and has full corporate, partnership, or other power and authority to execute, deliver, and perform this Agreement." },
            { n: "4.2", t: "Investment Intent.", b: "The Investor is acquiring the Subscribed Shares for its own account, for investment purposes only, and not with a view to or for resale in connection with any distribution thereof in violation of applicable securities laws." },
            { n: "4.3", t: "Sophistication; Investigation.", b: "The Investor has such knowledge and experience in financial and business matters that the Investor is capable of evaluating the merits and risks of an investment in the Shares. The Investor has been given the opportunity to ask questions of, and receive answers from, the Company regarding its business, operations, financial condition, and the terms and conditions of the Offering, and to obtain any additional information the Investor deems necessary to evaluate the investment." },
            { n: "4.4", t: "Accredited Investor Status.", b: "The Investor is an \"accredited investor\" as that term is defined in Rule 501(a) of Regulation D under the U.S. Securities Act of 1933, as amended, or otherwise meets the eligibility requirements for participation in the Offering under applicable securities laws, as represented to the Company in a separate investor questionnaire." },
            { n: "4.5", t: "No General Solicitation Reliance.", b: "The Investor acknowledges that the Offering has not been made by means of any general solicitation or general advertising (except as permitted by applicable law where specifically disclosed), including any advertisement, article, notice, or other communication published in any newspaper, magazine, or similar media or broadcast over television, radio, or the internet, or any seminar or meeting whose attendees have been invited by general solicitation or general advertising." },
            { n: "4.6", t: "Restricted Securities.", b: "The Investor understands that the Shares have not been registered under the Securities Act or under the securities laws of any state or other jurisdiction, and that the Shares constitute \"restricted securities\" under the Securities Act and applicable state securities laws. The Investor understands that the Shares may not be sold, transferred, or otherwise disposed of without registration or an available exemption." },
            { n: "4.7", t: "Ability to Bear Risk.", b: "The Investor is able to bear the economic risk of this investment for an indefinite period of time and is able to afford a complete loss of this investment." },
            { n: "4.8", t: "No Reliance on Unwritten Representations.", b: "The Investor has not relied on any representation or warranty of the Company or any of its officers, directors, employees, agents, or representatives except as expressly set forth in this Agreement and in any separate written offering documents provided by the Company." },
          ].map(({ n, t, b }) => (
            <div key={n}>
              <p className="text-xs font-semibold text-foreground mb-1">{n} {t}</p>
              <p className="text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      number: "5",
      title: "Company Representations and Warranties",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">The Company hereby represents and warrants to each Investor that:</p>
          {[
            { n: "5.1", t: "Organization and Good Standing.", b: "The Company is duly organized, validly existing, and in good standing under the laws of its jurisdiction of incorporation, with all requisite corporate power and authority to own, lease, and operate its properties and to carry on its business." },
            { n: "5.2", t: "Authority.", b: "The Company has full corporate power and authority to execute and deliver this Agreement and to perform its obligations hereunder. This Agreement constitutes a valid and binding obligation of the Company, enforceable against the Company in accordance with its terms, subject to applicable bankruptcy, insolvency, and similar laws and general principles of equity." },
            { n: "5.3", t: "Valid Issuance of Shares.", b: "The Shares, when issued and delivered against payment therefor as provided in this Agreement, will be duly authorized, validly issued, fully paid, and non-assessable, and will be free of any liens or encumbrances created by the Company, except as set forth in the Company's charter documents and any investor rights agreements." },
          ].map(({ n, t, b }) => (
            <div key={n}>
              <p className="text-xs font-semibold text-foreground mb-1">{n} {t}</p>
              <p className="text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      number: "6",
      title: "Restrictions on Transfer",
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">6.1 No Public Market.</p>
            <p className="text-sm text-muted-foreground">The Investor understands that no public market for the Shares currently exists and that there is no assurance that a public market will develop.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">6.2 Transfer Restrictions.</p>
            <p className="text-sm text-muted-foreground">The Investor shall not sell, assign, transfer, pledge, or otherwise dispose of any of the Shares except in compliance with (a) this Agreement, (b) applicable securities laws, and (c) any other applicable agreements between the Investor and the Company, including any shareholder or investor rights agreements.</p>
          </div>
        </div>
      ),
    },
    {
      number: "7",
      title: "Miscellaneous",
      content: (
        <div className="space-y-4">
          {[
            { n: "7.1", t: "Governing Law.", b: "This Agreement shall be governed by and construed in accordance with the laws of the State of [GOVERNING LAW STATE], without regard to its conflict of laws principles." },
            { n: "7.2", t: "Entire Agreement.", b: "This Agreement, together with any related subscription documents, exhibits, and schedules, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements and understandings, whether written or oral." },
            { n: "7.3", t: "Amendments.", b: "This Agreement may be amended, modified, or supplemented only by a written instrument executed by the Company and the Investor (or by the Company and a requisite majority of Investors, if structured that way)." },
            { n: "7.4", t: "Counterparts.", b: "This Agreement may be executed in counterparts (including via electronic signatures or scanned copies), each of which shall be deemed an original and all of which together shall constitute one and the same instrument." },
            { n: "7.5", t: "Severability.", b: "If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be enforced to the maximum extent permissible, and the remaining provisions shall remain in full force and effect." },
            { n: "7.6", t: "No Tax or Legal Advice.", b: "Each Investor acknowledges that the Company has not provided, and does not provide, tax, legal, or investment advice to the Investor. The Investor has been advised to consult its own legal, tax, and financial advisors regarding this investment." },
          ].map(({ n, t, b }) => (
            <div key={n}>
              <p className="text-xs font-semibold text-foreground mb-1">{n} {t}</p>
              <p className="text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      number: "8",
      title: "Investor Information and Signature",
      content: (
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">Each Investor will complete and sign a signature page substantially in the following form:</p>
          <div className="rounded-xl border border-border bg-background/50 p-6 space-y-4 font-mono text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              {["Investor Name:", "Address:", "Email:", "Phone:"].map((f) => (
                <div key={f}>
                  <p className="text-xs text-muted-foreground mb-1">{f}</p>
                  <div className="border-b border-border/60 h-7" />
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Purchase Amount (USD):</p>
                <div className="border-b border-border/60 h-7" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Number of Shares Subscribed:</p>
                <div className="border-b border-border/60 h-7" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2">By signing below, the Investor agrees to be bound by all terms and conditions of this Omnibus Subscription Agreement.</p>
            <div className="grid sm:grid-cols-3 gap-4 pt-1">
              {["Investor Signature:", "Name (print):", "Title (if entity):"].map((f) => (
                <div key={f}>
                  <p className="text-xs text-muted-foreground mb-1">{f}</p>
                  <div className="border-b border-border/60 h-7" />
                </div>
              ))}
            </div>
            <div className="w-40">
              <p className="text-xs text-muted-foreground mb-1">Date:</p>
              <div className="border-b border-border/60 h-7" />
            </div>
          </div>
        </div>
      ),
    },
    {
      number: "9",
      title: "Company Acceptance",
      content: (
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">PamliEcoConnect, Inc. hereby accepts the foregoing subscription, subject to the terms and conditions of this Omnibus Subscription Agreement.</p>
          <div className="rounded-xl border border-border bg-background/50 p-6 space-y-4 font-mono text-sm">
            <p className="text-xs font-semibold text-foreground">Company: PamliEcoConnect, Inc.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {["By:", "Name:", "Title:"].map((f) => (
                <div key={f}>
                  <p className="text-xs text-muted-foreground mb-1">{f}</p>
                  <div className="border-b border-border/60 h-7" />
                </div>
              ))}
            </div>
            <div className="w-40">
              <p className="text-xs text-muted-foreground mb-1">Date:</p>
              <div className="border-b border-border/60 h-7" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Confidential — For Approved Investors Only</p>
        <h2 className="font-display text-3xl font-bold text-foreground mb-1">Omnibus Subscription Agreement</h2>
        <p className="text-sm text-muted-foreground mb-4">Seed / Series Seed Preferred Stock — PamliEcoConnect, Inc.</p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">Template Notice</p>
          <p className="text-xs text-muted-foreground">
            This document is a template only and must be reviewed and modified by legal counsel prior to use. It does not constitute legal advice or a binding legal obligation.
          </p>
        </div>
      </div>

      {/* Preamble */}
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground mb-3">
          This Omnibus Subscription Agreement (this "Agreement") is made and entered into by and between <strong className="text-foreground">PamliEcoConnect, Inc.</strong>, a [jurisdiction] corporation (the "Company"), and each undersigned investor (each, an "Investor" and collectively, the "Investors").
        </p>
        <p className="text-sm text-muted-foreground">
          This Agreement sets forth the terms under which the Investors will subscribe for shares of the Company's <strong className="text-foreground">Series Seed Preferred Stock</strong> (the "Shares") in a private offering exempt from registration under applicable securities laws (the "Offering").
        </p>
      </div>

      {/* Numbered clauses */}
      <div className="space-y-6">
        {clauses.map(({ number, title, content }) => (
          <div key={number} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/80">
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                {number}
              </span>
              <h3 className="font-display font-semibold text-foreground">{title}</h3>
            </div>
            <div className="px-6 py-5">
              {content}
            </div>
          </div>
        ))}
      </div>

      {/* Footer disclaimer */}
      <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          This Omnibus Subscription Agreement template is provided for informational purposes within the secure investor portal. Execution of any subscription is subject to finalization of offering documents, legal review, and compliance with applicable securities laws. Contact the Company directly to initiate the subscription process.
        </p>
      </div>
    </div>
  );
}

// ─── Section config ──────────────────────────────────────────────────────────

type PlanSection = {
  slug: string;
  label: string;
  staticContent?: ReactNode;
};

const PLAN_SECTIONS: PlanSection[] = [
  // ── Front matter ──────────────────────────────────────────────────────────
  { slug: "cover-page",              label: "Start Here" },
  // ── Core business plan ────────────────────────────────────────────────────
  { slug: "exec-summary",            label: "Executive Summary" },
  { slug: "company-overview",        label: "Company Overview" },
  { slug: "market-analysis",         label: "Market Analysis" },
  { slug: "services",                label: "Service Model" },
  { slug: "products",                label: "Vessel & Technology" },
  { slug: "vessel-platform",         label: "Vessel Platform" },
  { slug: "jones-act-strategy",      label: "Jones Act Strategy" },
  { slug: "regulatory-pathway",      label: "Regulatory Pathway" },
  { slug: "marketing-plan",          label: "P3 Partnership" },
  { slug: "operations",              label: "Operations Plan" },
  // ── Financial ─────────────────────────────────────────────────────────────
  { slug: "financial-plan",          label: "Financial Plan" },
  { slug: "capital-structure",       label: "Investment Structure" },
  { slug: "five-year-proforma",      label: "5-Year Proforma" },
  { slug: "corporate-structure",     label: "Corporate Structure" },
  { slug: "governance-philosophy",   label: "Governance Philosophy" },
  // ── Impact & risk ─────────────────────────────────────────────────────────
  { slug: "economic-impact",         label: "Economic Impact" },
  { slug: "risk-analysis",           label: "Risk Analysis" },
  { slug: "timeline",                label: "Implementation" },
  { slug: "conclusion",              label: "Investors & Funding" },
  { slug: "grants",                  label: "Grant Opportunities" },
  // ── Static sections ───────────────────────────────────────────────────────
  { slug: "management-team",         label: "Management Team",              staticContent: <ManagementTeamSection /> },
  { slug: "disclaimer",              label: "Disclaimer & Disclosures" },
  { slug: "disclaimer-about",        label: "Disclaimer About Disclaimer" },
  { slug: "the-offering",            label: "The Offering",                 staticContent: <TheOfferingSection /> },
  { slug: "subscription-agreement",  label: "Subscription Agreement",       staticContent: <SubscriptionAgreementSection /> },
];

// ─── Portal page ─────────────────────────────────────────────────────────────

export default function Portal() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSlug, setActiveSlug] = useState(PLAN_SECTIONS[0].slug);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    PLAN_SECTIONS.forEach(({ slug }) => {
      const el = sectionRefs.current[slug];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSlug(slug); },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [allPages]);

  const scrollTo = (slug: string) => {
    sectionRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (authLoading || !user || user.approvalStatus !== "approved") return null;

  const pageMap = Object.fromEntries((allPages ?? []).map((p) => [p.slug, p]));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Two-column layout — sidebar + content */}
      <div className="flex flex-1 border-t border-border">

        {/* Sidebar — sticky */}
        <aside className="w-64 shrink-0 self-start sticky top-16 border-r border-border bg-card p-6 hidden md:flex flex-col gap-2 min-h-[calc(100vh-4rem)]">
          <div className="flex items-center gap-2 text-primary font-semibold mb-4 pb-4 border-b border-border text-sm">
            <Lock className="h-4 w-4 shrink-0" />
            Investor Business Plan
          </div>

          <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
            {PLAN_SECTIONS.map(({ slug, label }) => {
              const page = pageMap[slug];
              const { headings } = page ? extractH2s(page.content, slug) : { headings: [] as { id: string; text: string }[] };
              const isActive = activeSlug === slug;
              return (
                <div key={slug}>
                  <button
                    onClick={() => scrollTo(slug)}
                    data-testid={`btn-portal-section-${slug}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors text-left w-full ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <span>{label}</span>
                    {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
                  </button>
                  {isActive && headings.length > 0 && (
                    <div className="ml-3 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-border pl-2">
                      {headings.slice(0, 8).map(h => (
                        <button
                          key={h.id}
                          onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                          className="text-left text-xs text-muted-foreground hover:text-foreground py-0.5 leading-snug truncate w-full"
                          title={h.text}
                        >
                          {h.text.length > 30 ? h.text.slice(0, 30) + "…" : h.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-border space-y-2">
            <Link href="/investors/print">
              <Button size="sm" variant="outline" className="w-full text-xs gap-1.5">
                <FileDown className="h-3 w-3" /> Print / Save as PDF
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-2 mb-1">Questions about investing?</p>
            <Link href="/contact">
              <Button size="sm" className="w-full text-xs gap-1.5">
                <Phone className="h-3 w-3" /> Schedule a Call
              </Button>
            </Link>
          </div>
        </aside>

        {/* Scrollable content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            {pagesLoading ? (
              <div className="py-16 space-y-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-8 bg-accent rounded w-1/3" />
                    <div className="h-4 bg-accent rounded w-full" />
                    <div className="h-4 bg-accent rounded w-5/6" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {PLAN_SECTIONS.map(({ slug, label, staticContent }, idx) => {
                  const page = pageMap[slug];
                  return (
                    <section
                      key={slug}
                      id={slug}
                      ref={(el) => { sectionRefs.current[slug] = el; }}
                      className={`py-16 ${idx < PLAN_SECTIONS.length - 1 ? "border-b border-border" : ""}`}
                    >
                      {staticContent ? (
                        staticContent
                      ) : page ? (
                        <>
                          {/* Skip label H1 when the content supplies its own <h1> */}
                          {!page.content.startsWith("<h1>") && (
                            <h1 className="font-display text-4xl font-bold text-foreground mb-8 pb-4 border-b border-border">
                              {label}
                            </h1>
                          )}
                          <div className="prose prose-invert prose-headings:font-display prose-headings:text-foreground prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-2 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-2 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: extractH2s(page.content, slug).html }} />
                          </div>
                        </>
                      ) : (
                        <div>
                          <h1 className="font-display text-4xl font-bold text-foreground mb-8 pb-4 border-b border-border">{label}</h1>
                          <p className="text-muted-foreground">Content for this section is coming soon.</p>
                        </div>
                      )}
                    </section>
                  );
                })}
              </>
            )}
          </div>
        </main>

      </div>

      <Footer />
    </div>
  );
}
