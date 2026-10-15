import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Award, Printer, Shield, BookOpen, HelpCircle, Building2 } from "lucide-react";
import { Diploma, trackName, type DiplomaData } from "@/components/diploma";
import { domainData } from "@/data/domains";

type Detail = {
  user: {
    id: number; email: string; name: string; hasPaid: boolean; isAdmin: boolean; companyCode: string | null;
    companyId: number | null; canRenew: boolean; isDisabled: boolean; lastLoginAt: string | null; createdAt: string | null;
  };
  company: { id: number; name: string; validUntil: string | null; invoiceStatus: string } | null;
  quizResults: { id: number; domains: number[]; totalQuestions: number; correctAnswers: number; completedAt: string }[];
  certificates: (DiplomaData & { id: number })[];
  progress: { chapterId: string; completed: boolean }[];
};

const dt = (d: string | null) => (d ? new Date(d).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }) : "—");

export default function AdminUserPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [printing, setPrinting] = useState<DiplomaData | null>(null);

  const { data, isLoading, error } = useQuery<Detail>({ queryKey: [`/api/admin/users/${id}`] });

  const toggleDisabled = useMutation({
    mutationFn: async (isDisabled: boolean) => apiRequest("PATCH", `/api/admin/users/${id}`, { isDisabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/users/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Konto uppdaterat" });
    },
    onError: (e: Error) => toast({ title: "Fel", description: e.message, variant: "destructive" }),
  });

  const printDiploma = (cert: DiplomaData) => {
    setPrinting(cert);
    // wait for render + QR code generation
    setTimeout(() => window.print(), 400);
  };

  if (isLoading) {
    return <div className="p-6 max-w-5xl mx-auto space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-64" /></div>;
  }
  if (error || !data) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <p className="text-destructive">Kunde inte hämta användaren.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin")}>Tillbaka</Button>
      </div>
    );
  }

  const { user, company, quizResults, certificates, progress } = data;
  const completedChapters = progress.filter((p) => p.completed).length;
  const domainTitle = (ids: number[]) => ids.map((d) => domainData.find((x) => x.id === d)?.shortTitle ?? d).join(", ");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Användare #{user.id}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Admin
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardContent className="pt-6 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {user.hasPaid ? <Badge className="bg-emerald-600">Licens</Badge> : <Badge variant="secondary">Ingen licens</Badge>}
                {user.isAdmin && <Badge>Admin</Badge>}
                {user.isDisabled && <Badge variant="destructive">Inaktiverad</Badge>}
                {user.canRenew && <Badge variant="outline">Förnyelse aktiverad</Badge>}
              </div>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> {company?.name ?? "Inget företag"} {user.companyCode && <Badge variant="outline" className="font-mono">{user.companyCode}</Badge>}</p>
              <p><span className="text-muted-foreground">Registrerad:</span> {dt(user.createdAt)}</p>
              <p><span className="text-muted-foreground">Senast inloggad:</span> {dt(user.lastLoginAt)}</p>
              <p><span className="text-muted-foreground">Avklarade avsnitt:</span> {completedChapters}</p>
              {!user.isAdmin && (
                <Button size="sm" variant="outline" className="mt-2" disabled={toggleDisabled.isPending} onClick={() => toggleDisabled.mutate(!user.isDisabled)}>
                  {user.isDisabled ? "Aktivera konto" : "Inaktivera konto"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Diplom ({certificates.length})</CardTitle></CardHeader>
          <CardContent>
            {certificates.length === 0 ? <p className="text-muted-foreground text-sm">Inga diplom utfärdade.</p> : (
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2">Spår</th><th className="pb-2">Resultat</th><th className="pb-2">Utfärdat</th><th className="pb-2">Giltigt till</th><th className="pb-2"></th>
                </tr></thead>
                <tbody>
                  {certificates.map((c) => {
                    const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                    return (
                      <tr key={c.id} className="border-b last:border-0">
                        <td className="py-2">{trackName(c.track)}{c.isRenewal ? " (förnyelse)" : ""}</td>
                        <td className="py-2">{Math.round((c.examScore / c.totalQuestions) * 100)}% ({c.examScore}/{c.totalQuestions})</td>
                        <td className="py-2">{dt(c.issuedAt)}</td>
                        <td className="py-2">{dt(c.expiresAt)} {expired && <Badge variant="destructive" className="ml-1">Utgånget</Badge>}</td>
                        <td className="py-2 text-right">
                          <Button size="sm" variant="outline" onClick={() => printDiploma(c)} data-testid={`print-diploma-${c.id}`}>
                            <Printer className="h-4 w-4 mr-1" /> Skriv ut A4
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" /> Resultat ({quizResults.length})</CardTitle></CardHeader>
          <CardContent>
            {quizResults.length === 0 ? <p className="text-muted-foreground text-sm">Inga quiz eller prov genomförda.</p> : (
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2">Datum</th><th className="pb-2">Delar</th><th className="pb-2">Rätt</th><th className="pb-2">Resultat</th>
                </tr></thead>
                <tbody>
                  {quizResults.map((r) => {
                    const pct = r.totalQuestions ? Math.round((r.correctAnswers / r.totalQuestions) * 100) : 0;
                    return (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="py-2">{dt(r.completedAt)}</td>
                        <td className="py-2">{domainTitle(Array.isArray(r.domains) ? r.domains : [])}</td>
                        <td className="py-2">{r.correctAnswers}/{r.totalQuestions}</td>
                        <td className="py-2"><span className={pct >= 70 ? "text-emerald-600 font-medium" : "text-destructive"}>{pct}%</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Studieframsteg</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {progress.length === 0 ? <p className="text-muted-foreground text-sm">Inga avsnitt påbörjade.</p> :
              progress.map((p) => <Badge key={p.chapterId} variant={p.completed ? "default" : "secondary"}>{p.chapterId}</Badge>)}
          </CardContent>
        </Card>

        {printing && (
          <Card>
            <CardHeader><CardTitle className="text-base">Förhandsvisning</CardTitle></CardHeader>
            <CardContent className="overflow-auto">
              <div style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "148.5mm", height: "105mm" }}>
                <Diploma cert={printing} name={user.name} companyName={company?.name} />
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {printing && (
        <div className="diploma-print-only">
          <Diploma cert={printing} name={user.name} companyName={company?.name} />
        </div>
      )}
    </div>
  );
}
