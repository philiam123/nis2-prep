import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Users, DollarSign, BookOpen, HelpCircle, ArrowLeft,
  CheckCircle, XCircle, Shield, TrendingUp, Plus, Building2,
  Trash2, Loader2, Copy, Check, RefreshCw, Award, Download, Search
} from "lucide-react";
import { CompaniesPanel, CertificatesPanel, type Company } from "@/components/admin-companies";

type AdminUser = {
  id: number;
  email: string;
  name: string;
  hasPaid: boolean;
  isAdmin: boolean;
  companyCode: string | null;
  companyId: number | null;
  companyName: string | null;
  canRenew: boolean;
  isDisabled: boolean;
  lastLoginAt: string | null;
  certificateCount: number;
  quizCount: number;
  chaptersCompleted: number;
  bestScore: number | null;
  createdAt: string | null;
};

type AdminStats = {
  totalUsers: number;
  paidUsers: number;
  totalRevenue: number;
  totalQuizzes: number;
  avgScore: number;
  totalChaptersCompleted: number;
  totalCompanies: number;
  totalCertificates: number;
  activeLast30Days: number;
};

type CompanyCode = {
  id: number;
  code: string;
  companyName: string;
  companyId: number | null;
  maxUses: number;
  usedCount: number;
  pricePerUser: number;
  isActive: boolean;
  createdAt: string;
};

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: users = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: companyCodes = [], isLoading: codesLoading } = useQuery<CompanyCode[]>({
    queryKey: ["/api/admin/company-codes"],
  });

  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/admin/companies"],
  });
  const [tab, setTab] = useState("users");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  const loading = usersLoading || statsLoading || codesLoading;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const nonAdminUsers = users.filter(u => !u.isAdmin);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">NIS2 Utbildning Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              App
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logga ut
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalUsers ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Totala användare</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.paidUsers ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Med licens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalCompanies ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Företag</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalQuizzes ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Quiz genomförda</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalCertificates ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Utfärdade diplom</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-cyan-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.activeLast30Days ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Aktiva senaste 30 d</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalChaptersCompleted ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Kapitel avklarade (alla)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.avgScore ?? 0}%</p>
                  <p className="text-sm text-muted-foreground">Snittresultat quiz</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Users / Company Codes */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Användare
            </TabsTrigger>
            <TabsTrigger value="companies" className="gap-2">
              <Building2 className="h-4 w-4" />
              Företag
            </TabsTrigger>
            <TabsTrigger value="certificates" className="gap-2">
              <Award className="h-4 w-4" />
              Diplom
            </TabsTrigger>
            <TabsTrigger value="company-codes" className="gap-2">
              <Building2 className="h-4 w-4" />
              Företagskoder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <CreateUserForm />
            <UsersTable users={nonAdminUsers} companies={companies} companyFilter={companyFilter} setCompanyFilter={setCompanyFilter} />
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <CompaniesPanel
              companies={companies}
              onShowUsers={(id) => { setCompanyFilter(String(id)); setTab("users"); }}
            />
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <CertificatesPanel companies={companies} />
          </TabsContent>

          <TabsContent value="company-codes" className="space-y-6">
            <CreateCompanyCodeForm />
            <CompanyCodesTable codes={companyCodes} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ── Create User Form ── */
function CreateUserForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasPaid, setHasPaid] = useState(false);
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/users", { name, email, password, hasPaid });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Användare skapad" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setName("");
      setEmail("");
      setPassword("");
      setHasPaid(false);
      setOpen(false);
    },
    onError: (err: Error) => {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    },
  });

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} data-testid="admin-create-user-btn">
        <Plus className="h-4 w-4 mr-2" />
        Skapa användare
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Skapa ny användare</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="admin-user-name">Namn</Label>
            <Input
              id="admin-user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anna Andersson"
              required
              data-testid="admin-user-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-user-email">E-post</Label>
            <Input
              id="admin-user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anna@foretag.se"
              required
              data-testid="admin-user-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-user-password">Lösenord</Label>
            <Input
              id="admin-user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minst 6 tecken"
              required
              minLength={6}
              data-testid="admin-user-password"
            />
          </div>
          <div className="flex items-end gap-4 pb-0.5">
            <div className="flex items-center gap-2">
              <Switch
                id="admin-user-paid"
                checked={hasPaid}
                onCheckedChange={setHasPaid}
                data-testid="admin-user-paid"
              />
              <Label htmlFor="admin-user-paid">Markera som betald</Label>
            </div>
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" disabled={mutation.isPending} data-testid="admin-user-submit">
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Skapa
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── Users Table ── */
function UsersTable({ users, companies, companyFilter, setCompanyFilter }: {
  users: AdminUser[];
  companies: Company[];
  companyFilter: string;
  setCompanyFilter: (v: string) => void;
}) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [certFilter, setCertFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = Date.now();
    return users.filter((u) => {
      if (q && ![u.name, u.email, u.companyCode, u.companyName].some((v) => v?.toLowerCase().includes(q))) return false;
      if (companyFilter === "none" && u.companyId) return false;
      if (companyFilter !== "all" && companyFilter !== "none" && String(u.companyId) !== companyFilter) return false;
      if (licenseFilter === "yes" && !u.hasPaid) return false;
      if (licenseFilter === "no" && u.hasPaid) return false;
      if (certFilter === "yes" && !u.certificateCount) return false;
      if (certFilter === "no" && u.certificateCount) return false;
      const last = u.lastLoginAt ? new Date(u.lastLoginAt).getTime() : 0;
      if (activityFilter === "30d" && (!last || now - last > 30 * 864e5)) return false;
      if (activityFilter === "inactive" && last && now - last <= 30 * 864e5) return false;
      if (activityFilter === "never" && last) return false;
      return true;
    });
  }, [users, search, companyFilter, licenseFilter, certFilter, activityFilter]);
  const selectClass = "h-9 rounded-md border border-input bg-background px-2 text-sm";

  const togglePayment = useMutation({
    mutationFn: async ({ id, hasPaid }: { id: number; hasPaid: boolean }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}/payment`, { hasPaid });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Licensstatus uppdaterad" });
    },
    onError: (err: Error) => {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    },
  });

  const toggleRenew = useMutation({
    mutationFn: async ({ id, canRenew }: { id: number; canRenew: boolean }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}/renew`, { canRenew });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Förnyelsestatus uppdaterad" });
    },
    onError: (err: Error) => {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Registrerade användare ({filtered.length}{filtered.length !== users.length ? ` av ${users.length}` : ""})
        </CardTitle>
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Sök namn, e-post, företag, kod…" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="admin-user-search" />
          </div>
          <select className={selectClass} value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} data-testid="filter-company">
            <option value="all">Alla företag</option>
            <option value="none">Inget företag</option>
            {companies.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
          <select className={selectClass} value={licenseFilter} onChange={(e) => setLicenseFilter(e.target.value)}>
            <option value="all">Licens: alla</option>
            <option value="yes">Har licens</option>
            <option value="no">Saknar licens</option>
          </select>
          <select className={selectClass} value={certFilter} onChange={(e) => setCertFilter(e.target.value)}>
            <option value="all">Diplom: alla</option>
            <option value="yes">Har diplom</option>
            <option value="no">Inget diplom</option>
          </select>
          <select className={selectClass} value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
            <option value="all">Aktivitet: alla</option>
            <option value="30d">Inloggad senaste 30 d</option>
            <option value="inactive">Inaktiv &gt; 30 d</option>
            <option value="never">Aldrig inloggad (sedan spårning)</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Inga användare registrerade ännu.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">ID</th>
                  <th className="pb-3 font-medium text-muted-foreground">Namn</th>
                  <th className="pb-3 font-medium text-muted-foreground">E-post</th>
                  <th className="pb-3 font-medium text-muted-foreground">Företag</th>
                  <th className="pb-3 font-medium text-muted-foreground">Licens</th>
                  <th className="pb-3 font-medium text-muted-foreground">Bästa</th>
                  <th className="pb-3 font-medium text-muted-foreground">Diplom</th>
                  <th className="pb-3 font-medium text-muted-foreground">Förnyelse</th>
                  <th className="pb-3 font-medium text-muted-foreground">Senast inloggad</th>
                  <th className="pb-3 font-medium text-muted-foreground">Registrerad</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className={`border-b last:border-0 ${u.isDisabled ? "opacity-50" : ""}`}>
                    <td className="py-3 text-muted-foreground">#{u.id}</td>
                    <td className="py-3 font-medium">
                      <button className="text-primary hover:underline text-left" onClick={() => navigate(`/admin/users/${u.id}`)} data-testid={`admin-user-link-${u.id}`}>
                        {u.name}
                      </button>
                    </td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">
                      {u.companyName ? <div>{u.companyName}</div> : null}
                      {u.companyCode ? (
                        <Badge variant="outline" className="font-mono text-xs">
                          {u.companyCode}
                        </Badge>
                      ) : !u.companyName ? (
                        <span className="text-muted-foreground">—</span>
                      ) : null}
                    </td>
                    <td className="py-3">
                      <button
                        className="cursor-pointer"
                        onClick={() => togglePayment.mutate({ id: u.id, hasPaid: !u.hasPaid })}
                        disabled={togglePayment.isPending}
                        data-testid={`toggle-payment-${u.id}`}
                      >
                        {u.hasPaid ? (
                          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Licens
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="hover:bg-destructive/20">
                            <XCircle className="h-3 w-3 mr-1" />
                            Ingen
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="py-3">{u.bestScore != null ? `${u.bestScore}%` : "—"}</td>
                    <td className="py-3">{u.certificateCount > 0 ? <Badge variant="outline"><Award className="h-3 w-3 mr-1" />{u.certificateCount}</Badge> : "—"}</td>
                    <td className="py-3">
                      <button
                        className="cursor-pointer"
                        onClick={() => toggleRenew.mutate({ id: u.id, canRenew: !u.canRenew })}
                        disabled={toggleRenew.isPending}
                        data-testid={`toggle-renew-${u.id}`}
                      >
                        {u.canRenew ? (
                          <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Aktiverad
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Ej aktiverad
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="py-3 text-muted-foreground whitespace-nowrap">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }) : "—"}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("sv-SE")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Create Company Code Form ── */
function CreateCompanyCodeForm() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [maxUses, setMaxUses] = useState("50");
  const [pricePerUser, setPricePerUser] = useState("1190");
  const [companyId, setCompanyId] = useState("");
  const { data: companies = [] } = useQuery<Company[]>({ queryKey: ["/api/admin/companies"] });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/company-codes", {
        code: code.toUpperCase(),
        companyName,
        maxUses: parseInt(maxUses) || 50,
        pricePerUser: (parseInt(pricePerUser) || 1190) * 100, // convert to öre
        companyId: companyId ? parseInt(companyId) : null,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Företagskod skapad" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/company-codes"] });
      setCode("");
      setCompanyName("");
      setMaxUses("50");
      setPricePerUser("1190");
      setOpen(false);
    },
    onError: (err: Error) => {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    },
  });

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} data-testid="admin-create-code-btn">
        <Plus className="h-4 w-4 mr-2" />
        Skapa företagskod
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Skapa ny företagskod</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="cc-code">Kod</Label>
            <Input
              id="cc-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="FORETAG2026"
              required
              data-testid="cc-code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-company">Företagsnamn</Label>
            <Input
              id="cc-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Företag AB"
              required={!companyId}
              data-testid="cc-company"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cc-companyid">Koppla till företag (licens/platser)</Label>
            <select
              id="cc-companyid"
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value);
                const c = companies.find((x) => String(x.id) === e.target.value);
                if (c && !companyName) setCompanyName(c.name);
              }}
            >
              <option value="">— Inget företag —</option>
              {companies.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-max">Max antal användare</Label>
            <Input
              id="cc-max"
              type="number"
              min="1"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              data-testid="cc-max"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-price">Pris per användare (kr)</Label>
            <Input
              id="cc-price"
              type="number"
              min="0"
              value={pricePerUser}
              onChange={(e) => setPricePerUser(e.target.value)}
              data-testid="cc-price"
            />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" disabled={mutation.isPending} data-testid="cc-submit">
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Skapa
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── Company Codes Table ── */
function CompanyCodesTable({ codes }: { codes: CompanyCode[] }) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/admin/company-codes/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/company-codes"] });
      toast({ title: "Kod uppdaterad" });
    },
    onError: (err: Error) => {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    },
  });

  const deleteCode = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/company-codes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/company-codes"] });
      toast({ title: "Kod borttagen" });
    },
    onError: (err: Error) => {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    },
  });

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Företagskoder ({codes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {codes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Inga företagskoder skapade ännu.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Kod</th>
                  <th className="pb-3 font-medium text-muted-foreground">Företag</th>
                  <th className="pb-3 font-medium text-muted-foreground">Användning</th>
                  <th className="pb-3 font-medium text-muted-foreground">Pris/st</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {codes.map(cc => (
                  <tr key={cc.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{cc.code}</span>
                        <button
                          onClick={() => handleCopy(cc.code, cc.id)}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid={`copy-code-${cc.id}`}
                        >
                          {copiedId === cc.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 font-medium">{cc.companyName}</td>
                    <td className="py-3">
                      <span className={cc.usedCount >= cc.maxUses ? "text-destructive font-medium" : ""}>
                        {cc.usedCount} / {cc.maxUses}
                      </span>
                    </td>
                    <td className="py-3">{Math.round(cc.pricePerUser / 100)} kr</td>
                    <td className="py-3">
                      <button
                        onClick={() => toggleActive.mutate({ id: cc.id, isActive: !cc.isActive })}
                        disabled={toggleActive.isPending}
                        data-testid={`toggle-active-${cc.id}`}
                      >
                        {cc.isActive ? (
                          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                            Aktiv
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Inaktiv
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Vill du ta bort denna företagskod?")) {
                            deleteCode.mutate(cc.id);
                          }
                        }}
                        className="text-destructive hover:text-destructive"
                        data-testid={`delete-code-${cc.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
