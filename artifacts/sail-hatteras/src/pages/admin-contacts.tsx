import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Anchor, Search, Mail, Phone, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  tripInterest: string | null;
  createdAt: string;
}

export default function AdminContacts() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const res = await fetch("/api/sh/admin/contacts");
      if (!res.ok) throw new Error("Failed to load contacts");
      return res.json();
    },
  });

  const filtered = (contacts ?? []).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q) ||
      (c.tripInterest ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Anchor className="h-4 w-4" />
              <span>Hatteras Community Sailing — Staff Portal</span>
            </div>
            <h1 className="font-serif text-3xl font-bold">Contact Inquiries</h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or message..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-64 mb-3" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-xl px-6 py-16 text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{search ? "No matching inquiries" : "No contact inquiries yet"}</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  className="w-full text-left px-5 py-4 hover:bg-muted/30 transition-colors"
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{c.name}</span>
                        {c.tripInterest && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {c.tripInterest}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <a
                            href={`mailto:${c.email}`}
                            className="hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {c.email}
                          </a>
                        </span>
                        {c.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {c.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {expanded !== c.id && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{c.message}</p>
                  )}
                </button>
                {expanded === c.id && (
                  <div className="px-5 pb-5 border-t border-border bg-muted/20">
                    <p className="text-sm text-foreground mt-4 whitespace-pre-wrap">{c.message}</p>
                    <div className="mt-4">
                      <a
                        href={`mailto:${c.email}?subject=Re: Your Hatteras Community Sailing Inquiry`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Reply to {c.name}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {!isLoading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-6">
            {filtered.length} inquiry{filtered.length !== 1 ? "ies" : "y"}
          </p>
        )}
      </div>
    </div>
  );
}
