import { Link, useLocation } from "wouter";
import { Menu, X, Heart, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "/logo.png";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/trips?category=experiences", label: "Experiences" },
    { href: "/trips?category=learn", label: "Learn to Sail" },
    { href: "/trips?category=rentals", label: "Rentals" },
    { href: "/about", label: "Our Mission" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top white bar — logo + social + book button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-[88px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
            <img
              src={logo}
              alt="Hatteras Community Sailing — SailHatteras.org"
              className="h-[70px] w-auto"
            />
            <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground flex items-center gap-1 hidden sm:flex">
              <Heart className="h-2.5 w-2.5 fill-current text-primary" />
              501(c)3 Nonprofit
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-muted-foreground">
              <a
                href="https://facebook.com/sailhatteras"
                className="hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/sailhatteras"
                className="hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <Button
              asChild
              size="default"
              className="hidden md:inline-flex bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold tracking-wide"
              data-testid="button-book-sail"
            >
              <Link href="/trips">Book a Program</Link>
            </Button>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dark navy nav bar */}
      <nav className="bg-primary text-primary-foreground hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-secondary ${
                location === link.href.split("?")[0]
                  ? "text-secondary"
                  : "text-primary-foreground/90"
              }`}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile expanded menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border px-6 py-4 flex flex-col gap-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-medium py-3 border-b border-border/50 ${
                location === link.href.split("?")[0] ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-3 w-full" onClick={() => setIsMobileMenuOpen(false)}>
            <Link href="/trips">Book a Community Program</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
