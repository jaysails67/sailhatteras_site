import { Link, useLocation } from "wouter";
import { Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import logo from "/logo.png";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/trips?category=experiences", label: "Experiences" },
    { href: "/trips?category=learn", label: "Learn to Sail" },
    { href: "/trips?category=rentals", label: "Rentals" },
    { href: "/about", label: "Our Mission" },
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
        <Link href="/" className="flex items-center gap-2.5 group" data-testid="link-logo">
          <img src={logo} alt="Hatteras Community Sailing — SailHatteras.org" className="h-14 w-auto" />
          <span className={`text-[10px] font-medium tracking-wider uppercase flex items-center gap-1 hidden sm:flex ${transparent ? "text-white/70" : "text-muted-foreground"}`}>
            <Heart className="h-2.5 w-2.5 fill-current" />
            501(c)3 Nonprofit
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
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
          <Button asChild variant={transparent ? "secondary" : "default"} size="sm" className="ml-2" data-testid="button-book-sail">
            <Link href="/trips">Book a Program</Link>
          </Button>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

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
            <Link href="/trips">Book a Community Program</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
