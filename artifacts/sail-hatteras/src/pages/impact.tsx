import { Link } from "wouter";
import { Heart, Users, Anchor, Trophy, Star, ArrowRight, Waves, GraduationCap, MapPin, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";

const stats2024 = [
  { value: "~80", label: "Youth Reached", sub: "in 2024 outreach programs" },
  { value: "14", label: "Lifelong Sailors", sub: "identified and developed in 2024" },
  { value: "11–12", label: "Weeks of Programming", sub: "of on-water outreach in 2024" },
  { value: "2", label: "Regional Regattas", sub: "hosted annually on Hatteras Island" },
];

const programs = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Cape Explorer Camp",
    body: "Introductory sailing and boating camp for children using both large and small boats. Many participants have never sailed, boated, or swum before joining.",
  },
  {
    icon: <Waves className="h-6 w-6" />,
    title: "Sailing Littles",
    body: "Feeder program for children ages 5–7 focused on water comfort and swimming, with more experienced Opti sailors serving as mentors.",
  },
  {
    icon: <Anchor className="h-6 w-6" />,
    title: "Opti Sailing Program",
    body: "Youth sailing development on Optimist dinghies, building competitive skills and seamanship for sailors ages 8–13.",
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "High School 420 Program",
    body: "Competitive collegiate-style sailing on 420s for high school sailors. Our 14 year-round sailors consistently place well in regional competitions.",
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Adult Learn to Sail",
    body: "Group adult sailing sessions June through August on a rotating fleet including Hobie Cats, Stiletto Catamaran, Flying Scot, and Collegiate 420.",
  },
  {
    icon: <Wind className="h-6 w-6" />,
    title: "School & Homeschool Programs",
    body: "Multi-day on-water training for school groups and homeschool co-ops throughout Dare County. A 2024 Chapel Hill 10th-grade group was so successful that 21 students are returning in 2025.",
  },
];

