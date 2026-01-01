
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
  Check,
  List,
  Languages
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

type Language = 'en' | 'bn';

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

const useLanguage = () => {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang');
      return (saved as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'bn' : 'en');
  return { lang, toggleLang };
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
    className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 transition-colors"
    aria-label="Toggle Theme"
  >
    {theme === 'light' ? <Moon size={16} className="text-slate-600" /> : <Sun size={16} className="text-amber-400" />}
  </button>
);

const LanguageToggle = ({ lang, onToggle }: { lang: Language, onToggle: () => void }) => (
  <button 
    onClick={onToggle}
    className="px-2 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 transition-colors text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 min-w-[3rem] justify-center"
    aria-label="Toggle Language"
  >
    {lang === 'en' ? 'BN' : 'EN'}
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
    primary: "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600",
    outline: "border border-emerald-700 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-500",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`px-4 py-2 rounded-md font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}
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
  lang: Language;
  toggleLang: () => void;
}> = ({ onStart, onLearn, theme, toggleTheme, lang, toggleLang }) => {
  const stats = getStats();

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 spiritual-bg">
      <header className="flex justify-between items-center max-w-4xl mx-auto w-full mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-700 dark:text-emerald-500" size={18} />
          <span className="font-bold tracking-tight text-slate-800 dark:text-slate-200 uppercase text-xs">Asmaul Husna</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle lang={lang} onToggle={toggleLang} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full flex flex-col justify-center gap-12">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-arabic text-emerald-900 dark:text-emerald-50 mb-2">الأسماء الحسنى</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <List size={14} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Select Exam Module</span>
          </div>
          <div className="grid gap-2">
            {(Object.keys(DifficultyConfig) as DifficultyLevel[]).map((level) => {
              const config = DifficultyConfig[level];
              const bestScore = stats[level];
              return (
                <button
                  key={level}
                  onClick={() => onStart(level)}
                  className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-emerald-600 transition-colors"
                >
                  <div className="text-left">
                    <span className="block text-sm font-bold capitalize text-slate-800 dark:text-slate-100">{level}</span>
                    <span className="text-[10px] text-slate-400">{config.questions} Attributes • {config.timeLimit ? `${config.timeLimit / 60}m` : 'Unlimited'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {bestScore !== undefined && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/50">
                        {bestScore}/{config.questions}
                      </span>
                    )}
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600" />
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={onLearn}
            className="w-full mt-4 p-4 border border-dashed border-emerald-200 dark:border-emerald-800 rounded-lg text-sm font-bold text-emerald-700 dark:text-emerald-500 flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
          >
            <BookOpen size={16} /> Open Study Library
          </button>
        </div>
      </main>
    </div>
  );
};

const LearnScreen: React.FC<{ onBack: () => void; theme: 'light' | 'dark'; toggleTheme: () => void; lang: Language; toggleLang: () => void }> = ({ onBack, theme, toggleTheme, lang, toggleLang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredNames = useMemo(() => {
    return NAMES_OF_ALLAH.filter(name => 
      name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.arabic.includes(searchTerm) ||
      name.bn.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.bn.meaning.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md">
            <ArrowLeft size={18} />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input 
              type="text"
              placeholder="Search library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-md outline-none text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle lang={lang} onToggle={toggleLang} />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredNames.map((name) => (
          <div key={name.id} className="p-4 border-b border-slate-50 dark:border-slate-900 flex justify-between items-center">
            <div className="flex gap-4 items-center">
               <span className="text-[10px] font-mono text-slate-300">{name.id}</span>
               <div>
                 <p className={`text-xs font-bold text-slate-800 dark:text-slate-200 ${lang === 'bn' ? 'font-bengali text-[14px] tracking-wide' : 'uppercase'}`}>
                   {lang === 'bn' ? name.bn.transliteration : name.transliteration}
                 </p>
                 <p className={`text-[10px] text-slate-400 italic ${lang === 'bn' ? 'font-bengali text-[12px] tracking-wide' : ''}`}>
                   {lang === 'bn' ? name.bn.meaning : name.meaning}
                 </p>
               </div>
            </div>
            <span className="text-3xl font-arabic text-emerald-800 dark:text-emerald-100">{name.arabic}</span>
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
  lang: Language;
  toggleLang: () => void;
}> = ({ level, onEnd, onExit, theme, toggleTheme, lang, toggleLang }) => {
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
    <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
      <Loader2 className="animate-spin text-emerald-600" size={24} />
    </div>
  );

  const answeredCount = Object.keys(answers).length;

  // Labels based on language
  const labels = {
    exam: lang === 'bn' ? 'পরীক্ষা' : 'Exam',
    answered: lang === 'bn' ? 'উত্তর দেওয়া হয়েছে' : 'Answered',
    of: lang === 'bn' ? '/' : 'of',
    submit: lang === 'bn' ? 'জমা দিন' : 'Submit Exam',
    submitNow: lang === 'bn' ? 'জমা দিন' : 'Submit Now',
    completed: lang === 'bn' ? 'সম্পন্ন' : 'Completed'
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button onClick={onExit} className="p-1 hover:text-red-500 transition-colors">
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex-1 flex flex-col items-center">
            <span className={`text-[10px] font-bold text-emerald-700 dark:text-emerald-500 tracking-widest ${lang === 'bn' ? 'font-bengali' : 'uppercase'}`}>
              {level} {labels.exam}
            </span>
            <div className={`text-[9px] text-slate-400 font-bold uppercase ${lang === 'bn' ? 'font-bengali' : ''}`}>
              {answeredCount} {labels.of} {questions.length} {labels.answered}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {timeLeft !== null && (
              <div className={`font-mono font-bold text-xs ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            )}
            <div className="flex items-center gap-2">
              <LanguageToggle lang={lang} onToggle={toggleLang} />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-12 pb-32">
        {questions.map((q, idx) => (
          <div key={q.question.id} className="animate-fade-in group">
            <div className="flex items-center gap-4 mb-4 border-b border-slate-50 dark:border-slate-900 pb-2">
              <span className="text-[10px] font-mono text-slate-300 dark:text-slate-700 w-6 flex-shrink-0">{idx + 1}.</span>
              <div className="flex-1 flex items-center justify-center gap-4">
                <span className={`font-black text-slate-700 dark:text-slate-300 tracking-wide ${lang === 'bn' ? 'font-bengali text-[15px] tracking-widest' : 'text-xs uppercase'}`}>
                  {lang === 'bn' ? q.question.bn.transliteration : q.question.transliteration}
                </span>
                <span className="text-slate-200 dark:text-slate-800 font-bold text-xs">||</span>
                <span className="text-3xl font-arabic text-emerald-800 dark:text-emerald-50">
                  {q.question.arabic}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {q.options.map((opt) => {
                const isSelected = answers[q.question.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswerChange(q.question.id, opt.id)}
                    className={`w-full p-3 flex items-center gap-4 transition-all text-left font-bold ${
                      isSelected 
                      ? 'bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 border-l-2 border-emerald-600' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 border-l-2 border-transparent'
                    } ${lang === 'bn' ? 'font-bengali text-[15px] tracking-[0.03em] leading-relaxed py-3.5' : 'text-xs'}`}
                  >
                    <div className={`w-3 h-3 rounded-full border flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 dark:border-slate-700'
                    }`} />
                    <span>{lang === 'bn' ? opt.bn.meaning : opt.meaning}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleFinish} 
            className={`w-full sm:w-auto px-16 py-3 rounded-md ${lang === 'bn' ? 'font-bengali' : ''}`}
            disabled={answeredCount === 0}
          >
            <Send size={16} /> {labels.submit}
          </Button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-4 pointer-events-none flex justify-center z-50">
         <div className="bg-slate-900 dark:bg-slate-800 text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-6 pointer-events-auto scale-90 sm:scale-100">
            <div className={`text-[10px] font-bold tracking-widest flex items-center gap-2 ${lang === 'bn' ? 'font-bengali' : 'uppercase'}`}>
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               {labels.completed}: {Math.round((answeredCount/questions.length)*100)}%
            </div>
            <div className="h-4 w-[px] bg-white/10" />
            <button 
              onClick={handleFinish}
              className={`text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors ${lang === 'bn' ? 'font-bengali' : 'uppercase'}`}
            >
              {labels.submitNow}
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
  lang: Language;
  toggleLang: () => void;
}> = ({ data, onRetry, theme, toggleTheme, lang, toggleLang }) => {
  const percentage = Math.round((data.score / data.total) * 100);

  useEffect(() => {
    saveStat(data.level, data.score);
  }, []);

  const labels = {
    report: lang === 'bn' ? 'পরীক্ষার ফলাফল' : 'Assessment Final Report',
    mastery: lang === 'bn' ? 'চমৎকার দক্ষতা' : 'Excellent Mastery',
    commendable: lang === 'bn' ? 'প্রশংসনীয়' : 'Commendable',
    growth: lang === 'bn' ? 'উন্নতির অবকাশ আছে' : 'Room for Growth',
    correct: lang === 'bn' ? 'সঠিক উত্তর' : 'Correct Matches',
    of: lang === 'bn' ? 'এর মধ্যে' : 'of',
    retake: lang === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Module',
    home: lang === 'bn' ? 'মূল পাতা' : 'Return Home',
    analysis: lang === 'bn' ? 'বিশ্লেষণ' : 'Analysis',
    chosen: lang === 'bn' ? 'নির্বাচিত' : 'Chosen',
    empty: lang === 'bn' ? 'খালি' : 'Empty'
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 p-4 pb-20">
      <header className="flex justify-between items-center max-w-2xl mx-auto w-full py-4 mb-8">
        <span className={`text-[10px] font-bold text-slate-400 tracking-widest ${lang === 'bn' ? 'font-bengali' : 'uppercase'}`}>
          {labels.report}
        </span>
        <div className="flex items-center gap-2">
          <LanguageToggle lang={lang} onToggle={toggleLang} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="flex-1 max-xl mx-auto w-full animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-block text-5xl font-black text-emerald-700 dark:text-emerald-400 mb-2">{percentage}%</div>
          <h2 className={`text-xl font-bold text-slate-800 dark:text-slate-100 ${lang === 'bn' ? 'font-bengali' : ''}`}>
            {percentage === 100 ? labels.mastery : percentage >= 80 ? labels.commendable : labels.growth}
          </h2>
          <p className={`text-xs text-slate-500 dark:text-slate-400 mt-1 tracking-wider ${lang === 'bn' ? 'font-bengali text-[13px]' : 'uppercase'}`}>
            {data.score} {labels.of} {data.total} {labels.correct}
          </p>
        </div>

        <div className="flex gap-2 mb-12">
          <Button onClick={onRetry} variant="primary" className={`flex-1 text-xs ${lang === 'bn' ? 'font-bengali text-[14px]' : ''}`}>{labels.retake}</Button>
          <Button onClick={onRetry} variant="ghost" className={`flex-1 text-xs ${lang === 'bn' ? 'font-bengali text-[14px]' : ''}`}>{labels.home}</Button>
        </div>

        <div className="space-y-6">
          <h3 className={`text-[10px] font-bold text-slate-400 tracking-widest border-b border-slate-50 dark:border-slate-900 pb-2 ${lang === 'bn' ? 'font-bengali' : 'uppercase'}`}>
            {labels.analysis}
          </h3>
          {data.questions.map((q, idx) => {
            const isCorrect = data.answers[q.question.id] === q.question.id;
            const userAnswerObj = q.options.find(o => o.id === data.answers[q.question.id]);
            const userAnswer = lang === 'bn' ? userAnswerObj?.bn.meaning || labels.empty : userAnswerObj?.meaning || labels.empty;
            
            return (
              <div key={q.question.id} className="flex justify-between items-start gap-4">
                <div className="flex gap-3">
                  <span className="text-[9px] font-mono text-slate-300">{idx + 1}</span>
                  <div>
                    <div className="flex items-baseline gap-2">
                       <span className={`text-xs font-bold text-slate-800 dark:text-slate-200 ${lang === 'bn' ? 'font-bengali text-[15px] tracking-wide' : ''}`}>
                         {lang === 'bn' ? q.question.bn.transliteration : q.question.transliteration}
                       </span>
                       <span className="text-xl font-arabic text-emerald-800 dark:text-emerald-50 leading-none">{q.question.arabic}</span>
                    </div>
                    {!isCorrect && <div className={`text-[10px] text-red-500 font-bold mt-1 ${lang === 'bn' ? 'font-bengali text-[13px] tracking-wide' : ''}`}>{labels.chosen}: {userAnswer}</div>}
                    <div className={`text-[10px] ${isCorrect ? 'text-emerald-600' : 'text-slate-400'} font-medium italic mt-0.5 ${lang === 'bn' ? 'font-bengali text-[13px] tracking-wide' : ''}`}>
                       {lang === 'bn' ? q.question.bn.meaning : q.question.meaning}
                    </div>
                  </div>
                </div>
                {isCorrect ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" /> : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
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
  const { lang, toggleLang } = useLanguage();

  const handleStart = (l: DifficultyLevel) => { setLevel(l); setGameState('PLAYING'); };
  const handleLearn = () => setGameState('LEARN');
  const handleEnd = (r: QuizResultData) => { setResultData(r); setGameState('ENDED'); };
  const handleRetry = () => { setGameState('IDLE'); setResultData(null); };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {gameState === 'IDLE' && <StartScreen onStart={handleStart} onLearn={handleLearn} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />}
      {gameState === 'LEARN' && <LearnScreen onBack={handleRetry} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />}
      {gameState === 'PLAYING' && <QuizScreen level={level} onEnd={handleEnd} onExit={handleRetry} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />}
      {gameState === 'ENDED' && resultData && <ResultScreen data={resultData} onRetry={handleRetry} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />}
    </div>
  );
}
