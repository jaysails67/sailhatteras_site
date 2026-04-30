import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useAcceptNda } from "@workspace/api-client-react";
import { events } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

export default function Nda() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  
  const acceptNdaMutation = useAcceptNda();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/investors");
    } else if (user?.ndaAccepted) {
      setLocation("/investors/pending");
    }
  }, [user, isLoading, setLocation]);

  const handleAccept = () => {
    if (!agreed) return;
    
    acceptNdaMutation.mutate(undefined, {
      onSuccess: () => {
        events.investorNdaAccepted();
        toast({
          title: "NDA Accepted",
          description: "Your application is now pending approval.",
        });
        window.location.href = "/investors/pending";
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: (error.data as { error?: string })?.error || error.message,
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading || !user || user.ndaAccepted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-display font-bold">Non-Disclosure Agreement</h1>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-6 h-64 overflow-y-auto mb-6 text-sm text-muted-foreground space-y-4">
              <p><strong>NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT</strong></p>
              <p>This Non-Disclosure and Confidentiality Agreement (the "Agreement") is entered into by and between PamliEcoConnect ("Disclosing Party") and the undersigned investor ("Receiving Party").</p>
              <p>1. <strong>Confidential Information.</strong> The Receiving Party understands that the Disclosing Party has disclosed or may disclose information relating to the Disclosing Party's business, including, without limitation, computer programs, technical drawings, algorithms, names and expertise of employees and consultants, formulas, processes, ideas, inventions, schematics and other technical, business, financial, customer and product development plans, forecasts, strategies and information, which to the extent previously, presently or subsequently disclosed to the Receiving Party is hereinafter referred to as "Confidential Information".</p>
              <p>2. <strong>Non-Use and Non-Disclosure.</strong> The Receiving Party agrees not to use any Confidential Information for any purpose except to evaluate and engage in discussions concerning a potential business relationship between the parties.</p>
              <p>3. <strong>Maintenance of Confidentiality.</strong> The Receiving Party agrees to take reasonable measures to protect the secrecy of and avoid disclosure and unauthorized use of the Confidential Information.</p>
              <p><em>(This is a sample NDA for demonstration purposes)</em></p>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <Checkbox 
                id="terms" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                data-testid="checkbox-nda-agree"
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I understand and agree to the terms of the Non-Disclosure Agreement
              </label>
            </div>

            <Button 
              className="w-full" 
              onClick={handleAccept} 
              disabled={!agreed || acceptNdaMutation.isPending}
              data-testid="button-nda-submit"
            >
              {acceptNdaMutation.isPending ? "Submitting..." : "Accept & Continue"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