export default function Impact() {
  useSeo({
    title: "2024 Community Impact — Hatteras Community Sailing",
    description: "Hatteras Community Sailing's 2024 impact: ~80 youth reached, 14 lifelong sailors identified, 11–12 weeks of programming, 2 regional regattas. Building the next generation of maritime professionals on the Outer Banks.",
    canonical: "/impact",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": "https://sailhatteras.org/impact",
      "name": "2024 Community Impact — Hatteras Community Sailing",
      "description": "Annual impact report for Hatteras Community Sailing, a 501(c)3 nonprofit on the Outer Banks of NC.",
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
            2024 Community Impact Report
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Making a Difference<br />on Hatteras Island
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Since 2020, Hatteras Community Sailing has worked to make the waters of Pamlico Sound accessible to every member of the Outer Banks community — residents, visitors, and youth alike.
          </p>
        </div>
      </section>

      {/* 2024 Stats */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-center mb-12 text-primary-foreground">2024 By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats2024.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-5xl font-bold text-secondary mb-2">{s.value}</div>
                <div className="font-semibold text-primary-foreground text-sm mb-1">{s.label}</div>
                <div className="text-primary-foreground/60 text-xs leading-relaxed">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Hatteras Community Sailing was founded during the onset of COVID early in 2020 in the Seaside Village of Avon on Hatteras Island, NC. The Mission: an organization dedicated to nurturing a lifelong passion for seamanship and a deep respect for nature and the sea.
                </p>
                <p>
                  Programs existed in the region, but only in the form of weekly camps — with no path for ongoing development. With the waters surrounding Cape Hatteras (Pamlico Sound and the Atlantic Gulf Stream) rich and diverse in maritime heritage, it made perfect sense. For six years, Hatteras Community Sailing has been the <strong className="text-foreground">only program on the Outer Banks focused on continuous skill development for all ages.</strong>
                </p>
                <p>
                  As a US Sailing Community Sailing Organization, Hatteras Community Sailing has made a real impact. With a <strong className="text-foreground">perfect safety record since inception</strong>, our program has — for the first time in Outer Banks history — produced local youth who are impressing coaches from Florida to New England. We constantly expose our sailors to the highest levels of competition by collaborating with highly established organizations including Hampton Yacht Club, Fishing Bay Yacht Club, Annapolis Yacht Club, and Carolina Yacht Club.
                </p>
                <p>
                  We are truly a <strong className="text-foreground">Community Sailing Program</strong>, here for island youth. <strong className="text-foreground">No child is turned away for inability to pay.</strong>
                </p>
              </div>
              <Button asChild className="mt-8" size="lg">
                <Link href="/support">Support Our Mission <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
            <div className="space-y-5">
              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
                <blockquote className="font-serif text-lg text-foreground leading-relaxed italic">
                  "Hatteras Island has one of the finest sailing environments on the East Coast. Our job is to make sure every kid here knows it — and has the skills to belong to it."
                </blockquote>
                <div className="mt-4 text-sm text-muted-foreground font-medium">— Jay Phillips, Chairman of the Board of Directors</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-5 text-sm text-muted-foreground space-y-2">
                <div className="font-semibold text-foreground">Organizational Details</div>
                <div>501(c)3 Nonprofit · EIN: 85-2684924</div>
                <div>Founded: 2020 · Buxton, NC (Outer Banks)</div>
                <div>US Sailing Certified Organizational Member</div>
                <div>
                  <a href="https://www.youtube.com/watch?v=MIBwuwJyvuM" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Who We Are — Introduction Video →
                  </a>
                </div>
                <div>
                  <a href="https://www.youtube.com/watch?v=r6D-feGa2Mo" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Watch our 2024 Impact Video →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-16 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-bold mb-2">Board of Directors</h2>
          <p className="text-muted-foreground text-sm mb-8">Hatteras Community Sailing is governed by a volunteer board of community members. All board positions are uncompensated.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: "Jay Phillips", role: "Chairman" },
              { name: "Jeff Waters", role: "Director" },
              { name: "Billy Moseley", role: "Director" },
              { name: "Brent Smith", role: "Director" },
              { name: "Tamir Ben Menachem", role: "Director" },
            ].map((member) => (
              <div key={member.name} className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-lg mx-auto mb-3">
                  {member.name.charAt(0)}
                </div>
                <div className="font-semibold text-sm text-foreground leading-snug">{member.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Active Programs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Year-round skill progression from first splash to competitive sailor — unique in all of Dare County.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div key={p.title} className="bg-card border border-border rounded-xl p-6">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {p.icon}
                </div>
                <h3 className="font-serif text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link href="/trips">View All Programs <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-10">2024 Highlights</h2>
          <div className="space-y-6">
            {[
              {
                icon: <Trophy className="h-5 w-5 text-primary" />,
                title: "Lighthouse Regatta — SAYRA Grand Prix Nomination",
                body: "Our 2024 fall Lighthouse Regatta was nominated as a SAYRA (South Atlantic Yacht Racing Association) Grand Prix event, drawing competitive sailors from North Carolina and Georgia — even as the region dealt with the impact of Hurricane Helene. A testament to the dedication of our sailing community.",
              },
              {
                icon: <GraduationCap className="h-5 w-5 text-primary" />,
                title: "Chapel Hill School Group — 21 Returning in 2025",
                body: "A group of 10th graders from Chapel Hill completed three days of on-water training, learning the physics of sailing across Hobie Cats, Melges 24s, and a Stiletto 425. The program was so successful that 21 students are expected to return in 2025.",
              },
              {
                icon: <Star className="h-5 w-5 text-primary" />,
                title: "Pipeline to Professional Maritime Careers",
                body: "Our year-round program is unique in Dare County for offering continuous skill progression — from beginner to mentor, to certified US Sailing instructor, to US Coast Guard licensed Merchant Marine. In 2024, our first group of youth began pursuing their instructor certifications.",
              },
              {
                icon: <MapPin className="h-5 w-5 text-primary" />,
                title: "Regional Reach — Kill Devil Hills & Dare County",
                body: "Beyond Hatteras Island, we coach and provide equipment for the Colington sailing camp in Kill Devil Hills, and offer programs for homeschoolers throughout Dare County.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5 bg-card border border-border rounded-xl p-6">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regattas */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Two Annual Regional Regattas</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Hatteras Community Sailing organizes two regattas each year that draw sailors from across the Carolinas and beyond — establishing Hatteras Island as a competitive sailing destination on the East Coast.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-primary-foreground/10 rounded-xl p-6 text-left">
              <div className="font-serif text-lg font-bold mb-2">Wind &amp; Waves Maritime Festival</div>
              <div className="text-primary-foreground/70 text-sm">Spring regatta · Pamlico Sound</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-6 text-left">
              <div className="font-serif text-lg font-bold mb-2">Lighthouse Regatta</div>
              <div className="text-primary-foreground/70 text-sm">Fall regatta · 2024 SAYRA Grand Prix nominated</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Help Us Do More in 2025</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Every donation keeps our fleet on the water, funds youth scholarships, and ensures no child on Hatteras Island is turned away for inability to pay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/support">Donate Now <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/volunteer">Volunteer With Us</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Hatteras Community Sailing · EIN: 85-2684924 · 501(c)3 Nonprofit · Donations are tax-deductible
          </p>
        </div>
      </section>

    </div>
  );
}
