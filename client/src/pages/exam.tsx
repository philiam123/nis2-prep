import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { domainData } from "@/data/domains";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GraduationCap, Clock, RotateCcw, Save, Award, Lock, CheckCircle2, Shield, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

type Screen = "pre-exam" | "question" | "results";

interface Question {
  index: number;
  domain: number;
  subtopic: string;
  question: string;
  options: string[];
}

interface Answer {
  questionIndex: number;
  selectedOption: number;
}

interface ExamResult {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  late: boolean;
  certificate: any | null;
  breakdown: { domain: number; correct: number; total: number }[];
}

interface TrackConfig {
  track: number; // 1 or 2 — matches DB track column
  domains: number[]; // primary domain IDs to pull questions from
  questionCount: number; // questions from primary domains
  bonusDomains?: number[]; // extra domains to pull bonus questions from
  bonusCount?: number; // how many bonus questions
  timeSeconds: number;
  title: string;
  shortTitle: string;
  color: string;
  description: string;
}

// Track 1 (Ledning) = gemensam (0) + ledning (1) + 5 frågor från personal (2)
// Track 2 (Personal) = gemensam (0) + personal (2)
const TRACK_CONFIGS: Record<number, TrackConfig> = {
  1: {
    track: 1,
    domains: [0, 1],
    questionCount: 15,
    bonusDomains: [2],
    bonusCount: 5,
    timeSeconds: 40 * 60,
    title: "Ledning & Styrelse",
    shortTitle: "Ledning & Styrelse",
    color: "#00D4FF",
    description: "Gemensam + Ledning + 5 frågor från Personal — 20 frågor, 40 min",
  },
  2: {
    track: 2,
    domains: [0, 2],
    questionCount: 25,
    timeSeconds: 50 * 60,
    title: "All Personal",
    shortTitle: "All Personal",
    color: "#0066FF",
    description: "Gemensam + Personal — 25 frågor, 50 min",
  },
};

