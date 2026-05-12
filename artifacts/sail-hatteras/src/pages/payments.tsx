import { Link } from "wouter";
import { Heart, CreditCard, Mail, DollarSign, Smartphone, FileText, Anchor, AlertCircle, CheckCircle2, CloudSun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";

export default function Payments() {
  useSeo({
    title: "Payment Policy — Hatteras Community Sailing",
    description: "Charter deposit and payment policy for Hatteras Community Sailing. 15% deposit holds your reservation. Final balance due 4 days before your charter date.",
    canonical: "/payments",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <Heart className="h-4 w-4 fill-primary" />
            Hatteras Community Sailing · 501(c)3 Nonprofit
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Payment Policy
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Our payment structure is designed around the realities of sailing on Pamlico Sound —
            where weather is the dominant factor in every charter decision.
          </p>
        </div>

        {/* Charter Deposit Policy */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Anchor className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-xl text-foreground">Charter &amp; Event Reservations</h2>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-2">
            <div className="font-semibold text-foreground text-lg">Reservations Require a 15% Deposit</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A non-refundable 15% deposit is required to hold your reservation date. This deposit
              secures your date and vessel and is applied toward your total balance.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <CloudSun className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-foreground">Final Balance Due 4 Days Before Your Charter</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your Confirmation Payment (remaining balance) is due <strong className="text-foreground">4 days before your reservation date</strong>,
                unless your Reservation Consultant has made other arrangements with you.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We set this window intentionally — at 4 days out, reliable weather forecasts are available for
                Pamlico Sound. Before we collect your final balance, your Reservation Consultant will review
                the forecast with you and discuss any scheduling adjustments if conditions warrant it.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Payment of your final balance also confirms to us that you are in the area and plan
                to be present for your charter — which helps us crew and prepare appropriately.
              </p>
            </div>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg text-foreground">Refund Policy — Charters &amp; Events</h2>

          <div className="rounded-xl border bg-card divide-y divide-border overflow-hidden">
            <div className="p-5 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-foreground">15% Deposit — Non-Refundable</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The initial deposit is non-refundable. It compensates us for holding your date,
                  turning away other bookings, and the work involved in preparing your reservation.
                </p>
              </div>
            </div>

            <div className="p-5 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-foreground">Confirmation Payment — Refundable Under These Conditions</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your final balance payment is fully refundable if:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2 list-none">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>Hatteras Community Sailing is unable to fulfill your charter for any reason, <em>or</em></span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>Weather conditions require rescheduling and you are not able to adjust your date around the forecast.</span></li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  We work hard to reschedule around weather whenever possible. Our goal is to get
                  you on the water — not to keep your money.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Programs - separate note */}
        <div className="rounded-xl border bg-amber-50 border-amber-200 px-5 py-4 space-y-2">
          <div className="font-semibold text-amber-900 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Educational Programs — Different Policy
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            The deposit and refund policy above applies to <strong>charter and event bookings only</strong>.
            Sailing lessons, youth camps, and SAISA programs are subsidized through our nonprofit mission
            and follow a separate enrollment and payment process. Contact us for details.
          </p>
          <div className="pt-1">
            <Button asChild variant="outline" size="sm">
              <Link href="/contact">Ask About Educational Programs</Link>
            </Button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-foreground">Payment Methods</h2>

          <div className="rounded-xl border bg-card p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-foreground">Cash or Check</div>
              <div className="text-sm text-muted-foreground">
                Make checks payable to <span className="font-medium text-foreground">Hatteras Community Sailing</span>.
                Deliver in person or by mail — our address will be included in your reservation email.
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-foreground">Zelle</div>
              <div className="text-sm text-muted-foreground">
                Send directly to our Zelle account. Details will be included in your reservation
                confirmation email. Transfers are instant and free from most major banks.
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-foreground">Venmo</div>
              <div className="text-sm text-muted-foreground">
                We accept Venmo. Our handle will be provided in your reservation email.
                Please include your name and charter date in the payment note.
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships */}
        <div className="rounded-xl border bg-primary/5 border-primary/20 p-5 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Mail className="h-4 w-4 text-primary" />
            Scholarships Available
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Full and partial scholarships are available for Hatteras community youth. No child
            will be turned away for inability to pay. Contact us to learn more.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        <div className="text-center space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Ready to book a charter or event?
          </p>
          <Button asChild>
            <Link href="/trips?category=charter">View Charter Options</Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
