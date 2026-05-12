import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import {
  Heart, Mail, DollarSign, FileText, Anchor, AlertCircle,
  CheckCircle2, CloudSun, Upload, X, Camera, Info, Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSeo } from "@/hooks/use-seo";

type ImageSlot = { file: File; preview: string } | null;

function ImageUploadZone({
  label,
  slot,
  onSelect,
  onClear,
  testId,
}: {
  label: string;
  slot: ImageSlot;
  onSelect: (f: File) => void;
  onClear: () => void;
  testId?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) onSelect(file);
  }, [onSelect]);

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {slot ? (
        <div className="relative rounded-lg border border-primary/30 overflow-hidden bg-black/5">
          <img src={slot.preview} alt={label} className="w-full h-36 object-contain" />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="absolute bottom-2 left-2 text-[11px] text-white/90 bg-black/50 rounded px-1.5 py-0.5">
            {slot.file.name}
          </div>
        </div>
      ) : (
        <div
          data-testid={testId}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => ref.current?.click()}
          className="h-36 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Camera className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground text-center px-4">
            Click or drag image here
          </div>
          <div className="text-xs text-muted-foreground/70">JPG, PNG, HEIC up to 12 MB</div>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={e => { const f = e.target.files?.[0]; if (f) onSelect(f); }}
      />
    </div>
  );
}

function QrBlock({
  src,
  altLabel,
  fallbackText,
}: {
  src: string;
  altLabel: string;
  fallbackText: string;
}) {
  const [missing, setMissing] = useState(false);
  return missing ? (
    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center text-center text-xs text-muted-foreground p-3 leading-relaxed">
      {fallbackText}
    </div>
  ) : (
    <img
      src={src}
      alt={altLabel}
      className="w-32 h-32 rounded-xl border border-border object-contain bg-white"
      onError={() => setMissing(true)}
    />
  );
}

