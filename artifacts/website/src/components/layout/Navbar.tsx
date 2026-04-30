import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Ship, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/buyers", label: "Boats" },
    { href: "/reservations", label: "Reservations" },
    { href: "/press", label: "Press" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 mr-6 font-display font-bold text-xl tracking-tight text-primary">
          <Ship className="h-6 w-6" />
          PamliEcoConnect
        </Link>
        <div className="hidden md:flex flex-1 items-center justify-between">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${
                  location === link.href ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href={user.role === 'admin' ? "/admin" : "/investors/portal"} className="text-sm font-medium text-foreground/60 hover:text-primary">
                  Dashboard
                </Link>
                <Button variant="ghost" onClick={() => logout()}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-foreground/60 hover:text-primary">
                  Login
                </Link>
                <Link href="/investors" className="text-sm font-medium">
                  <Button variant="default" className="font-semibold">Investors</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <button
          className="ml-auto md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background p-4">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${
                  location === link.href ? "text-foreground" : "text-foreground/60"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={user.role === 'admin' ? "/admin" : "/investors/portal"} className="text-foreground/60 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <button className="text-left text-foreground/60 hover:text-primary" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-foreground/60 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/investors" className="text-foreground/60 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  Investors
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
