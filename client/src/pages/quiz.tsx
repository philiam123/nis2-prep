import { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { allQuestions, type Question } from "@/data/questions";
import { domainData } from "@/data/domains";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, RotateCcw, Save } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

type Screen = "setup" | "question" | "results";

interface Answer {
  questionIndex: number;
  selectedOption: number;
  correct: boolean;
}

export default function QuizPage() {
  const [, navigate] = useLocation();

  const [screen, setScreen] = useState<Screen>("setup");
  const [selectedDomains, setSelectedDomains] = useState<number[]>([1, 2]);
  const [practiceCount, setPracticeCount] = useState<number>(10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saved, setSaved] = useState(false);

  const saveResultFn = useCallback(async (data: any) => {
    try {
      await apiRequest("POST", "/api/quiz-results", data);
    } catch (err) {
      console.error("Failed to save quiz result", err);
    }
  }, []);

  const toggleDomain = (domainId: number) => {
    setSelectedDomains((prev) =>
      prev.includes(domainId)
        ? prev.filter((d) => d !== domainId)
        : [...prev, domainId]
    );
  };

  const startQuiz = () => {
    const filtered = allQuestions.filter((q) => selectedDomains.includes(q.domain));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const count = Math.min(practiceCount, shuffled.length);
    const selected = shuffled.slice(0, count);

    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnswers([]);
    setSaved(false);
    setScreen("question");
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    const question = questions[currentIndex];
    const correct = selectedOption === question.correct;
    setAnswers((prev) => [...prev, { questionIndex: currentIndex, selectedOption, correct }]);
    setShowExplanation(true);
  };

  const goToNext = useCallback(() => {
    if (selectedOption !== null && !answers.find((a) => a.questionIndex === currentIndex)) {
      const question = questions[currentIndex];
      const correct = selectedOption === question.correct;
      setAnswers((prev) => [...prev, { questionIndex: currentIndex, selectedOption, correct }]);
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setScreen("results");
    }
  }, [currentIndex, questions, selectedOption, answers]);

  const correctCount = answers.filter((a) => a.correct).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

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

  // ── SETUP SCREEN ──
  if (screen === "setup") {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold" data-testid="quiz-setup-title">Övningsquiz</h1>

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

        <Button
          size="lg"
          className="w-full"
          onClick={startQuiz}
          disabled={selectedDomains.length === 0}
          data-testid="quiz-start"
        >
          Starta quiz
        </Button>
      </div>
    );
  }

  // ── QUESTION SCREEN ──
  if (screen === "question" && questions.length > 0) {
    const question = questions[currentIndex];
    const answered = answers.find((a) => a.questionIndex === currentIndex);
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground" data-testid="quiz-progress-text">
            Fråga {currentIndex + 1} av {questions.length}
          </span>
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
                if (answered || showExplanation) return;
                setSelectedOption(Number(val));
              }}
              className="space-y-3"
            >
              {question.options.map((option, idx) => {
                let optionClass = "";
                if (answered || showExplanation) {
                  if (idx === question.correct) {
                    optionClass = "border-green-500 bg-green-500/10";
                  } else if (idx === answered?.selectedOption && !answered?.correct) {
                    optionClass = "border-destructive bg-destructive/10";
                  }
                }
                const isLocked = !!answered || showExplanation;
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
                    {(answered || showExplanation) && idx === question.correct && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    )}
                    {(answered || showExplanation) &&
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

        <div className="flex justify-end">
          <div className="flex gap-2">
            {!showExplanation && (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                data-testid="quiz-check-answer"
              >
                Kontrollera svar
              </Button>
            )}
            {showExplanation && (
              <Button onClick={goToNext} data-testid="quiz-next">
                {currentIndex < questions.length - 1 ? "Nästa fråga" : "Visa resultat"}
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
                <span className="text-green-600 font-medium">Bra jobbat!</span>
              ) : (
                <span className="text-destructive font-medium">Fortsätt studera och försök igen!</span>
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
          <Button onClick={handleSaveResults} disabled={saved} data-testid="quiz-save-results">
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
