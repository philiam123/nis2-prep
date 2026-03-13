import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { allQuestions, type Question } from "@/data/questions";
import { domainData } from "@/data/domains";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Clock, RotateCcw, Save, Award, AlertTriangle, Lock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

type QuizMode = "practice" | "exam";
type Screen = "setup" | "question" | "results";

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

export default function QuizPage() {
  const [, navigate] = useLocation();
  const searchStr = useSearch();
  const searchParams = new URLSearchParams(searchStr);
  const startInExam = searchParams.get("mode") === "exam";

  const [screen, setScreen] = useState<Screen>("setup");
  const [selectedDomains, setSelectedDomains] = useState<number[]>([1, 2]);
  const [mode, setMode] = useState<QuizMode>(startInExam ? "exam" : "practice");
  const [practiceCount, setPracticeCount] = useState<number>(10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saved, setSaved] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answerLocked, setAnswerLocked] = useState(false);

  // Anti-cheat: track if user has confirmed exam start
  const [examActive, setExamActive] = useState(false);
  const examActiveRef = useRef(false);

  const saveResultFn = useCallback(async (data: any) => {
    try {
      await apiRequest("POST", "/api/quiz-results", data);
    } catch (err) {
      console.error("Failed to save quiz result", err);
    }
  }, []);

  // Timer for exam mode
  useEffect(() => {
    if (screen !== "question" || mode !== "exam" || timeRemaining <= 0) return;
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
  }, [screen, mode, timeRemaining]);

  // Anti-cheat: prevent browser back/navigation during exam
  useEffect(() => {
    if (!examActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Du har ett pågående slutprov. Om du lämnar sidan förlorar du dina svar.";
      return e.returnValue;
    };

    const handlePopState = (e: PopStateEvent) => {
      if (examActiveRef.current) {
        // Push state back to prevent navigation
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Push a state so we can intercept back button
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

  const toggleDomain = (domainId: number) => {
    setSelectedDomains((prev) =>
      prev.includes(domainId)
        ? prev.filter((d) => d !== domainId)
        : [...prev, domainId]
    );
  };

  const startQuiz = () => {
    const filtered = allQuestions.filter((q) => selectedDomains.includes(q.domain));
    // Shuffle questions
    const shuffled = shuffleArray(filtered);
    const count = mode === "exam" ? Math.min(25, shuffled.length) : Math.min(practiceCount, shuffled.length);
    const selected = shuffled.slice(0, count);

    // For exam mode: also shuffle the answer options within each question
    const finalQuestions = mode === "exam"
      ? selected.map(q => shuffleQuestion(q))
      : selected;

    setQuestions(finalQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnswers([]);
    setSaved(false);
    setAnswerLocked(false);
    setTimeRemaining(mode === "exam" ? 2700 : 0); // 45 min for exam
    setScreen("question");

    if (mode === "exam") {
      setExamActive(true);
      examActiveRef.current = true;
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || answerLocked) return;
    const question = questions[currentIndex];
    const correct = selectedOption === question.correct;
    setAnswers((prev) => [...prev, { questionIndex: currentIndex, selectedOption, correct }]);

    if (mode === "practice") {
      setShowExplanation(true);
    } else {
      // Exam mode: lock the answer, then auto-advance after brief delay
      setAnswerLocked(true);
      setTimeout(() => {
        advanceToNext();
      }, 300);
    }
  };

  const advanceToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setAnswerLocked(false);
    } else {
      setScreen("results");
      setExamActive(false);
      examActiveRef.current = false;
    }
  }, [currentIndex, questions.length]);

  const goToNext = useCallback(() => {
    if (selectedOption !== null && !answers.find((a) => a.questionIndex === currentIndex)) {
      const question = questions[currentIndex];
      const correct = selectedOption === question.correct;
      setAnswers((prev) => [...prev, { questionIndex: currentIndex, selectedOption, correct }]);
    }
    advanceToNext();
  }, [currentIndex, questions, selectedOption, answers, advanceToNext]);

  const correctCount = answers.filter((a) => a.correct).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isExamPass = mode === "exam" && scorePercent >= 70;

  const domainBreakdown = useMemo(() => {
    return domainData
      .filter((d) => selectedDomains.includes(d.id))
      .map((domain) => {
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
  }, [answers, questions, selectedDomains]);

  const weakAreas = domainBreakdown.filter((d) => d.percent < 70 && d.total > 0);

  const handleSaveResults = async () => {
    const answersMap: Record<string, number> = {};
    answers.forEach((a) => {
      const q = questions[a.questionIndex];
      if (q) answersMap[q.subtopic] = a.selectedOption;
    });
    await saveResultFn({
      domains: selectedDomains,
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

  // ── SETUP SCREEN ──
  if (screen === "setup") {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold" data-testid="quiz-setup-title">Quiz</h1>

        {mode === "practice" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Välj spår</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {domainData.map((domain) => (
                <div key={domain.id} className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedDomains.includes(domain.id)}
                    onCheckedChange={() => toggleDomain(domain.id)}
                    data-testid={`quiz-domain-${domain.id}`}
                  />
                  <Label className="text-sm">
                    Track {domain.numeral}: {domain.shortTitle}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Läge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={mode === "practice" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("practice")}
                data-testid="quiz-mode-practice"
              >
                Övning
              </Button>
              <Button
                variant={mode === "exam" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("exam")}
                data-testid="quiz-mode-exam"
              >
                Slutprov
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mode === "practice"
                ? "Se förklaringar efter varje fråga. Välj antal frågor."
                : "25 frågor från alla moduler, 45 min tidsgräns. 70% för godkänt och certifikat."}
            </p>
          </CardContent>
        </Card>

        {mode === "practice" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Antal frågor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 15, 25].map((count) => (
                  <Button
                    key={count}
                    variant={practiceCount === count ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPracticeCount(count)}
                    data-testid={`quiz-count-${count}`}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {mode === "exam" && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-amber-600 dark:text-amber-400">Viktigt om slutprovet</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                      Du kan inte gå tillbaka och ändra svar
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      45 minuters tidsgräns
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 shrink-0" />
                      Minst 70% rätt för godkänt och certifikat
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    Frågorna och svarsalternativen slumpas varje gång du startar provet. Se till att du är redo innan du börjar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          size="lg"
          className={`w-full ${mode === "exam" ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500" : ""}`}
          onClick={() => {
            if (mode === "exam") {
              // Force both tracks for exam
              setSelectedDomains([1, 2]);
            }
            startQuiz();
          }}
          disabled={mode === "practice" && selectedDomains.length === 0}
          data-testid="quiz-start"
        >
          {mode === "exam" ? "Påbörja slutprov" : "Starta quiz"}
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
          <span className="text-sm text-muted-foreground" data-testid="quiz-progress-text">
            Fråga {currentIndex + 1} av {questions.length}
          </span>
          {mode === "exam" && (
            <div className={`flex items-center gap-1 text-sm font-mono ${timeRemaining < 300 ? "text-destructive" : ""}`} data-testid="quiz-timer">
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>
        <Progress value={progressPercent} className="h-1.5" data-testid="quiz-progress-bar" />

        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-2">
              {question.subtopic}
            </p>
            <p className="font-medium mb-6 leading-relaxed" data-testid="quiz-question-text">
              {question.question}
            </p>

            <RadioGroup
              key={`q-${currentIndex}`}
              value={selectedOption !== null ? String(selectedOption) : ""}
              onValueChange={(val) => {
                // In exam mode: prevent changing answer once locked
                if (isLocked) return;
                setSelectedOption(Number(val));
              }}
              className="space-y-3"
            >
              {question.options.map((option, idx) => {
                let optionClass = "";
                if (mode === "practice" && (answered || showExplanation)) {
                  if (idx === question.correct) {
                    optionClass = "border-green-500 bg-green-500/10";
                  } else if (idx === answered?.selectedOption && !answered?.correct) {
                    optionClass = "border-destructive bg-destructive/10";
                  }
                }
                // In exam mode: just highlight selected option, no correct/incorrect feedback
                if (mode === "exam" && selectedOption === idx) {
                  optionClass = isLocked ? "border-primary/50 bg-primary/5 opacity-80" : "";
                }
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${optionClass} ${isLocked ? "cursor-not-allowed" : ""}`}
                  >
                    <RadioGroupItem
                      value={String(idx)}
                      id={`option-${idx}`}
                      disabled={isLocked}
                      data-testid={`quiz-option-${idx}`}
                    />
                    <Label htmlFor={`option-${idx}`} className={`text-sm leading-relaxed flex-1 ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}>
                      {option}
                    </Label>
                    {mode === "practice" && (answered || showExplanation) && idx === question.correct && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    )}
                    {mode === "practice" && (answered || showExplanation) &&
                      idx === (answered?.selectedOption ?? selectedOption) &&
                      idx !== question.correct && (
                        <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      )}
                  </div>
                );
              })}
            </RadioGroup>

            {showExplanation && (
              <div className="mt-4 p-3 bg-muted rounded-md" data-testid="quiz-explanation">
                <p className="text-sm font-medium mb-1">Förklaring</p>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          {/* Exam mode: show locked indicator */}
          {mode === "exam" && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Svar kan inte ändras efter bekräftelse
            </p>
          )}
          {mode === "practice" && <div />}

          <div className="flex gap-2">
            {mode === "practice" && !showExplanation && (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                data-testid="quiz-check-answer"
              >
                Kontrollera svar
              </Button>
            )}
            {mode === "practice" && showExplanation && (
              <Button onClick={goToNext} data-testid="quiz-next">
                {currentIndex < questions.length - 1 ? "Nästa fråga" : "Visa resultat"}
              </Button>
            )}
            {mode === "exam" && !isLocked && (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                data-testid="quiz-next"
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
        <h1 className="text-2xl font-bold" data-testid="quiz-results-title">Resultat</h1>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-5xl font-bold text-primary mb-2" data-testid="quiz-score">
              {scorePercent}%
            </div>
            <p className="text-muted-foreground">
              {correctCount} av {questions.length} rätt
            </p>
            <p className="text-sm mt-1">
              {scorePercent >= 70 ? (
                <span className="text-green-600 font-medium">Godkänt! Bra jobbat.</span>
              ) : (
                <span className="text-destructive font-medium">Under godkäntgränsen. Fortsätt studera!</span>
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
              <div className="h-64" data-testid="quiz-domain-chart">
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

        {weakAreas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Förbättringsområden</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {weakAreas.map((area) => (
                  <li key={area.name} className="flex items-center justify-between text-sm">
                    <span>{area.name}: {area.shortName}</span>
                    <span className="text-destructive font-medium">{area.percent}%</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {isExamPass && (
            <Button onClick={handleGetCertificate} data-testid="quiz-get-certificate" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">
              <Award className="mr-2 h-4 w-4" />
              Hämta certifikat
            </Button>
          )}
          <Button onClick={handleSaveResults} disabled={saved} variant={isExamPass ? "outline" : "default"} data-testid="quiz-save-results">
            <Save className="mr-2 h-4 w-4" />
            {saved ? "Sparat!" : "Spara resultat"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setScreen("setup");
              setAnswers([]);
              setCurrentIndex(0);
              setSaved(false);
              setAnswerLocked(false);
            }}
            data-testid="quiz-try-again"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Försök igen
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")} data-testid="quiz-back-dashboard">
            Tillbaka till dashboard
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
