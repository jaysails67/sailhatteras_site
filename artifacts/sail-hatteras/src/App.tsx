import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
// Placeholders until we create them
const Trips = () => <div className="pt-20">Trips</div>;
const TripDetail = () => <div className="pt-20">Trip Detail</div>;
const Contact = () => <div className="pt-20">Contact</div>;
const BookingConfirmation = () => <div className="pt-20">Booking Conf</div>;
const Admin = () => <div className="pt-20">Admin</div>;
const AdminBookings = () => <div className="pt-20">Admin Bookings</div>;


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
          <Route path="/admin" component={Admin} />
          <Route path="/admin/bookings" component={AdminBookings} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
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
