import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { domainData } from "@/data/domains";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, Shield, Users, BookOpen, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Info
} from "lucide-react";

const ROLE_DESCRIPTIONS: Record<number, { roles: string; examples: string }> = {
  0: {
    roles: "Alla i organisationen",
    examples: "Grundläggande kunskap som gäller samtliga — oavsett roll.",
  },
  1: {
    roles: "VD, styrelseledamöter, ledningsgrupp, CISO, beslutsfattare",
    examples: "Du som fattar strategiska beslut om cybersäkerhet, budget eller policy. Inkluderar även personal-avsnitten.",
  },
  2: {
    roles: "Alla medarbetare, konsulter, inhyrd personal, entreprenörer",
    examples: "Du som använder IT-system i ditt dagliga arbete och behöver förstå grundläggande cybersäkerhet.",
  },
};

export default function StudyPage() {
  const [selectedChapter, setSelectedChapter] = useState<string>(domainData[0].chapters[0].id);
  const [collapsedDomains, setCollapsedDomains] = useState<Set<number>>(new Set());
  const [showRoleInfo, setShowRoleInfo] = useState<number | null>(null);
  const qc = useQueryClient();

  const { data: progress = [] } = useQuery<any[]>({
    queryKey: ["/api/progress"],
  });

  const completedSet = useMemo(() => {
    return new Set(progress.filter((p: any) => p.completed).map((p: any) => p.chapterId));
  }, [progress]);

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ chapterId, completed }: { chapterId: string; completed: boolean }) => {
      const res = await apiRequest("POST", "/api/progress", { chapterId, completed });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const currentChapter = useMemo(() => {
    for (const domain of domainData) {
      const ch = domain.chapters.find((c) => c.id === selectedChapter);
      if (ch) return { chapter: ch, domain };
    }
    return null;
  }, [selectedChapter]);

  // Flat list for prev/next
  const allChapters = useMemo(() => {
    return domainData.flatMap((d) => d.chapters.map(ch => ({ ...ch, domain: d })));
  }, []);

  const currentFlatIndex = allChapters.findIndex((c) => c.id === selectedChapter);
  const prevChapter = currentFlatIndex > 0 ? allChapters[currentFlatIndex - 1] : null;
  const nextChapter = currentFlatIndex < allChapters.length - 1 ? allChapters[currentFlatIndex + 1] : null;

  const toggleCollapse = (id: number) => {
    setCollapsedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getDomainIcon = (id: number) => {
    if (id === 0) return <BookOpen className="h-4 w-4" />;
    if (id === 1) return <Shield className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const getDomainColor = (id: number) => {
    if (id === 0) return "#10B981";
    if (id === 1) return "#00D4FF";
    return "#0066FF";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Clean section navigation */}
      <nav className="mb-8 space-y-1" data-testid="study-nav">
        {domainData.map((domain) => {
          const isCollapsed = collapsedDomains.has(domain.id);
          const domainDone = domain.chapters.filter((c) => completedSet.has(c.id)).length;
          const domainTotal = domain.chapters.length;
          const color = getDomainColor(domain.id);
          const hasActiveChapter = domain.chapters.some((c) => c.id === selectedChapter);
          const roleInfo = ROLE_DESCRIPTIONS[domain.id];

          return (
            <div key={domain.id} className="rounded-lg border bg-card overflow-hidden" data-testid={`study-domain-${domain.id}`}>
              {/* Domain header */}
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
                onClick={() => toggleCollapse(domain.id)}
              >
                <span style={{ color }} className="shrink-0">{getDomainIcon(domain.id)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{domain.title}</span>
                    {hasActiveChapter && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Progress value={domainTotal > 0 ? (domainDone / domainTotal) * 100 : 0} className="h-1 flex-1 max-w-[120px]" />
                    <span className="text-[11px] text-muted-foreground">{domainDone}/{domainTotal}</span>
                  </div>
                </div>
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Role info tooltip */}
              {!isCollapsed && roleInfo && (
                <div className="px-4 pb-2">
                  <button
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRoleInfo(showRoleInfo === domain.id ? null : domain.id);
                    }}
                  >
                    <Info className="h-3 w-3" />
                    Vilka ska gå detta?
                  </button>
                  {showRoleInfo === domain.id && (
                    <div className="mt-1.5 p-3 rounded-md bg-muted/50 border text-xs space-y-1">
                      <p><span className="font-medium">Roller:</span> {roleInfo.roles}</p>
                      <p className="text-muted-foreground">{roleInfo.examples}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Chapter list */}
              {!isCollapsed && (
                <div className="border-t">
                  {domain.chapters.map((ch, i) => {
                    const isActive = selectedChapter === ch.id;
                    const isDone = completedSet.has(ch.id);
                    return (
                      <button
                        key={ch.id}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors
                          ${i < domain.chapters.length - 1 ? "border-b border-border/50" : ""}
                          ${isActive
                            ? "bg-primary/5 font-medium"
                            : "hover:bg-accent/30"
                          }`}
                        onClick={() => setSelectedChapter(ch.id)}
                        data-testid={`study-chapter-${ch.id}`}
                      >
                        <div className="shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : isActive ? (
                            <div className="h-4 w-4 rounded-full border-2" style={{ borderColor: color }} />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
                          )}
                        </div>
                        <span className={`truncate ${isDone && !isActive ? "text-muted-foreground" : ""}`}>
                          {ch.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Main content */}
      {currentChapter ? (
        <>
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${getDomainColor(currentChapter.domain.id)}15`,
                    color: getDomainColor(currentChapter.domain.id),
                  }}
                >
                  {getDomainIcon(currentChapter.domain.id)}
                  {currentChapter.domain.shortTitle}
                </span>
              </div>
              <h1 className="text-xl font-bold" data-testid="study-chapter-title">
                {currentChapter.chapter.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {currentChapter.domain.chapters.filter(c => completedSet.has(c.id)).length} av {currentChapter.domain.chapters.length} avsnitt avklarade
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <Checkbox
                checked={completedSet.has(currentChapter.chapter.id)}
                onCheckedChange={(checked) =>
                  toggleCompleteMutation.mutate({
                    chapterId: currentChapter.chapter.id,
                    completed: !!checked,
                  })
                }
                data-testid="study-mark-complete"
              />
              <span className="text-sm">Markera klar</span>
            </div>
          </div>

          {/* Study content */}
          <div
            className="study-content prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentChapter.chapter.content }}
            data-testid="study-content"
          />

          {/* Navigation */}
          <div className="mt-8 flex justify-between gap-4">
            {prevChapter ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedChapter(prevChapter.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                data-testid="study-prev-btn"
                className="max-w-[45%]"
              >
                <ChevronLeft className="h-4 w-4 mr-1 shrink-0" />
                <span className="truncate">{prevChapter.title}</span>
              </Button>
            ) : <div />}
            {nextChapter ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedChapter(nextChapter.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                data-testid="study-next-btn"
                className="max-w-[45%]"
              >
                <span className="truncate">{nextChapter.title}</span>
                <ChevronRight className="h-4 w-4 ml-1 shrink-0" />
              </Button>
            ) : <div />}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">Välj ett avsnitt för att börja studera.</p>
      )}
    </div>
  );
}
