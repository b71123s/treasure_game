import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getScores, GameScore } from "@/lib/api";

interface ScoreHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScoreHistory({ open, onOpenChange }: ScoreHistoryProps) {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    getScores()
      .then(setScores)
      .catch(() => setScores([]))
      .finally(() => setIsLoading(false));
  }, [open]);

  function formatDate(dateStr: string) {
    return new Date(dateStr + "Z").toLocaleString("zh-TW", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>歷史分數</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-6">載入中...</p>
        ) : scores.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">還沒有記錄，快去玩一局吧！</p>
        ) : (
          <div className="space-y-2">
            {scores.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border px-4 py-2 text-sm">
                <span className="text-muted-foreground">{formatDate(s.created_at)}</span>
                <span className="text-muted-foreground">{s.rounds} 輪</span>
                <span className={s.score >= 0 ? "font-semibold text-green-600" : "font-semibold text-destructive"}>
                  {s.score >= 0 ? "+" : ""}{s.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
