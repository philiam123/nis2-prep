import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { domainData } from "@/data/domains";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Shield, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

export default function StudyPage() {
  const [selectedChapter, setSelectedChapter] = useState<string>(domainData[0].chapters[0].id);
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

  // Flat list of all chapters for prev/next navigation
  const allChapters = useMemo(() => {
    return domainData.flatMap((d) => d.chapters.map(ch => ({ ...ch, domain: d })));
  }, []);

  const currentFlatIndex = allChapters.findIndex((c) => c.id === selectedChapter);
  const prevChapter = currentFlatIndex > 0 ? allChapters[currentFlatIndex - 1] : null;
  const nextChapter = currentFlatIndex < allChapters.length - 1 ? allChapters[currentFlatIndex + 1] : null;

  // Progress per domain
  const domainProgress = useMemo(() => {
    return domainData.map((d) => {
      const total = d.chapters.length;
      const done = d.chapters.filter((c) => completedSet.has(c.id)).length;
      return { id: d.id, title: d.shortTitle, done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
  }, [completedSet]);

  const getDomainIcon = (id: number) => {
    if (id === 0) return <BookOpen className="h-4 w-4 text-emerald-500" />;
    if (id === 1) return <Shield className="h-4 w-4 text-cyan-500" />;
    return <Users className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Compact section navigation (replaces blocking sidebar) */}
      <div className="mb-6 space-y-3">
        {domainData.map((domain) => (
          <div key={domain.id}>
            <div className="flex items-center gap-2 mb-1.5">
              {getDomainIcon(domain.id)}
              <span className="text-xs font-medium text-muted-foreground">{domain.title}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {domainProgress.find(p => p.id === domain.id)?.done}/{domain.chapters.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {domain.chapters.map((ch) => {
                const isActive = selectedChapter === ch.id;
                const isDone = completedSet.has(ch.id);
                return (
                  <button
                    key={ch.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors
                      ${isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : isDone
                          ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
                          : "bg-card border-border hover:bg-accent text-muted-foreground hover:text-foreground"
                      }`}
                    onClick={() => setSelectedChapter(ch.id)}
                    data-testid={`study-chapter-${ch.id}`}
                  >
                    {isDone && !isActive && <CheckCircle2 className="h-3 w-3" />}
                    {ch.title.replace(/^Avsnitt \d+: /, '')}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      {currentChapter ? (
        <>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {currentChapter.domain.title}
              </p>
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
