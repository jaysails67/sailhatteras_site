import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

import Home from "@/pages/home";
import Trips from "@/pages/trips";
import TripDetail from "@/pages/trip-detail";
import BookingConfirmation from "@/pages/booking-confirmation";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Payments from "@/pages/payments";
import Membership from "@/pages/membership";
import Support from "@/pages/support";
import Admin from "@/pages/admin";
import AdminBookings from "@/pages/admin-bookings";
import AdminContacts from "@/pages/admin-contacts";
import AdminRoadmap from "@/pages/admin-roadmap";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/trips" component={Trips} />
          <Route path="/trips/:slug" component={TripDetail} />
          <Route path="/booking-confirmation" component={BookingConfirmation} />
          <Route path="/contact" component={Contact} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/payments" component={Payments} />
          <Route path="/membership" component={Membership} />
          <Route path="/support" component={Support} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/bookings" component={AdminBookings} />
          <Route path="/admin/contacts" component={AdminContacts} />
          <Route path="/admin/roadmap" component={AdminRoadmap} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
