import { Heart } from "lucide-react";

export default function Privacy() {
  const updated = "May 7, 2026";
  return (
    <div className="min-h-screen pt-20 bg-background">
      <section className="py-16 px-6 bg-muted/30 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>Hatteras Community Sailing — 501(c)3 Nonprofit</span>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {updated}</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-neutral max-w-none">
          <div className="space-y-10 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">About This Policy</h2>
              <p>
                Hatteras Community Sailing (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the organization&rdquo;) is a 501(c)3 nonprofit organization located in Hatteras Village, North Carolina. This Privacy Policy explains how we collect, use, and protect information you provide when using our website at sailhatteras.org and participating in our community sailing programs.
              </p>
              <p className="mt-3">
                We are committed to protecting your privacy and using your data only to support our nonprofit mission of community sailing access on the Outer Banks.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Information We Collect</h2>
              <p><strong className="text-foreground">Program Registrations and Bookings:</strong> When you register for a community program, we collect your name, email address, phone number, the program selected, your preferred date, number of participants, and any special requests or notes.</p>
              <p className="mt-3"><strong className="text-foreground">Contact Inquiries:</strong> When you use our contact form, we collect your name, email address, optional phone number, and your message.</p>
              <p className="mt-3"><strong className="text-foreground">Payment Information:</strong> We do not store payment card numbers or financial data on our servers. All payment processing is handled by Stripe, Inc., a PCI-compliant payment processor. Please review <a href="https://stripe.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Stripe&rsquo;s Privacy Policy</a> for information on how payment data is handled.</p>
              <p className="mt-3"><strong className="text-foreground">Website Usage:</strong> We may collect anonymized information about how visitors interact with our website to improve our programs and community outreach. We do not use advertising trackers or sell website data.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Confirm and administer your program registration or booking</li>
                <li>Communicate with you about your participation, schedule changes, or cancellations</li>
                <li>Respond to contact form inquiries</li>
                <li>Process payments through our Stripe integration</li>
                <li>Improve our programs and community outreach efforts</li>
                <li>Fulfill our legal and tax obligations as a 501(c)3 nonprofit</li>
              </ul>
              <p className="mt-4">
                <strong className="text-foreground">We do not sell, rent, or trade your personal information to third parties.</strong> We do not use your information for advertising purposes. We are a nonprofit organization and your data is used only to support our sailing programs and mission.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Data Retention</h2>
              <p>
                We retain program and booking records for a period of 7 years to comply with nonprofit financial record-keeping requirements. Contact inquiry records are retained for 2 years. You may request deletion of your personal information at any time by contacting us, subject to our legal retention obligations.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Third-Party Services</h2>
              <p>
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong className="text-foreground">Stripe:</strong> For secure payment processing. Stripe is PCI-DSS compliant. We do not store card data.</li>
                <li><strong className="text-foreground">Google Analytics:</strong> For anonymous website usage analytics to help us improve our community programs. Data is anonymized and not linked to individual users.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Request a copy of the personal information we hold about you</li>
                <li>Request correction of inaccurate personal information</li>
                <li>Request deletion of your personal information, subject to retention obligations</li>
                <li>Opt out of any non-essential communications from us</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Children&rsquo;s Privacy</h2>
              <p>
                Our youth sailing programs serve children as young as 8 years old. We collect information about youth participants only from their parents or legal guardians. We do not knowingly collect personal information directly from children under 13. Youth program registration must be completed by a parent or legal guardian.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or your personal information, please contact us:
              </p>
              <div className="mt-3 space-y-1">
                <p><strong className="text-foreground">Hatteras Community Sailing</strong></p>
                <p>Hatteras Village, NC 27943</p>
                <p>Email: <a href="mailto:info@sailhatteras.org" className="text-primary hover:underline">info@sailhatteras.org</a></p>
                <p>Phone: (252) 489-8193</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
