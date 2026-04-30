import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useGetContentPage, getGetContentPageQueryKey } from "@workspace/api-client-react";
import { FileText, Lock, ChevronRight } from "lucide-react";

const sections = [
  { slug: "exec-summary", label: "Executive Summary" },
  { slug: "products", label: "Products" },
  { slug: "services", label: "Services" },
  { slug: "marketing-plan", label: "Marketing Plan" },
  { slug: "financial-plan", label: "Financial Plan" },
  { slug: "conclusion", label: "Conclusion" },
];

export default function Portal() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSlug, setActiveSlug] = useState(sections[0].slug);

  const isApproved = !!user && user.approvalStatus === "approved";

  const { data: page, isLoading: pageLoading } = useGetContentPage(activeSlug, {
    query: { enabled: isApproved, queryKey: getGetContentPageQueryKey(activeSlug) }
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/login");
      } else if (user.approvalStatus === "pending") {
        setLocation("/investors/pending");
      } else if (user.approvalStatus === "denied") {
        setLocation("/investors/denied");
      }
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || !user || user.approvalStatus !== "approved") return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row border-t border-border">
        <aside className="w-full md:w-64 border-r border-border bg-card p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-semibold mb-4 pb-4 border-b border-border">
            <Lock className="h-4 w-4" />
            Investor Portal
          </div>
          {sections.map((section) => (
            <button
              key={section.slug}
              onClick={() => setActiveSlug(section.slug)}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSlug === section.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              data-testid={`btn-portal-section-${section.slug}`}
            >
              {section.label}
              {activeSlug === section.slug && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </aside>

        <section className="flex-1 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            {pageLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-accent rounded w-1/3"></div>
                <div className="h-4 bg-accent rounded w-full"></div>
                <div className="h-4 bg-accent rounded w-full"></div>
                <div className="h-4 bg-accent rounded w-5/6"></div>
              </div>
            ) : page ? (
              <div className="prose prose-invert max-w-none">
                <h1 className="font-display text-4xl font-bold mb-8 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  {page.title}
                </h1>
                {page.content.includes("<") ? (
                  <div dangerouslySetInnerHTML={{ __html: page.content }} />
                ) : (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{page.content}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                Content for this section is currently unavailable.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
