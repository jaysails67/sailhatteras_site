import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Users, Shield, Compass, Anchor, Wind } from "lucide-react";
import pSeriesShuttle from "@/assets/images/p-series-shuttle.png";
import tSeriesTaxi from "@/assets/images/t-series-taxi.png";
import mSeriesPatrol from "@/assets/images/m-series-patrol.png";
import rSeriesFoiling from "@/assets/images/r-series-foiling.png";
import xSeriesCat from "@/assets/images/x-series-cat.jpg";
import phb85Cat from "@/assets/images/phb-85-cat.jpg";
import phbLogo from "@/assets/images/phillips-boatworks-icon.png";

function PhbLogo() {
  return (
    <img
      src={phbLogo}
      alt="Phillips Boatworks"
      className="inline-block h-9 w-9 rounded-md object-contain align-middle mr-2 -mt-1"
    />
  );
}

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

        {/* pHb P-Series — Passenger Ferry */}
        <section className="py-24 border-b border-border">
          <div className="container px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <Users className="mr-2 h-4 w-4" />
                  Passenger Transport
                </div>
                <h2 className="text-4xl font-display font-bold mb-6"><PhbLogo />P-Series</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Redefining urban commuting. The pHb P-Series provides a smooth, silent ride above the waves, cutting travel times and operating costs significantly compared to traditional ferries.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-foreground">50</div>
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
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden border border-border aspect-video">
                  <img src={pSeriesShuttle} alt="pHb P-Series electric foiling passenger shuttle on the water" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* pHb T-Series — Water Taxi */}
        <section className="py-24 border-b border-border bg-card/50">
          <div className="container px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="rounded-2xl overflow-hidden border border-border aspect-video">
                  <img src={tSeriesTaxi} alt="pHb T-Series electric foiling water taxi with passengers" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <Anchor className="mr-2 h-4 w-4" />
                  Water Taxi
                </div>
                <h2 className="text-4xl font-display font-bold mb-6"><PhbLogo />T-Series</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Urban waterway transit, reimagined. The pHb T-Series is a compact, high-efficiency electric foiling water taxi purpose-built for last-mile connectivity across harbors, rivers, and coastal routes. Quiet, fast, and zero-emission — the perfect fit for busy waterfront cities.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-foreground">20</div>
                    <div className="text-sm text-muted-foreground">Passengers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">35 knots</div>
                    <div className="text-sm text-muted-foreground">Top Speed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">60 nm</div>
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
            </div>
          </div>
        </section>

        {/* pHb M-Series — Military */}
        <section className="py-24 border-b border-border">
          <div className="container px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="rounded-2xl overflow-hidden border border-border aspect-video">
                  <img src={mSeriesPatrol} alt="pHb M-Series electric foiling patrol vessel for coast guard and military" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive mb-6">
                  <Shield className="mr-2 h-4 w-4" />
                  Military & Enforcement
                </div>
                <h2 className="text-4xl font-display font-bold mb-6"><PhbLogo />M-Series</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Stealth, speed, and absolute stability. The pHb M-Series offers a near-zero acoustic and thermal signature, providing an unparalleled tactical advantage for interception and patrol.
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

        {/* pHb R-Series — Recreational */}
        <section className="py-24 border-b border-border bg-card/50">
          <div className="container px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <Compass className="mr-2 h-4 w-4" />
                  Recreational
                </div>
                <h2 className="text-4xl font-display font-bold mb-6"><PhbLogo />R-Series</h2>
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
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden border border-border aspect-video">
                  <img src={rSeriesFoiling} alt="pHb R-Series electric foiling recreational boat on the water" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* pHb X-Series — Sailing Catamaran */}
        <section className="py-24 border-b border-border">
          <div className="container px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="rounded-2xl overflow-hidden border border-border aspect-video">
                  <img src={xSeriesCat} alt="pHb X-Series performance sailing catamaran at dock" className="w-full h-full object-cover object-center" />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <Wind className="mr-2 h-4 w-4" />
                  Sailing Catamaran
                </div>
                <h2 className="text-4xl font-display font-bold mb-6"><PhbLogo />X-Series</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Where sail meets innovation. The pHb X-Series is a high-performance sailing catamaran built in-house at Phillips Boatworks — a proven platform that demonstrates the composite construction and hull engineering at the core of every pHb vessel.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-foreground">6-10</div>
                    <div className="text-sm text-muted-foreground">Capacity</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">Sail + Electric</div>
                    <div className="text-sm text-muted-foreground">Propulsion</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">Blue-water</div>
                    <div className="text-sm text-muted-foreground">Capable</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">Carbon</div>
                    <div className="text-sm text-muted-foreground">Construction</div>
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

        {/* pHb 8.5-Series — Foiling Sailing Cat */}
        <section className="py-24 bg-card/50">
          <div className="container px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <Wind className="mr-2 h-4 w-4" />
                  Foiling Sailing Cat
                </div>
                <h2 className="text-4xl font-display font-bold mb-6"><PhbLogo />8.5-Series</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  The pHb 8.5 is an 8.5-meter foiling sailing catamaran — a compact, high-performance platform that lifts fully above the water under sail. Combining the zero-drag efficiency of foiling with wind power, it represents the leading edge of sustainable high-speed sailing.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-foreground">8.5 m</div>
                    <div className="text-sm text-muted-foreground">LOA</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">4-6</div>
                    <div className="text-sm text-muted-foreground">Capacity</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">Foiling</div>
                    <div className="text-sm text-muted-foreground">Under Sail</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">In Dev.</div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href="/contact">
                    <Button>Consultation <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                  <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Spec Sheet</Button>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="rounded-2xl overflow-hidden border border-border aspect-video">
                  <img src={phb85Cat} alt="pHb 8.5-Series foiling sailing catamaran concept render with orange hull" className="w-full h-full object-cover object-top" />
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
