import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import {
  Clock, Users, Anchor, ArrowLeft, Check, Heart,
  ChevronRight, AlertCircle, Loader2, Ship, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGetShTrip, useCreateShCheckout, useShTripVessels } from "@workspace/api-client-react";
import type { ShVessel } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildDateOptions() {
  const opts: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    const iso = d.toISOString().slice(0, 10);
    opts.push({ label: `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`, value: iso });
  }
  return opts;
}

const DATE_OPTIONS = buildDateOptions();

function VesselCard({
  vessel,
  selected,
  onSelect,
}: {
  vessel: ShVessel;
  selected: boolean;
  onSelect: () => void;
}) {
  const isFlat = vessel.pricingModel === "flat";
  return (
    <button
      onClick={onSelect}
      data-testid={`vessel-card-${vessel.id}`}
      className={`w-full text-left rounded-xl border-2 transition-all p-4 flex items-center justify-between gap-3 group hover:border-primary/60 ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:bg-muted/30"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        }`}>
          <Ship className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className={`font-semibold text-sm leading-tight ${selected ? "text-primary" : "text-foreground"}`}>
            {vessel.name}
          </div>
          {vessel.description && (
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{vessel.description}</div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Users className="h-3 w-3" />
            <span>Up to {vessel.capacity}</span>
          </div>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className={`text-base font-bold ${selected ? "text-primary" : "text-foreground"}`}>
          {vessel.priceDisplay}
        </div>
        <div className="text-xs text-muted-foreground">
          {isFlat ? "private charter" : "per person"}
        </div>
      </div>
    </button>
  );
}

export default function TripDetail() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: trip, isLoading, error } = useGetShTrip(params.slug!);
  const { data: vessels, isLoading: vesselsLoading } = useShTripVessels(params.slug);

  const hasVessels = !vesselsLoading && vessels && vessels.length > 0;

  // Steps: 1=vessel (if available), 2=date/pax, 3=details, 4=review
  // When no vessels: steps 1=date/pax, 2=details, 3=review
  const [step, setStep] = useState(1);
  const [selectedVessel, setSelectedVessel] = useState<ShVessel | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [vacationStart, setVacationStart] = useState("");
  const [vacationEnd, setVacationEnd] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  const checkout = useCreateShCheckout();

  const totalSteps = hasVessels ? 4 : 3;
  const isLearnTrip = trip?.category === "learn";
  const vesselStepLabel = isLearnTrip ? "Choose Program" : "Choose Vessel";
  const stepLabels = hasVessels
    ? [vesselStepLabel, "Select Date", "Your Details", "Review"]
    : ["Select Date", "Your Details", "Review"];

  const isFlat = trip?.pricingModel === "flat";

  // Effective price = selected vessel price or trip base price
  const effectivePriceCents = selectedVessel
    ? selectedVessel.priceCents
    : trip?.priceMin ?? 0;
  const effectivePriceDisplay = selectedVessel
    ? selectedVessel.priceDisplay
    : trip?.priceDisplay ?? "";

  // Total respects pricing model — charters are flat (whole boat), not per-head
  const totalCents = isFlat ? effectivePriceCents : effectivePriceCents * passengers;

  const highlights: string[] = trip?.highlights
    ? (typeof trip.highlights === "string" ? JSON.parse(trip.highlights) : trip.highlights)
    : [];

  const handleCheckout = () => {
    if (!form.name || !form.email) {
      toast({ title: "Please fill in your name and email", variant: "destructive" });
      return;
    }
    if (!selectedDate) {
      toast({ title: "Please select a date", variant: "destructive" });
      return;
    }
    checkout.mutate(
      {
        data: {
          tripSlug: trip!.slug,
          bookingDate: new Date(selectedDate + "T12:00:00"),
          vacationStart: vacationStart || undefined,
          vacationEnd: vacationEnd || undefined,
          passengers,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone || "",
          specialRequests: form.notes || undefined,
          vesselId: selectedVessel?.id,
          vesselName: selectedVessel?.name,
        } as any,
      },
      {
        onSuccess: (data: any) => {
          if (data?.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            toast({ title: "Checkout unavailable", description: "Please contact us directly to book.", variant: "destructive" });
          }
        },
        onError: () => {
          toast({ title: "Booking error", description: "Something went wrong. Please try again or contact us.", variant: "destructive" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-6">
        <div className="max-w-5xl mx-auto py-16 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="font-serif text-2xl font-bold">Program Not Found</h1>
          <p className="text-muted-foreground">This program may no longer be available.</p>
          <Button asChild><Link href="/trips">Browse All Programs</Link></Button>
        </div>
      </div>
    );
  }

  // Adjusted step for display when no vessels (offset by 1)
  const displayStep = hasVessels ? step : step + 1;

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Breadcrumb */}
      <div className="px-6 py-4 border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/trips" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Programs
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="capitalize text-muted-foreground">{trip.category}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{trip.name}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        {/* Left: Trip Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="capitalize">{trip.type}</Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Heart className="h-3 w-3 fill-primary text-primary" />
              <span>Supports our 501(c)3 mission</span>
            </div>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">{trip.name}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{trip.duration}</div>
            <div className="flex items-center gap-1.5"><Users className="h-4 w-4" />Up to {trip.maxPassengers} participants</div>
            <div className="flex items-center gap-1.5"><Anchor className="h-4 w-4" />{trip.boat}</div>
          </div>

          {/* Image */}
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-10">
            {trip.imageUrl
              ? <img src={trip.imageUrl} alt={trip.name} className="w-full h-full object-cover" />
              : <Anchor className="h-20 w-20 text-primary/20" />
            }
          </div>

          {/* Description */}
          <div className="prose prose-neutral max-w-none mb-10 space-y-4">
            {trip.description.split(/\n\n+/).map((para, i) => {
              if (para.trim() === "---") return <hr key={i} className="border-border" />;
              const parts = para.split(/\*\*(.+?)\*\*/g);
              return (
                <p key={i} className="text-muted-foreground leading-relaxed text-lg">
                  {parts.map((part, j) =>
                    j % 2 === 1 ? <strong key={j} className="text-foreground font-semibold">{part}</strong> : part
                  )}
                </p>
              );
            })}
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="mb-10">
              <h3 className="font-serif text-xl font-bold mb-4">What&rsquo;s Included</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cost Transparency Section — youth program only */}
          {params.slug === "kids-development-program" && (
            <div className="mb-10 rounded-2xl border border-border overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h3 className="font-serif text-xl font-bold text-primary-foreground">What this program actually costs</h3>
                <p className="text-primary-foreground/80 text-sm mt-1">
                  Your $200 session fee covers only a fraction of the real cost. The rest is funded by donors, grants, and the Hatteras sailing community — so every family receives a meaningful scholarship just by enrolling.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-muted-foreground text-xs uppercase tracking-wide border-b border-border">
                      <th className="text-left px-5 py-3">Program Track</th>
                      <th className="text-right px-5 py-3">Ages</th>
                      <th className="text-right px-5 py-3">Actual Cost</th>
                      <th className="text-right px-5 py-3">Your Fee</th>
                      <th className="text-right px-5 py-3 text-primary font-bold">HCS Covers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { track: "Sailing Littles", ages: "6–9", actual: "—", fee: "$200", subsidy: "Contact us", highlight: false },
                      { track: "Opti Green Fleet", ages: "9–13", actual: "~$620", fee: "$200", subsidy: "~$420", highlight: false },
                      { track: "Collegiate 420", ages: "12–18", actual: "~$1,100", fee: "$200", subsidy: "~$900", highlight: false },
                      { track: "SAISA High School", ages: "Gr. 8–12", actual: "~$2,700", fee: "$200", subsidy: "~$2,500", highlight: true },
                    ].map(({ track, ages, actual, fee, subsidy, highlight }) => (
                      <tr key={track} className={highlight ? "bg-primary/5" : "hover:bg-muted/30"}>
                        <td className="px-5 py-3.5 font-medium">{track}</td>
                        <td className="px-5 py-3.5 text-right text-muted-foreground">{ages}</td>
                        <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">{actual}</td>
                        <td className="px-5 py-3.5 text-right tabular-nums font-semibold">{fee}</td>
                        <td className={`px-5 py-3.5 text-right tabular-nums font-bold ${highlight ? "text-primary text-base" : "text-primary"}`}>{subsidy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-muted/30 border-t border-border text-xs text-muted-foreground space-y-1">
                <p>Costs per student assume minimum enrollment (6–8 participants per session). SAISA costs reflect travel, regatta entry fees, and the coaching intensity required for competitive interscholastic sailing.</p>
                <p>Hatteras Community Sailing is a 501(c)3 nonprofit (EIN 85-2684924). Donations are tax-deductible.</p>
              </div>
            </div>
          )}

          {/* Nonprofit Mission Note */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">How your participation helps</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hatteras Community Sailing is a 501(c)3 nonprofit. Your program fee funds our youth sailing scholarships, community sailing days, and fleet maintenance — keeping sailing accessible to everyone on the Outer Banks. No child is turned away for inability to pay.
            </p>
            <Link href="/about" className="text-sm text-primary font-medium hover:underline mt-2 inline-block">
              Learn about our mission →
            </Link>
          </div>
        </div>

        {/* Right: Booking Widget */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Price header */}
            <div className="p-6 bg-primary text-primary-foreground">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold">{effectivePriceDisplay}</div>
                    {params.slug === "kids-development-program" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            title="What this really costs"
                            className="rounded-full p-1 hover:bg-primary-foreground/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
                          >
                            <Info className="h-5 w-5 text-primary-foreground/70 hover:text-primary-foreground" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle className="font-serif text-xl">What This Really Costs</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-muted-foreground mb-4">
                            Your $200 program fee covers only a fraction of the real cost. The rest is funded by donors, grants, and the Hatteras sailing community — every family receives a meaningful scholarship just by enrolling.
                          </p>
                          <div className="rounded-xl border border-border overflow-hidden text-sm">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-muted text-muted-foreground text-xs uppercase tracking-wide">
                                  <th className="text-left px-4 py-2.5">Program Track</th>
                                  <th className="text-right px-4 py-2.5">Actual Cost</th>
                                  <th className="text-right px-4 py-2.5">Your Fee</th>
                                  <th className="text-right px-4 py-2.5">HCS Covers</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {[
                                  ["Sailing Littles (ages 6–9)", "Contact us", "$200", "—"],
                                  ["Opti Green Fleet (ages 9–13)", "~$620", "$200", "~$420"],
                                  ["Collegiate 420 (ages 12–18)", "~$1,100", "$200", "~$900"],
                                  ["SAISA High School (grades 8–12)", "~$2,700", "$200", "~$2,500"],
                                ].map(([track, actual, fee, subsidy]) => (
                                  <tr key={track} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 text-muted-foreground">{track}</td>
                                    <td className="px-4 py-3 text-right tabular-nums font-medium">{actual}</td>
                                    <td className="px-4 py-3 text-right tabular-nums text-primary font-semibold">{fee}</td>
                                    <td className="px-4 py-3 text-right tabular-nums font-bold text-primary">{subsidy}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="text-sm text-muted-foreground mt-3">
                            Cost per student assumes minimum enrollment (6–8 participants). SAISA costs include travel, regatta entry fees, and coaching intensity required for competitive interscholastic sailing.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Figures are based on actual operating costs. Hatteras Community Sailing is a 501(c)3 nonprofit (EIN 85-2684924). Donations are tax-deductible.
                          </p>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="text-primary-foreground/70 text-sm mt-1">
                    {selectedVessel ? `${selectedVessel.name}` : (trip.pricingNote ?? "per person")}
                  </div>
                </div>
                {selectedVessel && (
                  <button
                    onClick={() => { setSelectedVessel(null); setStep(1); }}
                    className="text-xs text-primary-foreground/70 hover:text-primary-foreground underline mt-1"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Step indicator */}
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {Array.from({ length: totalSteps }).map((_, i) => {
                  const s = i + 1;
                  const done = step > s;
                  const active = step === s;
                  return (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                        done ? "bg-primary text-primary-foreground"
                        : active ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                      }`}>
                        {done ? <Check className="h-3 w-3" /> : s}
                      </div>
                      {s < totalSteps && (
                        <div className={`h-px flex-1 min-w-[12px] transition-colors ${done ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                  );
                })}
                <span className="ml-1">{stepLabels[step - 1]}</span>
              </div>

              {/* ── Step 1: Vessel Picker (only if vessels available) ── */}
              {hasVessels && step === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {isLearnTrip
                      ? "Select the program track that fits your sailor."
                      : isFlat
                      ? "Select your vessel — your charter is a private, all-inclusive flat rate for the boat."
                      : "Select your vessel — prices vary by boat."}
                  </p>
                  <div className="space-y-2">
                    {vessels!.map((vessel) => (
                      <VesselCard
                        key={vessel.id}
                        vessel={vessel}
                        selected={selectedVessel?.id === vessel.id}
                        onSelect={() => setSelectedVessel(vessel)}
                      />
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedVessel}
                    onClick={() => setStep(2)}
                    data-testid="button-next-vessel"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* ── Step: Date & Participants ── */}
              {((!hasVessels && step === 1) || (hasVessels && step === 2)) && (
                <div className="space-y-4">
                  {selectedVessel && (
                    <div className="bg-primary/5 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                      <Ship className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="font-medium text-foreground">{selectedVessel.name}</span>
                      <span className="text-muted-foreground ml-auto">
                        {isFlat ? `${selectedVessel.priceDisplay} flat rate` : `${selectedVessel.priceDisplay}/person`}
                      </span>
                    </div>
                  )}

                  {/* Preferred date */}
                  <div className="space-y-2">
                    <Label>Preferred Sailing Date <span className="text-destructive">*</span></Label>
                    <select
                      data-testid="select-date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select a date...</option>
                      {DATE_OPTIONS.slice(0, 60).map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Vacation window */}
                  <div className="space-y-2 pt-1">
                    <div>
                      <Label className="text-sm">Your Vacation Window <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        If weather forces a reschedule, we'll reach out within this window.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Arrives</Label>
                        <input
                          type="date"
                          data-testid="input-vacation-start"
                          value={vacationStart}
                          onChange={e => setVacationStart(e.target.value)}
                          min={new Date().toISOString().slice(0, 10)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Departs</Label>
                        <input
                          type="date"
                          data-testid="input-vacation-end"
                          value={vacationEnd}
                          onChange={e => setVacationEnd(e.target.value)}
                          min={vacationStart || new Date().toISOString().slice(0, 10)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="space-y-2 pt-1">
                    <Label>Participants</Label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPassengers(p => Math.max(1, p - 1))}
                        className="h-9 w-9 rounded-md border border-input flex items-center justify-center hover:bg-muted transition-colors font-bold"
                        data-testid="button-decrement"
                      >–</button>
                      <span className="text-lg font-semibold w-8 text-center" data-testid="passenger-count">{passengers}</span>
                      <button
                        onClick={() => setPassengers(p => Math.min(selectedVessel?.capacity ?? trip.maxPassengers ?? 10, p + 1))}
                        className="h-9 w-9 rounded-md border border-input flex items-center justify-center hover:bg-muted transition-colors font-bold"
                        data-testid="button-increment"
                      >+</button>
                      <span className="text-sm text-muted-foreground">
                        / {selectedVessel?.capacity ?? trip.maxPassengers} max
                      </span>
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="text-xs text-right text-muted-foreground">
                      Subtotal: <span className="font-semibold text-foreground">${((effectivePriceCents * passengers) / 100).toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    {hasVessels && (
                      <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                    )}
                    <Button
                      className="flex-1"
                      size="lg"
                      disabled={!selectedDate}
                      onClick={() => setStep(hasVessels ? 3 : 2)}
                      data-testid="button-next-step"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Step: Your Details ── */}
              {((!hasVessels && step === 2) || (hasVessels && step === 3)) && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm space-y-1">
                    {selectedVessel && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Vessel</span><span className="font-medium">{selectedVessel.name}</span></div>
                    )}
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Participants</span><span className="font-medium">{passengers}</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Name <span className="text-destructive">*</span></Label>
                      <Input data-testid="input-contact-name" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email <span className="text-destructive">*</span></Label>
                      <Input data-testid="input-contact-email" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Phone <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input data-testid="input-contact-phone" type="tel" placeholder="(252) 555-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Textarea data-testid="textarea-notes" placeholder="Any requests, experience level, accessibility needs..." rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(hasVessels ? 2 : 1)}>Back</Button>
                    <Button className="flex-1" onClick={() => setStep(hasVessels ? 4 : 3)} disabled={!form.name || !form.email} data-testid="button-review">Review</Button>
                  </div>
                </div>
              )}

              {/* ── Step: Review ── */}
              {((!hasVessels && step === 3) || (hasVessels && step === 4)) && (
                <div className="space-y-5">
                  <div className="bg-muted/50 rounded-lg px-4 py-4 text-sm space-y-2">
                    <div className="font-semibold mb-3">Booking Summary</div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Program</span><span className="font-medium">{trip.name}</span></div>
                    {selectedVessel && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Vessel</span><span className="font-medium">{selectedVessel.name}</span></div>
                    )}
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Participants</span><span className="font-medium">{passengers}</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{form.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium text-xs break-all">{form.email}</span></div>
                    {form.phone && <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{form.phone}</span></div>}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>${(totalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isFlat
                        ? `${effectivePriceDisplay} · private charter · up to ${selectedVessel?.capacity ?? trip.maxPassengers} guests`
                        : `${effectivePriceDisplay} × ${passengers} person${passengers > 1 ? "s" : ""}`}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You will be taken to our secure Stripe checkout to complete your payment. Your program fee supports our 501(c)3 nonprofit mission.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(hasVessels ? 3 : 2)}>Back</Button>
                    <Button
                      className="flex-1"
                      onClick={handleCheckout}
                      disabled={checkout.isPending}
                      data-testid="button-checkout"
                    >
                      {checkout.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {checkout.isPending ? "Redirecting..." : "Complete Booking"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 pt-0">
              <div className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                <Heart className="h-3 w-3 fill-primary text-primary" />
                Program fees support Hatteras Community Sailing's 501(c)3 mission
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Questions? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> before booking.
          </p>
        </div>
      </div>
    </div>
  );
}
