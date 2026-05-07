import { Link } from "wouter";
import { ArrowRight, Compass, Wind, Clock, Heart, BookOpen, Users, Anchor, Waves, Anchor as AnchorIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetShHomeSummary } from "@workspace/api-client-react";
import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL;
const slide = (file: string) => `${BASE}slideshow/${file}`;

const SLIDES = [
  { src: slide("s06-catamaran-sunset.jpg"),  alt: "Evening sail on the Pamlico Sound" },
  { src: slide("s11-junior-girl.jpg"),        alt: "Junior sailor in her Optimist dinghy" },
  { src: slide("s04-catamaran-beach.jpg"),    alt: "Catamaran beached on the Outer Banks" },
  { src: slide("s09-junior-boy.jpg"),         alt: "Young sailor at the helm" },
  { src: slide("s05-sunset-couple.jpg"),      alt: "Sunset sail on the sound" },
  { src: slide("s14-teens-sailing.jpg"),      alt: "Teen sailors racing on the Pamlico Sound" },
  { src: slide("s07-aerial-cat.jpg"),         alt: "Aerial view of catamaran on the sound" },
  { src: slide("s12-team-photo.jpg"),         alt: "Hatteras Community Sailing junior team" },
  { src: slide("s03-boy-sunset.jpg"),         alt: "Kid and dog aboard at sunset" },
  { src: slide("s15-girls-dinghy.jpg"),       alt: "Girls sailing together on the Pamlico Sound" },
  { src: slide("s10-outer-banks-opti.jpg"),   alt: "Sailing an Optimist on the Outer Banks" },
  { src: slide("s18-awards.jpg"),             alt: "Community sailing awards ceremony" },
  { src: slide("s16-kid-cockpit.jpg"),        alt: "Young sailor in the cockpit" },
  { src: slide("s01-youth-group.jpg"),        alt: "Youth sailing program participants" },
  { src: slide("s13-kid-on-boat.jpg"),        alt: "Kids on the water" },
  { src: slide("s17-kid-at-dock.jpg"),        alt: "Young sailor rigging at the dock" },
  { src: slide("s08-kids-on-trailer.jpg"),    alt: "Kids excited about a new boat" },
  { src: slide("s02-campfire.jpg"),           alt: "Community gathering after a sail" },
  { src: slide("s19-campfire2.jpg"),          alt: "Hatteras sailing community bonfire" },
];

export default function Home() {
  const { data: summary, isLoading } = useGetShHomeSummary();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Slideshow */}
      <section className="relative h-[68vh] min-h-[480px] overflow-hidden">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
          >
            <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-primary/25" />

        {/* Slide dots */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary/85 text-white z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="font-serif text-xl md:text-2xl font-bold">Hatteras Community Sailing</p>
              <p className="text-sm text-white/75">Pamlico Sound, Outer Banks, NC &mdash; 501(c)3 Nonprofit</p>
            </div>
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold shrink-0">
              <Link href="/trips">Book Here</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Statement — required for Google Ad Grants nonprofit eligibility */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Heart className="h-4 w-4 fill-primary-foreground" />
            501(c)3 Nonprofit — Hatteras Community Sailing
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-5 leading-snug">
            Connecting Outer Banks youth to the sea &mdash; and to each other
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
            Hatteras Island children grow up on a strip of land surrounded by water on every side. Our mission is to make sure they grow up <em>connected</em> to it. We start the youngest kids on sailboats — and as they grow, we open every door the ocean offers: powerboating, diving, fishing, boatbuilding, maritime technology, and professional seamanship. These are real skills, real careers, and real ways of life. <strong className="text-primary-foreground">No child is turned away for inability to pay.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/about">Our Mission &amp; Story</Link>
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Pathways to the Ocean</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every program we offer is part of a longer journey — one that starts on the water and grows with each child through their youth and into their life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                <Wind className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold">Community Experiences</h3>
              <p className="text-muted-foreground">Sunset sails, wildlife tours, and full-day Sound explorations that bring visitors and locals alike to the water — funding free youth programs with every charter and ticket sold.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold">Youth Maritime Pathways</h3>
              <p className="text-muted-foreground">Sailing opens the door for the youngest. As youth grow with us, we introduce powerboating, diving, fishing, boatbuilding, maritime technology, and professional seamanship — real pathways for life on a working waterfront.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl font-semibold">Community Fleet Access</h3>
              <p className="text-muted-foreground">Low-cost catamaran and skiff rentals for qualified community members — keeping independent time on Pamlico Sound accessible and affordable, so the water stays part of everyday life here.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-muted/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Get on the Water</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you want to charter a sunset sail, learn something new, or take the helm yourself — there's a program for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/trips?category=experiences" className="group relative rounded-2xl overflow-hidden aspect-[4/5] hover-elevate shadow-sm hover:shadow-md transition-shadow">
              <img src={slide("s06-catamaran-sunset.jpg")} alt="Sailing Experiences" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="font-serif text-3xl font-bold mb-2">Experiences</h3>
                <p className="text-white/80 mb-4 line-clamp-2">Private charters and guided tours on Pamlico Sound — your ticket also puts a kid on the water.</p>
                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  <span>Browse Experiences</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <Link href="/trips?category=learn" className="group relative rounded-2xl overflow-hidden aspect-[4/5] hover-elevate shadow-sm hover:shadow-md transition-shadow">
              <img src={slide("s11-junior-girl.jpg")} alt="Learn to Sail" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="font-serif text-3xl font-bold mb-2">Learn &amp; Grow</h3>
                <p className="text-white/80 mb-4 line-clamp-2">Hands-on instruction for all ages — from first-time sailors to youth building careers on the water.</p>
                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  <span>View Programs</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <Link href="/trips?category=rentals" className="group relative rounded-2xl overflow-hidden aspect-[4/5] hover-elevate shadow-sm hover:shadow-md transition-shadow">
              <img src={slide("s04-catamaran-beach.jpg")} alt="Rentals" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <h3 className="font-serif text-3xl font-bold mb-2">Rentals</h3>
                <p className="text-white/80 mb-4 line-clamp-2">Qualified sailors can take our fleet out independently at below-market community rates.</p>
                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  <span>See Fleet</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      {!isLoading && summary?.featuredTrips && summary.featuredTrips.length > 0 && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Featured Programs</h2>
              <p className="text-muted-foreground text-lg">Our most popular ways to get on the water.</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/trips">View All Programs</Link>
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
              <Link href="/trips">View All Programs</Link>
            </Button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">The ocean is right outside your door.</h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Book a program, support our mission, or reach out about youth scholarships.
          </p>
          <Button asChild size="lg" className="h-14 px-10 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link href="/trips">View All Programs</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
