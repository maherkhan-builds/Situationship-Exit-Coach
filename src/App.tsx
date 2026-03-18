import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  LayoutDashboard, 
  LogOut, 
  Heart, 
  Settings, 
  ChevronRight, 
  Upload, 
  AlertCircle,
  TrendingUp,
  User,
  ArrowRight,
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  Smile
} from 'lucide-react';
import { analyzeRelationship, AnalysisResult } from './services/geminiService';

// --- Components ---

const ProgressBar = ({ value, label, color = "bg-lavender" }: { value: number, label: string, color?: string }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</span>
      <span className="text-xs font-bold">{value}%</span>
    </div>
    <div className="w-full bg-plum/10 rounded-full h-2">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-2 rounded-full ${color}`}
      />
    </div>
  </div>
);

const InsightCard = ({ title, content, icon: Icon }: { title: string, content: string, icon: any }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass-card p-4 rounded-2xl mb-4"
  >
    <div className="flex items-start gap-3">
      <div className="p-2 bg-lavender/10 rounded-lg">
        <Icon size={18} className="text-lavender" />
      </div>
      <div>
        <h4 className="text-sm font-bold mb-1">{title}</h4>
        <p className="text-xs leading-relaxed opacity-80">{content}</p>
      </div>
    </div>
  </motion.div>
);

// --- Screens ---

const Onboarding = ({ onComplete }: { onComplete: () => void }) => (
  <div className="min-h-screen flex flex-col p-6 justify-center items-center text-center">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
    >
      <Heart className="text-white" size={48} fill="white" />
    </motion.div>
    <motion.h1 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-4xl font-black mb-4 tracking-tight"
    >
      Situationship <br />
      <span className="gradient-text">Exit Coach</span>
    </motion.h1>
    <motion.p 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-lg opacity-70 mb-12 max-w-xs"
    >
      Stop guessing. Start knowing. AI-powered relationship clarity for the modern dater.
    </motion.p>
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onComplete}
      className="w-full py-4 gradient-bg text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"
    >
      Get Started <ArrowRight size={20} />
    </motion.button>
  </div>
);

const ChatInput = ({ onAnalyze }: { onAnalyze: (text: string) => void }) => {
  const [text, setText] = useState('');
  return (
    <div className="p-6">
      <h2 className="text-2xl font-black mb-2">Analyze Chat</h2>
      <p className="text-sm opacity-60 mb-6">Paste a conversation or describe your situation for a deep dive.</p>
      
      <div className="glass-card rounded-3xl p-4 mb-6">
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste messages here... (e.g. 'Them: I'm just busy right now. Me: But you were out last night?')"
          className="w-full h-64 bg-transparent resize-none focus:outline-none text-sm leading-relaxed"
        />
      </div>

      <div className="flex gap-4 mb-8">
        <button className="flex-1 py-3 border-2 border-lavender/20 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold opacity-70">
          <Upload size={18} /> Upload Screenshot
        </button>
      </div>

      <button
        disabled={!text.trim()}
        onClick={() => onAnalyze(text)}
        className="w-full py-4 gradient-bg text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Sparkles size={20} /> Analyze Now
      </button>
    </div>
  );
};

const AnalysisResults = ({ result, onBack }: { result: AnalysisResult, onBack: () => void }) => (
  <div className="p-6 pb-24">
    <div className="flex items-center gap-2 mb-6">
      <button onClick={onBack} className="p-2 hover:bg-plum/5 rounded-full">
        <ArrowRight className="rotate-180" size={20} />
      </button>
      <h2 className="text-2xl font-black">AI Analysis</h2>
    </div>

    <div className="glass-card rounded-3xl p-6 mb-6 text-center overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={80} />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block">Relationship Status</span>
      <h3 className={`text-3xl font-black mb-4 ${result.progressStatus === 'Not Going Anywhere' ? 'text-coral' : result.progressStatus === 'Progressing' ? 'text-emerald-500' : 'text-lavender'}`}>
        {result.progressStatus}
      </h3>
      <div className="flex justify-center items-center gap-4 mb-2">
        <div className="text-center">
          <div className="text-4xl font-black">{result.clarityScore}</div>
          <div className="text-[10px] uppercase font-bold opacity-50">Clarity Score</div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="glass-card p-4 rounded-2xl">
        <ProgressBar value={result.effortBalance.user} label="Your Effort" color="bg-soft-pink" />
        <ProgressBar value={result.effortBalance.them} label="Their Effort" color="bg-lavender" />
      </div>
      <div className="glass-card p-4 rounded-2xl">
        <ProgressBar value={result.consistencyIndex} label="Consistency" color="bg-coral" />
        <ProgressBar value={result.emotionalAvailability} label="Availability" color="bg-plum" />
      </div>
    </div>

    <h3 className="text-lg font-black mb-4 flex items-center gap-2">
      <BrainCircuit size={20} className="text-lavender" /> Deep Insights
    </h3>
    <InsightCard title="Behavior Suggests" content={result.insights.behaviorSuggests} icon={User} />
    <InsightCard title="What You're Overlooking" content={result.insights.overlooking} icon={AlertCircle} />
    <InsightCard title="Reality vs Perception" content={result.insights.realityVsPerception} icon={Sparkles} />
    
    <div className="glass-card p-6 rounded-3xl mb-6">
      <h4 className="font-bold mb-2">The Breakdown</h4>
      <p className="text-sm opacity-80 leading-relaxed">{result.insights.explanation}</p>
    </div>

    {result.flags.length > 0 && (
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Red Flags Detected</h4>
        <div className="flex flex-wrap gap-2">
          {result.flags.map(flag => (
            <span key={flag} className="px-3 py-1 bg-coral/10 text-coral text-xs font-bold rounded-full border border-coral/20">
              {flag}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ExitCoach = ({ result }: { result: AnalysisResult | null }) => {
  if (!result) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-lavender/10 rounded-full flex items-center justify-center mb-4">
        <ShieldCheck size={32} className="text-lavender" />
      </div>
      <h2 className="text-xl font-black mb-2">No Analysis Yet</h2>
      <p className="text-sm opacity-60">Analyze a chat first to get personalized exit strategies and scripts.</p>
    </div>
  );

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-black mb-6">Exit Strategy Coach</h2>
      
      <div className="glass-card p-6 rounded-3xl mb-6 border-l-4 border-l-coral">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <LogOut size={18} className="text-coral" /> The Game Plan
        </h3>
        <p className="text-sm opacity-80 leading-relaxed">{result.exitStrategy.advice}</p>
      </div>

      <h3 className="text-lg font-black mb-4">Conversation Scripts</h3>
      {result.exitStrategy.scripts.map((script, i) => (
        <div key={i} className="glass-card p-4 rounded-2xl mb-3 bg-plum/5">
          <p className="text-sm italic opacity-90">"{script}"</p>
        </div>
      ))}

      <h3 className="text-lg font-black mt-6 mb-4">Boundaries to Set</h3>
      <div className="space-y-3">
        {result.exitStrategy.boundaries.map((b, i) => (
          <div key={i} className="flex items-start gap-3 glass-card p-3 rounded-xl">
            <div className="mt-1"><ShieldCheck size={16} className="text-lavender" /></div>
            <p className="text-sm opacity-80">{b}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-black mt-6 mb-4">When to Walk Away</h3>
      <div className="space-y-3">
        {result.exitStrategy.signalsToWalkAway.map((s, i) => (
          <div key={i} className="flex items-start gap-3 glass-card p-3 rounded-xl border-l-2 border-l-coral/30">
            <div className="mt-1"><AlertCircle size={16} className="text-coral" /></div>
            <p className="text-sm opacity-80">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReflectionTracker = () => {
  const [mood, setMood] = useState<number | null>(null);
  const moods = ['😔', '😕', '😐', '🙂', '✨'];

  return (
    <div className="p-6 pb-24">
      <h2 className="text-2xl font-black mb-6">Reflection & Growth</h2>
      
      <div className="glass-card p-6 rounded-3xl mb-6">
        <h3 className="font-bold mb-4 text-center">How are you feeling today?</h3>
        <div className="flex justify-between">
          {moods.map((m, i) => (
            <button 
              key={i} 
              onClick={() => setMood(i)}
              className={`text-3xl p-2 rounded-2xl transition-all ${mood === i ? 'bg-lavender/20 scale-125' : 'opacity-50 grayscale hover:grayscale-0'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-lavender" /> Emotional Trend
        </h3>
        <div className="h-32 flex items-end gap-2 px-2">
          {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              className="flex-1 bg-lavender/30 rounded-t-lg relative group"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Day {i+1}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-bold opacity-40 uppercase tracking-widest">
          <span>Mon</span>
          <span>Sun</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-soft-pink/20 rounded-full flex items-center justify-center">
            <Smile size={20} className="text-soft-pink" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Self-Worth Reminder</h4>
            <p className="text-xs opacity-60">You deserve clarity, not just convenience.</p>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-plum/20 rounded-full flex items-center justify-center">
            <Sparkles size={20} className="text-plum" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Attachment Insight</h4>
            <p className="text-xs opacity-60">Anxious leaning detected. Focus on self-soothing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<'onboarding' | 'input' | 'results' | 'dashboard' | 'coach' | 'tracker' | 'settings'>('onboarding');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeRelationship(text);
      setAnalysisResult(result);
      setScreen('results');
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (screen === 'onboarding') return <Onboarding onComplete={() => setScreen('dashboard')} />;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-neutral-bg relative flex flex-col">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-plum/90 backdrop-blur-xl flex flex-col items-center justify-center text-white p-12 text-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="mb-8"
            >
              <Sparkles size={64} className="text-lavender" />
            </motion.div>
            <h2 className="text-2xl font-black mb-4">Decoding the signals...</h2>
            <p className="text-sm opacity-70">Our AI is analyzing tone, effort balance, and emotional consistency. Hang tight.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto">
        {screen === 'dashboard' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-black">Hey, You ✨</h1>
                <p className="text-sm opacity-60">Ready for some clarity today?</p>
              </div>
              <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
            </div>

            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => setScreen('input')}
              className="gradient-bg p-6 rounded-3xl text-white mb-8 shadow-xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-xl font-black mb-2">New Analysis</h2>
                <p className="text-sm opacity-80 mb-4">Paste messages to see if it's going somewhere.</p>
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-sm">
                  Start Now <ChevronRight size={14} />
                </div>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 opacity-20" size={120} />
            </motion.div>

            <h3 className="text-lg font-black mb-4">Recent Insights</h3>
            {analysisResult ? (
              <div className="glass-card p-4 rounded-2xl mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lavender/10 rounded-xl flex items-center justify-center">
                    <MessageSquare size={20} className="text-lavender" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Latest Analysis</h4>
                    <p className="text-[10px] opacity-50 uppercase font-bold tracking-wider">{analysisResult.progressStatus}</p>
                  </div>
                </div>
                <button onClick={() => setScreen('results')} className="p-2 hover:bg-plum/5 rounded-full">
                  <ChevronRight size={20} />
                </button>
              </div>
            ) : (
              <div className="text-center p-12 opacity-40">
                <p className="text-sm italic">No analyses yet. Your clarity journey starts here.</p>
              </div>
            )}
          </div>
        )}

        {screen === 'input' && <ChatInput onAnalyze={handleAnalyze} />}
        {screen === 'results' && analysisResult && <AnalysisResults result={analysisResult} onBack={() => setScreen('dashboard')} />}
        {screen === 'coach' && <ExitCoach result={analysisResult} />}
        {screen === 'tracker' && <ReflectionTracker />}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-plum/5 px-6 py-4 flex justify-between items-center max-w-md mx-auto z-40">
        <NavButton active={screen === 'dashboard'} icon={LayoutDashboard} label="Home" onClick={() => setScreen('dashboard')} />
        <NavButton active={screen === 'input'} icon={MessageSquare} label="Analyze" onClick={() => setScreen('input')} />
        <NavButton active={screen === 'coach'} icon={LogOut} label="Coach" onClick={() => setScreen('coach')} />
        <NavButton active={screen === 'tracker'} icon={TrendingUp} label="Growth" onClick={() => setScreen('tracker')} />
        <NavButton active={screen === 'settings'} icon={Settings} label="More" onClick={() => setScreen('settings')} />
      </nav>
    </div>
  );
}

const NavButton = ({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-plum scale-110' : 'text-plum/30 hover:text-plum/60'}`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);
