import { Link } from "wouter";
import phbwIcon from "@/assets/images/phillips-boatworks-icon.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container px-4 md:px-8 py-12 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-primary">
              <img src={phbwIcon} alt="Phillips Boatworks" className="h-8 w-8 rounded-sm object-cover" />
              PamliEcoConnect
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              The future of waterborne transport. Silent, fast, and airborne above the water's surface. Aerospace precision meets maritime craft.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/team" className="hover:text-primary transition-colors">Team</Link></li>
              <li><Link href="/press" className="hover:text-primary transition-colors">Press</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Products</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/buyers" className="hover:text-primary transition-colors">Passenger Boats</Link></li>
              <li><Link href="/buyers" className="hover:text-primary transition-colors">Military & Enforcement</Link></li>
              <li><Link href="/buyers" className="hover:text-primary transition-colors">Recreational</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Portals</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/investors" className="hover:text-primary transition-colors">Investor Relations</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PamliEcoConnect. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            <span className="flex items-center gap-1.5 text-muted-foreground/60">
              <img src={phbwIcon} alt="" className="h-4 w-4 rounded-sm object-cover opacity-60" />
              Phillips Boatworks
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
