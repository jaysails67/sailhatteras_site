import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Anchor, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d2137 40%, #0a3d5c 70%, #0e4f70 100%)' }}>
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(6,182,212,0.15) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(14,116,144,0.1) 0%, transparent 50%)' }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          
          <div className="container relative z-10 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
                <Zap className="mr-2 h-4 w-4" />
                The Future of Waterborne Transport
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white mb-6 leading-tight">
                Airborne above the <span className="text-primary">water's surface.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                PamliEcoConnect engineers cutting-edge electric foiling boats. Aerospace precision meets maritime craft for a silent, zero-emission, high-speed experience.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/buyers">
                  <Button size="lg" className="font-semibold tracking-wide">
                    Explore Models <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/investors">
                  <Button size="lg" variant="outline" className="font-semibold backdrop-blur-md bg-background/30 border-border/50 hover:bg-accent">
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
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Silent. Fast. Precision-Engineered.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are revolutionizing marine mobility. By lifting the hull out of the water, our advanced hydrofoil technology reduces drag by up to 80%, enabling unprecedented range and speed on battery power alone. 
            </p>
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
                <Link href="/reservations" className="inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
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
