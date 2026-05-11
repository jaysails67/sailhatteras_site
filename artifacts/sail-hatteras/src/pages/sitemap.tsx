import { Link } from "wouter";
import { Map, Anchor, Users, Heart, Phone, FileText, ChevronRight } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { useListShTrips } from "@workspace/api-client-react";

const STATIC_SECTIONS = [
  {
    title: "Sailing Programs",
    icon: Anchor,
    links: [
      { label: "All Programs & Trips", href: "/trips" },
      { label: "Community Experiences", href: "/trips?category=experiences" },
      { label: "Learn to Sail", href: "/trips?category=learn" },
      { label: "Fleet Rentals", href: "/trips?category=rentals" },
    ],
  },
  {
    title: "Organization",
    icon: Heart,
    links: [
      { label: "Our Mission & Story", href: "/about" },
      { label: "Membership", href: "/membership" },
      { label: "Support Our Mission", href: "/support" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Information",
    icon: FileText,
    links: [
      { label: "Payment Options", href: "/payments" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export default function SitemapPage() {
  useSeo({
    title: "Sitemap — Hatteras Community Sailing",
    description: "Complete site map for SailHatteras.org — browse all sailing programs, organization pages, and resources for Hatteras Community Sailing.",
    canonical: "/sitemap",
  });

  const { data: trips, isLoading } = useListShTrips();

  return (
    <div className="min-h-screen pt-20 bg-background">
      <section className="py-16 px-6 bg-muted/30 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Map className="h-3.5 w-3.5 text-primary" />
            <span>SailHatteras.org</span>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-2">Sitemap</h1>
          <p className="text-muted-foreground">Every page on SailHatteras.org, organized for easy browsing.</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid gap-12">

          {STATIC_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                <div className="flex items-center gap-2 mb-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-2xl font-bold">{section.title}</h2>
                </div>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1.5 group"
                      >
                        <ChevronRight className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div>
            <div className="flex items-center gap-2 mb-5">
              <Anchor className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl font-bold">Individual Trip Pages</h2>
            </div>
            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-2">
                {(trips ?? []).map((trip) => (
                  <li key={trip.slug}>
                    <Link
                      href={`/trips/${trip.slug}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1.5 group"
                    >
                      <ChevronRight className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors shrink-0" />
                      {trip.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-5">
              <Phone className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl font-bold">Quick Contact</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary/40 shrink-0" />
                Phone: <a href="tel:+12524898193" className="hover:text-primary transition-colors">(252) 489-8193</a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary/40 shrink-0" />
                Email: <a href="mailto:info@sailhatteras.org" className="hover:text-primary transition-colors">info@sailhatteras.org</a>
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary/40 shrink-0" />
                XML Sitemap (for search engines): <a href="/api/sitemap.xml" className="hover:text-primary transition-colors font-mono text-sm">/api/sitemap.xml</a>
              </li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
}
