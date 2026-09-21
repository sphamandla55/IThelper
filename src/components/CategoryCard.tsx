import { Wifi, Power, Gauge, AlertTriangle, Printer, KeyRound } from 'lucide-react';
import type { Category } from '@/data/troubleshootingTree';

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Wifi,
  Power,
  Gauge,
  AlertTriangle,
  Printer,
  KeyRound,
};

const colorMap: Record<string, { bg: string; icon: string; border: string; hover: string }> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/50',
    hover: 'hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-100/60 dark:hover:bg-blue-950/60',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border-red-100 dark:border-red-900/50',
    hover: 'hover:border-red-300 dark:hover:border-red-700 hover:bg-red-100/60 dark:hover:bg-red-950/60',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    icon: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/50',
    hover: 'hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-100/60 dark:hover:bg-amber-950/60',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    icon: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-100 dark:border-orange-900/50',
    hover: 'hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-100/60 dark:hover:bg-orange-950/60',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    icon: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/50',
    hover: 'hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/60',
  },
  purple: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    icon: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-100 dark:border-violet-900/50',
    hover: 'hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-100/60 dark:hover:bg-violet-950/60',
  },
};

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  const Icon = iconMap[category.icon];
  const colors = colorMap[category.color];

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl border-2 ${colors.border} ${colors.hover} bg-white dark:bg-slate-900 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-slate-400`}
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 rounded-xl ${colors.bg} p-3 transition-colors`}>
          <Icon size={24} strokeWidth={1.75} className={`${colors.icon} transition-colors`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base leading-snug group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {category.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">{category.description}</p>
        </div>
        <div className="shrink-0 self-center">
          <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
