import { Link } from "wouter";
import {
  Heart, Users, Anchor, Star, CheckCircle2, ArrowRight, Waves,
  Shield, Home, Trophy, BookOpen, PartyPopper, LifeBuoy,
  Lock, CreditCard, Award, Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";

const localBenefits = [
  "Adult sailing sessions: $95/session (vs. $250 non-member)",
  "Discounts on all sailing programs & youth team registrations",
  "Rental discounts on club boats",
  "Full regatta eligibility — local, regional & national",
  "All social events & community sails",
  "Use of club boats at club-sponsored events",
  "Priority registration for new programs",
  "Expert local knowledge & on-water guidance",
];

const nrpoBenefits = [
  "Adult sailing sessions: $95/session (vs. $250 non-member)",
  "Full member rates on all programs when on-island",
  "Rental discounts on club boats",
  "Regatta eligibility during island visits",
  "Social events & community sails",
  "Use of club boats at club-sponsored events",
  "Priority registration for seasonal programs",
];

const capeSelectBenefits = [
  "Guests receive full member privileges under your membership",
  "Safe, supervised boat launch access at Buxton Harbor",
  "Sailing lessons, instruction & on-water training",
  "Boat rentals & charter experiences",
  "Kids programs, camps & youth sailing",
  "On-water social events, birthday parties & weddings",
  "On-island towing & emergency assistance",
  "Expert local knowledge — best spots, conditions, safety",
  "Your property listed as a Cape Select partner",
];

const capeSelectPricing = [
  { size: "1–2 Bedrooms", price: "$695 / year" },
  { size: "3–4 Bedrooms", price: "$895 / year" },
  { size: "5–6 Bedrooms", price: "$995 / year" },
  { size: "7–8 Bedrooms", price: "$1,195 / year" },
  { size: "9+ Bedrooms", price: "Contact us" },
];

export default function Membership() {
  useSeo({
    title: "Membership — Hatteras Community Sailing",
    description: "Join Hatteras Community Sailing as a Charter Member and lock in your rate for up to 10 years. Three tiers for locals, non-resident property owners, and vacation rental managers.",
    canonical: "/membership",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": "https://sailhatteras.org/membership",
      "name": "Membership — Hatteras Community Sailing",
      "description": "Charter Member founding rates locked for 10 years. Local resident, NRPO, and Cape Select tiers. Flexible auto-billing payment plans available.",
      "publisher": { "@id": "https://sailhatteras.org/#organization" }
    },
  });

  return (
    <div className="min-h-screen pt-20 bg-background">

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Heart className="h-4 w-4 fill-primary" />
            Support the Mission
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Join Hatteras<br />Community Sailing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Membership sustains our youth sailing scholarships, keeps the fleet on the water, and connects the Hatteras Island community to its maritime heritage — while giving members meaningful perks in return.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Become a Member</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/trips">Browse Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Charter Member Callout */}
      <section className="py-16 px-6 bg-amber-50 border-y border-amber-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 mb-4">
                <Award className="h-4 w-4" /> Charter Member Status — Now Open
              </div>
              <h2 className="font-serif text-3xl font-bold text-amber-900 mb-4">
                Be a Founding Voice.<br />Lock In Your Rate.
              </h2>
              <p className="text-amber-800 leading-relaxed mb-4">
                Charter Members are the founding backbone of Hatteras Community Sailing. Join now and your membership rate is <strong>locked for 10 years</strong> — as long as you maintain continuous membership. No rate increases, no surprises. Just the same price you joined at, year after year.
              </p>
              <p className="text-amber-800 leading-relaxed mb-6">
                Charter Member status is open now and will remain available until the Board of Directors votes to close it. Once it closes, it's gone — there's no path back to founding rates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-amber-700 hover:bg-amber-800 text-white border-0">
                  <Link href="/contact">Claim Charter Member Status <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
            <div className="md:w-80 space-y-4 shrink-0">
              {[
                {
                  icon: <Lock className="h-5 w-5 text-amber-700" />,
                  title: "Rate Locked 10 Years",
                  body: "Local & NRPO members who join as Charter Members pay today's rate for a full decade. Cape Select properties: 3-year rate lock.",
                },
                {
                  icon: <CreditCard className="h-5 w-5 text-amber-700" />,
                  title: "Flexible Payment Plans",
                  body: "Pay on a schedule that works for your budget. Automatic billing only — set it up once and forget it.",
                },
                {
                  icon: <Star className="h-5 w-5 text-amber-700 fill-amber-700" />,
                  title: "Charter Member Recognition",
                  body: "Your name recognized as a founding member of Hatteras Community Sailing — part of the organization's permanent history.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-amber-200 rounded-xl p-5 flex gap-4">
                  <div className="shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <div className="font-semibold text-amber-900 text-sm mb-1">{item.title}</div>
                    <div className="text-amber-700 text-xs leading-relaxed">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Board / Committee / Volunteer Incentives */}
      <section className="py-16 px-6 border-b border-border bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                <Gavel className="h-4 w-4" /> Service Positions
              </div>
              <h2 className="font-serif text-3xl font-bold mb-4">Lead. Serve. Save.</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Members who step up to serve in Board, Committee, or key volunteer positions receive <strong className="text-foreground">50% off their membership</strong> for the duration of their service — plus a rate lock for as long as they hold the position.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                When a position is vacated, membership reverts to the standard rate. Service incentives apply to Board members, Committee chairs and members, and key volunteer roles as designated by the Board.
              </p>
              <Button asChild variant="outline">
                <Link href="/contact">Ask About Service Positions <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: <Gavel className="h-5 w-5 text-primary" />,
                  title: "Board of Directors",
                  body: "Elected leadership positions guiding the organization's mission, finances, and strategy.",
                },
                {
                  icon: <Users className="h-5 w-5 text-primary" />,
                  title: "Committee Members",
                  body: "Appointed roles on program, fundraising, youth, events, and other standing committees.",
                },
                {
                  icon: <Heart className="h-5 w-5 text-primary" />,
                  title: "Key Volunteers",
                  body: "Designated volunteer positions critical to program delivery, fleet maintenance, and community events.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-xl p-5 flex gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-1">{item.title}</div>
                    <div className="text-muted-foreground text-xs leading-relaxed">{item.body}</div>
                  </div>
                </div>
              ))}
              <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Rate reverts on vacating a position.</span> Service incentives are tied to active service only and do not carry forward after a position ends.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Overview */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">Why Join?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Hatteras Community Sailing was founded in 2020 to provide sailing and maritime education to Hatteras Island locals, seasonal visitors, and summer residents. Programs grow every year — and so does our impact on the community.
                </p>
                <p>
                  Our mission is bigger than sailing. We work to sustain the maritime heritage of Cape Hatteras: keeping traditional skills alive, investing in island youth, and making the water accessible to everyone — not just tourists.
                </p>
                <p>
                  <strong className="text-foreground">Membership is not required to participate in our programs.</strong> But members receive meaningful discounts and perks — and every membership fee goes directly toward keeping our boats in the water and our youth programs running.
                </p>
                <p>
                  <strong className="text-foreground">No child is turned away for inability to pay.</strong> Scholarships and free program spots are available for Hatteras Island youth.
                </p>
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-8">
              <h3 className="font-serif text-xl font-bold mb-5">Three Membership Types</h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">Local Resident</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Year-round Hatteras Island residents & families · $150/year</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">Non-Resident Property Owner</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Property owners who visit seasonally · $500/year</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Anchor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">Cape Select</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Rental property owners & managers — guests receive full privileges · from $695/year</div>
                  </div>
                </div>
              </div>
              <div className="pt-5 mt-5 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Flexible auto-billing payment plans available for all tiers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>EIN: 85-2684924 · 501(c)3 Nonprofit · Donations tax-deductible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tier 1: Local Resident */}
      <section className="py-20 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                <Users className="h-4 w-4" /> Local Resident Membership
              </div>
              <h2 className="font-serif text-3xl font-bold mb-2">For Year-Round Islanders</h2>
              <div className="text-4xl font-bold text-primary mb-2">$150 <span className="text-lg font-normal text-muted-foreground">/ year</span></div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-6">
                <Lock className="h-3 w-3" /> Charter Members lock this rate for 10 years
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                <p>
                  Designed for Hatteras Island year-round residents and their families. Full access to all member benefits, programs, social events, and regattas — at rates that reflect your role as the backbone of this community's sailing heritage.
                </p>
                <p>
                  Hatteras Island locals are the foundation of this organization. This membership is our way of making sure cost is never a barrier to getting on the water.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">Join as a Local Member <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-5">What's Included</h3>
              <ul className="space-y-3">
                {localBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tier 2: NRPO */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="order-2 lg:order-1 bg-card border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-5">What's Included</h3>
              <ul className="space-y-3">
                {nrpoBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                <Home className="h-4 w-4" /> Non-Resident Property Owner
              </div>
              <h2 className="font-serif text-3xl font-bold mb-2">For NRPO Families</h2>
              <div className="text-4xl font-bold text-primary mb-2">$500 <span className="text-lg font-normal text-muted-foreground">/ year</span></div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-6">
                <Lock className="h-3 w-3" /> Charter Members lock this rate for 10 years
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                <p>
                  You own property on Hatteras Island but don't live here year-round. When you're here — whether for a long weekend or the whole summer — you deserve full access to what the island has to offer on the water.
                </p>
                <p>
                  NRPO membership gives you and your family full member privileges every time you're on-island: member rates on programs, boat rentals, social events, and regatta eligibility.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">Join as an NRPO Member <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tier 3: Cape Select */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                <Star className="h-4 w-4 fill-secondary" /> Cape Select Membership
              </div>
              <h2 className="font-serif text-3xl font-bold mb-2 text-primary-foreground">For Rental Property Owners &amp; Managers</h2>
              <p className="text-primary-foreground/70 text-sm mb-2">Priced by property size — from $695/year</p>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-900/30 border border-amber-400/30 rounded-full px-3 py-1 mb-6">
                <Lock className="h-3 w-3" /> Charter Members lock their rate for 3 years
              </div>
              <div className="space-y-3 text-primary-foreground/80 leading-relaxed text-sm">
                <p>
                  Cape Select is a hospitality membership for vacation rental property owners and managers on Hatteras Island. It lets you extend full HCS member privileges directly to your guests — turning a sailing club membership into a premium rental amenity.
                </p>
                <p>
                  Your guests arrive and immediately have access to everything we offer: sailing lessons, boat rentals, kids programs, on-water social events, birthday parties, weddings, towing, and the kind of local knowledge that turns a good vacation into an unforgettable one.
                </p>
                <p>
                  <strong className="text-primary-foreground">You can't get much closer to the Cape by boat</strong> than where we are in Buxton — and your guests will know it.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">Get Cape Select Pricing <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-primary-foreground/10 rounded-2xl p-6">
                <h3 className="font-semibold text-primary-foreground mb-4">Guest Privileges Include</h3>
                <ul className="space-y-2.5">
                  {capeSelectBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm text-primary-foreground/90">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-primary-foreground/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-primary-foreground/20">
                  <h3 className="font-semibold text-primary-foreground">Annual Pricing by Property Size</h3>
                  <p className="text-xs text-primary-foreground/60 mt-0.5">Based on rental property bedroom count</p>
                </div>
                <table className="w-full">
                  <tbody>
                    {capeSelectPricing.map((row, i) => (
                      <tr key={row.size} className={i % 2 === 0 ? "bg-primary-foreground/5" : ""}>
                        <td className="px-6 py-3 text-sm text-primary-foreground/80">{row.size}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-secondary text-right">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs open to all */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-3">Open to Members &amp; Non-Members</h2>
          <p className="text-muted-foreground mb-10">Membership is never required — but members save meaningfully on everything below.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Users className="h-5 w-5" />,
                title: "Youth Sailing",
                body: "Sailing Littles, Kids Development Program, Junior Camps, and SAISA High School Sailing — open to all. Membership gives discounted registration. Scholarships available for Hatteras Island youth.",
                link: "/trips",
                cta: "View Youth Programs",
              },
              {
                icon: <Waves className="h-5 w-5" />,
                title: "Adult Learn to Sail",
                body: "Monthly group sessions run June through August on a rotating fleet. Members pay $95/session. Non-members $250. Private lessons available year-round.",
                link: "/trips/adult-sailing-program",
                cta: "View Adult Sessions",
              },
              {
                icon: <Trophy className="h-5 w-5" />,
                title: "Regattas & Racing",
                body: "Members are eligible for one-design regattas on Hatteras Island, plus regional and national competitions through SAISA and US Sailing affiliations.",
                link: "/contact",
                cta: "Ask About Racing",
              },
              {
                icon: <BookOpen className="h-5 w-5" />,
                title: "Social Events",
                body: "A full calendar of on-water gatherings, skill-sharing sails, and community celebrations tied to the rhythm of island life. Members are always on the list.",
                link: "/contact",
                cta: "Get on the List",
              },
              {
                icon: <PartyPopper className="h-5 w-5" />,
                title: "Private Events",
                body: "Birthday parties, weddings, corporate outings, and special occasions on the water. Cape Select members can extend these privileges directly to rental guests.",
                link: "/contact",
                cta: "Plan an Event",
              },
              {
                icon: <LifeBuoy className="h-5 w-5" />,
                title: "Towing & Assistance",
                body: "On-water towing and emergency assistance on Pamlico Sound. Available to members and Cape Select guests — so your vacation doesn't end with a call for help.",
                link: "/contact",
                cta: "Learn More",
              },
            ].map((card) => (
              <div key={card.title} className="bg-card rounded-xl border border-border p-6">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {card.icon}
                </div>
                <h3 className="font-serif text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{card.body}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={card.link}>{card.cta} <ArrowRight className="h-3.5 w-3.5 ml-1.5" /></Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Contact us to claim Charter Member status, set up your payment plan, get a Cape Select quote, or apply for a youth sailing scholarship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Contact Us to Join <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/support">Support the Mission</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Hatteras Community Sailing · EIN: 85-2684924 · 501(c)3 Nonprofit · Buxton, NC
          </p>
        </div>
      </section>

    </div>
  );
}
