
export interface NameOfAllah {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  bn: {
    transliteration: string;
    meaning: string;
  };
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GameStatus = 'IDLE' | 'PLAYING' | 'ENDED' | 'LEARN';

export interface LevelConfig {
  questions: number;
  timeLimit: number | null; // Total time in seconds, null for no limit
}

export interface QuestionData {
  question: NameOfAllah;
  options: NameOfAllah[];
}
