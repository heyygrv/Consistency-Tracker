import {
  Check, Flame, Trophy, Trash2,
  Target, Dumbbell, Book, Code,
  Droplets, Brain, Coffee, Music, Heart
} from 'lucide-react';
import ContributionGrid from './ContributionGrid';

const ICON_MAP = {
  Target, Dumbbell, Book, Code, Flame,
  Droplets, Brain, Coffee, Music, Heart, Trophy
};

export default function HabitSection({ habit, logs, onToggle, onDelete }) {
  const HabitIcon = ICON_MAP[habit.icon] || Trophy;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-slide-up transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center flex-shrink-0"
            style={{ color: habit.color }}
          >
            <HabitIcon strokeWidth={1.5} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {habit.name}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                <Flame className="w-3 h-3 text-orange-500" />
                {habit.currentStreak || 0} Streak
              </span>
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                <Trophy className="w-3 h-3 text-amber-500" />
                {habit.longestStreak || 0} Best
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onToggle}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
              habit.completedToday
                ? 'bg-[#22c55e] border border-[#22c55e] text-white'
                : 'border border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {habit.completedToday ? (
              <>
                <Check className="w-4 h-4" />
                Done Today
              </>
            ) : (
              'Mark Done'
            )}
          </button>
          
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
            title="Delete habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <ContributionGrid
          logs={logs}
          color={habit.color}
          habitCount={1}
        />
      </div>
    </div>
  );
}
