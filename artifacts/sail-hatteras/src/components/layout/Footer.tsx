import { Link } from "wouter";
import { Anchor, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Anchor className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              <span className="font-serif text-xl font-bold tracking-tight">
                Sail Hatteras
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Family-owned and operated. Experience the steady winds and warm waters of the Pamlico Sound from the best deck in town.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Sailing</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link href="/trips?category=experiences" className="hover:text-white transition-colors">Experiences</Link>
              </li>
              <li>
                <Link href="/trips?category=learn" className="hover:text-white transition-colors">Learn to Sail</Link>
              </li>
              <li>
                <Link href="/trips?category=rentals" className="hover:text-white transition-colors">Rentals</Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-white transition-colors text-white font-medium">Book Now</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">About the Captains</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Find Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Hatteras Village<br />
                  Outer Banks, NC
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(252) 555-SAIL</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <span>captain@sailhatteras.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Sail Hatteras. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary-foreground/80">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground/80">Terms of Service</a>
            <Link href="/admin" className="hover:text-primary-foreground/80">Captain's Log</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
