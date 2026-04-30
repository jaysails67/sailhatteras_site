import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useListContentPages, getListContentPagesQueryKey } from "@workspace/api-client-react";
import { Lock, ChevronRight, ArrowRight, Phone } from "lucide-react";
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
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
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
      <main className="flex-1 flex border-t border-border">

        {/* Sticky sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-border bg-card p-6">
          <div className="flex items-center gap-2 text-primary font-semibold mb-6 pb-4 border-b border-border text-sm">
            <Lock className="h-4 w-4" />
            Investor Business Plan
          </div>
          <nav className="flex flex-col gap-1">
            {PLAN_SECTIONS.map(({ slug, label }) => (
              <button
                key={slug}
                onClick={() => scrollTo(slug)}
                data-testid={`btn-portal-section-${slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                  activeSlug === slug
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span>{label}</span>
                {activeSlug === slug && <ChevronRight className="h-4 w-4 shrink-0" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Questions about investing?</p>
            <Link href="/contact">
              <Button size="sm" className="w-full text-xs">
                <Phone className="h-3 w-3 mr-1.5" /> Schedule a Call
              </Button>
            </Link>
          </div>
        </aside>

        {/* Scrolling content */}
        <div className="flex-1 overflow-y-auto">
          {pagesLoading ? (
            <div className="max-w-4xl mx-auto p-8 md:p-12 space-y-6 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-8 bg-accent rounded w-1/3" />
                  <div className="h-4 bg-accent rounded w-full" />
                  <div className="h-4 bg-accent rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-6 md:px-12">
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
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/contact">
                      <Button size="lg" className="font-semibold">
                        Schedule a Conversation <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
