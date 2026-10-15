import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Download, Plus, Loader2, Users, Award, Search } from "lucide-react";
import { trackName } from "@/components/diploma";

export type Company = {
  id: number;
  name: string;
  orgNumber: string | null;
  contactName: string | null;
  contactEmail: string | null;
  seats: number;
  validUntil: string | null;
  invoiceStatus: string;
  notes: string | null;
  userCount: number;
  certifiedCount: number;
};

const INVOICE_LABELS: Record<string, string> = {
  pending: "Ej fakturerad",
  invoiced: "Fakturerad",
  paid: "Betald",
  overdue: "Förfallen",
  cancelled: "Avbruten",
};
const selectClass = "h-9 rounded-md border border-input bg-background px-2 text-sm";

function CreateCompanyForm() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", orgNumber: "", contactName: "", contactEmail: "", seats: "10", validUntil: "", invoiceStatus: "pending" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const mutation = useMutation({
    mutationFn: async () => (await apiRequest("POST", "/api/admin/companies", { ...f, seats: parseInt(f.seats) || 0, validUntil: f.validUntil || null })).json(),
    onSuccess: () => {
      toast({ title: "Företag skapat" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setOpen(false);
      setF({ name: "", orgNumber: "", contactName: "", contactEmail: "", seats: "10", validUntil: "", invoiceStatus: "pending" });
    },
    onError: (e: Error) => toast({ title: "Fel", description: e.message, variant: "destructive" }),
  });

  if (!open) return <Button onClick={() => setOpen(true)} data-testid="admin-create-company-btn"><Plus className="h-4 w-4 mr-2" />Lägg till företag</Button>;

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Nytt företag</CardTitle></CardHeader>
      <CardContent>
        <form className="grid sm:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>
          <div className="space-y-2"><Label>Företagsnamn</Label><Input value={f.name} onChange={set("name")} required /></div>
          <div className="space-y-2"><Label>Org.nr</Label><Input value={f.orgNumber} onChange={set("orgNumber")} /></div>
          <div className="space-y-2"><Label>Kontaktperson</Label><Input value={f.contactName} onChange={set("contactName")} /></div>
          <div className="space-y-2"><Label>Kontakt e-post</Label><Input type="email" value={f.contactEmail} onChange={set("contactEmail")} /></div>
          <div className="space-y-2"><Label>Antal platser (0 = obegränsat)</Label><Input type="number" min="0" value={f.seats} onChange={set("seats")} /></div>
          <div className="space-y-2"><Label>Licens giltig till</Label><Input type="date" value={f.validUntil} onChange={set("validUntil")} /></div>
          <div className="space-y-2"><Label>Fakturastatus</Label>
            <select className={selectClass + " w-full"} value={f.invoiceStatus} onChange={set("invoiceStatus")}>
              {Object.entries(INVOICE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Skapa</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Avbryt</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function CompaniesPanel({ companies, onShowUsers }: { companies: Company[]; onShowUsers: (id: number) => void }) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const update = useMutation({
    mutationFn: async ({ id, ...body }: { id: number } & Record<string, unknown>) => apiRequest("PATCH", `/api/admin/companies/${id}`, body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/companies"] }); toast({ title: "Företag uppdaterat" }); },
    onError: (e: Error) => toast({ title: "Fel", description: e.message, variant: "destructive" }),
  });
  const q = search.trim().toLowerCase();
  const list = companies.filter((c) => !q || [c.name, c.orgNumber, c.contactName, c.contactEmail].some((v) => v?.toLowerCase().includes(q)));

  return (
    <div className="space-y-6">
      <CreateCompanyForm />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Företag ({list.length})</CardTitle>
          <div className="relative pt-2 max-w-sm">
            <Search className="absolute left-2 top-4.5 h-4 w-4 text-muted-foreground" style={{ top: "1.1rem" }} />
            <Input className="pl-8" placeholder="Sök företag…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? <p className="text-muted-foreground text-center py-8">Inga företag ännu. Skapa ett och koppla en företagskod till det.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3">Företag</th><th className="pb-3">Platser</th><th className="pb-3">Diplom</th><th className="pb-3">Giltig till</th><th className="pb-3">Faktura</th><th className="pb-3"></th>
                </tr></thead>
                <tbody>
                  {list.map((c) => {
                    const expired = c.validUntil && new Date(c.validUntil + "T23:59:59") < new Date();
                    return (
                      <tr key={c.id} className="border-b last:border-0 align-top">
                        <td className="py-3">
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{[c.orgNumber, c.contactName, c.contactEmail].filter(Boolean).join(" · ")}</div>
                        </td>
                        <td className="py-3">
                          <span className={c.seats > 0 && c.userCount >= c.seats ? "text-destructive font-medium" : ""}>{c.userCount}</span>
                          {" / "}
                          <input
                            type="number" min={0} defaultValue={c.seats}
                            className="w-16 h-7 rounded border border-input bg-background px-1"
                            onBlur={(e) => { const v = parseInt(e.target.value) || 0; if (v !== c.seats) update.mutate({ id: c.id, seats: v }); }}
                          />
                        </td>
                        <td className="py-3">{c.certifiedCount}</td>
                        <td className="py-3">
                          <input
                            type="date" defaultValue={c.validUntil ?? ""}
                            className={`h-7 rounded border border-input bg-background px-1 ${expired ? "text-destructive" : ""}`}
                            onBlur={(e) => { if ((e.target.value || null) !== c.validUntil) update.mutate({ id: c.id, validUntil: e.target.value || "" }); }}
                          />
                        </td>
                        <td className="py-3">
                          <select className={selectClass} value={c.invoiceStatus} onChange={(e) => update.mutate({ id: c.id, invoiceStatus: e.target.value })}>
                            {Object.entries(INVOICE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                        </td>
                        <td className="py-3 text-right whitespace-nowrap space-x-2">
                          <Button size="sm" variant="outline" onClick={() => onShowUsers(c.id)}><Users className="h-4 w-4 mr-1" />Användare</Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/api/admin/companies/${c.id}/export.csv`} download data-testid={`export-company-${c.id}`}><Download className="h-4 w-4 mr-1" />CSV</a>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type AdminCert = {
  id: number; userId: number; certificateId: string; examScore: number; totalQuestions: number; track: number;
  issuedAt: string; expiresAt: string | null; isRenewal: boolean; userName: string; userEmail: string; companyId: number | null; companyName: string | null;
};

export function CertificatesPanel({ companies }: { companies: Company[] }) {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("all");
  const [status, setStatus] = useState("all");
  const { data: certs = [], isLoading } = useQuery<AdminCert[]>({ queryKey: ["/api/admin/certificates"] });
  const q = search.trim().toLowerCase();
  const now = new Date();
  const list = certs.filter((c) => {
    if (q && ![c.userName, c.userEmail, c.companyName, c.certificateId].some((v) => v?.toLowerCase().includes(q))) return false;
    if (company !== "all" && String(c.companyId) !== company) return false;
    const expired = !!c.expiresAt && new Date(c.expiresAt) < now;
    if (status === "valid" && expired) return false;
    if (status === "expired" && !expired) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Utfärdade diplom ({list.length})</CardTitle>
        <div className="flex flex-wrap gap-2 pt-2">
          <Input className="max-w-xs" placeholder="Sök namn, e-post, ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className={selectClass} value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="all">Alla företag</option>
            {companies.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Alla</option><option value="valid">Giltiga</option><option value="expired">Utgångna</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <p className="text-muted-foreground">Laddar…</p> : list.length === 0 ? <p className="text-muted-foreground text-center py-8">Inga diplom.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="pb-3">Namn</th><th className="pb-3">Företag</th><th className="pb-3">Spår</th><th className="pb-3">Resultat</th><th className="pb-3">Utfärdat</th><th className="pb-3">Giltigt till</th>
              </tr></thead>
              <tbody>
                {list.map((c) => {
                  const expired = !!c.expiresAt && new Date(c.expiresAt) < now;
                  return (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-2">
                        <button className="text-primary hover:underline text-left" onClick={() => navigate(`/admin/users/${c.userId}`)}>{c.userName}</button>
                        <div className="text-xs text-muted-foreground">{c.userEmail}</div>
                      </td>
                      <td className="py-2">{c.companyName ?? "—"}</td>
                      <td className="py-2">{trackName(c.track)}</td>
                      <td className="py-2">{Math.round((c.examScore / c.totalQuestions) * 100)}%</td>
                      <td className="py-2">{new Date(c.issuedAt).toLocaleDateString("sv-SE")}</td>
                      <td className="py-2">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("sv-SE") : "—"} {expired && <Badge variant="destructive" className="ml-1">Utgånget</Badge>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
