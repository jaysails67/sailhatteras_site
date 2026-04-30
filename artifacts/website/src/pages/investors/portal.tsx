import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useListContentPages, getListContentPagesQueryKey } from "@workspace/api-client-react";
import { ArrowRight, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const PLAN_SECTIONS = [
  { slug: "exec-summary",   label: "Executive Summary" },
  { slug: "products",       label: "Products & Vessels" },
  { slug: "services",       label: "Services & Routes" },
  { slug: "marketing-plan", label: "Marketing Plan" },
  { slug: "financial-plan", label: "Financial Plan" },
  { slug: "conclusion",     label: "Conclusion" },
];

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

      {/* Sticky section nav */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container px-4 md:px-8 max-w-screen-2xl">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium pr-3 mr-2 border-r border-border shrink-0">
              <Lock className="h-3 w-3" />
              Investor Plan
            </span>
            {PLAN_SECTIONS.map(({ slug, label }) => (
              <button
                key={slug}
                onClick={() => scrollTo(slug)}
                data-testid={`btn-portal-section-${slug}`}
                className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSlug === slug
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
            <div className="ml-auto pl-4 shrink-0">
              <Link href="/contact">
                <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5">
                  <Phone className="h-3 w-3" /> Schedule a Call
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="container px-4 md:px-8 max-w-4xl mx-auto">
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
              {PLAN_SECTIONS.map(({ slug, label }, idx) => {
                const page = pageMap[slug];
                return (
                  <section
                    key={slug}
                    id={slug}
                    ref={(el) => { sectionRefs.current[slug] = el; }}
                    className={`py-16 ${idx < PLAN_SECTIONS.length - 1 ? "border-b border-border" : ""}`}
                  >
                    {page ? (
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

              {/* Bottom CTA */}
              <section className="py-16">
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-10 text-center">
                  <h2 className="font-display text-3xl font-bold mb-4">Ready to Invest in Clean Maritime Transit?</h2>
                  <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                    We're actively building our founding investor group. If this opportunity aligns with your portfolio, we'd love to connect.
                  </p>
                  <Link href="/contact">
                    <Button size="lg" className="font-semibold">
                      Schedule a Conversation <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
