import { Link, useLocation } from "wouter";
import { Menu, X, Anchor } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/trips?category=experiences", label: "Experiences" },
    { href: "/trips?category=learn", label: "Learn to Sail" },
    { href: "/trips?category=rentals", label: "Rentals" },
    { href: "/contact", label: "Contact" },
  ];

  const isHome = location === "/";
  const transparent = isHome && !isScrolled && !isMobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        transparent
          ? "bg-transparent border-transparent text-white"
          : "bg-background/95 backdrop-blur-md border-border text-foreground"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Anchor className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          <span className="font-serif text-xl font-bold tracking-tight">
            Sail Hatteras
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href.split("?")[0]
                  ? "text-primary"
                  : transparent
                  ? "text-white/90 hover:text-white"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant={transparent ? "secondary" : "default"} size="sm" className="ml-4">
            <Link href="/trips">Book a Sail</Link>
          </Button>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-4 text-foreground shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium py-2 border-b border-border/50"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-2 w-full" onClick={() => setIsMobileMenuOpen(false)}>
            <Link href="/trips">Book a Sail</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
