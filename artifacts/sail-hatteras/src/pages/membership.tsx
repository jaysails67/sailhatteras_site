import { Link } from "wouter";
import { Heart, Users, Anchor, Star, CheckCircle2, ArrowRight, Waves, Shield, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";

const memberBenefits = [
  "Discounted rates on all sailing programs and experiences",
  "Member pricing on boat rentals",
  "Full calendar of social events and community sails",
  "Use of club boats during club-sponsored sailing events",
  "Local one-design regatta participation",
  "Regional and national regatta opportunities",
  "Expert local knowledge and on-water guidance",
  "Priority registration for new programs",
];

const tiers = [
  {
    name: "Locals Only Family",
    badge: "Year-Round Residents",
    price: "Contact us",
    description: "For Hatteras Island year-round residents and their families. Full access to all member benefits, programs, social events, and regattas.",
    highlights: [
      "Adult Fun Sail: member rate ($95 vs $250)",
      "Discounts on sailing programs & youth teams",
      "Rental discounts on club boats",
      "Full regatta eligibility",
      "All social events & community sails",
      "Use of club boats at club events",
    ],
    cta: "Join as Local Member",
    href: "/contact",
    featured: false,
  },
  {
    name: "Seasonal / Non-Resident Family",
    badge: "Seasonal Visitors & Homeowners",
    price: "Contact us",
    description: "For Hatteras Island seasonal visitors, second-home owners, and their families who spend part of the year on the island.",
    highlights: [
      "Adult Community Intro to Sailing: 70% off",
      "Intro to Cruising / Catamaran / Keelboat / Small Boats: 15% off",
      "Opti Sailing Team: 20% off",
      "Homeschool Cape Explorer: 10% off",
      "Rental discounts",
      "Social events & community sails",
    ],
    cta: "Join as Seasonal Member",
    href: "/contact",
    featured: true,
  },
  {
    name: "Cape Select",
    badge: "Rental Property Owners",
    price: "Contact us",
    description: "Designed for vacation rental property owners on Hatteras Island. Provide your guests with exclusive on-water access as part of their rental amenity package.",
    highlights: [
      "Guest access to safe boat launch",
      "Expert local knowledge & training",
      "Rental discounts for guests",
      "Charter & experience access",
      "On-water social activities",
      "Weekly group option available",
    ],
    cta: "Ask About Cape Select",
    href: "/contact",
    featured: false,
  },
];

export default function Membership() {
  useSeo({
    title: "Membership — Hatteras Community Sailing",
    description: "Join Hatteras Community Sailing as a member. Discounts on programs, boat rentals, community sails, and regattas. Open to Hatteras Island locals, seasonal visitors, and families.",
    canonical: "/membership",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": "https://sailhatteras.org/membership",
      "name": "Membership — Hatteras Community Sailing",
      "description": "Become a member of Hatteras Community Sailing. Members receive discounts on all programs, priority registration, rental access, and invitations to community sails and regattas.",
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
            Membership helps fund youth scholarships, keeps our fleet on the water, and earns you exclusive discounts on programs, rentals, and events all year long.
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
                  Hatteras Community Sailing was founded in 2020 to provide sailing and maritime education to Hatteras Island residents, seasonal visitors, and summer residents. Programs grow every year — and so does our impact on the community.
                </p>
                <p>
                  Our mission is bigger than sailing. We work to sustain the maritime heritage of Cape Hatteras: keeping traditional skills alive, investing in island youth, and making the water accessible to everyone — not just tourists.
                </p>
                <p>
                  <strong className="text-foreground">Membership is not required to participate in our programs.</strong> But members receive meaningful discounts and perks — and every membership fee goes directly toward keeping our boats in the water and our youth programs running.
                </p>
                <p>
                  <strong className="text-foreground">No child is turned away for inability to pay.</strong> Scholarships and free program spots are available for local Hatteras youth. Contact us to learn more.
                </p>
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-8 space-y-4">
              <h3 className="font-serif text-xl font-bold mb-2">Member Benefits</h3>
              {memberBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground leading-relaxed">{benefit}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>EIN: 85-2684924 · Donations are tax-deductible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Membership Options</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you live on the island year-round or are visiting for the summer, there's a way to be part of the community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-8 flex flex-col ${
                  tier.featured
                    ? "border-primary bg-primary text-primary-foreground shadow-lg"
                    : "border-border bg-card"
                }`}
              >
                <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-4 ${
                  tier.featured ? "text-secondary" : "text-primary"
                }`}>
                  {tier.featured && <Star className="h-3.5 w-3.5 fill-secondary" />}
                  {tier.badge}
                </div>
                <h3 className={`font-serif text-xl font-bold mb-4 ${tier.featured ? "text-primary-foreground" : "text-foreground"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm leading-relaxed mb-6 ${tier.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {tier.description}
                </p>
                <ul className="space-y-2 mb-8 flex-1">
                  {tier.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${tier.featured ? "text-secondary" : "text-primary"}`} />
                      <span className={`text-sm ${tier.featured ? "text-primary-foreground/90" : "text-foreground"}`}>{h}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={tier.featured ? "secondary" : "outline"}
                  className={tier.featured ? "font-bold" : ""}
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Youth & Adult Programs */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-10">Programs Open to Members & Non-Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Youth Sailing</h3>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Membership is not required to register your child in any of our junior programs — Sailing Littles, Kids Development Program, Junior Summer Camps, or SAISA High School Sailing.
                </p>
                <p>
                  Members receive discounted registration fees. Sailing scholarships are available for Hatteras Island youth — contact us to apply.
                </p>
              </div>
              <div className="mt-5">
                <Button asChild variant="outline" size="sm">
                  <Link href="/trips?category=learn">View Youth Programs <ArrowRight className="h-3.5 w-3.5 ml-1.5" /></Link>
                </Button>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Adult Sailing</h3>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  We teach group and private adult sailing on a rotating fleet: Stiletto Catamaran, Stiletto XC, Collegiate 420, Flying Scot, and Beach Cats.
                </p>
                <p>
                  Group adult sessions run June through August. Members pay $95/session — non-members $250. Private lessons are available year-round for visitors and residents.
                </p>
              </div>
              <div className="mt-5">
                <Button asChild variant="outline" size="sm">
                  <Link href="/trips/adult-fun-sail">Adult Fun Sail <ArrowRight className="h-3.5 w-3.5 ml-1.5" /></Link>
                </Button>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Regattas & Racing</h3>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Members are eligible to participate in one-design regattas right here on Hatteras Island, plus regional and national sailing competitions through our SAISA and US Sailing affiliations.
                </p>
              </div>
              <div className="mt-5">
                <Button asChild variant="outline" size="sm">
                  <Link href="/contact">Ask About Racing <ArrowRight className="h-3.5 w-3.5 ml-1.5" /></Link>
                </Button>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Social Events</h3>
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Members are invited to a full year of social sailing events — on-water gatherings, skill-sharing days, and community celebrations tied to the rhythm of island life and the sailing calendar.
                </p>
              </div>
              <div className="mt-5">
                <Button asChild variant="outline" size="sm">
                  <Link href="/contact">Get on the List <ArrowRight className="h-3.5 w-3.5 ml-1.5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visitors / Cape Select */}
      <section className="py-16 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/15 rounded-full px-3 py-1 text-xs font-semibold tracking-wider mb-5 text-secondary">
                <Anchor className="h-3.5 w-3.5" />
                For Rental Property Visitors
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
                Vacationing at Cape Hatteras?
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-4">
                Our Cape Select membership is designed for vacation rental property owners and their guests. It's one of the closest-to-the-Cape boating clubs you'll find — with safe boat launch access, rental discounts, expert local knowledge, charters, and on-water social activities included.
              </p>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                If your rental property owner isn't already a member, let them know this is an amenity you'd appreciate. We also offer weekly group options for visitors who want to get on the water without a full membership.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Ask About Visitor Options</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Contact us to set up your membership, ask questions about the right option for your situation, or apply for a youth sailing scholarship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                Contact Us to Join <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
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
