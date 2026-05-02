import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Anchor, ShieldCheck, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { events } from "@/lib/analytics";
import pSeriesShuttle from "@/assets/images/p-series-shuttle.png";
import interiorFerry from "@/assets/images/interior-ferry.jpg";

interface HomeContent {
  id: number;
  slug: string;
  title: string;
  content: string;
  metaData: {
    heroTitle?: string;
    heroTagline?: string;
    introHeading?: string;
    introText?: string;
  } | null;
  updatedAt: string;
}

function useHomeContent() {
  return useQuery<HomeContent>({
    queryKey: ["public-content", "home"],
    queryFn: async () => {
      const res = await fetch("/api/public-content/home");
      if (!res.ok) throw new Error("Failed to load home content");
      return res.json() as Promise<HomeContent>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default function Home() {
  const { data: homeContent } = useHomeContent();

  const heroTitle = homeContent?.metaData?.heroTitle ?? "Airborne above the water's surface.";
  const heroTagline = homeContent?.metaData?.heroTagline ?? "The Future of Waterborne Transport";
  const heroDescription = homeContent?.content ?? "PamliEcoConnect engineers cutting-edge electric foiling boats. Aerospace precision meets maritime craft for a silent, zero-emission, high-speed experience.";
  const introHeading = homeContent?.metaData?.introHeading ?? "Silent. Fast. Precision-Engineered.";
  const introText = homeContent?.metaData?.introText ?? "We are revolutionizing marine mobility. By lifting the hull out of the water, our advanced hydrofoil technology reduces drag by up to 80%, enabling unprecedented range and speed on battery power alone.";

  const heroWords = heroTitle.split(" ");
  const lastTwoWords = heroWords.slice(-3).join(" ");
  const firstPart = heroWords.slice(0, -3).join(" ");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={pSeriesShuttle}
              alt="PamliEcoConnect hydrofoil electric shuttle in flight above water"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          
          <div className="container relative z-10 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
                <Zap className="mr-2 h-4 w-4" />
                {heroTagline}
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-tight">
                {firstPart} <span className="text-primary">{lastTwoWords}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                {heroDescription}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/buyers">
                  <Button size="lg" className="font-semibold tracking-wide" onClick={events.ctaClickBoats}>
                    Explore Models <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/investors">
                  <Button size="lg" variant="outline" className="font-semibold backdrop-blur-md bg-background/30 border-border/50 hover:bg-accent" onClick={events.ctaClickInvestors}>
                    Investor Relations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-24 bg-background border-b border-border">
          <div className="container px-4 md:px-8 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{introHeading}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {introText}
            </p>
          </div>
        </section>

        {/* Interior Experience Section */}
        <section className="relative h-[50vh] overflow-hidden">
          <img
            src={interiorFerry}
            alt="Luxury interior of a PamliEcoConnect hydrofoil passenger ferry"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3">Passenger Experience</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold">Fly. Quietly.</h2>
            </div>
          </div>
        </section>

        {/* Funnel Cards */}
        <section className="py-24 bg-card/50">
          <div className="container px-4 md:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              
              <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Anchor className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">Boat Buyers</h3>
                <p className="text-muted-foreground mb-8">
                  Discover our lineup of passenger, military, and recreational electric foiling vessels.
                </p>
                <Link href="/buyers" className="inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                  View lineup <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">Investors</h3>
                <p className="text-muted-foreground mb-8">
                  Join us in building the future of maritime transport. Request access to our business plan.
                </p>
                <Link href="/investors" className="inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                  Request access <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">Reservations</h3>
                <p className="text-muted-foreground mb-8">
                  Be among the first to experience silent flight over water. Join the passenger waitlist.
                </p>
                <Link href="/reservations" className="inline-flex items-center text-sm font-semibold text-primary group-hover:underline" onClick={events.ctaClickReservations}>
                  Join waitlist <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
