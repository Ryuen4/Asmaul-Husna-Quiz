import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Loader2,
  Clock,
  BookOpen,
  Search,
  ArrowLeft,
  GraduationCap,
  Trophy,
  Sun,
  Moon,
  ChevronRight,
  Send,
  Info,
  Check
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

// --- Hooks ---
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  return { theme, toggleTheme };
};

// --- Storage ---
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
const ThemeToggle = ({ theme, onToggle }: { theme: 'light' | 'dark', onToggle: () => void }) => (
  <button 
    onClick={onToggle}
    className="p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 transition-all shadow-sm border border-slate-200 dark:border-slate-700"
    aria-label="Toggle Theme"
  >
    {theme === 'light' ? <Moon size={18} className="text-slate-600" /> : <Sun size={18} className="text-amber-400" />}
  </button>
);

const Button: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600",
    outline: "border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const StartScreen: React.FC<{ 
  onStart: (level: DifficultyLevel) => void;
  onLearn: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}> = ({ onStart, onLearn, theme, toggleTheme }) => {
  const stats = getStats();

  return (
    <div className="flex flex-col min-h-screen p-6 spiritual-bg relative">
      <header className="flex justify-between items-center py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 dark:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="font-black tracking-tight text-slate-800 dark:text-white uppercase text-sm">Asmaul Husna</span>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full py-12">
        <div className="mb-16 text-center animate-fade-in">
          <h1 className="text-7xl md:text-9xl font-arabic text-emerald-900 dark:text-emerald-50 mb-4 drop-shadow-sm select-none">
            الأسماء الحسنى
          </h1>
          <p className="text-lg md:text-xl font-medium tracking-wide text-emerald-700 dark:text-emerald-400 uppercase">99 Beautiful Names of Allah</p>
          <div className="mt-8 w-16 h-1.5 bg-emerald-500 mx-auto rounded-full shadow-lg shadow-emerald-500/20"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 w-full">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Certification Exams</h3>
            {(Object.keys(DifficultyConfig) as DifficultyLevel[]).map((level) => {
              const config = DifficultyConfig[level];
              const bestScore = stats[level];
              return (
                <button
                  key={level}
                  onClick={() => onStart(level)}
                  className="w-full group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-emerald-500 dark:hover:border-emerald-500 flex justify-between items-center relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black capitalize text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {level}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {config.questions} Questions • {config.timeLimit ? `${Math.floor(config.timeLimit / 60)} min` : 'Un-timed'}
                    </p>
                    {bestScore !== undefined && (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/50">
                        <Trophy size={12} /> BEST RECORD: {bestScore}/{config.questions}
                      </div>
                    )}
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                    <Play size={20} fill="currentColor" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Learning Path</h3>
            <button
              onClick={onLearn}
              className="flex-1 bg-white dark:bg-slate-900 border-2 border-dashed border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 transition-all hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 group"
            >
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-6 rounded-3xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <BookOpen size={48} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-black mb-2 text-slate-800 dark:text-slate-100">Study Materials</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs font-medium">Memorize the meanings and transliterations before the assessment.</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                Open Library <ChevronRight size={18} />
              </div>
            </button>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 dark:text-slate-600 text-xs font-medium">
        Built for continuous spiritual improvement. Version 4.0
      </footer>
    </div>
  );
};

const LearnScreen: React.FC<{ onBack: () => void; theme: 'light' | 'dark'; toggleTheme: () => void }> = ({ onBack, theme, toggleTheme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredNames = useMemo(() => {
    return NAMES_OF_ALLAH.filter(name => 
      name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.arabic.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col spiritual-bg">
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-black flex items-center gap-2 hidden lg:flex">
              <GraduationCap className="text-emerald-600 dark:text-emerald-400" size={24} /> 
              Study Library
            </h2>
          </div>
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name, meaning or transliteration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium transition-all"
            />
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
        {filteredNames.map((name) => (
          <div key={name.id} className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-black text-sm mb-6 border border-slate-100 dark:border-slate-700">
              {String(name.id).padStart(2, '0')}
            </div>
            <h3 className="text-5xl font-arabic text-emerald-900 dark:text-emerald-50 mb-4 leading-normal tracking-wide group-hover:scale-110 transition-transform duration-500">{name.arabic}</h3>
            <div className="space-y-1">
              <p className="text-xl font-black text-slate-800 dark:text-slate-100">{name.transliteration}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold italic">{name.meaning}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

const QuizScreen: React.FC<{
  level: DifficultyLevel;
  onEnd: (result: QuizResultData) => void;
  onExit: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}> = ({ level, onEnd, onExit, theme, toggleTheme }) => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    if (timeLeft === 0) { handleFinish(); return; }
    const timer = setTimeout(() => setTimeLeft(prev => prev! - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isInitializing]);

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleFinish = () => {
    const score = questions.reduce((acc, q) => 
      acc + (answers[q.question.id] === q.question.id ? 1 : 0), 0);
    onEnd({ score, total: questions.length, questions, answers, level });
  };

  if (isInitializing) return (
    <div className="flex h-screen items-center justify-center spiritual-bg">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-emerald-700 dark:text-emerald-400 font-bold animate-pulse">Assembling Exam Paper...</p>
      </div>
    </div>
  );

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col spiritual-bg selection:bg-emerald-100 dark:selection:bg-emerald-900">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/50">
               <ArrowLeft size={20} />
            </button>
            <div className="hidden sm:block">
              <span className="font-black text-emerald-600 dark:text-emerald-400 capitalize text-sm tracking-tight">{level} Level Examination</span>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">Formal Assessment Mode</div>
            </div>
          </div>

          {timeLeft !== null && (
            <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-black text-base shadow-inner ${timeLeft < 60 ? 'text-red-500 animate-pulse border-red-200' : 'text-slate-700 dark:text-slate-300'}`}>
              <Clock size={18} className={timeLeft < 60 ? 'animate-bounce' : ''} />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          )}

          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end gap-1.5 hidden md:flex min-w-[140px]">
              <div className="flex justify-between w-full">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Answered</span>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{answeredCount}/{questions.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-lg shadow-emerald-500/40" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-10 pb-40">
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-4">
          <div className="mt-0.5 p-1.5 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
            <Info size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="font-semibold leading-relaxed">
            Please identify the correct meaning for each Arabic attribute below.
            <span className="block text-xs mt-1 text-emerald-600 dark:text-emerald-500 font-medium italic opacity-80">Tip: Scroll down and click 'Submit' once you have completed all questions.</span>
          </p>
        </div>

        {questions.map((q, idx) => (
          <div 
            key={q.question.id} 
            ref={el => scrollRefs.current[idx] = el}
            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-2xl hover:border-emerald-500/20 animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-10 pb-8 border-b border-slate-50 dark:border-slate-800/50">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 font-black text-lg border border-slate-100 dark:border-slate-700 shadow-inner group-hover:text-emerald-500 transition-colors">
                  {idx + 1}
                </div>
                <div className="text-center sm:text-left">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Attribute</div>
                   <h3 className="text-5xl md:text-6xl font-arabic text-emerald-900 dark:text-emerald-50 leading-relaxed tracking-wide drop-shadow-sm group-hover:scale-[1.02] transition-transform duration-500">
                     {q.question.arabic}
                   </h3>
                   <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                     <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-black tracking-widest uppercase border border-emerald-100 dark:border-emerald-800">
                        {q.question.transliteration}
                     </span>
                   </div>
                </div>
              </div>
              {answers[q.question.id] !== undefined && (
                <div className="p-3 rounded-full bg-emerald-500 dark:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 animate-fade-in">
                  <Check size={24} strokeWidth={4} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {q.options.map((opt) => {
                const isSelected = answers[q.question.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswerChange(q.question.id, opt.id)}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 text-sm font-bold overflow-hidden ${
                      isSelected 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-500 dark:text-emerald-100 shadow-lg shadow-emerald-500/10' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? 'border-emerald-500 bg-emerald-500 rotate-0' : 'border-slate-200 dark:border-slate-600 rotate-12'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                    <span className="relative z-10 leading-snug">{opt.meaning}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center pt-20 pb-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              answeredCount === questions.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
               {answeredCount === questions.length ? "Examination Complete" : `${questions.length - answeredCount} Questions Remaining`}
            </div>
            {answeredCount < questions.length && (
              <p className="text-slate-400 dark:text-slate-600 text-xs font-medium">Please answer all attributes before submitting your exam.</p>
            )}
          </div>
          <Button 
            onClick={handleFinish} 
            className="w-full sm:w-auto px-20 py-6 text-2xl rounded-3xl shadow-2xl hover:scale-105 active:scale-95 shadow-emerald-500/20 group"
            disabled={answeredCount === 0}
          >
            <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
            Final Submission
          </Button>
        </div>
      </main>

      {/* Floating Status Bar */}
      <div className="fixed bottom-0 left-0 w-full p-8 pointer-events-none flex justify-center z-[60]">
         <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl text-white px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-10 pointer-events-auto border border-white/10 scale-90 sm:scale-100">
            <div className="flex items-center gap-4">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">Progress</span>
                  <span className="text-base font-black tracking-tight">{answeredCount} / {questions.length}</span>
               </div>
               <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                 <div className="h-full bg-emerald-500 shadow-lg shadow-emerald-500/50 transition-all duration-1000" style={{ width: `${progress}%` }} />
               </div>
            </div>
            
            <div className="h-10 w-[1px] bg-white/10"></div>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex flex-col items-center gap-1"
            >
              <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">Navigation</span>
              <span className="text-xs font-black group-hover:text-emerald-400 transition-colors">Scroll to Top</span>
            </button>

            <button 
              onClick={handleFinish}
              disabled={answeredCount === 0}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              Submit <Send size={16} />
            </button>
         </div>
      </div>
    </div>
  );
};

const ResultScreen: React.FC<{
  data: QuizResultData;
  onRetry: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}> = ({ data, onRetry, theme, toggleTheme }) => {
  const percentage = Math.round((data.score / data.total) * 100);

  useEffect(() => {
    saveStat(data.level, data.score);
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-6 spiritual-bg pb-20">
      <header className="flex justify-between items-center py-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-600 dark:text-emerald-400" size={24} />
          <span className="font-black tracking-tight text-slate-800 dark:text-white uppercase text-sm">Exam Report</span>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full animate-fade-in mt-12">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-emerald-500/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] dark:shadow-2xl text-center mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"></div>
          
          <div className="w-48 h-48 rounded-full border-[12px] border-emerald-50/50 dark:border-emerald-950/50 flex flex-col items-center justify-center bg-white dark:bg-slate-800 mx-auto mb-10 shadow-2xl relative">
             <div className="text-6xl font-black text-emerald-600 dark:text-emerald-400">{percentage}%</div>
             <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Overall Score</div>
          </div>
          
          <h2 className="text-5xl font-black text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
            {percentage === 100 ? "Subhan'Allah!" : percentage >= 80 ? "Masha'Allah!" : "Alhamdulillah!"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-12 text-xl font-medium max-w-md mx-auto leading-relaxed">
            You successfully identified <span className="text-emerald-600 dark:text-emerald-400 font-black">{data.score}</span> of the {data.total} Divine Attributes correctly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button onClick={onRetry} variant="primary" className="px-16 py-5 text-xl rounded-2xl shadow-xl shadow-emerald-500/20">
              <RotateCcw size={22} strokeWidth={3} /> Retake Exam
            </Button>
            <Button onClick={onRetry} variant="ghost" className="px-10 font-black tracking-wide">
              Exit to Menu
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
               <GraduationCap size={28} className="text-emerald-500" /> Assessment Feedback
            </h3>
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest">
              Reviewing {data.total} Items
            </div>
          </div>

          {data.questions.map((q, idx) => {
            const isCorrect = data.answers[q.question.id] === q.question.id;
            const userAnswer = q.options.find(o => o.id === data.answers[q.question.id])?.meaning || "Not Answered";
            
            return (
              <div key={q.question.id} className={`p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-2 shadow-sm transition-all hover:scale-[1.01] ${isCorrect ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-8">
                    <div className="text-sm font-black text-slate-300 dark:text-slate-700 w-6">{(idx + 1).toString().padStart(2, '0')}</div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <span className="font-arabic text-4xl text-emerald-900 dark:text-emerald-100 leading-normal select-none">{q.question.arabic}</span>
                      <div className="flex flex-col">
                        <div className="font-black text-slate-800 dark:text-slate-100 text-base">{q.question.transliteration}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-semibold italic">{q.question.meaning}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end lg:items-end text-right gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className={`flex items-center gap-2 font-black text-sm uppercase tracking-widest ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      {isCorrect ? "Correct Match" : "Incorrect Match"}
                    </div>
                    
                    {!isCorrect && (
                      <div className="bg-red-50/50 dark:bg-red-950/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/50 min-w-[200px]">
                        <div className="mb-2">
                          <div className="text-[9px] uppercase font-black text-slate-400 mb-0.5 tracking-widest">Selected Response</div>
                          <div className="text-sm text-red-600 dark:text-red-400 font-bold leading-tight">{userAnswer}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-black text-slate-400 mb-0.5 tracking-widest">Expected Response</div>
                          <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold leading-tight">{q.question.meaning}</div>
                        </div>
                      </div>
                    )}
                    
                    {isCorrect && (
                      <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                        Excellent Memory
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<GameStatus>('IDLE');
  const [level, setLevel] = useState<DifficultyLevel>('easy');
  const [resultData, setResultData] = useState<QuizResultData | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleStart = (l: DifficultyLevel) => { 
    setLevel(l); 
    setGameState('PLAYING');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  
  const handleLearn = () => {
    setGameState('LEARN');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  
  const handleEnd = (r: QuizResultData) => { 
    setResultData(r); 
    setGameState('ENDED');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleRetry = () => { 
    setGameState('IDLE'); 
    setResultData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {gameState === 'IDLE' && <StartScreen onStart={handleStart} onLearn={handleLearn} theme={theme} toggleTheme={toggleTheme} />}
      {gameState === 'LEARN' && <LearnScreen onBack={handleRetry} theme={theme} toggleTheme={toggleTheme} />}
      {gameState === 'PLAYING' && <QuizScreen level={level} onEnd={handleEnd} onExit={handleRetry} theme={theme} toggleTheme={toggleTheme} />}
      {gameState === 'ENDED' && resultData && <ResultScreen data={resultData} onRetry={handleRetry} theme={theme} toggleTheme={toggleTheme} />}
    </div>
  );
}