import { Link, useSearch } from "wouter";
import { CheckCircle, Heart, Anchor, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetShBooking } from "@workspace/api-client-react";

export default function BookingConfirmation() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const bookingId = params.get("bookingId");
  const bookingIdInt = bookingId ? parseInt(bookingId, 10) : 0;

  const { data: booking, isLoading } = useGetShBooking(bookingIdInt, {
    query: { enabled: !!bookingId && bookingIdInt > 0 },
  });

  if (!bookingId) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <Anchor className="h-16 w-16 text-muted-foreground/30 mx-auto" />
          <h1 className="font-serif text-2xl font-bold">No booking found</h1>
          <p className="text-muted-foreground">Something may have gone wrong. Please check your email or contact us.</p>
          <Button asChild><Link href="/contact">Contact Us</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-2xl mx-auto px-6 py-20">
        {isLoading ? (
          <div className="space-y-6 text-center">
            <Skeleton className="h-20 w-20 rounded-full mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-80 mx-auto" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ) : (
          <div className="text-center" data-testid="booking-confirmation">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>

            <h1 className="font-serif text-4xl font-bold mb-3">You&rsquo;re Confirmed!</h1>
            <p className="text-lg text-muted-foreground mb-2">
              Thank you for joining a Hatteras Community Sailing program.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-10">
              <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
              <span>Your participation supports our 501(c)3 nonprofit mission</span>
            </div>

            {booking && (
              <div className="bg-card border border-border rounded-2xl p-6 text-left mb-8 shadow-sm">
                <h2 className="font-semibold text-lg mb-4">Booking Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confirmation #</span>
                    <span className="font-mono font-medium">#{booking.id}</span>
                  </div>
                  {(booking as any).customerName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium">{(booking as any).customerName}</span>
                    </div>
                  )}
                  {(booking as any).bookingDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{(booking as any).bookingDate}</span>
                    </div>
                  )}
                  {booking.passengers && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Participants</span>
                      <span className="font-medium">{booking.passengers}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize text-primary">{booking.status ?? "confirmed"}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 text-left mb-8">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Confirmation email on its way</div>
                  <p className="text-sm text-muted-foreground">
                    We&rsquo;ll send confirmation details to your email. If you have any questions before your program, don&rsquo;t hesitate to reach out.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/40 rounded-xl p-5 text-left mb-10">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 fill-primary text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold mb-1">Thank you for supporting our mission</div>
                  <p className="text-sm text-muted-foreground">
                    Hatteras Community Sailing is a 501(c)3 nonprofit. Your program fee directly funds free and reduced-cost sailing for youth and community members on the Outer Banks. We couldn&rsquo;t do this work without participants like you.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="flex-1">
                <Link href="/trips">
                  Explore More Programs <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
