import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateShContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useSeo } from "@/hooks/use-seo";

const TRIP_OPTIONS = [
  "Sunset Sail",
  "Half Day Sail",
  "Full Day Sail",
  "Stiletto X Charter",
  "Dolphin & Wildlife Tour",
  "Island Adventure",
  "Beach Cat Sailing Lesson",
  "Junior Sailing Program",
  "Visitor Sailing Intensive",
  "Beach Cat Rental",
  "Skiff Rental",
  "General Inquiry",
  "Youth Scholarship",
  "Partnership / Group Programs",
];

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", tripInterest: "" });
  const contact = useCreateShContact();

  useSeo({
    title: "Contact Us — Hatteras Community Sailing",
    description: "Get in touch with Hatteras Community Sailing. Book a program, ask about youth scholarships, or plan a group event. Call (252) 489-8193 or email info@sailhatteras.org.",
    canonical: "/contact",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "url": "https://sailhatteras.org/contact",
      "name": "Contact Hatteras Community Sailing",
      "description": "Contact us to book a sailing program, inquire about youth scholarships, or plan a group charter on Pamlico Sound.",
      "publisher": { "@id": "https://sailhatteras.org/#organization" }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    contact.mutate(
      { data: { name: form.name, email: form.email, phone: form.phone || undefined, message: form.message, tripInterest: form.tripInterest || undefined } },
      {
        onSuccess: () => setSubmitted(true),
        onError: () => toast({ title: "Something went wrong", description: "Please try again or email us directly.", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <section className="py-16 px-6 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>Hatteras Community Sailing — 501(c)3 Nonprofit</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Questions about our programs, youth scholarships, group bookings, or just want to know more about getting on the water — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6">Contact Information</h2>
              <ul className="space-y-5 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Location</div>
                    <div>48962 NC-12, Buxton, NC 27920<br />Office: 40039 NC-12, Avon, NC 27915</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Phone</div>
                    <a href="tel:+12524898193" className="hover:text-primary transition-colors">(252) 489-8193</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <a href="mailto:info@sailhatteras.org" className="hover:text-primary transition-colors">info@sailhatteras.org</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Season</div>
                    <div>Programs run April through October.<br />We respond to inquiries year-round.</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 fill-primary text-primary" />
                <span className="font-semibold text-sm">Youth Scholarship Inquiries</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Hatteras Community Sailing offers full and partial scholarships for youth from the local community who want to participate in our sailing programs. No child is turned away for inability to pay. Use the form to ask about scholarship availability.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4" data-testid="contact-success">
                <CheckCircle className="h-16 w-16 text-primary" />
                <h2 className="font-serif text-3xl font-bold">Message Received</h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  Thank you for reaching out. We'll get back to you within 24 hours. We look forward to getting you on the water.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                    <Input id="name" data-testid="input-name" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                    <Input id="email" type="email" data-testid="input-email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input id="phone" type="tel" data-testid="input-phone" placeholder="(252) 555-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tripInterest">Program Interest <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Select value={form.tripInterest} onValueChange={v => setForm(f => ({ ...f, tripInterest: v }))}>
                      <SelectTrigger id="tripInterest" data-testid="select-trip-interest">
                        <SelectValue placeholder="Select a program..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TRIP_OPTIONS.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="message"
                    data-testid="textarea-message"
                    placeholder="Tell us about yourself, your group, dates you're interested in, or any questions you have..."
                    rows={6}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={contact.isPending}
                  data-testid="button-submit-contact"
                >
                  {contact.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
