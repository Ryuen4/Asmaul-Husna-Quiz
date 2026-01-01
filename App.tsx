import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Loader2,
  CheckSquare,
  Clock,
  HelpCircle,
  BookOpen,
  Search,
  ArrowLeft,
  GraduationCap,
  Trophy
} from 'lucide-react';
import { NAMES_OF_ALLAH, DifficultyConfig } from './constants';
import { NameOfAllah, DifficultyLevel, GameStatus, QuestionData } from './types';

// --- Types ---

interface QuizResultData {
  score: number;
  total: number;
  questions: QuestionData[];
  answers: Record<number, number>;
  level: DifficultyLevel;
}

// --- Local Storage Utility ---
const STORAGE_KEY = 'asmaul_husna_stats';
const getStats = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
};
const saveStat = (level: string, score: number) => {
  const stats = getStats();
  const currentBest = stats[level] || 0;
  if (score > currentBest) {
    stats[level] = score;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }
};

// --- Components ---

const Button: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 shadow-md";
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-600",
    outline: "border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const StartScreen: React.FC<{ 
  onStart: (level: DifficultyLevel) => void;
  onLearn: () => void;
}> = ({ onStart, onLearn }) => {
  const stats = getStats();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-4xl mx-auto text-center animate-fade-in animate-spiritual">
      <div className="mb-8 relative p-12">
        <div className="absolute inset-0 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
        <h1 className="relative text-5xl md:text-7xl font-bold text-emerald-900 mb-2 font-arabic tracking-wide">
          الأسماء الحسنى
        </h1>
        <h2 className="relative text-2xl md:text-3xl font-semibold text-slate-700">99 Names of Allah</h2>
      </div>
      
      <p className="text-slate-600 mb-10 text-lg max-w-md mx-auto drop-shadow-sm font-medium">
        An interactive journey to learn the beautiful attributes of the Creator.
      </p>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-left px-2">Knowledge Quiz</h3>
          {(Object.keys(DifficultyConfig) as DifficultyLevel[]).map((level) => {
            const config = DifficultyConfig[level];
            const bestScore = stats[level];
            
            return (
              <button
                key={level}
                onClick={() => onStart(level)}
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm hover:bg-emerald-50/90 border-2 border-slate-200/50 hover:border-emerald-500 rounded-xl p-5 text-left transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 capitalize group-hover:text-emerald-700">
                      {level} Quiz
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {config.questions} Questions {config.timeLimit ? `• ${Math.floor(config.timeLimit / 60)}m` : ''}
                    </p>
                    {bestScore !== undefined && (
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        <Trophy size={10} /> Best: {bestScore}/{config.questions}
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-100/50 group-hover:bg-emerald-100 p-3 rounded-full transition-colors">
                    <Play size={20} className="text-slate-400 group-hover:text-emerald-600" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-left px-2">Browse & Study</h3>
          <button
            onClick={onLearn}
            className="group relative h-full flex flex-col items-center justify-center bg-emerald-600/90 backdrop-blur-sm hover:bg-emerald-700 text-white rounded-xl p-8 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
          >
            <div className="bg-white/20 p-6 rounded-full mb-4 shadow-inner">
              <BookOpen size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Learn Mode</h3>
            <p className="text-emerald-50 text-center opacity-90 font-medium text-sm">
              Study meanings and transliterations at your own pace. No time limits.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

const LearnScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredNames = useMemo(() => {
    return NAMES_OF_ALLAH.filter(name => 
      name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.arabic.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen animate-fade-in animate-spiritual">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/50 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onBack} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <GraduationCap className="text-emerald-600" /> Reference
            </h2>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Filter names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNames.map((name) => (
          <div key={name.id} className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:bg-white transition-all flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-slate-200 group-hover:text-emerald-200 self-start">#{name.id}</span>
            <h3 className="text-4xl font-arabic text-emerald-800 mb-2 leading-relaxed tracking-wide group-hover:scale-110 transition-transform">{name.arabic}</h3>
            <p className="text-lg font-bold text-slate-800">{name.transliteration}</p>
            <p className="text-sm text-slate-500 font-medium">{name.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuizScreen: React.FC<{
  level: DifficultyLevel;
  onEnd: (result: QuizResultData) => void;
}> = ({ level, onEnd }) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    const config = DifficultyConfig[level];
    const shuffled = [...NAMES_OF_ALLAH].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, config.questions);
    
    const quizData = selected.map(q => {
      const distractors = NAMES_OF_ALLAH.filter(n => n.id !== q.id).sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [...distractors, q].sort(() => 0.5 - Math.random());
      return { question: q, options };
    });

    setQuestions(quizData);
    setTimeLeft(config.timeLimit);
    setIsInitializing(false);
  }, [level]);

  useEffect(() => {
    if (isInitializing || timeLeft === null) return;
    if (timeLeft === 0) { handleSubmit(); return; }
    const timer = setTimeout(() => setTimeLeft(prev => prev! - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isInitializing]);

  const handleSubmit = () => {
    const score = questions.reduce((acc, q) => acc + (answers[q.question.id] === q.question.id ? 1 : 0), 0);
    onEnd({ score, total: questions.length, questions, answers, level });
  };

  if (isInitializing) return (
    <div className="flex h-screen items-center justify-center animate-spiritual">
      <Loader2 className="animate-spin text-emerald-600" size={48} />
    </div>
  );

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="flex flex-col min-h-screen animate-spiritual">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-emerald-900">{level.toUpperCase()}</span>
            {timeLeft !== null && (
              <div className={`px-4 py-1 rounded-full bg-white/50 border font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase">{answeredCount}/{questions.length}</span>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1"><div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6 pb-24">
          {questions.map((item, index) => (
            <div key={item.question.id} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 text-center md:text-right border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                  <span className="text-[10px] text-slate-300 font-bold uppercase">Question {index + 1}</span>
                  <h3 className="text-4xl font-arabic text-emerald-800 my-1">{item.question.arabic}</h3>
                  <p className="text-sm text-slate-500 italic font-serif">{item.question.transliteration}</p>
                </div>
                <div className="md:w-2/3 grid gap-2">
                  {item.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers(prev => ({ ...prev, [item.question.id]: opt.id }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${answers[item.question.id] === opt.id ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-50 hover:border-emerald-200'}`}
                    >
                      <span className="text-sm font-medium">{opt.meaning}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t p-4 z-20">
        <div className="max-w-3xl mx-auto">
          <Button onClick={handleSubmit} className="w-full">
            <CheckSquare size={20} /> Finish Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

const ResultScreen: React.FC<{
  data: QuizResultData;
  onRetry: () => void;
}> = ({ data, onRetry }) => {
  const percentage = Math.round((data.score / data.total) * 100);

  useEffect(() => {
    saveStat(data.level, data.score);
  }, []);

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto animate-fade-in animate-spiritual pb-20">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-emerald-500/20 shadow-2xl text-center mb-8 mt-10">
        <div className="w-32 h-32 rounded-full border-8 border-emerald-50 flex items-center justify-center bg-white mx-auto mb-6 shadow-inner">
          <span className="text-4xl font-black text-emerald-600">{percentage}%</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {percentage === 100 ? "Masha'Allah!" : percentage >= 80 ? "Excellent!" : "Keep Practicing!"}
        </h2>
        <p className="text-slate-500 mb-8">You got {data.score} out of {data.total} correct.</p>
        <Button onClick={onRetry} variant="primary" className="mx-auto">
          <RotateCcw size={18} /> Home Menu
        </Button>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">Review Results</h3>
      <div className="space-y-3">
        {data.questions.map((q, i) => {
          const isCorrect = data.answers[q.question.id] === q.question.id;
          return (
            <div key={q.question.id} className={`p-4 rounded-xl border-l-4 bg-white shadow-sm ${isCorrect ? 'border-emerald-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-arabic text-xl font-bold">{q.question.arabic}</span>
                    <span className="text-sm text-slate-500 italic">{q.question.transliteration}</span>
                  </div>
                  <p className="text-sm font-semibold">{q.question.meaning}</p>
                </div>
                {isCorrect ? <CheckCircle className="text-emerald-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<GameStatus>('IDLE');
  const [level, setLevel] = useState<DifficultyLevel>('easy');
  const [resultData, setResultData] = useState<QuizResultData | null>(null);

  const handleStart = (l: DifficultyLevel) => { setLevel(l); setGameState('PLAYING'); };
  const handleLearn = () => setGameState('LEARN');
  const handleEnd = (r: QuizResultData) => { setResultData(r); setGameState('ENDED'); };
  const handleRetry = () => { setGameState('IDLE'); setResultData(null); };

  return (
    <div className="min-h-screen bg-slate-50">
      {gameState === 'IDLE' && <StartScreen onStart={handleStart} onLearn={handleLearn} />}
      {gameState === 'LEARN' && <LearnScreen onBack={handleRetry} />}
      {gameState === 'PLAYING' && <QuizScreen level={level} onEnd={handleEnd} />}
      {gameState === 'ENDED' && resultData && <ResultScreen data={resultData} onRetry={handleRetry} />}
    </div>
  );
}