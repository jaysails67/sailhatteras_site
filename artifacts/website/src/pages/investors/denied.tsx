import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useGetMyApplication, getGetMyApplicationQueryKey } from "@workspace/api-client-react";
import { ShieldAlert, Mail } from "lucide-react";

export default function Denied() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const isDenied = !!user && user.approvalStatus === "denied";

  const { data: application } = useGetMyApplication({
    query: { enabled: isDenied, queryKey: getGetMyApplicationQueryKey() }
  });

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
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">Access Not Approved</h1>
            <p className="text-muted-foreground leading-relaxed">
              Thank you for your interest in PamliEcoConnect. After reviewing your application, we are unable to grant access to the investor portal at this time.
            </p>
          </div>

          {application?.notes && (
            <div className="bg-card border border-border rounded-lg p-5 mb-6 space-y-2">
              <p className="text-sm font-semibold text-foreground">Reason from admin:</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{application.notes}</p>
            </div>
          )}

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 space-y-2">
            <p className="text-sm font-semibold text-foreground">What you can do:</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Review the reason above and address any outstanding concerns.</li>
              <li>Re-register using a verifiable corporate email address and phone number.</li>
              <li>Contact us directly if you believe this decision was made in error.</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Questions? Email <a href="mailto:investors@pamliecoconnect.com" className="text-primary hover:underline">investors@pamliecoconnect.com</a></span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
