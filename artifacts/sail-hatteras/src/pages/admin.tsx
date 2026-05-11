import { useState } from "react";
import { Link } from "wouter";
import { Anchor, BarChart3, Calendar, Users, DollarSign, ArrowRight, Lock, ListTodo, GitPullRequest, CheckCircle2, XCircle, Loader2, RefreshCw, Github, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useListShAdminBookings, useGetShAdminDashboard } from "@workspace/api-client-react";
import { useSeo } from "@/hooks/use-seo";

const ADMIN_KEY = "hcs-admin-2026";

type DeployState = "idle" | "running" | "success" | "error";

function DeployPanel() {
  const [state, setState] = useState<DeployState>("idle");
  const [output, setOutput] = useState("");
  const [confirm, setConfirm] = useState(false);

  const handleDeploy = async () => {
    setConfirm(false);
    setState("running");
    setOutput("");
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/sh/admin/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY },
      });
      const data = await res.json();
      setOutput(data.output ?? "");
      setState(data.success ? "success" : "error");
    } catch (err: any) {
      setOutput(`Network error: ${err.message}`);
      setState("error");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">Deploy Latest Code</span>
          {state === "running" && (
            <span className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
              <Loader2 className="h-3 w-3 animate-spin" /> Building…
            </span>
          )}
          {state === "success" && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle2 className="h-3 w-3" /> Success — server restarting
            </span>
          )}
          {state === "error" && (
            <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <XCircle className="h-3 w-3" /> Deploy failed
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {state !== "idle" && state !== "running" && (
            <Button variant="ghost" size="sm" onClick={() => { setState("idle"); setOutput(""); setConfirm(false); }}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
          )}
          {!confirm && state === "idle" && (
            <Button size="sm" variant="outline" onClick={() => setConfirm(true)}>
              <GitPullRequest className="h-3.5 w-3.5 mr-1.5" /> Pull & Deploy
            </Button>
          )}
          {confirm && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Pull from GitHub and rebuild?</span>
              <Button size="sm" variant="destructive" onClick={handleDeploy}>Yes, deploy</Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
      {output && (
        <div className="px-6 py-4 bg-zinc-950">
          <pre className="text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/70 mt-0.5">{sub}</div>}
    </div>
  );
}

function AdminDashboard() {
  const { data: dashboard } = useGetShAdminDashboard();
  const { data: bookings } = useListShAdminBookings({});

  const upcoming = (dashboard?.upcomingBookings ?? []).slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Anchor className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">Hatteras Community Sailing — Staff Portal</span>
        </div>
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
      </div>

      <DeployPanel />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Calendar} label="Total Bookings" value={dashboard?.totalBookings ?? "—"} sub="All time" />
        <StatCard icon={Users} label="Confirmed" value={dashboard?.confirmedBookings ?? "—"} sub="Active reservations" />
        <StatCard icon={BarChart3} label="Pending" value={dashboard?.pendingBookings ?? "—"} sub="Awaiting confirmation" />
        <StatCard
          icon={DollarSign}
          label="Revenue This Month"
          value={dashboard?.revenueThisMonth != null ? `$${(dashboard.revenueThisMonth / 100).toFixed(0)}` : "—"}
          sub="Program fees collected"
        />
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Upcoming Programs</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/bookings">
              View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
        {upcoming.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted-foreground text-sm">No upcoming bookings</div>
        ) : (
          <div className="divide-y divide-border">
            {upcoming.map((b: any) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4 text-sm">
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{b.customerName}</div>
                  <div className="text-muted-foreground truncate">{b.customerEmail}</div>
                </div>
                <div className="text-muted-foreground shrink-0">{b.bookingDate}</div>
                <div className="text-muted-foreground shrink-0">{b.passengers} pax</div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                  b.status === "confirmed" ? "bg-green-100 text-green-800" :
                  b.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/bookings" className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group">
          <Calendar className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <div className="font-semibold">Manage Bookings</div>
          <div className="text-sm text-muted-foreground">View and update all reservations</div>
        </Link>
        <a href="/sail-hatteras/trips" className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group" target="_blank" rel="noopener noreferrer">
          <Anchor className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <div className="font-semibold">View Public Site</div>
          <div className="text-sm text-muted-foreground">See the programs page</div>
        </a>
        <Link href="/admin/contacts" className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group">
          <Users className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <div className="font-semibold">Contact Inquiries</div>
          <div className="text-sm text-muted-foreground">View all contact form submissions</div>
        </Link>
        <Link href="/admin/roadmap" className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group">
          <ListTodo className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <div className="font-semibold">Dev Roadmap</div>
          <div className="text-sm text-muted-foreground">Feature backlog & architecture notes</div>
        </Link>
      </div>

      {/* Developer Resources */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="https://github.com/jaysails67/sailhatteras_site/blob/main/.agents/skills/github-push/SKILL.md"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors group flex items-start gap-4"
        >
          <BookOpen className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-zinc-200 text-sm">GitHub Push Skill</div>
            <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">Step-by-step guide for pushing Replit → GitHub from any session. Includes credential workaround & troubleshooting.</div>
          </div>
        </a>
        <a
          href="https://github.com/jaysails67/sailhatteras_site"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors group flex items-start gap-4"
        >
          <Github className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-zinc-200 text-sm">GitHub Repository</div>
            <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">jaysails67/sailhatteras_site — view commits, branches, and source history.</div>
          </div>
        </a>
      </div>
    </div>
  );
}

export default function Admin() {
  useSeo({ title: "Admin — Hatteras Community Sailing", description: "Admin dashboard.", noIndex: true });
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem("hcs-admin") === ADMIN_KEY; } catch { return false; }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === ADMIN_KEY) {
      try { localStorage.setItem("hcs-admin", ADMIN_KEY); } catch {}
      setAuthed(true);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-6 bg-muted/30">
        <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <span className="font-serif text-xl font-bold">Staff Login</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Hatteras Community Sailing — Staff Portal</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-key">Access Key</Label>
              <Input
                id="admin-key"
                type="password"
                data-testid="input-admin-key"
                placeholder="Enter access key"
                value={key}
                onChange={e => setKey(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" data-testid="button-admin-login">Sign In</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <AdminDashboard />
      </div>
    </div>
  );
}