function CheckUploadForm() {
  const [front, setFront] = useState<ImageSlot>(null);
  const [back,  setBack]  = useState<ImageSlot>(null);
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [ref_,  setRef_]  = useState("");
  const [busy,  setBusy]  = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const makeSlot = (file: File): ImageSlot => ({ file, preview: URL.createObjectURL(file) });
  const clearSlot = (slot: ImageSlot, set: (v: ImageSlot) => void) => {
    if (slot?.preview) URL.revokeObjectURL(slot.preview);
    set(null);
  };

  const handleSubmit = async () => {
    if (!front || !back) { setResult({ ok: false, msg: "Please attach both front and back images of your check." }); return; }
    if (!name.trim() || !email.trim()) { setResult({ ok: false, msg: "Your name and email are required." }); return; }
    setBusy(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("frontImage", front.file);
      fd.append("backImage",  back.file);
      fd.append("customerName",  name.trim());
      fd.append("customerEmail", email.trim());
      if (ref_.trim()) fd.append("reservationRef", ref_.trim());

      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/sh/check-payment`, { method: "POST", body: fd });
      const json = await res.json() as { success?: boolean; message?: string; error?: string };
      if (res.ok && json.success) {
        setResult({ ok: true, msg: json.message ?? "Check images sent successfully." });
        clearSlot(front, setFront);
        clearSlot(back, setBack);
        setName(""); setEmail(""); setRef_("");
      } else {
        setResult({ ok: false, msg: json.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setResult({ ok: false, msg: "Network error. Please check your connection and try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
        <Banknote className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground text-sm">Submit Check Images</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Image quality requirements
          </div>
          <ul className="text-xs text-amber-800 space-y-1 pl-1">
            <li>• Lay the check flat on a solid, contrasting surface</li>
            <li>• Ensure the entire check is in frame — all four corners visible</li>
            <li>• Good, even lighting — no glare or shadows across the text</li>
            <li>• Hold the camera directly above (no skew or tilt)</li>
            <li>• Both images must be clear enough to read all printed text</li>
          </ul>
          <div className="text-xs font-semibold text-amber-900 pt-0.5">
            ⚠ Unclear or skewed images cannot be processed — you will need to resend.
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs text-foreground font-medium flex items-start gap-2">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          Your reservation date is <strong className="ml-1">not held</strong> until your check has cleared.
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ImageUploadZone label="Front of Check" slot={front} onSelect={f => setFront(makeSlot(f))} onClear={() => clearSlot(front, setFront)} testId="upload-front" />
          <ImageUploadZone label="Back of Check"  slot={back}  onSelect={f => setBack(makeSlot(f))}  onClear={() => clearSlot(back, setBack)}   testId="upload-back"  />
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Your Name <span className="text-destructive">*</span></Label>
            <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Your Email <span className="text-destructive">*</span></Label>
            <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Reservation Reference <span className="text-muted-foreground font-normal text-xs">(optional — from your confirmation email)</span></Label>
            <Input placeholder="e.g. HCS-2026-001" value={ref_} onChange={e => setRef_(e.target.value)} />
          </div>
        </div>

        {result && (
          <div className={`rounded-lg px-4 py-3 text-sm flex items-start gap-2 ${result.ok ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            {result.ok
              ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
              : <AlertCircle  className="h-4 w-4 shrink-0 mt-0.5 text-red-500"   />}
            {result.msg}
          </div>
        )}

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={busy || !front || !back || !name.trim() || !email.trim()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {busy ? "Sending…" : "Send Check Images"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Images are sent securely to{" "}
          <a href="mailto:reservations@sailhatteras.org" className="text-primary hover:underline">
            reservations@sailhatteras.org
          </a>
        </p>
      </div>
    </div>
  );
}

export default function Payments() {
  useSeo({
    title: "Payment Policy — Hatteras Community Sailing",
    description: "Charter deposit and payment policy for Hatteras Community Sailing. 15% deposit holds your reservation. Final balance due 4 days before your charter date.",
    canonical: "/payments",
  });

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <Heart className="h-4 w-4 fill-primary" />
            Hatteras Community Sailing · 501(c)3 Nonprofit
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Payment Policy</h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Our payment structure is designed around the realities of sailing on Pamlico Sound —
            where weather is the dominant factor in every charter decision.
          </p>
        </div>

        {/* Charter Deposit Policy */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Anchor className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-xl text-foreground">Charter &amp; Event Reservations</h2>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-2">
            <div className="font-semibold text-foreground text-lg">Reservations Require a 15% Deposit</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A non-refundable 15% deposit is required to hold your reservation date. This deposit
              secures your date and vessel and is applied toward your total balance.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <CloudSun className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1.5">
              <div className="font-semibold text-foreground">Charter Confirmation Due 4 Days Before Your Reservation</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your Charter Confirmation (final balance) is due <strong className="text-foreground">4 days prior to your reservation date</strong>,
                unless your Reservation Consultant has made other arrangements with you.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We set this window intentionally — at 4 days out, reliable weather forecasts are available for
                Pamlico Sound. Before we collect your final balance, your Reservation Consultant will review
                the forecast with you and discuss any scheduling adjustments if conditions warrant it.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Payment of your final balance also confirms to us that you are in the area and plan
                to be present for your charter — which helps us crew and prepare appropriately.
              </p>
            </div>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg text-foreground">Refund Policy — Charters &amp; Events</h2>
          <div className="rounded-xl border bg-card divide-y divide-border overflow-hidden">
            <div className="p-5 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-foreground">15% Deposit — Non-Refundable</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The initial deposit is non-refundable. It compensates us for holding your date,
                  turning away other bookings, and the work involved in preparing your reservation.
                </p>
              </div>
            </div>
            <div className="p-5 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-foreground">Charter Confirmation — Refundable Under These Conditions</div>
                <p className="text-sm text-muted-foreground leading-relaxed">Your final balance is fully refundable if:</p>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2 list-none">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>Hatteras Community Sailing is unable to fulfill your charter for any reason, <em>or</em></span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>Weather conditions require rescheduling and you are unable to reschedule.</span></li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  We work hard to reschedule around weather whenever possible. Our goal is to get you on the water — not to keep your money.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Programs note */}
        <div className="rounded-xl border bg-amber-50 border-amber-200 px-5 py-4 space-y-2">
          <div className="font-semibold text-amber-900 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Educational Programs — Different Policy
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            The deposit and refund policy above applies to <strong>charter and event bookings only</strong>.
            Sailing lessons, youth camps, and SAISA programs are subsidized through our nonprofit mission
            and follow a separate enrollment and payment process. Contact us for details.
          </p>
          <Button asChild variant="outline" size="sm"><Link href="/contact">Ask About Educational Programs</Link></Button>
        </div>

        {/* Payment Methods */}
        <div className="space-y-5">
          <h2 className="font-semibold text-xl text-foreground">Payment Methods</h2>
          <p className="text-sm text-muted-foreground -mt-2">
            All methods below are fee-free — 100% of your payment goes directly to our sailing programs.
          </p>

          {/* Cash */}
          <div className="rounded-xl border bg-card p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-foreground">Cash</div>
              <div className="text-sm text-muted-foreground">
                Deliver in person — our location will be included in your reservation confirmation email.
              </div>
            </div>
          </div>

          {/* Check */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="p-5 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Banknote className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-foreground">Check</div>
                <div className="text-sm text-muted-foreground">
                  Make payable to <span className="font-medium text-foreground">Hatteras Community Sailing</span>.
                  Mail to the address in your confirmation, or submit check images below.
                </div>
                <div className="text-xs font-medium text-amber-700 mt-1">
                  Reservation date is not held until the check clears.
                </div>
              </div>
            </div>
            <div className="border-t border-border px-5 pb-5 pt-4">
              <CheckUploadForm />
            </div>
          </div>

          {/* Zelle */}
          <div className="rounded-xl border bg-card p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-[#6b21e8]/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#6b21e8]" aria-hidden="true"><path d="M13.228 2H3.5L2 9.5h7.228L4.5 22 22 9.5h-7.228L13.228 2z"/></svg>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="font-semibold text-foreground">Zelle</div>
                <div className="text-sm text-muted-foreground">
                  Instant, bank-to-bank transfer — free from all major US banks. Scan the QR code or use
                  the Zelle address provided in your reservation confirmation email.
                </div>
              </div>
              <div className="flex items-start gap-4">
                <QrBlock
                  src={`${base}/qr-zelle.png`}
                  altLabel="Zelle QR code"
                  fallbackText="Zelle QR code — provided in your confirmation email"
                />
                <div className="text-xs text-muted-foreground leading-relaxed pt-1">
                  Open your bank's app → Zelle → Send → scan this code, or search by the email/phone
                  in your confirmation. Include your name and reservation date in the memo.
                </div>
              </div>
            </div>
          </div>

          {/* Venmo */}
          <div className="rounded-xl border bg-card p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-[#008cff]/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#008cff]" aria-hidden="true"><path d="M19.024 2c.532.879.771 1.785.771 2.933 0 3.659-3.124 8.412-5.658 11.757H8.38L5.956 2.856l5.532-.532 1.33 10.667c1.251-2.021 2.799-5.195 2.799-7.359 0-1.197-.212-2.021-.559-2.692L19.024 2z"/></svg>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="font-semibold text-foreground">Venmo</div>
                <div className="text-sm text-muted-foreground">
                  Scan the QR code with the Venmo app, or use the handle provided in your confirmation email.
                  Include your name and reservation date in the payment note.
                </div>
              </div>
              <div className="flex items-start gap-4">
                <QrBlock
                  src={`${base}/qr-venmo.png`}
                  altLabel="Venmo QR code"
                  fallbackText="Venmo QR code — provided in your confirmation email"
                />
                <div className="text-xs text-muted-foreground leading-relaxed pt-1">
                  Open Venmo → Scan → point at this code. Or tap "Pay or Request" and search
                  for our handle from your confirmation email.
                </div>
              </div>
            </div>
          </div>

          {/* CashApp */}
          <div className="rounded-xl border bg-card p-5 flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-[#00d632]/10 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#00d632]" aria-hidden="true"><path d="M23.59 3.47A2.41 2.41 0 0 0 21.18 1a2.37 2.37 0 0 0-1.67.66L18.2 3a7.93 7.93 0 0 0-2.37-.36 8 8 0 0 0-5.66 2.34 8 8 0 0 0-.29 10.95l-1.44 1.44a2.41 2.41 0 0 0 0 3.41 2.43 2.43 0 0 0 3.42 0l1.43-1.43a8 8 0 0 0 10.3-11.88zm-7.46 11a4.78 4.78 0 0 1-2.34.61 4.84 4.84 0 0 1-3.42-1.42 4.84 4.84 0 0 1 0-6.84 4.81 4.81 0 0 1 3.42-1.42 4.78 4.78 0 0 1 2.34.61l-5.15 5.15a.8.8 0 0 0 1.13 1.13l5.15-5.15a4.83 4.83 0 0 1-1.13 7.33z"/></svg>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="font-semibold text-foreground">Cash App</div>
                <div className="text-sm text-muted-foreground">
                  Scan the QR code with Cash App, or use the $Cashtag provided in your reservation
                  confirmation email. Include your name and reservation date in the note.
                </div>
              </div>
              <div className="flex items-start gap-4">
                <QrBlock
                  src={`${base}/qr-cashapp.png`}
                  altLabel="Cash App QR code"
                  fallbackText="Cash App QR code — coming soon"
                />
                <div className="text-xs text-muted-foreground leading-relaxed pt-1">
                  Open Cash App → Scan QR → confirm amount. Or tap "Pay" and enter the
                  $Cashtag from your confirmation email.
                </div>
              </div>
            </div>
          </div>

          {/* Apple Pay / Google Pay note */}
          <div className="rounded-xl border border-border bg-muted/30 px-5 py-4 flex gap-3">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-medium text-sm text-foreground">Apple Pay &amp; Google Pay</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These digital wallets require a third-party payment processor, which charges a 2.9%+
                transaction fee. As a nonprofit, we'd rather that money go to your sailing experience
                than to a payment company — which is why we focus on the fee-free options above.
                If you need an alternative arrangement, contact your Reservation Consultant.
              </p>
            </div>
          </div>
        </div>

        {/* Scholarships */}
        <div className="rounded-xl border bg-primary/5 border-primary/20 p-5 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Mail className="h-4 w-4 text-primary" />
            Scholarships Available
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Full and partial scholarships are available for Hatteras community youth. No child
            will be turned away for inability to pay. Contact us to learn more.
          </p>
          <Button asChild variant="outline" size="sm"><Link href="/contact">Contact Us</Link></Button>
        </div>

        <div className="text-center space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">Ready to book a charter or event?</p>
          <Button asChild><Link href="/trips?category=charter">View Charter Options</Link></Button>
        </div>

      </div>
    </div>
  );
}
