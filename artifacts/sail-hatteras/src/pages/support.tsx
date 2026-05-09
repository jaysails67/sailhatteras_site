import { Link } from "wouter";
import { Heart, ArrowRight, Shield, Anchor, Users, Star, DollarSign, Gift, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const waysToSupport = [
  {
    icon: Heart,
    title: "Individual Donation",
    description:
      "A one-time or recurring donation directly funds youth scholarships, equipment maintenance, and new program development. Every dollar stays on Hatteras Island.",
    action: "Donate",
    href: "/contact",
  },
  {
    icon: Users,
    title: "Become a Member",
    description:
      "Annual membership keeps our nonprofit sustainable and earns you discounts on all programs, rentals, and community events throughout the year.",
    action: "Learn About Membership",
    href: "/membership",
  },
  {
    icon: Star,
    title: "Youth Sailing Sponsorship",
    description:
      "Sponsor a kid's season of sailing — from Sailing Littles to SAISA High School Sailing. Sponsors are recognized on our website, social channels, and event t-shirts.",
    action: "Sponsor a Sailor",
    href: "/contact",
  },
  {
    icon: Megaphone,
    title: "Business Sponsorship",
    description:
      "Local and regional businesses can sponsor our programs or regattas. Sponsorships include website banner ads, t-shirt logos, and recognition on our social channels.",
    action: "Sponsor Our Programs",
    href: "/contact",
  },
  {
    icon: Gift,
    title: "Donate Equipment",
    description:
      "We welcome donations of sailboats, rigging, safety gear, and maritime equipment. Contact us to discuss what we can accept and put to immediate use.",
    action: "Ask About Equipment",
    href: "/contact",
  },
  {
    icon: DollarSign,
    title: "Book a Program",
    description:
      "Every charter, experience, and lesson you book directly funds youth programming and nonprofit operations. Booking is one of the most direct ways to support.",
    action: "Browse Programs",
    href: "/trips",
  },
];

export default function Support() {
  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Heart className="h-4 w-4 fill-primary" />
            501(c)3 Nonprofit
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Support Hatteras<br />Community Sailing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your support keeps island kids on the water and maritime heritage alive on Cape Hatteras. Donations are tax-deductible and every dollar goes directly to programs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Donate or Sponsor</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/membership">Join as a Member</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">Why Your Support Matters</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Hatteras Community Sailing is a member-based nonprofit open to all. We were founded to encourage sailing and competitive opportunities for island youth — and to keep the maritime heritage of Cape Hatteras alive and strong in the community.
                </p>
                <p>
                  Hatteras Island is a working-class community that largely supports the vacation rental industry. The pressure of tourism can erode local character over time — and the best defense is a generation of young people with deep roots in the sea: kids who sail, fish, dive, build boats, and love this place.
                </p>
                <p>
                  <strong className="text-foreground">No child is turned away for inability to pay.</strong> Scholarships and free program spots are available. Your support funds those slots directly.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">IRS Tax-Exempt Status</div>
                    <div className="text-xs text-muted-foreground">501(c)3 Nonprofit — EIN: 85-2684924</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Anchor className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Based in Buxton, NC</div>
                    <div className="text-xs text-muted-foreground">48962 NC-12, Buxton, NC 27920</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 fill-primary text-primary shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Youth Scholarships Available</div>
                    <div className="text-xs text-muted-foreground">Full and partial awards for Hatteras Island youth</div>
                  </div>
                </div>
                <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                  Donations are tax-deductible to the extent permitted by law. Consult your tax advisor.
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl border border-border px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Financial Reports</div>
                <p className="text-sm text-muted-foreground">
                  As a 501(c)3, our financial statements and Form 990 are available upon request. Contact us at{" "}
                  <a href="mailto:info@sailhatteras.org" className="text-primary hover:underline">
                    info@sailhatteras.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Support */}
      <section className="py-20 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Ways to Support</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a one-time donation to a business sponsorship, every form of support makes a difference.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {waysToSupport.map((item) => (
              <div key={item.title} className="bg-card rounded-xl border border-border p-6 flex flex-col">
                <div className="h-11 w-11 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">{item.description}</p>
                <Button asChild variant="outline" size="sm" className="self-start">
                  <Link href={item.href}>
                    {item.action} <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Youth Sponsorship Spotlight */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/15 rounded-full px-3 py-1 text-xs font-semibold tracking-wider mb-5 text-secondary">
                <Star className="h-3.5 w-3.5 fill-secondary" />
                Sponsor Youth Sailing
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
                Help Build the Next Generation of Hatteras Sailors
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-4">
                Hatteras Community Sailing offers a wide variety of youth sponsorship opportunities. We need support to establish a sustainable future for our US Sailing juniors program — from the youngest beach cat sailors to our SAISA high school team.
              </p>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Sponsors are acknowledged with a banner on our website, logo on event t-shirts, and recognition across our social channels. Contact us to discuss the right sponsorship level for your business or family.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">
                  Sponsor Youth Sailing <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold mb-3">Questions About Giving?</h2>
          <p className="text-muted-foreground mb-6">
            Reach out — we're happy to talk about how your support can make the most impact.
          </p>
          <Button asChild size="lg">
            <a href="mailto:info@sailhatteras.org">
              info@sailhatteras.org <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground mt-6">
            Hatteras Community Sailing · EIN: 85-2684924 · 501(c)3 Nonprofit · Buxton, NC
          </p>
        </div>
      </section>
    </div>
  );
}
