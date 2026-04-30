import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { 
  useGetAdminDashboard, 
  useListInvestors, 
  useApproveInvestor, 
  useDenyInvestor,
  getGetAdminDashboardQueryKey,
  getListInvestorsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const isAdmin = !!user && user.role === "admin";

  const { data: dashboard, isLoading: dashboardLoading, refetch: refetchDashboard } = useGetAdminDashboard({
    query: { enabled: isAdmin, queryKey: getGetAdminDashboardQueryKey() }
  });

  const { data: pendingInvestors, isLoading: investorsLoading, refetch: refetchInvestors } = useListInvestors(
    { status: "pending" },
    { query: { enabled: isAdmin, queryKey: getListInvestorsQueryKey({ status: "pending" }) } }
  );

  const approveMutation = useApproveInvestor();
  const denyMutation = useDenyInvestor();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/login");
      } else if (user.role !== "admin") {
        setLocation("/");
      }
    }
  }, [user, authLoading, setLocation]);

  const handleApprove = (id: number) => {
    approveMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Investor approved" });
        refetchInvestors();
        refetchDashboard();
      },
      onError: (err) => toast({ title: "Error", description: (err.data as { error?: string })?.error || err.message, variant: "destructive" })
    });
  };

  const handleDeny = (id: number) => {
    denyMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Investor denied" });
        refetchInvestors();
        refetchDashboard();
      },
      onError: (err) => toast({ title: "Error", description: (err.data as { error?: string })?.error || err.message, variant: "destructive" })
    });
  };

  if (authLoading || !user || user.role !== "admin") return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Investors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboardLoading ? "-" : dashboard?.investorStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{dashboardLoading ? "-" : dashboard?.investorStats.pending}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Waitlist Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboardLoading ? "-" : dashboard?.totalWaitlist}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Contact Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboardLoading ? "-" : dashboard?.totalContacts}</div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Pending Investor Applications</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground bg-accent/50 uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Phone</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investorsLoading ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
                    ) : pendingInvestors && pendingInvestors.length > 0 ? (
                      pendingInvestors.map((inv) => (
                        <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{inv.userName}</td>
                          <td className="px-6 py-4">{inv.userEmail}</td>
                          <td className="px-6 py-4">{inv.userPhone}</td>
                          <td className="px-6 py-4 text-muted-foreground">{format(new Date(inv.createdAt), "MMM d, yyyy")}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleDeny(inv.id)}
                                disabled={denyMutation.isPending || approveMutation.isPending}
                                data-testid={`btn-deny-${inv.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-1" /> Deny
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => handleApprove(inv.id)}
                                disabled={denyMutation.isPending || approveMutation.isPending}
                                data-testid={`btn-approve-${inv.id}`}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No pending applications.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

        </div>
      </main>
    </div>
  );
}
