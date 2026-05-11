import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Anchor } from "lucide-react";
import { Link } from "wouter";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm your SailHatteras Guide 🌊 I can answer questions about our programs, pricing, and availability — or walk you through booking. What can I help you with today?",
};

// ─── Markdown-lite renderer ────────────────────────────────────────────────
// Handles **bold**, [text](/trips/slug) links, bare /trips/slug paths,
// and newlines. Everything else is plain text.
function renderContent(text: string): React.ReactNode[] {
  const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\(\/trips\/[\w-]+\)|\/trips\/[\w-]+|\n)/g;
  const parts = text.split(TOKEN);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const mdLink = part.match(/^\[([^\]]+)\]\((\/trips\/[\w-]+)\)$/);
    if (mdLink) {
      return (
        <Link
          key={i}
          href={mdLink[2]}
          className="font-semibold underline text-secondary hover:text-secondary/80 transition-colors"
        >
          {mdLink[1]}
        </Link>
      );
    }
    if (/^\/trips\/[\w-]+$/.test(part)) {
      return (
        <Link
          key={i}
          href={part}
          className="font-semibold underline text-secondary hover:text-secondary/80 transition-colors"
        >
          View trip →
        </Link>
      );
    }
    if (part === "\n") return <br key={i} />;
    return <span key={i}>{part}</span>;
  });
}

// ─── Single message bubble ─────────────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        }`}
      >
        {renderContent(msg.content)}
        {msg.streaming && (
          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-current opacity-60 animate-pulse rounded-sm align-middle" />
        )}
      </div>
    </div>
  );
}

// ─── Quick-reply chips shown after the welcome message ────────────────────
const CHIPS = [
  "What programs do you offer?",
  "How do I book a sunset sail?",
  "Do you have kids programs?",
  "What are your prices?",
];

// ─── Main widget ──────────────────────────────────────────────────────────
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hasUserSent, setHasUserSent] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      setHasUserSent(true);
      setInput("");

      const userMsg: Message = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setBusy(true);

      // Placeholder for streaming response
      const assistantPlaceholder: Message = {
        role: "assistant",
        content: "",
        streaming: true,
      };
      setMessages((prev) => [...prev, assistantPlaceholder]);

      try {
        const history = [...messages, userMsg].map(({ role, content }) => ({
          role,
          content,
        }));

        const response = await fetch("/api/sh/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const raw = decoder.decode(value, { stream: true });
          for (const line of raw.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            try {
              const parsed = JSON.parse(line.slice(6)) as {
                content?: string;
                done?: boolean;
                error?: string;
              };
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.content) {
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next[next.length - 1];
                  next[next.length - 1] = {
                    ...last,
                    content: last.content + parsed.content,
                  };
                  return next;
                });
              }
            } catch {
              // ignore malformed SSE frames
            }
          }
        }

        // Mark streaming done
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], streaming: false };
          return next;
        });
      } catch {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content:
              "Sorry, I'm having trouble right now. Please try again or call us at (252) 489-8193.",
            streaming: false,
          };
          return next;
        });
      } finally {
        setBusy(false);
      }
    },
    [busy, messages],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Chat panel */}
      {open && (
        <div
          className="pointer-events-auto w-[340px] sm:w-[380px] rounded-2xl shadow-2xl border border-border bg-background flex flex-col overflow-hidden"
          style={{ height: 520 }}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary-foreground/20 rounded-full p-1.5">
                <Anchor className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">SailHatteras Guide</p>
                <p className="text-[11px] text-primary-foreground/70">
                  Booking assistant · Usually instant
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors p-1"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
            {messages.map((msg, i) => (
              <Bubble key={i} msg={msg} />
            ))}

            {/* Quick-reply chips — show only before user has typed */}
            {!hasUserSent && (
              <div className="flex flex-wrap gap-2 pt-2">
                {CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    disabled={busy}
                    className="text-xs bg-primary/8 border border-primary/20 text-primary rounded-full px-3 py-1.5 hover:bg-primary/15 transition-colors disabled:opacity-50"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-border px-3 py-3 flex gap-2 shrink-0 bg-background">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={busy}
              placeholder="Ask about trips, dates, pricing…"
              className="flex-1 text-sm bg-muted rounded-xl px-3.5 py-2 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground disabled:opacity-50"
              aria-label="Chat message"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || busy}
              className="shrink-0 h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Launcher bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        aria-label={open ? "Close chat" : "Chat with us"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
