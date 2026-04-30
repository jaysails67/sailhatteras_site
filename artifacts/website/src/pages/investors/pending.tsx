import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ShieldCheck, UserCheck, Search, Clock } from "lucide-react";

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

  const steps = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "NDA Submitted",
      description: "Your Non-Disclosure Agreement has been received and recorded.",
      done: true,
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      title: "Identity Validation",
      description: "Your name, email, and phone number are being verified as belonging to a real person — not a bot or AI-generated identity.",
      done: false,
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "Industry Cross-Reference",
      description: "Your information is being cross-referenced against known industry competitors to ensure confidential materials are shared only with qualified, non-competing investors.",
      done: false,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Admin Review & Decision",
      description: "Once validated, the admin will approve or deny your access. If denied, you will receive a brief explanation and guidance on next steps.",
      done: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">Application Under Review</h1>
            <p className="text-muted-foreground leading-relaxed">
              Your request has been sent to the admin. Here is what happens next:
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex gap-4 p-4 rounded-lg border ${
                  step.done
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 ${
                  step.done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step.done ? <ShieldCheck className="h-4 w-4" /> : i + 1}
                </div>
                <div>
                  <p className={`font-semibold text-sm mb-1 ${step.done ? "text-primary" : "text-foreground"}`}>
                    {step.title}
                    {step.done && <span className="ml-2 text-xs font-normal opacity-70">✓ Complete</span>}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            This page will automatically update once a decision has been made.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
