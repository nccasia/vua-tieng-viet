export interface Player {
  id: string;
  playerName: string;
  rating?: number;
}

export interface WordData {
  id: string;
  letters: string[];
}

export interface GameState {
  gameId: string | null;
  currentWord: WordData | null;
  isPlaying: boolean;
  score?: {
    player: number;
    opponent: number;
  };
  timeLeft?: number;
}
