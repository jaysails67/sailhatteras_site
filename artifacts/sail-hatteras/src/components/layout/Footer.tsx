import { Link } from "wouter";
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from "lucide-react";
import logo from "/logo.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <img src={logo} alt="Hatteras Community Sailing — SailHatteras.org" className="h-14 w-auto brightness-0 invert" />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Our mission: to inspire a passion for lifelong seamanship and the environment — in every member of the Outer Banks community.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://facebook.com/sailhatteras" className="text-primary-foreground/70 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/sailhatteras" className="text-primary-foreground/70 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Programs</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/trips?category=experiences" className="hover:text-white transition-colors">Community Experiences</Link></li>
              <li><Link href="/trips?category=learn" className="hover:text-white transition-colors">Learn to Sail</Link></li>
              <li><Link href="/trips?category=rentals" className="hover:text-white transition-colors">Fleet Rentals</Link></li>
              <li><Link href="/trips" className="hover:text-white transition-colors text-white font-medium">All Programs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Organization</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Staff Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Find Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>48962 NC-12, Buxton, NC 27920<br />Office: 40039 NC-12, Avon, NC 27915</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+12524898193" className="hover:text-white transition-colors">(252) 489-8193</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:info@sailhatteras.org" className="hover:text-white transition-colors">info@sailhatteras.org</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
            <p>© {new Date().getFullYear()} Hatteras Community Sailing. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <Heart className="h-3 w-3 fill-current text-primary-foreground/40" />
              501(c)3 Tax-Exempt Nonprofit — EIN: 85-2684924
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary-foreground/80">Privacy Policy</Link>
            <Link href="/about" className="hover:text-primary-foreground/80">Our Mission</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
