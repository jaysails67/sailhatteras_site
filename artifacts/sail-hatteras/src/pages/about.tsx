import { Link } from "wouter";
import { Heart, Anchor, Users, BookOpen, Waves, Shield, ArrowRight } from "lucide-react";
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
            Our Mission: Sailing<br />for Everyone
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hatteras Community Sailing exists to make the art and joy of sailing accessible to every member of the Outer Banks community — regardless of background, income, or prior experience.
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
                  Hatteras Community Sailing is a 501(c)3 tax-exempt nonprofit organization based in Hatteras Village, North Carolina. We operate on the waters of Pamlico Sound — one of the finest sailing environments on the East Coast — with the mission of building community through sailing.
                </p>
                <p>
                  We were founded on the belief that access to the water should not be limited by what you can afford. Our community sailing programs — experiences, instruction, and rentals — generate the revenue that funds free and subsidized sailing for youth and underserved members of our community.
                </p>
                <p>
                  <strong className="text-foreground">No child is turned away for inability to pay.</strong> Scholarships and free program spots are available for local Hatteras youth. Reach out to us directly to learn more.
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
                    <div className="text-xs text-muted-foreground">501(c)3 Nonprofit — EIN: [Your EIN Here]</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Anchor className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Based in Hatteras Village, NC</div>
                    <div className="text-xs text-muted-foreground">Outer Banks, North Carolina 27943</div>
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

      {/* How Programs Support Mission */}
      <section className="py-20 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">How Our Programs Serve the Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every program we offer ties directly to our nonprofit mission of community sailing access. Here's how participation translates to impact.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Community Experiences</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our sailing experiences — sunset sails, wildlife tours, half and full-day charters — bring participants into contact with the unique ecology and culture of the Outer Banks. Program fees fund operational costs and directly subsidize our youth programs. Every ticket you buy keeps a kid sailing.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Sailing Education</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sailing instruction is the heart of our mission. We operate youth development programs on Optimists and Collegiate 420s, adult learn-to-sail sessions on Hobie catamarans, and visitor intensives that bring the joy of sailing to families vacationing on the Outer Banks. Scholarships ensure no one is excluded.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-5">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Community Fleet Access</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our rental program makes independent sailing accessible at below-market rates. By maintaining a community fleet of Hobie catamarans and high-performance skiffs, we give experienced sailors affordable access to the water. Fleet fees support maintenance and insurance, keeping boats available for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Ad Grants / Nonprofit Transparency */}
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
                Our board of directors is composed of community members from Hatteras Village and the surrounding Outer Banks area. All board positions are volunteer, with no compensation.
              </p>
              <p>
                Donations to Hatteras Community Sailing are tax-deductible to the extent permitted by law. Our EIN is <strong className="text-foreground">[Your EIN Here]</strong>. Please consult your tax advisor for specific guidance.
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
