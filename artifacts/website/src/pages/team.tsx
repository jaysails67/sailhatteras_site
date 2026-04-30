import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, Users, Briefcase, TrendingUp, Shield, Wrench, Zap, Ship, Factory, ChevronRight } from "lucide-react";

const coreTeam = [
  {
    name: "Jay M. Phillips",
    title: "Chief Executive Officer & Project Manager",
    bio: "Founder; responsible for overall company leadership, program management, route and service design, and stakeholder relationships. Jay has been immersed in the maritime industry since the age of 14, accumulating over 100,000 bluewater miles. His career spans ownership and management of sail lofts, boat building operations, and maritime web development firms. Jay currently serves as Chair of Hatteras Sailing, an educational maritime nonprofit.",
    initials: "JP",
  },
  {
    name: "John Edward Elion",
    title: "Chief Financial Officer",
    bio: "Responsible for capital strategy, financial planning & analysis, investor relations, and oversight of grant/loan structures. John has served as Chair of the Waterworks Foundation, a Chesapeake Bay environmental organization. He has owned and built several multihull brands across the United States and Canada, combining deep financial acumen with a lifelong commitment to environmental stewardship.",
    initials: "JE",
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

const equityMilestones = [
  {
    milestone: "USCG Approval — 20-Passenger R&D Vessels",
    description: "Entry into service of the first 20-passenger R&D vessels triggers performance-based equity kicker grants for active management.",
  },
  {
    milestone: "50-Passenger Vessel Design Approval",
    description: "Completion and regulatory approval of the full commercial platform design unlocks the next tranche of management equity.",
  },
  {
    milestone: "Significant Commercial or Defense Contracts",
    description: "Execution of major institutional, commercial, or defense contracts triggers additional performance-based grants.",
  },
];

export default function Team() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="py-24 bg-card border-b border-border">
          <div className="container px-4 md:px-8 max-w-3xl text-center mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-5xl font-display font-bold mb-6">Management Team</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              PamliEcoConnect is led by its founding team and is in the process of carefully identifying and inviting a select group of maritime engineers, regulatory specialists, and industry veterans into advisory and eventual management roles as the company and its financing mature.
            </p>
          </div>
        </section>

        {/* Core Management */}
        <section className="py-24 border-b border-border">
          <div className="container px-4 md:px-8 max-w-5xl mx-auto">
            <div className="mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                <Users className="h-4 w-4" /> Current Core Management
              </div>
              <h2 className="text-3xl font-display font-bold mb-3">Committed Executive Leadership</h2>
              <p className="text-muted-foreground max-w-2xl">
                These are the only currently committed management roles. All other individuals are advisors or prospective management candidates as the company and financing mature.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {coreTeam.map((person) => (
                <div key={person.name} className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                      {person.initials}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold">{person.name}</h3>
                      <p className="text-primary text-sm font-medium">{person.title}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{person.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advisory Board */}
        <section className="py-24 border-b border-border bg-card/30">
          <div className="container px-4 md:px-8 max-w-6xl mx-auto">
            <div className="mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground mb-4">
                Prospective Advisory & Leadership Team
              </div>
              <h2 className="text-3xl font-display font-bold mb-3">Hand-Picked Candidates & Open Roles</h2>
              <p className="text-muted-foreground max-w-2xl">
                The following individuals have been specifically identified for the expertise they would bring to PamliEcoConnect. They are interested parties at this stage — not yet formally committed — and will be selectively invited into advisory or management roles as the company and its financing mature.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advisors.map((advisor) => {
                const Icon = advisor.icon;
                return (
                  <div
                    key={advisor.area}
                    className={`rounded-2xl border p-6 flex flex-col transition-colors ${
                      advisor.identified
                        ? "bg-card border-border hover:border-primary/30"
                        : "bg-card/50 border-dashed border-border/60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 rounded-xl ${advisor.identified ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {advisor.identified ? (
                        <span className="text-xs font-medium text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                          Identified
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                          Seeking
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{advisor.area}</p>
                    {advisor.name ? (
                      <h3 className="text-base font-semibold text-foreground mb-0.5">{advisor.name}</h3>
                    ) : (
                      <h3 className="text-base font-semibold text-muted-foreground/60 italic mb-0.5">Role to be filled</h3>
                    )}
                    <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" /> Target role if invited: {advisor.prospective}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{advisor.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Compensation Philosophy */}
        <section className="py-24 border-b border-border">
          <div className="container px-4 md:px-8 max-w-5xl mx-auto">
            <div className="mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                <TrendingUp className="h-4 w-4" /> Compensation & Incentive Philosophy
              </div>
              <h2 className="text-3xl font-display font-bold mb-3">Aligning Incentives with Long-Term Success</h2>
              <p className="text-muted-foreground max-w-2xl">
                Our compensation philosophy is built around capital efficiency in the R&D phase — minimizing fixed cash outlay while offering meaningful upside to those who help build the company.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  title: "Capital Efficiency",
                  body: "During the R&D phase, we minimize fixed cash outlay in favor of funding vessel development, USCG approval, and operational pilots.",
                },
                {
                  title: "Upside Alignment",
                  body: "We offer meaningful equity-based incentives to those who take on ongoing management responsibilities — structured to reward sustained commitment.",
                },
                {
                  title: "Performance & Commitment",
                  body: "The most substantial upside is reserved for individuals who move beyond advisory roles into operational leadership and drive measurable milestones.",
                },
              ].map((card) => (
                <div key={card.title} className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-4">Advisory vs. Management Compensation</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-medium">Advisory roles</span> may receive modest cash stipends and/or small equity grants (subject to board approval), reflecting their strategic input and introductions.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-foreground font-medium">Individuals who transition into formal management roles</span> will be eligible for management-level equity participation as described in the equity structure below.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Equity Structure */}
        <section className="py-24 bg-card/30">
          <div className="container px-4 md:px-8 max-w-5xl mx-auto">
            <div className="mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground mb-4">
                Future Management Equity Participation
              </div>
              <h2 className="text-3xl font-display font-bold mb-3">Equity Pool & Vesting Structure</h2>
              <p className="text-muted-foreground max-w-2xl">
                As the company secures initial financing and moves into full vessel development and operations, it intends to implement a Management & Key Contributor Equity Pool representing approximately{" "}
                <span className="text-foreground font-semibold">10–20% of fully diluted equity</span>, subject to board and legal approval.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Vesting Terms */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="font-semibold text-foreground mb-6">Standard Vesting Terms</h3>
                <div className="space-y-4">
                  {[
                    { label: "Instrument", value: "Stock options or restricted stock/units" },
                    { label: "Vesting Period", value: "4-year vesting with 1-year cliff" },
                    { label: "Ongoing Vesting", value: "Monthly or quarterly thereafter" },
                    { label: "Change of Control", value: "Double-trigger acceleration on CoC + termination or material role reduction" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm text-foreground font-medium text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who participates */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="font-semibold text-foreground mb-6">Who Participates</h3>
                <div className="space-y-4">
                  {[
                    { role: "Founders (CEO & CFO)", detail: "Meaningful common equity positions reflecting early risk and contribution." },
                    { role: "Advisors → Active Management", detail: "Significant equity grants sized according to role, time commitment, and impact upon transition into formal leadership." },
                    { role: "Key Management Leads", detail: "Design, M/E Engineering, Battery/Powerplant, Compliance, Production, and other formal roles." },
                  ].map((item) => (
                    <div key={item.role} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-0.5">{item.role}</p>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="font-semibold text-foreground mb-6">Performance-Based Milestone Grants</h3>
              <div className="space-y-4">
                {equityMilestones.map((item, i) => (
                  <div key={i} className="flex items-start gap-5 bg-card border border-border rounded-xl p-6">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">{item.milestone}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
