import { CheckCircle2, AlertCircle, Phone, ChevronLeft, Lightbulb, RotateCcw } from 'lucide-react';
import type { Step, Category } from '@/data/troubleshootingTree';

interface StepViewProps {
  step: Step;
  category: Category;
  history: string[];
  onOptionSelect: (nextId: string) => void;
  onBack: () => void;
  onRestart: () => void;
}

const accentColors: Record<string, { outline: string; resolved: string; escalate: string; tipBg: string }> = {
  blue: {
    outline: 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40',
    resolved: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    escalate: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    tipBg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900',
  },
  red: {
    outline: 'border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/40',
    resolved: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    escalate: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    tipBg: 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900',
  },
  amber: {
    outline: 'border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40',
    resolved: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    escalate: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    tipBg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900',
  },
  orange: {
    outline: 'border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40',
    resolved: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    escalate: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    tipBg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900',
  },
  green: {
    outline: 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40',
    resolved: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    escalate: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    tipBg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900',
  },
  purple: {
    outline: 'border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/40',
    resolved: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    escalate: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    tipBg: 'bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900',
  },
};

export default function StepView({ step, category, history, onOptionSelect, onBack, onRestart }: StepViewProps) {
  const colors = accentColors[category.color];
  const stepNumber = history.length + 1;
  const isTerminal = step.type === 'resolved' || step.type === 'escalate';

  return (
    <div className="animate-fade-in">
      {/* Progress + nav bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
        >
          <ChevronLeft size={16} />
          {history.length === 0 ? 'All topics' : 'Previous step'}
        </button>
        {!isTerminal && (
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full transition-colors">
            Step {stepNumber}
          </span>
        )}
      </div>

      {/* Resolved state */}
      {step.type === 'resolved' && (
        <div className={`rounded-2xl border-2 ${colors.resolved} p-6 mb-6 transition-colors`}>
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 size={28} className="text-emerald-500 dark:text-emerald-400 shrink-0" strokeWidth={1.75} />
            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 transition-colors">{step.title}</h2>
          </div>
          {step.description && (
            <p className="text-emerald-700 dark:text-emerald-400 text-sm leading-relaxed ml-10 transition-colors">{step.description}</p>
          )}
        </div>
      )}

      {/* Escalate state */}
      {step.type === 'escalate' && (
        <div className={`rounded-2xl border-2 ${colors.escalate} p-6 mb-6 transition-colors`}>
          <div className="flex items-center gap-3 mb-3">
            <Phone size={28} className="text-amber-600 dark:text-amber-400 shrink-0" strokeWidth={1.75} />
            <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300 transition-colors">{step.title}</h2>
          </div>
          {step.description && (
            <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed ml-10 transition-colors">{step.description}</p>
          )}
        </div>
      )}

      {/* Question or action step */}
      {(step.type === 'question' || step.type === 'action') && (
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-2">
            {step.type === 'action' && (
              <AlertCircle size={22} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" strokeWidth={1.75} />
            )}
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug transition-colors">{step.title}</h2>
          </div>
          {step.description && (
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-2 transition-colors">{step.description}</p>
          )}
        </div>
      )}

      {/* Tips */}
      {step.tips && step.tips.length > 0 && (
        <div className={`rounded-xl border ${colors.tipBg} p-4 mb-6 transition-colors`}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={15} className="text-slate-500 dark:text-slate-400" strokeWidth={1.75} />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide transition-colors">Tips</span>
          </div>
          <ul className="space-y-1.5">
            {step.tips.map((tip, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2 transition-colors">
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Options */}
      {step.options && step.options.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 transition-colors">
            {step.type === 'question' ? 'Select what applies' : 'What happened?'}
          </p>
          {step.options.map((option, i) => (
            <button
              key={i}
              onClick={() => onOptionSelect(option.nextId)}
              className={`w-full text-left rounded-xl border-2 ${colors.outline} bg-white dark:bg-slate-800 px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-150 hover:text-slate-900 dark:hover:text-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 focus:ring-slate-400 group`}
            >
              <div className="flex items-center justify-between gap-3">
                <span>{option.label}</span>
                <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-300 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Terminal actions */}
      {isTerminal && (
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 text-sm font-semibold hover:bg-slate-900 dark:hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-slate-600"
          >
            <RotateCcw size={15} strokeWidth={2} />
            Troubleshoot another issue
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-6 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 focus:ring-slate-400"
          >
            <ChevronLeft size={15} strokeWidth={2} />
            Go back
          </button>
        </div>
      )}
    </div>
  );
}
