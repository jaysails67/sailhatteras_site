import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Investors from "@/pages/investors/index";
import Nda from "@/pages/investors/nda";
import Pending from "@/pages/investors/pending";
import Denied from "@/pages/investors/denied";
import Portal from "@/pages/investors/portal";
import Login from "@/pages/login";
import Buyers from "@/pages/buyers";
import Reservations from "@/pages/reservations";
import Press from "@/pages/press";
import Contact from "@/pages/contact";
import Team from "@/pages/team";
import Admin from "@/pages/admin";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/investors" component={Investors} />
      <Route path="/investors/nda" component={Nda} />
      <Route path="/investors/pending" component={Pending} />
      <Route path="/investors/denied" component={Denied} />
      <Route path="/investors/portal" component={Portal} />
      <Route path="/login" component={Login} />
      <Route path="/buyers" component={Buyers} />
      <Route path="/reservations" component={Reservations} />
      <Route path="/press" component={Press} />
      <Route path="/contact" component={Contact} />
      <Route path="/team" component={Team} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
