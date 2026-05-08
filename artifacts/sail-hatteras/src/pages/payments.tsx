import { Link } from "wouter";
import { Heart, CreditCard, Mail, DollarSign, Smartphone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Payments() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <Heart className="h-4 w-4 fill-primary" />
            Hatteras Community Sailing · 501(c)3 Nonprofit
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            How to Pay
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            We're in the process of setting up online payments. For now, once you submit
            an enrollment request we'll confirm space availability and send you payment
            instructions by email within 24–48 hours.
          </p>
        </div>

        <div className="rounded-xl border bg-amber-50 border-amber-200 px-5 py-4 text-sm text-amber-900 space-y-1">
          <div className="font-semibold">Your spot is not reserved until payment is received.</div>
          <div className="text-amber-800">Submit your enrollment request → receive our email → complete payment → you're confirmed.</div>
        </div>

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
                Deliver in person or by mail. We'll include our mailing address in your enrollment email.
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
                Send directly to our Zelle account — details will be included in your enrollment
                confirmation email. Zelle transfers are instant and free from most major banks.
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
                We accept Venmo for program fees. Our Venmo handle will be provided in your
                enrollment email. Please include your child's name and program in the note.
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            SAISA High School — Payment Plans
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The $695 SAISA High School Sailing fee can be split into installment payments.
            Mention this when you submit your enrollment request and we'll work out a
            payment schedule that fits your family.
          </p>
        </div>

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
            Ready to enroll your sailor?
          </p>
          <Button asChild>
            <Link href="/trips?category=learn">View Programs</Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
