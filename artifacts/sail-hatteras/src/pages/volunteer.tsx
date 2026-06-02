import { useState } from "react";
import { Heart, Users, Anchor, Wrench, Camera, BookOpen, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSeo } from "@/hooks/use-seo";
import { useToast } from "@/hooks/use-toast";

const roles = [
  {
    icon: <Anchor className="h-6 w-6" />,
    title: "On-Water Instructor Assistant",
    time: "Weekends & weekday mornings, Jun–Aug",
    body: "Help certified instructors during youth sailing sessions. Assist with rigging, safety watch from support boats, and encourage young sailors. Prior sailing experience helpful but not required.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Youth Program Mentor",
    time: "Flexible — 2–4 hrs/week",
    body: "Serve as a positive role model for youth in the Opti and 420 programs. Help with boat handling, race coaching, and motivation. Our year-round sailors especially benefit from consistent mentors.",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Regatta Volunteer",
    time: "Spring & Fall regattas (2 weekends/year)",
    body: "Help run our two annual regattas — Wind & Waves Maritime Festival (spring) and Lighthouse Regatta (fall). Roles include race committee, registration, hospitality, and logistics.",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "School & Outreach Programs",
    time: "Seasonal — scheduled in advance",
    body: "Assist during school group and homeschool co-op visits. Help supervise, assist with gear, and share your enthusiasm for sailing and the Pamlico Sound environment.",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "Fleet & Facility Maintenance",
    time: "Flexible — project-based",
    body: "Help keep our fleet seaworthy. Tasks include boat maintenance, rigging, storage, and facility upkeep at our Buxton waterfront. Great for hands-on volunteers of any skill level.",
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Photography & Social Media",
    time: "Flexible — event-based",
    body: "Capture the energy of our programs on and off the water. Share your photos with our social team for Instagram, Facebook, and our annual impact report. Great for photographers of all levels.",
  },
];

export default function Volunteer() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  useSeo({
    title: "Volunteer With Us — Hatteras Community Sailing",
    description: "Volunteer with Hatteras Community Sailing on the Outer Banks. Help teach youth sailing, assist regattas, maintain our fleet, or mentor the next generation of Hatteras Island mariners.",
    canonical: "/volunteer",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": "https://sailhatteras.org/volunteer",
      "name": "Volunteer — Hatteras Community Sailing",
      "description": "Volunteer opportunities with Hatteras Community Sailing, a 501(c)3 nonprofit on Hatteras Island, NC.",
      "publisher": { "@id": "https://sailhatteras.org/#organization" }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: `Volunteer Interest: ${form.interest || "General"}`,
          message: form.message || `${form.name} is interested in volunteering with Hatteras Community Sailing.`,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please email us directly at info@sailhatteras.org", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-background">

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Heart className="h-4 w-4 fill-primary" />
            Get Involved
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Volunteer on<br />the Water
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every volunteer hour puts more kids on the water and keeps our community sailing programs running. Whether you sail, wrench, photograph, or just love the Outer Banks — there's a role for you.
          </p>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Ways to Help</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From one Saturday to a full summer season — every bit of help strengthens our community on Hatteras Island.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div key={r.title} className="bg-card border border-border rounded-xl p-6">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {r.icon}
                </div>
                <h3 className="font-serif text-lg font-bold mb-1">{r.title}</h3>
                <p className="text-xs text-primary font-medium mb-3">{r.time}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Position Benefit callout */}
      <section className="py-12 px-6 bg-amber-50 border-y border-amber-200">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Heart className="h-4 w-4 fill-amber-600 text-amber-600" />
            Member Benefit for Key Volunteers
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-900 mb-3">Board, Committee & Volunteer Positions</h2>
          <p className="text-amber-800 leading-relaxed">
            Individuals serving in a Board, Committee, or key volunteer role receive <strong>50% off their annual membership</strong> and a rate lock for as long as they serve. The benefit reverts to standard pricing upon vacating the position. <a href="/membership" className="underline hover:no-underline">Learn about membership →</a>
          </p>
        </div>
      </section>

      {/* Sign-up Form */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold mb-3">Sign Up to Volunteer</h2>
            <p className="text-muted-foreground">Fill out this form and our volunteer coordinator will be in touch within a few days.</p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-green-900 mb-2">Thank you, {form.name}!</h3>
              <p className="text-green-800">
                We've received your volunteer interest. Our coordinator will reach out to you at <strong>{form.email}</strong> within a few days.
              </p>
              <p className="text-green-700 text-sm mt-4">
                Questions? Email <a href="mailto:info@sailhatteras.org" className="underline">info@sailhatteras.org</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <Input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email <span className="text-red-500">*</span></label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone (optional)</label>
                <Input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(252) 555-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Area of Interest</label>
                <select
                  name="interest"
                  value={form.interest}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a role (optional)</option>
                  <option>On-Water Instructor Assistant</option>
                  <option>Youth Program Mentor</option>
                  <option>Regatta Volunteer</option>
                  <option>School & Outreach Programs</option>
                  <option>Fleet & Facility Maintenance</option>
                  <option>Photography & Social Media</option>
                  <option>Board / Committee Position</option>
                  <option>Other / Not Sure Yet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Anything else you'd like us to know?</label>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Sailing experience, availability, questions..."
                  rows={4}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Submitting…" : <>Submit Volunteer Interest <ArrowRight className="h-4 w-4 ml-2" /></>}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We'll never share your information. See our <a href="/privacy" className="text-primary hover:underline">privacy policy</a>.
              </p>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
