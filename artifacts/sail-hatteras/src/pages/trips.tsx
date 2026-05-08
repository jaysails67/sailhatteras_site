import { Link, useSearch } from "wouter";
import { ArrowRight, Clock, Users, Anchor, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useListShTrips } from "@workspace/api-client-react";

const CATEGORIES = [
  { value: "all", label: "All Programs" },
  { value: "experiences", label: "Experiences" },
  { value: "learn", label: "Learn to Sail" },
  { value: "rentals", label: "Rentals" },
];

function TripCard({ trip }: { trip: any }) {
  const cardInner = (
    <div className={`bg-card rounded-xl overflow-hidden border border-border shadow-sm transition-all h-full flex flex-col ${trip.comingSoon ? "opacity-75" : "hover:shadow-md hover-elevate"}`}>
      <div className="aspect-[16/9] relative overflow-hidden bg-muted">
        {trip.imageUrl ? (
          <img src={trip.imageUrl} alt={trip.name} className={`w-full h-full object-cover transition-transform duration-700 ${!trip.comingSoon ? "group-hover:scale-105" : ""}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <Anchor className="h-12 w-12 text-primary/30" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-background/90 text-foreground backdrop-blur-sm shadow-sm capitalize">
            {trip.type}
          </span>
          {trip.comingSoon && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm">
              Coming Soon
            </span>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className={`font-serif text-xl font-bold text-foreground line-clamp-2 leading-snug ${!trip.comingSoon ? "group-hover:text-primary transition-colors" : ""}`}>{trip.name}</h3>
          <div className="text-lg font-semibold text-primary shrink-0">{trip.priceDisplay}</div>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">{trip.shortDescription}</p>
        <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{trip.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>Up to {trip.maxPassengers}</span>
            </div>
          </div>
          {trip.slug === "kids-development-program" && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/8 rounded-lg px-3 py-2 mt-1">
              <Heart className="h-3 w-3 fill-primary text-primary shrink-0" />
              <span>Fees from $95 · HCS covers up to $2,402 per student</span>
            </div>
          )}
          {trip.comingSoon ? (
            <div className="flex items-center gap-1 text-muted-foreground font-medium mt-1">
              <span>Available soon — check back shortly</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-primary font-medium mt-1">
              <span>Join this program</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (trip.comingSoon) {
    return <div className="block h-full cursor-default">{cardInner}</div>;
  }

  return (
    <Link href={`/trips/${trip.slug}`} className="group block h-full" data-testid={`link-trip-${trip.slug}`}>
      {cardInner}
    </Link>
  );
}

function TripCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-6 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5 mt-4" />
      </div>
    </div>
  );
}

export default function Trips() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categoryParam = params.get("category") ?? "all";

  const { data: trips, isLoading } = useListShTrips(
    categoryParam !== "all" ? { category: categoryParam } : {}
  );

  const activeCategory = CATEGORIES.find(c => c.value === categoryParam) ?? CATEGORIES[0];

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Header */}
      <section className="py-16 px-6 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>Community Programs — Hatteras Community Sailing, 501(c)3 Nonprofit</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Our mission is to inspire a passion for lifelong seamanship and the environment. Every program here serves that mission, and every program fee directly funds free youth sailing and community instruction on the Outer Banks.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-20 z-30 bg-background/95 backdrop-blur-md border-b border-border px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <Tabs value={categoryParam} className="w-full">
            <TabsList className="h-auto gap-1 bg-transparent p-0 flex-wrap">
              {CATEGORIES.map((cat) => (
                <Link key={cat.value} href={cat.value === "all" ? "/trips" : `/trips?category=${cat.value}`}>
                  <TabsTrigger
                    value={cat.value}
                    data-testid={`tab-category-${cat.value}`}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium"
                  >
                    {cat.label}
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Trip Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 text-sm text-muted-foreground">
            {!isLoading && trips && (
              <span>{trips.length} program{trips.length !== 1 ? "s" : ""} — {activeCategory.label}</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <TripCardSkeleton key={i} />)
              : trips?.map((trip) => <TripCard key={trip.id} trip={trip} />)
            }
          </div>
          {!isLoading && (!trips || trips.length === 0) && (
            <div className="text-center py-24 text-muted-foreground">
              <Anchor className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No programs found</p>
            </div>
          )}
        </div>
      </section>

      {/* Mission callout */}
      <section className="bg-primary/5 border-t border-primary/10 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="h-8 w-8 fill-primary text-primary mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold mb-3">Your participation makes a difference</h2>
          <p className="text-muted-foreground mb-6">
            Hatteras Community Sailing is a 501(c)3 nonprofit. Every program fee you pay directly funds free and reduced-cost sailing for youth and underserved members of the Outer Banks community. No child is turned away for inability to pay.
          </p>
          <Button asChild variant="outline">
            <Link href="/about">Learn About Our Mission</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
