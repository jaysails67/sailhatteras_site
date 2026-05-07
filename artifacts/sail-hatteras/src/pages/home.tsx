import { Link } from "wouter";
import { ArrowRight, Compass, Sun, Wind, Clock, Anchor, Heart, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetShHomeSummary } from "@workspace/api-client-react";
import heroImg from "@/assets/images/hero-sunset.png";
import catamaranImg from "@/assets/images/catamaran.png";
import learnImg from "@/assets/images/learn-to-sail.png";
import groupImg from "@/assets/images/group-charter.png";

export default function Home() {
  const { data: summary, isLoading } = useGetShHomeSummary();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Sailboat at sunset on the Pamlico Sound"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Real sailing.<br />
            <span className="text-secondary">Right here in Hatteras.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            Leave the engine behind. Experience the steady winds and warm waters of the Pamlico Sound with local captains who know it best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <Button asChild size="lg" className="h-14 px-8 text-base bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto">
              <Link href="/trips">Book Your Sail</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-sm w-full sm:w-auto">
              <Link href="/trips?category=experiences">Explore Experiences</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Statement — required for Google Ad Grants nonprofit eligibility */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Heart className="h-4 w-4 fill-primary-foreground" />
            501(c)3 Nonprofit Organization — Hatteras Community Sailing
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-5 leading-snug">
            Our mission: Sailing for everyone on the Outer Banks
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
            Our mission is to inspire a passion for lifelong seamanship and the environment. Every program we run serves that mission — and every program fee funds free and reduced-cost sailing for youth and community members on the Outer Banks. <strong className="text-primary-foreground">No child is turned away for inability to pay.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/about">Learn About Our Mission</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link href="/contact">Youth Scholarship Inquiries</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How Programs Serve the Mission */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">How Our Programs Serve the Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every program we offer ties directly to our 501(c)3 mission of community sailing access on the Outer Banks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                <Wind className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold">Community Experiences</h3>
              <p className="text-muted-foreground">Sunset sails, wildlife tours, and full-day Sound explorations that bring participants to the water — and fund free youth programs with every ticket sold.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold">Sailing Education</h3>
              <p className="text-muted-foreground">Hands-on instruction for youth and adults — from Optimist dinghies for beginners to Collegiate 420s for advancing sailors. Scholarships available for all youth programs.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold">Community Fleet Access</h3>
              <p className="text-muted-foreground">Low-cost catamaran and skiff rentals for qualified community sailors — keeping independent sailing on Pamlico Sound accessible and affordable for everyone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-muted/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Choose Your Adventure</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From relaxing sunset cruises to hands-on sailing lessons, we have a trip for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/trips?category=experiences" className="group relative rounded-2xl overflow-hidden aspect-[4/5] hover-elevate shadow-sm hover:shadow-md transition-shadow">
              <img src={groupImg} alt="Sailing Experiences" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="font-serif text-3xl font-bold mb-2">Experiences</h3>
                <p className="text-white/80 mb-4 line-clamp-2">Sit back, relax, and let us handle the sailing on a private charter or public tour.</p>
                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  <span>Browse Experiences</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <Link href="/trips?category=learn" className="group relative rounded-2xl overflow-hidden aspect-[4/5] hover-elevate shadow-sm hover:shadow-md transition-shadow">
              <img src={learnImg} alt="Learn to Sail" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="font-serif text-3xl font-bold mb-2">Learn to Sail</h3>
                <p className="text-white/80 mb-4 line-clamp-2">Take the helm. Hands-on instruction for beginners and intermediate sailors.</p>
                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  <span>View Lessons</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <Link href="/trips?category=rentals" className="group relative rounded-2xl overflow-hidden aspect-[4/5] hover-elevate shadow-sm hover:shadow-md transition-shadow">
              <img src={catamaranImg} alt="Rentals" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="font-serif text-3xl font-bold mb-2">Rentals</h3>
                <p className="text-white/80 mb-4 line-clamp-2">Experienced sailor? Rent a boat from our fleet and explore the Sound on your own.</p>
                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  <span>See Fleet</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Trips (if we have data) */}
      {!isLoading && summary?.featuredTrips && summary.featuredTrips.length > 0 && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Featured Sails</h2>
              <p className="text-muted-foreground text-lg">Our most popular trips on the water.</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/trips">View All Trips</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {summary.featuredTrips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.slug}`} className="group block h-full">
                <div className="bg-card rounded-xl overflow-hidden border border-border hover-elevate shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                  <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                    {trip.imageUrl ? (
                      <img src={trip.imageUrl} alt={trip.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Anchor className="h-10 w-10 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-background/90 text-foreground backdrop-blur-sm shadow-sm capitalize">
                        {trip.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">{trip.name}</h3>
                      <div className="text-lg font-semibold text-primary shrink-0">{trip.priceDisplay}</div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-1">{trip.shortDescription}</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{trip.duration}</span>
                      </div>
                      <div className="font-medium text-secondary flex items-center gap-1">
                        Book Now
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/trips">View All Trips</Link>
            </Button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Ready to cast off?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Check our availability and secure your spot on the boat.
          </p>
          <Button asChild size="lg" className="h-14 px-10 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link href="/trips">View Schedule & Book</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
