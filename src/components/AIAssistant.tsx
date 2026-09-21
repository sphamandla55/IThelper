import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, ChevronRight, RotateCcw } from 'lucide-react';
import { categories } from '@/data/troubleshootingTree';
import type { Category, Step } from '@/data/troubleshootingTree';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  suggestedCategory?: Category;
  suggestedSteps?: { category: Category; step: Step }[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTroubleshooting: (category: Category) => void;
}

const ownerEmail = 'nyamanasphamandla@gmail.com';

function findRelevantCategories(query: string): { category: Category; score: number }[] {
  const q = query.toLowerCase();
  const keywords: Record<string, string[]> = {
    internet: ['internet', 'wifi', 'wi-fi', 'network', 'connection', 'router', 'modem', 'slow internet', 'no internet', 'disconnect', 'drop', 'dns', 'ip', 'ethernet', 'broadband', 'isp'],
    computer_wont_start: ['wont start', "won't start", 'no power', 'black screen', 'blank screen', 'boot', 'won\'t boot', 'power button', 'fan', 'beep', 'start', 'turn on', 'dead', 'no signal', 'monitor off'],
    slow_performance: ['slow', 'sluggish', 'lag', 'laggy', 'freeze', 'frozen', 'performance', 'speed up', 'unresponsive', 'hang', 'stuck', 'cpu', 'ram', 'memory', 'disk space', 'overheat', 'hot', 'startup'],
    software_errors: ['crash', 'crashes', 'error', 'error message', 'freeze', 'not responding', 'app', 'application', 'program', 'install', 'installation', 'blue screen', 'bsod', 'error code', 'force quit', 'force close'],
    printer: ['printer', 'print', 'printing', 'ink', 'toner', 'cartridge', 'offline', 'queue', 'paper jam', 'print quality', 'streak', 'faded', 'spooler'],
    password: ['password', 'login', 'log in', 'sign in', 'signin', 'forgot', 'locked', 'lock out', 'account', 'reset password', 'credentials', 'authentication', 'access denied', 'cant login', "can't login"],
  };

  return categories
    .map((category) => {
      const words = keywords[category.id] || [];
      let score = 0;
      for (const word of words) {
        if (q.includes(word)) score += word.length > 4 ? 3 : 2;
      }
      return { category, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function generateResponse(query: string): ChatMessage[] {
  const matches = findRelevantCategories(query);
  const q = query.toLowerCase();

  if (matches.length === 0) {
    return [
      {
        id: Date.now(),
        role: 'assistant' as const,
        text: "I'm not sure which category fits your issue from what you described. Could you tell me a bit more? For example, is it related to the internet, your computer starting up, a slow system, an app crashing, printing, or a login problem?",
      },
    ];
  }

  const top = matches[0];
  const suggestions = matches.slice(0, 3).map((m) => {
    const step = m.category.steps[m.category.startId];
    return { category: m.category, step };
  });

  let specificStep: Step | null = null;
  for (const step of Object.values(top.category.steps)) {
    if (step.type === 'question' || step.type === 'action') {
      const stepText = (step.title + ' ' + (step.description || '')).toLowerCase();
      const stepKeywords = stepText.match(/\b[a-z]{4,}\b/g) || [];
      let stepScore = 0;
      for (const kw of stepKeywords) {
        if (q.includes(kw)) stepScore++;
      }
      if (stepScore >= 2) {
        specificStep = step;
        break;
      }
    }
  }

  let text: string;
  if (specificStep && specificStep.id !== top.category.startId) {
    text = `Based on what you described, this sounds like a "${top.category.title}" issue. Here's what I'd recommend trying right now:\n\n${specificStep.title}${specificStep.description ? '\n\n' + specificStep.description : ''}`;
  } else {
    text = `That sounds like a "${top.category.title}" issue. I can walk you through fixing it step by step — just tap the option below to start the guided troubleshooter.`;
  }

  return [
    {
      id: Date.now(),
      role: 'assistant' as const,
      text,
      suggestedSteps: specificStep && specificStep.id !== top.category.startId ? undefined : suggestions,
      suggestedCategory: specificStep ? top.category : undefined,
    },
  ];
}

export default function AIAssistant({ isOpen, onClose, onStartTroubleshooting }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'assistant',
      text: "Hi! I'm your IT troubleshooting assistant. Describe what's going wrong and I'll help you fix it. For example: 'My Wi-Fi keeps dropping' or 'My computer won't turn on.'",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasEscalated, setHasEscalated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleSend(text?: string) {
    const query = (text || input).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now(), role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = generateResponse(query);
      const q = query.toLowerCase();
      const frustrationSignals = ['still not working', 'still broken', 'nothing works', 'help me', 'human', 'person', 'real person', 'agent', 'support', 'contact', 'email', 'talk to someone', 'give up', "doesn't work", 'didnt work', "didn't work"];
      const wantsHuman = frustrationSignals.some((sig) => q.includes(sig));

      if (wantsHuman && !hasEscalated) {
        setHasEscalated(true);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            text: `I understand this is frustrating. You can reach out directly for one-on-one help:\n\nEmail: ${ownerEmail}\n\nOr try describing the issue differently and I'll do my best to guide you through it.`,
          },
        ]);
      } else {
        setMessages((prev) => [...prev, ...responses]);
      }
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  }

  function handleReset() {
    setMessages([
      {
        id: 0,
        role: 'assistant',
        text: "Let's start fresh. What issue are you experiencing?",
      },
    ]);
    setHasEscalated(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Chat panel */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] sm:max-h-[600px] animate-slide-up transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center">
              <Sparkles size={16} className="text-white" strokeWidth={1.75} />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm transition-colors">AI Assistant</h2>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Start over"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[280px]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800'}`}>
                {msg.role === 'user' ? (
                  <User size={14} className="text-slate-500 dark:text-slate-300" strokeWidth={1.75} />
                ) : (
                  <Bot size={14} className="text-white" strokeWidth={1.75} />
                )}
              </div>
              <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-slate-800 dark:bg-slate-700 text-white rounded-tr-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                  } transition-colors`}
                >
                  {msg.text}
                </div>

                {/* Suggested categories */}
                {msg.suggestedSteps && msg.suggestedSteps.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {msg.suggestedSteps.map((s) => (
                      <button
                        key={s.category.id}
                        onClick={() => {
                          onStartTroubleshooting(s.category);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                      >
                        <span>{s.category.title}</span>
                        <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct start button */}
                {msg.suggestedCategory && (
                  <button
                    onClick={() => {
                      onStartTroubleshooting(msg.suggestedCategory!);
                      onClose();
                    }}
                    className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-3.5 py-2.5 text-sm font-semibold hover:bg-slate-900 dark:hover:bg-white transition-colors"
                  >
                    Start guided fix
                    <ChevronRight size={14} strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5">
              <div className="shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center">
                <Bot size={14} className="text-white" strokeWidth={1.75} />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 transition-colors">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {['Wi-Fi not working', 'Computer won\'t start', 'Slow computer', 'Printer offline'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 shrink-0 transition-colors">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your issue..."
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="shrink-0 w-10 h-10 rounded-xl bg-slate-800 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
