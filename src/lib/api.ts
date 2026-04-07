export interface GameScore {
  id: number;
  score: number;
  rounds: number;
  created_at: string;
}

const STORAGE_KEY = "gameScores";

function getLocalScores(): GameScore[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveScore(score: number, rounds: number): Promise<void> {
  const scores = getLocalScores();
  const newScore: GameScore = {
    id: scores.length > 0 ? Math.max(...scores.map((s) => s.id)) + 1 : 1,
    score,
    rounds,
    created_at: new Date().toISOString(),
  };
  scores.push(newScore);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export async function getScores(): Promise<GameScore[]> {
  return getLocalScores()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);
}