export default function ExamPage() {
  const [, navigate] = useLocation();

  const [screen, setScreen] = useState<Screen>("pre-exam");
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saved, setSaved] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [examId, setExamId] = useState<string | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [startError, setStartError] = useState("");
  const submittingRef = useRef(false);

  // Anti-cheat: track if exam is active
  const [examActive, setExamActive] = useState(false);
  const examActiveRef = useRef(false);

  const { data: certificates = [] } = useQuery<any[]>({
    queryKey: ["/api/certificates"],
  });

  type Eligibility = { track: number; hasValidCert: boolean; needsRenewal: boolean; canRenew: boolean; canTakeExam: boolean };
  const { data: eligibility = [] } = useQuery<Eligibility[]>({
    queryKey: ["/api/exam/eligibility"],
  });

  const track1Cert = certificates.find((c: any) => c.track === 1);
  const track2Cert = certificates.find((c: any) => c.track === 2);
  const track1Elig = eligibility.find(e => e.track === 1);
  const track2Elig = eligibility.find(e => e.track === 2);

  // Determine if each track is locked (expired cert without renewal permission)
  const track1Locked = track1Elig?.needsRenewal && !track1Elig?.canRenew;
  const track2Locked = track2Elig?.needsRenewal && !track2Elig?.canRenew;

  // Timer
  useEffect(() => {
    if (screen !== "question" || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setScreen("results");
          setExamActive(false);
          examActiveRef.current = false;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, timeRemaining]);

  // Anti-cheat: prevent browser back/navigation during exam
  useEffect(() => {
    if (!examActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Du har ett pågående slutprov. Om du lämnar sidan förlorar du dina svar.";
      return e.returnValue;
    };

    const handlePopState = () => {
      if (examActiveRef.current) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [examActive]);

  // Anti-cheat: prevent right-click context menu during exam
  useEffect(() => {
    if (!examActive) return;
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [examActive]);

  const startExam = async (track: number) => {
    setStartError("");
    let data: { examId: string; timeSeconds: number; questions: Question[] };
    try {
      const res = await apiRequest("POST", "/api/exam/start", { track });
      data = await res.json();
    } catch (err: any) {
      setStartError(err.message || "Kunde inte starta provet");
      return;
    }
    setSelectedTrack(track);
    setExamId(data.examId);
    setResult(null);
    setSubmitError("");
    submittingRef.current = false;
    setQuestions(data.questions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setSaved(false);
    setAnswerLocked(false);
    setTimeRemaining(data.timeSeconds);
    setScreen("question");
    setExamActive(true);
    examActiveRef.current = true;
  };

  const advanceToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerLocked(false);
    } else {
      setScreen("results");
      setExamActive(false);
      examActiveRef.current = false;
    }
  }, [currentIndex, questions.length]);

  const handleConfirmAnswer = () => {
    if (selectedOption === null || answerLocked) return;
    setAnswers((prev) => [...prev, { questionIndex: currentIndex, selectedOption }]);
    setAnswerLocked(true);
    setTimeout(() => {
      advanceToNext();
    }, 300);
  };

  // Submit answers to the server for scoring when the exam ends (finished or timed out)
  const submitExam = useCallback(async () => {
    if (!examId || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitError("");
    const payload = questions.map((_, idx) => {
      const a = answers.find((x) => x.questionIndex === idx);
      return a ? a.selectedOption : null;
    });
    try {
      const res = await apiRequest("POST", "/api/exam/submit", { examId, answers: payload });
      setResult(await res.json());
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/exam/eligibility"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quiz-results"] });
    } catch (err: any) {
      submittingRef.current = false;
      setSubmitError(err.message || "Kunde inte lämna in provet");
    }
  }, [examId, questions, answers]);

  useEffect(() => {
    if (screen === "results" && !result && !submittingRef.current) {
      submitExam();
    }
  }, [screen, result, submitExam]);

  const correctCount = result?.correct ?? 0;
  const scorePercent = result?.percent ?? 0;
  const isPass = !!result?.passed;

  const trackConfig = selectedTrack ? TRACK_CONFIGS[selectedTrack] : null;

  const domainBreakdown = useMemo(() => {
    if (!result) return [];
    return result.breakdown.map((b) => {
      const domain = domainData.find((d) => d.id === b.domain);
      if (!domain) return null;
      return {
        name: domain.shortTitle,
        shortName: domain.shortTitle,
        correct: b.correct,
        total: b.total,
        percent: b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0,
        color: domain.color,
      };
    }).filter(Boolean) as any[];
  }, [result]);

  const handleGetCertificate = () => {
    navigate("/certificate");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ── PRE-EXAM SCREEN ──
  if (screen === "pre-exam") {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold" data-testid="exam-title">Slutprov</h1>
        </div>

        <p className="text-muted-foreground">
          Välj vilket spår du vill göra slutprov för. Varje spår har sitt eget prov och certifikat.
          Slutprovet innehåller frågor från den gemensamma introduktionen samt spårspecifika avsnitt.
        </p>

        {/* Track 1 Card */}
        <Card
          className={`transition-all border-l-4 ${
            track1Elig?.hasValidCert ? "border-green-500/30 bg-green-500/5" :
            track1Locked ? "opacity-75" :
            "cursor-pointer hover:shadow-md"
          }`}
          style={{ borderLeftColor: "#00D4FF" }}
          onClick={() => !track1Elig?.hasValidCert && !track1Locked && startExam(1)}
          data-testid="exam-track-1"
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Shield className="h-10 w-10 shrink-0" style={{ color: track1Locked ? "#999" : "#00D4FF" }} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Ledning & Styrelse</h3>
                  {track1Elig?.hasValidCert && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {track1Locked && <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                <p className="text-sm text-muted-foreground">Gemensam + Ledning + 5 frågor från Personal — 20 frågor, 40 minuter, 70% för godkänt</p>
                {track1Elig?.hasValidCert && track1Cert && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Certifikat utfärdat — {Math.round((track1Cert.examScore / track1Cert.totalQuestions) * 100)}%
                  </p>
                )}
                {track1Locked && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    Certifikatet har gått ut — kontakta oss för att aktivera förnyelse
                  </p>
                )}
                {track1Elig?.needsRenewal && track1Elig?.canRenew && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Förnyelse aktiverad — du kan göra om slutprovet
                  </p>
                )}
              </div>
              {/* Can take exam: no cert yet, or renewal activated */}
              {track1Elig?.canTakeExam && !track1Elig?.hasValidCert && (
                <Button
                  className="shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                  onClick={(e) => { e.stopPropagation(); startExam(1); }}
                >
                  {track1Elig?.needsRenewal ? "Förnya certifikat" : "Påbörja slutprov"}
                </Button>
              )}
              {track1Elig?.hasValidCert && (
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate("/certificate"); }}>
                  <Award className="mr-2 h-4 w-4" />
                  Visa certifikat
                </Button>
              )}
              {track1Locked && (
                <Button variant="outline" size="sm" disabled className="shrink-0">
                  <Lock className="mr-2 h-4 w-4" />
                  Låst
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Track 2 Card */}
        <Card
          className={`transition-all border-l-4 ${
            track2Elig?.hasValidCert ? "border-green-500/30 bg-green-500/5" :
            track2Locked ? "opacity-75" :
            "cursor-pointer hover:shadow-md"
          }`}
          style={{ borderLeftColor: "#0066FF" }}
          onClick={() => !track2Elig?.hasValidCert && !track2Locked && startExam(2)}
          data-testid="exam-track-2"
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="h-10 w-10 shrink-0" style={{ color: track2Locked ? "#999" : "#0066FF" }} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">All Personal</h3>
                  {track2Elig?.hasValidCert && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {track2Locked && <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                <p className="text-sm text-muted-foreground">Gemensam + Personal — 25 frågor, 50 minuter, 70% för godkänt</p>
                {track2Elig?.hasValidCert && track2Cert && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Certifikat utfärdat — {Math.round((track2Cert.examScore / track2Cert.totalQuestions) * 100)}%
                  </p>
                )}
                {track2Locked && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    Certifikatet har gått ut — kontakta oss för att aktivera förnyelse
                  </p>
                )}
                {track2Elig?.needsRenewal && track2Elig?.canRenew && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Förnyelse aktiverad — du kan göra om slutprovet
                  </p>
                )}
              </div>
              {track2Elig?.canTakeExam && !track2Elig?.hasValidCert && (
                <Button
                  className="shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                  onClick={(e) => { e.stopPropagation(); startExam(2); }}
                >
                  {track2Elig?.needsRenewal ? "Förnya certifikat" : "Påbörja slutprov"}
                </Button>
              )}
              {track2Elig?.hasValidCert && (
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate("/certificate"); }}>
                  <Award className="mr-2 h-4 w-4" />
                  Visa certifikat
                </Button>
              )}
              {track2Locked && (
                <Button variant="outline" size="sm" disabled className="shrink-0">
                  <Lock className="mr-2 h-4 w-4" />
                  Låst
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {startError && <p className="text-sm text-destructive">{startError}</p>}

        {/* Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Regler för slutprovet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">1</span>
                <span>Frågorna och svarsalternativen slumpas varje gång</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">2</span>
                <span>Minst 70% rätt för godkänt</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">3</span>
                <span>Du kan inte gå tillbaka och ändra svar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">4</span>
                <span>Varje spår ger ett separat certifikat</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">5</span>
                <span>Provet innehåller frågor från gemensamma avsnitt + spårets avsnitt</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── QUESTION SCREEN ──
  if (screen === "question" && questions.length > 0 && trackConfig) {
    const question = questions[currentIndex];
    const answered = answers.find((a) => a.questionIndex === currentIndex);
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;
    const isLocked = !!answered || answerLocked;

    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
              style={{ backgroundColor: `${trackConfig.color}20`, color: trackConfig.color }}
            >
              {selectedTrack === 1 ? <Shield className="h-3 w-3" /> : <Users className="h-3 w-3" />}
              {trackConfig.shortTitle}
            </span>
            <span className="text-sm text-muted-foreground" data-testid="exam-progress-text">
              Fråga {currentIndex + 1} av {questions.length}
            </span>
          </div>
          <div className={`flex items-center gap-1 text-sm font-mono ${timeRemaining < 300 ? "text-destructive" : ""}`} data-testid="exam-timer">
            <Clock className="h-4 w-4" />
            {formatTime(timeRemaining)}
          </div>
        </div>
        <Progress value={progressPercent} className="h-1.5" data-testid="exam-progress-bar" />

        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-2">
              {question.subtopic}
            </p>
            <p className="font-medium mb-6 leading-relaxed" data-testid="exam-question-text">
              {question.question}
            </p>

            <RadioGroup
              key={`q-${currentIndex}`}
              value={selectedOption !== null ? String(selectedOption) : ""}
              onValueChange={(val) => {
                if (isLocked) return;
                setSelectedOption(Number(val));
              }}
              className="space-y-3"
            >
              {question.options.map((option, idx) => {
                let optionClass = "";
                if (selectedOption === idx && isLocked) {
                  optionClass = "border-primary/50 bg-primary/5 opacity-80";
                }
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${optionClass} ${isLocked ? "cursor-not-allowed" : ""}`}
                  >
                    <RadioGroupItem
                      value={String(idx)}
                      id={`exam-option-${idx}`}
                      disabled={isLocked}
                      data-testid={`exam-option-${idx}`}
                    />
                    <Label htmlFor={`exam-option-${idx}`} className={`text-sm leading-relaxed flex-1 ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}>
                      {option}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Svar kan inte ändras efter bekräftelse
          </p>

          <div className="flex gap-2">
            {!isLocked && (
              <Button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                data-testid="exam-confirm"
              >
                {currentIndex < questions.length - 1 ? "Bekräfta svar" : "Bekräfta & avsluta"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ──
  if (screen === "results" && trackConfig && !result) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4 text-center">
        {submitError ? (
          <>
            <p className="text-destructive">{submitError}</p>
            <Button onClick={submitExam}>Försök skicka igen</Button>
          </>
        ) : (
          <p className="text-muted-foreground">Rättar provet…</p>
        )}
      </div>
    );
  }

  if (screen === "results" && trackConfig && result) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold" data-testid="exam-results-title">
          Resultat — {trackConfig.title}
        </h1>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-5xl font-bold text-primary mb-2" data-testid="exam-score">
              {scorePercent}%
            </div>
            <p className="text-muted-foreground">
              {correctCount} av {result.total} rätt
            </p>
            <p className="text-sm mt-1">
              {isPass ? (
                <span className="text-green-600 font-medium">Godkänt! Bra jobbat.</span>
              ) : (
                <span className="text-destructive font-medium">Under godkäntgränsen (70%). Fortsätt studera och försök igen!</span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Domain Chart */}
        {domainBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resultat per del</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48" data-testid="exam-domain-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainBreakdown} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="shortName" tick={{ fontSize: 12 }} className="fill-foreground" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} className="fill-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.375rem",
                        fontSize: 12,
                      }}
                      formatter={(value: number, _: string, entry: any) => [
                        `${value}% (${entry.payload.correct}/${entry.payload.total})`,
                        "Resultat",
                      ]}
                    />
                    <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
                      {domainBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {isPass && !(selectedTrack === 1 ? track1Cert : track2Cert) && (
            <Button onClick={handleGetCertificate} data-testid="exam-get-certificate" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 h-12 text-base">
              <Award className="mr-2 h-5 w-5" />
              Hämta ditt certifikat
            </Button>
          )}
          {isPass && (selectedTrack === 1 ? track1Cert : track2Cert) && (
            <Button onClick={() => navigate("/certificate")} data-testid="exam-view-certificate" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 h-12 text-base">
              <Award className="mr-2 h-5 w-5" />
              Visa ditt certifikat
            </Button>
          )}
          <div className="flex flex-wrap gap-3">
            {!isPass && (
              <Button
                variant="outline"
                onClick={() => {
                  setScreen("pre-exam");
                  setSelectedTrack(null);
                  setAnswers([]);
                  setCurrentIndex(0);
                  setSaved(false);
                  setAnswerLocked(false);
                  setResult(null);
                  setExamId(null);
                }}
                data-testid="exam-try-again"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Försök igen
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/dashboard")} data-testid="exam-back-dashboard">
              Tillbaka till dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
