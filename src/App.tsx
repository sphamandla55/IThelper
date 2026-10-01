import { useState } from 'react';
import { Monitor, Shield, Sparkles, MessageCircle } from 'lucide-react';
import { categories } from '@/data/troubleshootingTree';
import CategoryCard from '@/components/CategoryCard';
import StepView from '@/components/StepView';
import AIAssistant from '@/components/AIAssistant';
import ThemeToggle from '@/components/ThemeToggle';
import type { Category } from '@/data/troubleshootingTree';

type View = 'home' | 'troubleshoot';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [assistantOpen, setAssistantOpen] = useState(false);

  function startTroubleshooting(category: Category) {
    setActiveCategory(category);
    setCurrentStepId(category.startId);
    setHistory([]);
    setView('troubleshoot');
  }

  function handleOptionSelect(nextId: string) {
    setHistory((prev) => [...prev, currentStepId]);
    setCurrentStepId(nextId);
  }

  function handleBack() {
    if (history.length === 0) {
      setView('home');
      setActiveCategory(null);
    } else {
      const prev = [...history];
      const last = prev.pop()!;
      setHistory(prev);
      setCurrentStepId(last);
    }
  }

  function handleRestart() {
    setView('home');
    setActiveCategory(null);
    setHistory([]);
  }

  const currentStep = activeCategory ? activeCategory.steps[currentStepId] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 dark:bg-slate-100 flex items-center justify-center transition-colors">
              <Monitor size={16} className="text-white dark:text-slate-900" strokeWidth={1.75} />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight transition-colors">IT Helper</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAssistantOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full px-3 py-1.5 transition-colors"
            >
              <Sparkles size={13} strokeWidth={2} />
              Ask AI
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {view === 'home' && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 transition-colors">
                IT Support Assistant
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight tracking-tight mb-4 transition-colors">
                What can we help
                <br />
                <span className="text-slate-500 dark:text-slate-400 transition-colors">you fix today?</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto leading-relaxed transition-colors">
                Select your issue below and we'll walk you through a step-by-step solution.
              </p>
            </div>

            {/* Category grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => startTroubleshooting(category)}
                />
              ))}
            </div>

            {/* AI Assistant card */}
            <div className="mt-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-950 p-6 text-white transition-colors">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="shrink-0 rounded-xl bg-white/10 p-3">
                  <Sparkles size={22} className="text-white" strokeWidth={1.75} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-white text-base">Not sure where to start?</h3>
                  <p className="mt-0.5 text-sm text-slate-300 leading-relaxed">
                    Tell the AI assistant what's wrong and it'll point you to the right fix.
                  </p>
                </div>
                <button
                  onClick={() => setAssistantOpen(true)}
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-slate-800 px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  <MessageCircle size={15} strokeWidth={2} />
                  Chat with AI
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'troubleshoot' && activeCategory && currentStep && (
          <div className="max-w-xl mx-auto">
            {/* Category progress header */}
            <div className="mb-6 flex items-center gap-3">
              <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                <div
                  className="h-full bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-300 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      ((history.length + 1) / Math.max(Object.keys(activeCategory.steps).length * 0.4, 3)) * 100,
                      95
                    )}%`,
                  }}
                />
              </div>
              <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors">
                {history.length + 1} step{history.length !== 0 ? 's' : ''} in
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
              <StepView
                step={currentStep}
                category={activeCategory}
                history={history}
                onOptionSelect={handleOptionSelect}
                onBack={handleBack}
                onRestart={handleRestart}
              />

              {/* AI help for escalate steps */}
              {currentStep.type === 'escalate' && (
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5 transition-colors">
                  <button
                    onClick={() => setAssistantOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-800 dark:border-slate-200 text-slate-800 dark:text-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 hover:text-white dark:hover:text-slate-900 transition-all"
                  >
                    <Sparkles size={15} strokeWidth={2} />
                    Ask the AI for more help
                  </button>
                </div>
              )}
            </div>

            {/* Floating AI help */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setAssistantOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <Sparkles size={12} strokeWidth={2} />
                Still stuck? Ask the AI assistant
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-slate-100 dark:bg-slate-800/30 opacity-60 blur-3xl transition-colors" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-slate-100 dark:bg-slate-800/30 opacity-60 blur-3xl transition-colors" />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 mt-6 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide">
            Founded by <span className="font-semibold text-slate-600 dark:text-slate-300">Nyamanas Phamandla</span>
          </p>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        onStartTroubleshooting={startTroubleshooting}
      />
    </div>
  );
}
