import { Link } from "wouter";
import { Heart, Anchor, Users, BookOpen, Waves, Shield, ArrowRight, Compass, Fish, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetShHomeSummary } from "@workspace/api-client-react";

export default function About() {
  const { data: summary } = useGetShHomeSummary();

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Heart className="h-4 w-4 fill-primary" />
            501(c)3 Nonprofit Organization
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
            The Sea for Every<br />Hatteras Child
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hatteras Community Sailing connects island youth to the ocean — and to every skill, career, and way of life it offers — through hands-on programs that grow with them from childhood into adulthood.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">Who We Are</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Hatteras Community Sailing is a 501(c)3 nonprofit based in Buxton, North Carolina on Hatteras Island. We operate on the waters of Pamlico Sound — one of the finest sailing environments on the East Coast — and our name reflects our roots. But our mission is bigger than sailing.
                </p>
                <p>
                  Hatteras Island is a remote barrier island community defined by the sea. The ocean shapes everything here: the economy, the culture, the weather, the land itself. Yet the same forces pulling young people away from real-world skills and community everywhere — screens, social media, algorithmic entertainment — are pulling at Hatteras kids too. We exist to give them a counterweight.
                </p>
                <p>
                  We start the youngest children on sailboats. Sailing is ideal for small kids — it demands attention, teaches consequence, and builds confidence in ways few other activities can. As youth grow with us, we walk alongside them into powerboating, diving, fishing, boatbuilding, maritime technology, and professional seamanship. These aren't hobbies. They're <strong className="text-foreground">pathways</strong> — to careers, to independence, to a life genuinely connected to the place they call home.
                </p>
                <p>
                  <strong className="text-foreground">No child is turned away for inability to pay.</strong> Scholarships and free program spots are available for local Hatteras youth. Contact us directly to learn more.
                </p>
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-8 space-y-6">
              <div className="text-center">
                <div className="font-serif text-5xl font-bold text-primary mb-1">
                  {summary?.totalTrips ?? 11}
                </div>
                <div className="text-sm text-muted-foreground">Active community programs</div>
              </div>
              <div className="border-t border-border pt-6 space-y-4">
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
                    <div className="font-semibold text-sm">Based in Buxton, NC — Hatteras Island</div>
                    <div className="text-xs text-muted-foreground">48962 NC-12, Buxton, NC 27920</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 fill-primary text-primary shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Youth Scholarships Available</div>
                    <div className="text-xs text-muted-foreground">Full and partial scholarships for local youth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pathways Section */}
      <section className="py-20 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">A Lifelong Relationship with the Sea</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our programs aren't one-time events — they're entry points to a larger journey. We meet youth where they are and grow with them as their skills and ambitions expand.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Community Experiences</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our sailing experiences — sunset sails, wildlife tours, half and full-day charters — bring visitors and locals into contact with the ecology and culture of the Outer Banks. Every program fee funds youth scholarships and keeps our fleet on the water. Every ticket you buy keeps a kid out here.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Youth Maritime Pathways</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We start the youngest children sailing — Optimist dinghies and beach cats for beginners, building to Collegiate 420s and larger vessels. As youth mature, we open pathways to powerboating, diving, fishing, boatbuilding, maritime technology, and professional seamanship. All youth programs are scholarship-eligible; no one is excluded.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Community Fleet Access</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our rental program keeps independent time on Pamlico Sound affordable for experienced community members. Below-market catamaran and skiff rates are made possible by our charter and program revenue — so the water stays part of everyday life on Hatteras Island, not just a tourist attraction.
              </p>
            </div>
          </div>

          {/* Pathway progression callout */}
          <div className="mt-12 bg-primary text-primary-foreground rounded-2xl p-8 md:p-10">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">The Pathway, Year by Year</h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                A child who joins our Junior Sailing Camp at age 8 doesn't stop there. We walk alongside them — through intermediate sailing, into powerboat seamanship, then diving, fishing, boatbuilding, and maritime technology as their interests and abilities grow. By the time they're ready to enter the workforce, they have skills and credentials that belong to life on a working waterfront.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
                {["Sailing", "Powerboating", "Diving", "Fishing", "Boatbuilding", "Maritime Technology", "Professional Seamanship"].map((p) => (
                  <span key={p} className="bg-primary-foreground/15 rounded-full px-4 py-1.5 text-primary-foreground">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nonprofit Transparency */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-8">Nonprofit Transparency</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Hatteras Community Sailing is committed to full transparency as a 501(c)3 nonprofit. Our financial statements, program reports, and Form 990 are available upon request.
              </p>
              <p>
                We are funded through a combination of community program fees, individual donations, grants, and partnerships with local businesses and institutions. No government funding is received for day-to-day operations.
              </p>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Our board of directors is composed of community members from Buxton, Avon, and the surrounding Hatteras Island area. All board positions are volunteer, with no compensation.
              </p>
              <div className="bg-muted/50 rounded-xl border border-border px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Board Leadership</div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-lg shrink-0">J</div>
                  <div>
                    <div className="font-semibold text-foreground">Jay Phillips</div>
                    <div className="text-sm text-muted-foreground">Chairman of the Board of Directors</div>
                  </div>
                </div>
              </div>
              <p>
                Donations to Hatteras Community Sailing are tax-deductible to the extent permitted by law. Our EIN is <strong className="text-foreground">85-2684924</strong>. Please consult your tax advisor for specific guidance.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/trips">Browse Our Programs</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">
                Contact Us <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
