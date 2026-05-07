import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import {
  Clock, Users, Anchor, ArrowLeft, Check, Heart,
  ChevronRight, AlertCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetShTrip, useCreateShCheckout } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildDateOptions() {
  const opts: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    if (day === 0 || day === 6) continue; // skip Sun/Sat for simplicity
    const iso = d.toISOString().slice(0, 10);
    opts.push({ label: `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`, value: iso });
  }
  return opts;
}

const DATE_OPTIONS = buildDateOptions();

export default function TripDetail() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: trip, isLoading, error } = useGetShTrip(params.slug!);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  const checkout = useCreateShCheckout();

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
          tripId: trip!.id,
          tripDate: selectedDate,
          passengers,
          contactName: form.name,
          contactEmail: form.email,
          contactPhone: form.phone || undefined,
          notes: form.notes || undefined,
        },
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

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
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

          {/* Image placeholder */}
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-10">
            {trip.imageUrl
              ? <img src={trip.imageUrl} alt={trip.name} className="w-full h-full object-cover" />
              : <Anchor className="h-20 w-20 text-primary/20" />
            }
          </div>

          {/* Description */}
          <div className="prose prose-neutral max-w-none mb-10">
            <p className="text-muted-foreground leading-relaxed text-lg">{trip.description}</p>
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
            <div className="p-6 bg-primary text-primary-foreground">
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="text-3xl font-bold">{trip.priceDisplay}</div>
                  <div className="text-primary-foreground/70 text-sm mt-1">{trip.pricingNote}</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Step indicator */}
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {step > s ? <Check className="h-3 w-3" /> : s}
                    </div>
                    {s < 3 && <div className={`h-px w-6 ${step > s ? "bg-primary" : "bg-border"}`} />}
                  </div>
                ))}
                <span className="ml-2">{step === 1 ? "Select Date" : step === 2 ? "Your Details" : "Review"}</span>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <select
                      data-testid="select-date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select a date...</option>
                      {DATE_OPTIONS.slice(0, 30).map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Participants</Label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPassengers(p => Math.max(1, p - 1))}
                        className="h-9 w-9 rounded-md border border-input flex items-center justify-center hover:bg-muted transition-colors font-bold"
                        data-testid="button-decrement"
                      >–</button>
                      <span className="text-lg font-semibold w-8 text-center" data-testid="passenger-count">{passengers}</span>
                      <button
                        onClick={() => setPassengers(p => Math.min(trip.maxPassengers ?? 10, p + 1))}
                        className="h-9 w-9 rounded-md border border-input flex items-center justify-center hover:bg-muted transition-colors font-bold"
                        data-testid="button-increment"
                      >+</button>
                      <span className="text-sm text-muted-foreground">/ {trip.maxPassengers} max</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedDate}
                    onClick={() => setStep(2)}
                    data-testid="button-next-step"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm space-y-1">
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
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                    <Button className="flex-1" onClick={() => setStep(3)} disabled={!form.name || !form.email} data-testid="button-review">Review</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="bg-muted/50 rounded-lg px-4 py-4 text-sm space-y-2">
                    <div className="font-semibold mb-3">Booking Summary</div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Program</span><span className="font-medium">{trip.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Participants</span><span className="font-medium">{passengers}</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{form.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium text-xs break-all">{form.email}</span></div>
                    {form.phone && <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{form.phone}</span></div>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You will be taken to our secure Stripe checkout to complete your payment. Your program fee supports our 501(c)3 nonprofit mission.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
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
