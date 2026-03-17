import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { allQuestions, type Question } from "@/data/questions";
import { domainData } from "@/data/domains";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GraduationCap, Clock, RotateCcw, Save, Award, Lock, CheckCircle2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

type Screen = "pre-exam" | "question" | "results";

interface Answer {
  questionIndex: number;
  selectedOption: number;
  correct: boolean;
}

/** Shuffle array using Fisher-Yates */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Create a shuffled version of a question (shuffle answer options, track correct answer) */
function shuffleQuestion(q: Question): Question & { _originalCorrect: number } {
  const indices = q.options.map((_, i) => i);
  const shuffledIndices = shuffleArray(indices);
  const newOptions = shuffledIndices.map(i => q.options[i]);
  const newCorrect = shuffledIndices.indexOf(q.correct);
  return {
    ...q,
    options: newOptions,
    correct: newCorrect,
    _originalCorrect: q.correct,
  };
}

export default function ExamPage() {
  const [, navigate] = useLocation();

  const [screen, setScreen] = useState<Screen>("pre-exam");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saved, setSaved] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answerLocked, setAnswerLocked] = useState(false);

  // Anti-cheat: track if exam is active
  const [examActive, setExamActive] = useState(false);
  const examActiveRef = useRef(false);

  const { data: certificates = [] } = useQuery<any[]>({
    queryKey: ["/api/certificates"],
  });

  const hasCertificate = certificates.length > 0;

  const saveResultFn = useCallback(async (data: any) => {
    try {
      await apiRequest("POST", "/api/quiz-results", data);
    } catch (err) {
      console.error("Failed to save exam result", err);
    }
  }, []);

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

  const startExam = () => {
    const allDomains = [1, 2];
    const filtered = allQuestions.filter((q) => allDomains.includes(q.domain));
    const shuffled = shuffleArray(filtered);
    const count = Math.min(25, shuffled.length);
    const selected = shuffled.slice(0, count);
    const finalQuestions = selected.map(q => shuffleQuestion(q));

    setQuestions(finalQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setSaved(false);
    setAnswerLocked(false);
    setTimeRemaining(2700); // 45 min
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
    const question = questions[currentIndex];
    const correct = selectedOption === question.correct;
    setAnswers((prev) => [...prev, { questionIndex: currentIndex, selectedOption, correct }]);
    setAnswerLocked(true);
    setTimeout(() => {
      advanceToNext();
    }, 300);
  };

  const correctCount = answers.filter((a) => a.correct).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPass = scorePercent >= 70;

  const domainBreakdown = useMemo(() => {
    return domainData.map((domain) => {
      const domainAnswers = answers.filter(
        (a) => questions[a.questionIndex]?.domain === domain.id
      );
      const total = domainAnswers.length;
      const correct = domainAnswers.filter((a) => a.correct).length;
      return {
        name: `Track ${domain.numeral}`,
        shortName: domain.shortTitle,
        correct,
        total,
        percent: total > 0 ? Math.round((correct / total) * 100) : 0,
        color: domain.color,
      };
    });
  }, [answers, questions]);

  const handleSaveResults = async () => {
    const answersMap: Record<string, number> = {};
    answers.forEach((a) => {
      const q = questions[a.questionIndex];
      if (q) answersMap[q.subtopic] = a.selectedOption;
    });
    await saveResultFn({
      domains: [1, 2],
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      answers: answersMap,
    });
    setSaved(true);
  };

  const handleGetCertificate = async () => {
    if (!saved) {
      await handleSaveResults();
    }
    try {
      await apiRequest("POST", "/api/certificates", {
        examScore: correctCount,
        totalQuestions: questions.length,
      });
    } catch (err) {
      console.error("Failed to create certificate", err);
    }
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

        {hasCertificate && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
                <div className="flex-1">
                  <p className="font-semibold text-green-600 dark:text-green-400">Du har redan godkänt slutprovet!</p>
                  <p className="text-sm text-muted-foreground">Ditt certifikat finns redan tillgängligt.</p>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/certificate")}
                  data-testid="exam-view-certificate"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Visa certifikat
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Regler för slutprovet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">1</span>
                <span>25 frågor från alla moduler</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">2</span>
                <span>45 minuters tidsgräns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">3</span>
                <span>Minst 70% rätt (18/25) för godkänt</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">4</span>
                <span>Du kan inte gå tillbaka och ändra svar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">5</span>
                <span>Frågorna och svarsalternativen slumpas varje gång</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
          onClick={startExam}
          data-testid="exam-start"
        >
          <GraduationCap className="mr-2 h-5 w-5" />
          Påbörja slutprov
        </Button>
      </div>
    );
  }

  // ── QUESTION SCREEN ──
  if (screen === "question" && questions.length > 0) {
    const question = questions[currentIndex];
    const answered = answers.find((a) => a.questionIndex === currentIndex);
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;
    const isLocked = !!answered || answerLocked;

    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground" data-testid="exam-progress-text">
            Fråga {currentIndex + 1} av {questions.length}
          </span>
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
  if (screen === "results") {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold" data-testid="exam-results-title">Resultat — Slutprov</h1>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-5xl font-bold text-primary mb-2" data-testid="exam-score">
              {scorePercent}%
            </div>
            <p className="text-muted-foreground">
              {correctCount} av {questions.length} rätt
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
              <CardTitle className="text-base">Fördelning per spår</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64" data-testid="exam-domain-chart">
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
        <div className="flex flex-wrap gap-3">
          {isPass && (
            <Button onClick={handleGetCertificate} data-testid="exam-get-certificate" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">
              <Award className="mr-2 h-4 w-4" />
              Hämta certifikat
            </Button>
          )}
          <Button onClick={handleSaveResults} disabled={saved} variant={isPass ? "outline" : "default"} data-testid="exam-save-results">
            <Save className="mr-2 h-4 w-4" />
            {saved ? "Sparat!" : "Spara resultat"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setScreen("pre-exam");
              setAnswers([]);
              setCurrentIndex(0);
              setSaved(false);
              setAnswerLocked(false);
            }}
            data-testid="exam-try-again"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Försök igen
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")} data-testid="exam-back-dashboard">
            Tillbaka till dashboard
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
