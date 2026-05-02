import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { 
  useGetAdminDashboard, 
  useListInvestors, 
  useApproveInvestor, 
  useDenyInvestor,
  useListContactSubmissions,
  useListWaitlistEntries,
  useListPosts,
  getListPostsQueryKey,
  getGetAdminDashboardQueryKey,
  getListInvestorsQueryKey,
  getListContactSubmissionsQueryKey,
  getListWaitlistEntriesQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Users, Mail, List, LayoutDashboard, KeyRound, Bot, RefreshCw, AlertTriangle, Upload, Newspaper, Trash2, ExternalLink, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useUpload } from "@workspace/object-storage-web";

type Tab = "overview" | "investors" | "contacts" | "waitlist" | "press";

interface DenyDialogState {
  investorId: number;
  investorName: string;
  reason: string;
}

interface ResetPasswordDialogState {
  investorId: number;
  investorName: string;
  investorEmail: string;
  newPassword: string;
  isResetting: boolean;
}

interface EditEmailDialogState {
  investorId: number;
  investorName: string;
  currentEmail: string;
  newEmail: string;
  isSaving: boolean;
}

interface DeleteDialogState {
  investorId: number;
  investorName: string;
  investorEmail: string;
  isDeleting: boolean;
}

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isAdmin = !!user && user.role === "admin";
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [denyDialog, setDenyDialog] = useState<DenyDialogState | null>(null);
  const [resetPwDialog, setResetPwDialog] = useState<ResetPasswordDialogState | null>(null);
  const [editEmailDialog, setEditEmailDialog] = useState<EditEmailDialogState | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState | null>(null);

  type TelegramStatus = {
    registered: { url: string; pending_update_count: number; last_error_message?: string; last_error_date?: number } | null;
    currentServerUrl: string | null;
    isCorrect: boolean;
  };
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatus | null>(null);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [reregisterLoading, setReregisterLoading] = useState(false);

  const fetchTelegramStatus = async () => {
    setTelegramLoading(true);
    try {
      const origin = encodeURIComponent(window.location.origin);
      const res = await fetch(`/api/admin/telegram/status?siteOrigin=${origin}`, { credentials: "include" });
      const data = await res.json() as TelegramStatus;
      setTelegramStatus(data);
    } catch {
      toast({ title: "Error", description: "Could not fetch Telegram webhook status.", variant: "destructive" });
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleReregisterWebhook = async () => {
    setReregisterLoading(true);
    try {
      const res = await fetch("/api/admin/telegram/reregister", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteOrigin: window.location.origin }),
      });
      const data = await res.json() as { ok?: boolean; webhookUrl?: string; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to re-register webhook");
      toast({ title: "Webhook registered", description: `Now pointing to: ${data.webhookUrl}` });
      await fetchTelegramStatus();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setReregisterLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchTelegramStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const { data: dashboard, isLoading: dashboardLoading, refetch: refetchDashboard } = useGetAdminDashboard({
    query: { enabled: isAdmin, queryKey: getGetAdminDashboardQueryKey() }
  });

  const { data: allInvestors, isLoading: investorsLoading, refetch: refetchInvestors } = useListInvestors(
    {},
    { query: { enabled: isAdmin, queryKey: getListInvestorsQueryKey({}) } }
  );

  const { data: contacts, isLoading: contactsLoading } = useListContactSubmissions({
    query: { enabled: isAdmin, queryKey: getListContactSubmissionsQueryKey() }
  });

  const { data: waitlist, isLoading: waitlistLoading } = useListWaitlistEntries({
    query: { enabled: isAdmin, queryKey: getListWaitlistEntriesQueryKey() }
  });

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
        toast({ title: "Investor approved", description: "Access to the portal has been granted." });
        refetchInvestors();
        refetchDashboard();
      },
      onError: (err) => toast({ title: "Error", description: (err.data as { error?: string })?.error || err.message, variant: "destructive" })
    });
  };

  const openDenyDialog = (id: number, name: string) => {
    setDenyDialog({ investorId: id, investorName: name, reason: "" });
  };

  const openResetPwDialog = (id: number, name: string, email: string) => {
    setResetPwDialog({ investorId: id, investorName: name, investorEmail: email, newPassword: "", isResetting: false });
  };

  const confirmResetPassword = async () => {
    if (!resetPwDialog || resetPwDialog.isResetting) return;
    if (resetPwDialog.newPassword.length < 8) {
      toast({ title: "Password too short", description: "Must be at least 8 characters.", variant: "destructive" });
      return;
    }
    setResetPwDialog({ ...resetPwDialog, isResetting: true });
    try {
      const res = await fetch(`/api/admin/investors/${resetPwDialog.investorId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword: resetPwDialog.newPassword }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      toast({ title: "Password reset", description: data.message });
      setResetPwDialog(null);
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
      setResetPwDialog((s) => s ? { ...s, isResetting: false } : null);
    }
  };

  const confirmDeny = () => {
    if (!denyDialog) return;
    denyMutation.mutate(
      { id: denyDialog.investorId, data: { reason: denyDialog.reason.trim() || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Investor denied", description: denyDialog.reason.trim() ? "Reason recorded and visible to the applicant." : "No reason provided." });
          setDenyDialog(null);
          refetchInvestors();
          refetchDashboard();
        },
        onError: (err) => toast({ title: "Error", description: (err.data as { error?: string })?.error || err.message, variant: "destructive" })
      }
    );
  };

  const openEditEmailDialog = (id: number, name: string, email: string) => {
    setEditEmailDialog({ investorId: id, investorName: name, currentEmail: email, newEmail: email, isSaving: false });
  };

  const confirmEditEmail = async () => {
    if (!editEmailDialog || editEmailDialog.isSaving) return;
    const email = editEmailDialog.newEmail.trim();
    if (!email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setEditEmailDialog({ ...editEmailDialog, isSaving: true });
    try {
      const res = await fetch(`/api/admin/investors/${editEmailDialog.investorId}/email`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      toast({ title: "Email updated", description: data.message });
      setEditEmailDialog(null);
      refetchInvestors();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
      setEditEmailDialog((s) => s ? { ...s, isSaving: false } : null);
    }
  };

  const openDeleteDialog = (id: number, name: string, email: string) => {
    setDeleteDialog({ investorId: id, investorName: name, investorEmail: email, isDeleting: false });
  };

  const confirmDelete = async () => {
    if (!deleteDialog || deleteDialog.isDeleting) return;
    setDeleteDialog({ ...deleteDialog, isDeleting: true });
    try {
      const res = await fetch(`/api/admin/investors/${deleteDialog.investorId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      toast({ title: "Account deleted", description: data.message });
      setDeleteDialog(null);
      refetchInvestors();
      refetchDashboard();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
      setDeleteDialog((s) => s ? { ...s, isDeleting: false } : null);
    }
  };

  // Press tab state — must be before early return (Rules of Hooks)
  const [pressForm, setPressForm] = useState({
    title: "",
    excerpt: "",
    type: "video" as "press_release" | "video" | "presentation",
    mediaUrl: "",
    useUploadedFile: true,
  });
  const [pressSubmitting, setPressSubmitting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const { data: allPosts, isLoading: postsLoading, refetch: refetchPosts } = useListPosts(
    {},
    { query: { enabled: isAdmin, queryKey: getListPostsQueryKey({}) } }
  );
  const { uploadFile, isUploading, progress } = useUpload({
    onError: (err: Error) => toast({ title: "Upload failed", description: err.message, variant: "destructive" }),
  });

  if (authLoading || !user || user.role !== "admin") return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadFile(file);
    if (result) {
      const servingUrl = `/api/storage${result.objectPath}`;
      setPressForm(f => ({ ...f, mediaUrl: servingUrl }));
      toast({ title: "File uploaded", description: `Stored at ${servingUrl}` });
    }
    e.target.value = "";
  };

  const handleCreatePressEntry = async () => {
    if (!pressForm.title.trim() || !pressForm.excerpt.trim()) {
      toast({ title: "Missing fields", description: "Title and excerpt are required.", variant: "destructive" });
      return;
    }
    setPressSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pressForm.title,
          excerpt: pressForm.excerpt,
          content: pressForm.excerpt,
          type: pressForm.type,
          mediaUrl: pressForm.mediaUrl || null,
          featured: false,
        }),
      });
      if (!res.ok) throw new Error((await res.json() as { error?: string }).error ?? "Failed");
      toast({ title: "Press entry created", description: `"${pressForm.title}" is now live.` });
      setPressForm({ title: "", excerpt: "", type: "video", mediaUrl: "", useUploadedFile: true });
      refetchPosts();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setPressSubmitting(false);
    }
  };

  const handleDeletePost = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingPostId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
      toast({ title: "Deleted", description: `"${title}" has been removed.` });
      refetchPosts();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setDeletingPostId(null);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "investors", label: "Investors", icon: <Users className="h-4 w-4" /> },
    { id: "contacts", label: "Contact Messages", icon: <Mail className="h-4 w-4" /> },
    { id: "waitlist", label: "Waitlist", icon: <List className="h-4 w-4" /> },
    { id: "press", label: "Press & Media", icon: <Newspaper className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
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

            {/* Telegram Bot Status */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bot className="h-5 w-5 text-primary" /> Telegram Bot Webhook
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={fetchTelegramStatus} disabled={telegramLoading}>
                    <RefreshCw className={`h-4 w-4 mr-1 ${telegramLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {telegramLoading && !telegramStatus ? (
                  <p className="text-muted-foreground">Checking webhook status…</p>
                ) : telegramStatus ? (
                  <>
                    <div className="flex items-start gap-2">
                      {telegramStatus.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <span className="font-medium text-foreground">
                          {telegramStatus.isCorrect ? "Webhook is correctly registered" : "Webhook URL mismatch — registration needed"}
                        </span>
                        {telegramStatus.registered && (
                          <p className="text-muted-foreground font-mono text-xs mt-0.5 break-all">
                            Registered: {telegramStatus.registered.url}
                          </p>
                        )}
                        {telegramStatus.currentServerUrl && !telegramStatus.isCorrect && (
                          <p className="text-muted-foreground font-mono text-xs mt-0.5 break-all">
                            This server: {telegramStatus.currentServerUrl}
                          </p>
                        )}
                      </div>
                    </div>

                    {telegramStatus.registered && (
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Pending updates: <span className={telegramStatus.registered.pending_update_count > 0 ? "text-yellow-400 font-semibold" : ""}>{telegramStatus.registered.pending_update_count}</span></span>
                        {telegramStatus.registered.last_error_message && (
                          <span className="text-destructive">Last error: {telegramStatus.registered.last_error_message}</span>
                        )}
                      </div>
                    )}

                    <Button
                      size="sm"
                      onClick={handleReregisterWebhook}
                      disabled={reregisterLoading}
                      className={telegramStatus.isCorrect ? "variant-outline" : ""}
                    >
                      <Bot className="h-4 w-4 mr-1" />
                      {reregisterLoading ? "Registering…" : telegramStatus.isCorrect ? "Re-register Webhook" : "Fix Webhook Now"}
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground">Could not load webhook status.</p>
                )}
              </CardContent>
            </Card>
            </div>
          )}

          {/* All Investors */}
          {activeTab === "investors" && (
            <Card>
              <CardHeader>
                <CardTitle>All Investor Applications</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground bg-accent/50 uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">ID</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Phone</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investorsLoading ? (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
                    ) : allInvestors && allInvestors.length > 0 ? (
                      allInvestors.map((inv) => (
                        <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 text-muted-foreground font-mono text-xs">#{inv.id}</td>
                          <td className="px-6 py-4 font-medium text-foreground">{inv.userName}</td>
                          <td className="px-6 py-4">{inv.userEmail}</td>
                          <td className="px-6 py-4">{inv.userPhone}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              inv.status === "approved"
                                ? "bg-green-500/15 text-green-400"
                                : inv.status === "denied"
                                ? "bg-destructive/15 text-destructive"
                                : "bg-primary/15 text-primary"
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{format(new Date(inv.createdAt), "MMM d, yyyy")}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-muted-foreground/40 text-muted-foreground hover:text-foreground"
                                onClick={() => openEditEmailDialog(inv.id, inv.userName, inv.userEmail)}
                                title="Change this investor's email address"
                              >
                                <Pencil className="h-4 w-4 mr-1" /> Email
                              </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-muted-foreground/40 text-muted-foreground hover:text-foreground"
                                onClick={() => openResetPwDialog(inv.id, inv.userName, inv.userEmail)}
                                title="Set a new temporary password for this investor"
                              >
                                <KeyRound className="h-4 w-4 mr-1" /> Reset PW
                              </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive/60 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => openDeleteDialog(inv.id, inv.userName, inv.userEmail)}
                                title="Permanently delete this account"
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                              {inv.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => openDenyDialog(inv.id, inv.userName)}
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
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No investor applications yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Contact Submissions */}
          {activeTab === "contacts" && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Form Submissions</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground bg-accent/50 uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Message</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactsLoading ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
                    ) : contacts && contacts.length > 0 ? (
                      contacts.map((c) => (
                        <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{c.name}</td>
                          <td className="px-6 py-4">{c.email}</td>
                          <td className="px-6 py-4 max-w-xs truncate text-muted-foreground">{c.message}</td>
                          <td className="px-6 py-4 text-muted-foreground">{format(new Date(c.createdAt), "MMM d, yyyy")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No contact submissions yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Waitlist */}
          {activeTab === "waitlist" && (
            <Card>
              <CardHeader>
                <CardTitle>Reservation Waitlist</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground bg-accent/50 uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Phone</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlistLoading ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
                    ) : waitlist && waitlist.length > 0 ? (
                      waitlist.map((w) => (
                        <tr key={w.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{w.name}</td>
                          <td className="px-6 py-4">{w.email}</td>
                          <td className="px-6 py-4">{w.phone}</td>
                          <td className="px-6 py-4 text-muted-foreground">{format(new Date(w.createdAt), "MMM d, yyyy")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No waitlist entries yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── PRESS & MEDIA TAB ──────────────────────────────────── */}
          {activeTab === "press" && (
            <div className="space-y-8">
              {/* Create new press entry */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-primary" /> Create New Press Entry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Type selector */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Content Type</label>
                    <div className="flex flex-wrap gap-3">
                      {([
                        { value: "video", label: "Video Presentation" },
                        { value: "presentation", label: "Audio Blog" },
                        { value: "press_release", label: "Written Research" },
                      ] as const).map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPressForm(f => ({ ...f, type: value, mediaUrl: "", useUploadedFile: true }))}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            pressForm.type === value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Title <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border bg-background text-foreground text-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                      placeholder="e.g. Phillips Boatworks Unveils the PB-1 Foiler"
                      value={pressForm.title}
                      onChange={(e) => setPressForm(f => ({ ...f, title: e.target.value }))}
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Excerpt / Summary <span className="text-destructive">*</span></label>
                    <textarea
                      className="w-full rounded-lg border border-border bg-background text-foreground text-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                      rows={3}
                      placeholder="Brief description shown on the press listing page…"
                      value={pressForm.excerpt}
                      onChange={(e) => setPressForm(f => ({ ...f, excerpt: e.target.value }))}
                    />
                  </div>

                  {/* Media URL section */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Media {pressForm.type === "press_release" ? "(optional)" : ""}
                    </label>

                    {/* Toggle: upload vs external link */}
                    <div className="flex gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => setPressForm(f => ({ ...f, useUploadedFile: true }))}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          pressForm.useUploadedFile
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setPressForm(f => ({ ...f, useUploadedFile: false }))}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          !pressForm.useUploadedFile
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        External URL
                      </button>
                    </div>

                    {pressForm.useUploadedFile ? (
                      <div className="space-y-3">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-muted/40 transition-colors">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="h-6 w-6" />
                            <span className="text-sm">
                              {isUploading ? `Uploading… ${progress}%` : (
                                pressForm.type === "press_release"
                                  ? "Click to upload PDF or document"
                                  : pressForm.type === "presentation"
                                  ? "Click to upload audio file"
                                  : "Click to upload video file"
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground/70">
                              {pressForm.type === "press_release"
                                ? "PDF, DOC, DOCX supported"
                                : pressForm.type === "presentation"
                                ? "MP3, M4A, WAV, OGG, AAC supported"
                                : "MP4, WEBM, MOV supported"}
                            </span>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept={
                              pressForm.type === "press_release"
                                ? ".pdf,.doc,.docx,application/pdf,application/msword"
                                : pressForm.type === "presentation"
                                ? "audio/*"
                                : "video/*"
                            }
                            disabled={isUploading}
                            onChange={handleFileUpload}
                          />
                        </label>
                        {pressForm.mediaUrl && (
                          <div className="flex items-center gap-2 text-xs text-green-400 bg-green-950/30 border border-green-800/40 rounded-lg px-3 py-2">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            <span className="font-mono break-all">{pressForm.mediaUrl}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="url"
                        className="w-full rounded-lg border border-border bg-background text-foreground text-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                        placeholder={
                          pressForm.type === "video"
                            ? "https://www.youtube.com/embed/… or HeyGen share URL"
                            : pressForm.type === "presentation"
                            ? "https://notebooklm.google.com/… or audio share link"
                            : "https://drive.google.com/… or PDF link"
                        }
                        value={pressForm.mediaUrl}
                        onChange={(e) => setPressForm(f => ({ ...f, mediaUrl: e.target.value }))}
                      />
                    )}
                  </div>

                  <div className="pt-1">
                    <Button
                      onClick={handleCreatePressEntry}
                      disabled={pressSubmitting || isUploading || !pressForm.title.trim() || !pressForm.excerpt.trim()}
                    >
                      {pressSubmitting ? "Creating…" : "Publish Press Entry"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing press entries */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">All Press Entries</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="px-6 py-3 text-left font-medium">Title</th>
                        <th className="px-6 py-3 text-left font-medium">Type</th>
                        <th className="px-6 py-3 text-left font-medium">Published</th>
                        <th className="px-6 py-3 text-left font-medium">Media</th>
                        <th className="px-6 py-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {postsLoading ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading…</td></tr>
                      ) : !allPosts?.length ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No press entries yet.</td></tr>
                      ) : (
                        allPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-foreground max-w-xs">
                              <a
                                href={`/press/${post.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors line-clamp-2"
                              >
                                {post.title}
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground capitalize">
                                {post.type.replace("_", " ")}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                              {format(new Date(post.publishedAt), "MMM d, yyyy")}
                            </td>
                            <td className="px-6 py-4">
                              {post.mediaUrl ? (
                                <a
                                  href={post.mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3" /> Link
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeletePost(post.id, post.title)}
                                disabled={deletingPostId === post.id}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                                title="Delete entry"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

        </div>
      </main>

      {/* Edit Email Dialog */}
      {editEmailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Pencil className="h-5 w-5 text-primary" /> Change Email Address
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update the login email for{" "}
                <span className="font-medium text-foreground">{editEmailDialog.investorName}</span>.
                They will need to use the new address to log in.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">New Email Address</label>
              <input
                type="email"
                className="w-full rounded-lg border border-border bg-background text-foreground text-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                placeholder="investor@example.com"
                value={editEmailDialog.newEmail}
                onChange={(e) => setEditEmailDialog({ ...editEmailDialog, newEmail: e.target.value })}
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setEditEmailDialog(null)} disabled={editEmailDialog.isSaving}>Cancel</Button>
              <Button
                onClick={confirmEditEmail}
                disabled={!editEmailDialog.newEmail.trim() || editEmailDialog.newEmail === editEmailDialog.currentEmail || editEmailDialog.isSaving}
              >
                {editEmailDialog.isSaving ? "Saving..." : "Save Email"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" /> Delete Account
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                You are about to permanently delete the account for{" "}
                <span className="font-medium text-foreground">{deleteDialog.investorName}</span>{" "}
                (<span className="font-mono text-xs">{deleteDialog.investorEmail}</span>).
                This cannot be undone. They will need to re-register if they want access in the future.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteDialog(null)} disabled={deleteDialog.isDeleting}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteDialog.isDeleting}>
                {deleteDialog.isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Dialog */}
      {resetPwDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" /> Reset Password
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Set a new temporary password for{" "}
                <span className="font-medium text-foreground">{resetPwDialog.investorName}</span>{" "}
                (<span className="font-mono text-xs">{resetPwDialog.investorEmail}</span>).
                Share it with them securely so they can log back in.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Temporary Password <span className="text-muted-foreground font-normal">(min 8 characters)</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-background text-foreground text-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground font-mono"
                placeholder="e.g. Pamlico2024!"
                value={resetPwDialog.newPassword}
                onChange={(e) => setResetPwDialog({ ...resetPwDialog, newPassword: e.target.value })}
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setResetPwDialog(null)}
                disabled={resetPwDialog.isResetting}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmResetPassword}
                disabled={resetPwDialog.newPassword.length < 8 || resetPwDialog.isResetting}
              >
                {resetPwDialog.isResetting ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deny Reason Dialog */}
      {denyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Deny Application</h2>
              <p className="text-sm text-muted-foreground mt-1">
                You are denying <span className="font-medium text-foreground">{denyDialog.investorName}</span>. Provide a reason — this message will be shown to the applicant so they know what action to take.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason for denial <span className="text-muted-foreground font-normal">(required)</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-border bg-background text-foreground text-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                rows={4}
                placeholder="e.g. We could not verify your identity. Please re-register with a valid corporate email address and phone number."
                value={denyDialog.reason}
                onChange={(e) => setDenyDialog({ ...denyDialog, reason: e.target.value })}
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDenyDialog(null)}
                disabled={denyMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeny}
                disabled={!denyDialog.reason.trim() || denyMutation.isPending}
              >
                {denyMutation.isPending ? "Denying..." : "Confirm Deny"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
