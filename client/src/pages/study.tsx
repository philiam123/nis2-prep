import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { domainData } from "@/data/domains";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, CheckCircle2, Shield, Users } from "lucide-react";

export default function StudyPage() {
  const [selectedChapter, setSelectedChapter] = useState<string>(domainData[0].chapters[0].id);
  const [expandedDomains, setExpandedDomains] = useState<number[]>([1]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  const toggleDomain = (id: number) => {
    setExpandedDomains((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const currentChapter = useMemo(() => {
    for (const domain of domainData) {
      const ch = domain.chapters.find((c) => c.id === selectedChapter);
      if (ch) return { chapter: ch, domain };
    }
    return null;
  }, [selectedChapter]);

  const selectChapter = (id: string) => {
    setSelectedChapter(id);
    setMobileNavOpen(false);
  };

  const ChapterNav = () => (
    <div className="space-y-1">
      {domainData.map((domain) => (
        <div key={domain.id}>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
            onClick={() => toggleDomain(domain.id)}
            data-testid={`study-domain-toggle-${domain.id}`}
          >
            {expandedDomains.includes(domain.id) ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
            {domain.id === 1 ? (
              <Shield className="h-4 w-4 shrink-0 text-cyan-500" />
            ) : (
              <Users className="h-4 w-4 shrink-0 text-blue-500" />
            )}
            <span className="truncate text-left">
              Track {domain.numeral}: {domain.shortTitle}
            </span>
          </button>
          {expandedDomains.includes(domain.id) && (
            <div className="ml-4 space-y-0.5">
              {domain.chapters.map((ch) => (
                <button
                  key={ch.id}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent ${
                    selectedChapter === ch.id ? "bg-accent font-medium" : ""
                  }`}
                  onClick={() => selectChapter(ch.id)}
                  data-testid={`study-chapter-${ch.id}`}
                >
                  {completedSet.has(ch.id) ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40 shrink-0" />
                  )}
                  <span className="truncate text-left">{ch.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Desktop sidebar nav */}
      <aside className="hidden md:block w-72 border-r shrink-0">
        <ScrollArea className="h-full p-3">
          <h2 className="font-semibold text-sm px-3 mb-2">Kursmaterial</h2>
          <ChapterNav />
        </ScrollArea>
      </aside>

      {/* Mobile nav toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          data-testid="study-mobile-nav-toggle"
        >
          Moduler
        </Button>
      </div>
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Moduler</h2>
            <Button variant="ghost" size="sm" onClick={() => setMobileNavOpen(false)}>
              Stäng
            </Button>
          </div>
          <ChapterNav />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
          <div className="p-4 md:p-6 max-w-4xl w-full">
            {currentChapter ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Track {currentChapter.domain.numeral}: {currentChapter.domain.shortTitle}
                    </p>
                    <h1 className="text-xl font-bold" data-testid="study-chapter-title">
                      {currentChapter.chapter.title}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentChapter.domain.chapters.filter(c => completedSet.has(c.id)).length} av {currentChapter.domain.chapters.length} moduler avklarade i detta spår
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
                <div className="mt-8 flex justify-between">
                  <PrevNextButton direction="prev" currentId={selectedChapter} onSelect={setSelectedChapter} />
                  <PrevNextButton direction="next" currentId={selectedChapter} onSelect={setSelectedChapter} />
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Välj en modul för att börja studera.</p>
            )}
          </div>
      </main>
    </div>
  );
}

function PrevNextButton({
  direction,
  currentId,
  onSelect,
}: {
  direction: "prev" | "next";
  currentId: string;
  onSelect: (id: string) => void;
}) {
  const allChapters = domainData.flatMap((d) => d.chapters);
  const currentIndex = allChapters.findIndex((c) => c.id === currentId);
  const targetIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
  const target = allChapters[targetIndex];

  if (!target) return <div />;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onSelect(target.id)}
      data-testid={`study-${direction}-btn`}
    >
      {direction === "prev" ? "← " : ""}
      {target.title}
      {direction === "next" ? " →" : ""}
    </Button>
  );
}
