import { useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { domainData } from "@/data/domains";
import { allQuestions } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, HelpCircle, ArrowRight, Target, Award, GraduationCap, Shield, Users } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: progress = [] } = useQuery<any[]>({
    queryKey: ["/api/progress"],
  });

  const { data: quizResults = [] } = useQuery<any[]>({
    queryKey: ["/api/quiz-results"],
  });

  const { data: certificates = [] } = useQuery<any[]>({
    queryKey: ["/api/certificates"],
  });

  // Calculate progress
  const totalChapters = domainData.reduce((sum, d) => sum + d.chapters.length, 0);
  const completedChapters = progress.filter((p: any) => p.completed).length;
  const overallPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const domainProgress = domainData.map((domain) => {
    const domainChapterIds = domain.chapters.map((c) => c.id);
    const completed = progress.filter(
      (p: any) => p.completed && domainChapterIds.includes(p.chapterId)
    ).length;
    const total = domain.chapters.length;
    return {
      ...domain,
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const recentResults = [...quizResults]
    .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  const hasCertificate = certificates.length > 0;
  const track1Cert = certificates.find((c: any) => c.track === 1);
  const track2Cert = certificates.find((c: any) => c.track === 2);
  const bothCerts = !!track1Cert && !!track2Cert;

  // Exam readiness
  const examReadiness = useMemo(() => {
    const studyScore = overallPercent;
    const examResults = quizResults.filter((r: any) => r.totalQuestions >= 20);
    const avgExamScore = examResults.length > 0
      ? Math.round(examResults.reduce((sum: number, r: any) => sum + (r.correctAnswers / r.totalQuestions) * 100, 0) / examResults.length)
      : 0;
    const quizCount = quizResults.length;
    const quizScore = Math.min(100, quizCount * 20);

    const readiness = Math.round(studyScore * 0.3 + avgExamScore * 0.5 + quizScore * 0.2);
    return {
      overall: readiness,
      studyProgress: studyScore,
      avgExamScore,
      quizzesTaken: quizCount,
      isReady: readiness >= 70,
    };
  }, [overallPercent, quizResults]);

  const getDomainIcon = (id: number) => {
    if (id === 0) return <BookOpen className="h-5 w-5 text-emerald-500" />;
    if (id === 1) return <Shield className="h-5 w-5" style={{ color: "#00D4FF" }} />;
    return <Users className="h-5 w-5" style={{ color: "#0066FF" }} />;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl">
      {/* Welcome */}
      <div className="rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-6 -mx-2">
        <h1 className="text-2xl font-bold" data-testid="dashboard-welcome">
          Välkommen, {user?.name || "Deltagare"}
        </h1>
        <p className="text-muted-foreground">Följ din NIS2-utbildning</p>
      </div>

      {/* Certificate Status */}
      <Card className={bothCerts ? "border-green-500/30 bg-green-500/5" : "border-primary/20"}>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-4">
            <Award className={`h-10 w-10 shrink-0 ${bothCerts ? "text-green-500" : "text-muted-foreground"}`} />
            <div className="flex-1">
              {bothCerts ? (
                <>
                  <p className="font-semibold text-green-600 dark:text-green-400">Alla certifikat utfärdade!</p>
                  <p className="text-sm text-muted-foreground">Du har godkänts i båda spåren.</p>
                </>
              ) : hasCertificate ? (
                <>
                  <p className="font-semibold text-green-600 dark:text-green-400">Certifikat utfärdat</p>
                  <p className="text-sm text-muted-foreground">Slutför fler slutprov för att få alla certifikat.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Certifikat</p>
                  <p className="text-sm text-muted-foreground">
                    Slutför slutprov med minst 70% för att få dina certifikat.
                  </p>
                </>
              )}
            </div>
            {hasCertificate && (
              <Button variant="default" size="sm" onClick={() => navigate("/certificate")}>
                Visa certifikat
              </Button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${track1Cert ? "border-green-500/30 bg-green-500/5" : "border-border"}`}>
              <Shield className="h-5 w-5 shrink-0" style={{ color: "#00D4FF" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Ledning & Styrelse</p>
                {track1Cert ? (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Godkänt — {Math.round((track1Cert.examScore / track1Cert.totalQuestions) * 100)}%
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Ej avklarat</p>
                )}
              </div>
              {!track1Cert && (
                <Button variant="outline" size="sm" onClick={() => navigate("/exam")}>Slutprov</Button>
              )}
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${track2Cert ? "border-green-500/30 bg-green-500/5" : "border-border"}`}>
              <Users className="h-5 w-5 shrink-0" style={{ color: "#0066FF" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">All Personal</p>
                {track2Cert ? (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Godkänt — {Math.round((track2Cert.examScore / track2Cert.totalQuestions) * 100)}%
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Ej avklarat</p>
                )}
              </div>
              {!track2Cert && (
                <Button variant="outline" size="sm" onClick={() => navigate("/exam")}>Slutprov</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exam Readiness */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5 text-primary" />
            Utbildningsstatus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center shrink-0">
              <div className="relative inline-flex items-center justify-center w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke={examReadiness.isReady ? "#16a34a" : "hsl(var(--primary))"} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${examReadiness.overall * 2.136} 213.6`} />
                </svg>
                <span className={`absolute text-lg font-bold ${examReadiness.isReady ? "text-green-600" : "text-primary"}`}>
                  {examReadiness.overall}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {examReadiness.isReady ? "Redo för slutprov" : "Fortsätt studera"}
              </p>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Kursmaterial</span>
                <span className="font-medium">{examReadiness.studyProgress}%</span>
              </div>
              <Progress value={examReadiness.studyProgress} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span>Snittresultat quiz</span>
                <span className="font-medium">{examReadiness.avgExamScore > 0 ? `${examReadiness.avgExamScore}%` : "N/A"}</span>
              </div>
              <Progress value={examReadiness.avgExamScore} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span>Quiz genomförda</span>
                <span className="font-medium">{examReadiness.quizzesTaken}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Statusen baseras på: kursmaterial (30%), quizresultat (50%) och antal övningar (20%).
            Mål: 70% för att vara redo.
          </p>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total kursframgång</span>
            <span className="text-2xl font-bold text-primary" data-testid="dashboard-overall-progress">{overallPercent}%</span>
          </div>
          <Progress value={overallPercent} className="h-3" data-testid="dashboard-progress-bar" />
          <p className="mt-2 text-xs text-muted-foreground">
            {completedChapters} av {totalChapters} avsnitt avklarade
          </p>
        </CardContent>
      </Card>

      {/* Domain Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Framgång per del</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {domainProgress.map((d) => (
            <Card key={d.id} data-testid={`domain-card-${d.id}`} className="border-l-4" style={{ borderLeftColor: d.color }}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getDomainIcon(d.id)}
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{d.shortTitle}</h3>
                    </div>
                  </div>
                  <span className="text-lg font-bold" style={{ color: d.color }}>{d.percent}%</span>
                </div>
                <Progress value={d.percent} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {d.completed}/{d.total} avsnitt — {d.questions}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button data-testid="dashboard-continue-study" onClick={() => navigate("/study")}>
          <BookOpen className="mr-2 h-4 w-4" />
          Fortsätt studera
        </Button>
        <Button variant="outline" data-testid="dashboard-take-quiz" onClick={() => navigate("/quiz")}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Gör quiz
        </Button>
        <Button variant="outline" data-testid="dashboard-take-exam" onClick={() => navigate("/exam")}>
          <GraduationCap className="mr-2 h-4 w-4" />
          Slutprov
        </Button>
      </div>

      {/* Recent Quiz Results */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Senaste quizresultat</h2>
        {recentResults.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>Inga quizresultat ännu.</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => navigate("/quiz")}
                data-testid="dashboard-first-quiz"
              >
                Gör ditt första quiz <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentResults.map((result: any, i: number) => (
              <Card key={result.id || i}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {result.correctAnswers}/{result.totalQuestions} rätt
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(result.completedAt).toLocaleDateString("sv-SE")}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-primary">{allQuestions.length}</p>
            <p className="text-xs text-muted-foreground">Quizfrågor</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalChapters}</p>
            <p className="text-xs text-muted-foreground">Avsnitt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-primary">3</p>
            <p className="text-xs text-muted-foreground">Kursdelar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-primary">70%</p>
            <p className="text-xs text-muted-foreground">Godkäntgräns</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
