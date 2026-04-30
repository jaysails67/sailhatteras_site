import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Users, Shield, Compass } from "lucide-react";
import hydrofoilShuttle from "@/assets/images/hydrofoil-shuttle.png";
import interiorFerry from "@/assets/images/interior-ferry.jpg";

export default function Buyers() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-24 bg-card border-b border-border">
          <div className="container px-4 md:px-8 text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-5xl font-display font-bold mb-6">Our Fleet</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Precision-engineered for absolute efficiency. Zero emissions, zero wake, zero noise. 
              Explore our lineup of next-generation foiling vessels.
            </p>
          </div>
        </section>

        {/* Passenger Model */}
        <section className="py-24 border-b border-border">
          <div className="container px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <Users className="mr-2 h-4 w-4" />
                  Passenger Transport
                </div>
                <h2 className="text-4xl font-display font-bold mb-6">Pamli P-Series</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Redefining urban commuting. The P-Series provides a smooth, silent ride above the waves, cutting travel times and operating costs significantly compared to traditional ferries.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-foreground">30-150</div>
                    <div className="text-sm text-muted-foreground">Passengers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">40 knots</div>
                    <div className="text-sm text-muted-foreground">Top Speed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">100 nm</div>
                    <div className="text-sm text-muted-foreground">Range</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">100%</div>
                    <div className="text-sm text-muted-foreground">Electric</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href="/contact">
                    <Button>Consultation <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                  <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Spec Sheet</Button>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-border aspect-video">
                  <img src={hydrofoilShuttle} alt="Pamli P-Series hydrofoil electric shuttle in flight" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden border border-border" style={{ aspectRatio: '16/7' }}>
                  <img src={interiorFerry} alt="Pamli P-Series luxury passenger cabin interior" className="w-full h-full object-cover object-center" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Military Model */}
        <section className="py-24 border-b border-border bg-card/50">
          <div className="container px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden border border-border aspect-video flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #1a2a1a 50%, #162416 100%)' }}>
                <div className="flex flex-col items-center gap-4 text-green-400/60">
                  <Shield className="h-20 w-20" />
                  <span className="text-sm font-medium tracking-widest uppercase">M-Series</span>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive mb-6">
                  <Shield className="mr-2 h-4 w-4" />
                  Military & Enforcement
                </div>
                <h2 className="text-4xl font-display font-bold mb-6">Pamli M-Series</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Stealth, speed, and absolute stability. The M-Series offers a near-zero acoustic and thermal signature, providing an unparalleled tactical advantage for interception and patrol.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-foreground">50+ knots</div>
                    <div className="text-sm text-muted-foreground">Top Speed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">120 nm</div>
                    <div className="text-sm text-muted-foreground">Range</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">Level 3</div>
                    <div className="text-sm text-muted-foreground">Armor Opt.</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">&lt; 40dB</div>
                    <div className="text-sm text-muted-foreground">Acoustic Sig.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href="/contact">
                    <Button>Consultation <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                  <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Spec Sheet</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recreational Model */}
        <section className="py-24">
          <div className="container px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <Compass className="mr-2 h-4 w-4" />
                  Recreational
                </div>
                <h2 className="text-4xl font-display font-bold mb-6">Pamli R-Series</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  The ultimate luxury on the water. No slamming against waves, no sea-sickness, just pure, silent flight. A sports car experience translated to the sea.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-foreground">4-8</div>
                    <div className="text-sm text-muted-foreground">Capacity</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">35 knots</div>
                    <div className="text-sm text-muted-foreground">Top Speed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">80 nm</div>
                    <div className="text-sm text-muted-foreground">Range</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">Luxury</div>
                    <div className="text-sm text-muted-foreground">Finish</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href="/contact">
                    <Button>Consultation <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                  <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Spec Sheet</Button>
                </div>
              </div>
              <div className="order-1 lg:order-2 rounded-2xl overflow-hidden border border-border aspect-video flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f3460 50%, #1a6bc7 100%)' }}>
                <div className="flex flex-col items-center gap-4 text-blue-400/60">
                  <Compass className="h-20 w-20" />
                  <span className="text-sm font-medium tracking-widest uppercase">R-Series</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
