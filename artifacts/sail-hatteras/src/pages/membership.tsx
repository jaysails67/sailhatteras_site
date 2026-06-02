import { Link } from "wouter";
import { Heart, Users, Anchor, Star, CheckCircle2, ArrowRight, Waves, Shield, Home, Trophy, BookOpen, PartyPopper, LifeBuoy } from "lucide-react";
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
    description: "Join Hatteras Community Sailing. Local residents, non-resident property owners, and vacation rental managers each have a membership tailored to their needs.",
    canonical: "/membership",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": "https://sailhatteras.org/membership",
      "name": "Membership — Hatteras Community Sailing",
      "description": "Three membership tiers for Hatteras Island locals, non-resident property owners, and vacation rental managers. Member discounts on sailing programs, events, and rentals.",
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

      {/* Why Join */}
      <section className="py-20 px-6">
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
                    <div className="text-xs text-muted-foreground mt-0.5">Rental property owners & managers — extend full privileges to guests · from $695/year</div>
                  </div>
                </div>
              </div>
              <div className="pt-5 mt-5 border-t border-border">
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
              <div className="text-4xl font-bold text-primary mb-6">$150 <span className="text-lg font-normal text-muted-foreground">/ year</span></div>
              <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                <p>
                  Designed for Hatteras Island year-round residents and their families. Full access to all member benefits, programs, social events, and regattas — at the rates that reflect your role in keeping this community's sailing heritage alive.
                </p>
                <p>
                  Hatteras Island locals are the backbone of this organization. This membership is our way of making sure cost is never a barrier to getting on the water.
                </p>
              </div>
              <Button asChild size="lg" className="mt-8">
                <Link href="/contact">Join as a Local Member <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
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
              <div className="text-4xl font-bold text-primary mb-6">$500 <span className="text-lg font-normal text-muted-foreground">/ year</span></div>
              <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                <p>
                  You own property on Hatteras Island but don't live here year-round. When you're here — whether for a long weekend or the whole summer — you deserve full access to what the island has to offer on the water.
                </p>
                <p>
                  NRPO membership gives you and your family full member privileges every time you're on-island: member rates on programs, boat rentals, social events, and regatta eligibility.
                </p>
              </div>
              <Button asChild size="lg" className="mt-8">
                <Link href="/contact">Join as an NRPO Member <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
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
              <h2 className="font-serif text-3xl font-bold mb-2 text-primary-foreground">For Rental Property Owners & Managers</h2>
              <p className="text-primary-foreground/70 text-sm mb-6">Priced by property size — from $695/year</p>
              <div className="space-y-3 text-primary-foreground/80 leading-relaxed text-sm">
                <p>
                  Cape Select is a hospitality membership designed for vacation rental property owners and managers on Hatteras Island. It lets you extend full HCS member privileges directly to your guests — turning a sailing club membership into a premium rental amenity.
                </p>
                <p>
                  Your guests arrive and immediately have access to everything we offer: sailing lessons, boat rentals, kids programs, on-water social events, birthday parties, weddings, towing, and the kind of local knowledge that turns a good vacation into an unforgettable one.
                </p>
                <p>
                  <strong className="text-primary-foreground">You can't get much closer to the Cape by boat</strong> than where we are in Buxton — and your guests will know it.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">Get Cape Select Pricing <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              {/* Benefits */}
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
              {/* Pricing table */}
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
            Contact us to set up your membership, get a Cape Select quote for your rental property, or apply for a youth sailing scholarship.
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
