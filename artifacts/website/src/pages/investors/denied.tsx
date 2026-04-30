import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";

export default function Denied() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation("/investors");
      } else if (user.approvalStatus === "approved") {
        setLocation("/investors/portal");
      } else if (user.approvalStatus === "pending") {
        setLocation("/investors/pending");
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Access Restricted</h1>
          <p className="text-muted-foreground leading-relaxed">
            We appreciate your interest in PamliEcoConnect. Unfortunately, we are unable to grant you access to the investor portal at this time. If you believe this is an error, please contact our support team.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
