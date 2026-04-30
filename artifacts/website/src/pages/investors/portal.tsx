import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useListContentPages, getListContentPagesQueryKey } from "@workspace/api-client-react";
import {
  Phone, Lock, ChevronRight, Ship, Wrench, Zap, TrendingUp, Shield, Factory, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
    bio: "Responsible for capital strategy, financial planning & analysis, investor relations, and oversight of grant/loan structures. John has served as Chair of the Waterworks Foundation, a Chesapeake Bay environmental organization. He has owned and built several multihull brands across the United States and Canada, combining deep financial acumen with a lifelong commitment to environmental stewardship.",
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
    name: "Brian Palmer",
    description:
      "Brings expertise in energy storage, powertrain architecture, and marine charging systems. His knowledge of battery management and electric propulsion at scale is exactly the capability PamliEcoConnect will need as vessel development progresses.",
    identified: true,
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

// ─── Section config ──────────────────────────────────────────────────────────

type PlanSection = {
  slug: string;
  label: string;
  staticContent?: ReactNode;
};

const PLAN_SECTIONS: PlanSection[] = [
  { slug: "exec-summary",      label: "Executive Summary" },
  { slug: "company-overview",  label: "Company Overview" },
  { slug: "market-analysis",   label: "Market Analysis" },
  { slug: "services",          label: "Service Model" },
  { slug: "products",          label: "Vessel & Technology" },
  { slug: "marketing-plan",    label: "P3 Partnership" },
  { slug: "operations",        label: "Operations Plan" },
  { slug: "financial-plan",    label: "Financial Plan" },
  { slug: "economic-impact",   label: "Economic Impact" },
  { slug: "risk-analysis",     label: "Risk Analysis" },
  { slug: "timeline",          label: "Implementation" },
  { slug: "conclusion",        label: "Investors & Funding" },
  { slug: "grants",            label: "Grant Opportunities" },
  { slug: "management-team",   label: "Management Team",  staticContent: <ManagementTeamSection /> },
  { slug: "the-offering",      label: "The Offering",     staticContent: <TheOfferingSection /> },
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

          <nav className="flex flex-col gap-1 flex-1">
            {PLAN_SECTIONS.map(({ slug, label }) => (
              <button
                key={slug}
                onClick={() => scrollTo(slug)}
                data-testid={`btn-portal-section-${slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors text-left w-full ${
                  activeSlug === slug
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span>{label}</span>
                {activeSlug === slug && <ChevronRight className="h-4 w-4 shrink-0" />}
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Questions about investing?</p>
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
                        <div className="prose prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: page.content }} />
                        </div>
                      ) : (
                        <div>
                          <h2 className="font-display text-3xl font-bold text-foreground mb-4">{label}</h2>
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
