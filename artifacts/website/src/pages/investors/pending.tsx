import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";

export default function Pending() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation("/investors");
      } else if (!user.ndaAccepted) {
        setLocation("/investors/nda");
      } else if (user.approvalStatus === "approved") {
        setLocation("/investors/portal");
      } else if (user.approvalStatus === "denied") {
        setLocation("/investors/denied");
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Application Under Review</h1>
          <p className="text-muted-foreground leading-relaxed">
            Thank you for completing the Non-Disclosure Agreement. Our team is currently reviewing your investor application. You will receive an email once your access to the portal has been approved.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
