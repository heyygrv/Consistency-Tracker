import { useState } from 'react';
import { Check, Trash2, Flame, Trophy, ChevronRight } from 'lucide-react';

export default function HabitCard({ habit, index, isSelected, onToggle, onDelete, onSelect }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);
    try {
      await onToggle();
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (showConfirm) {
      onDelete();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl p-5 animate-slide-up cursor-pointer transition-all duration-200 group border ${
        isSelected
          ? 'ring-2 ring-violet-500 border-violet-200 dark:border-violet-500/30'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
      style={{
        animationDelay: `${index * 80}ms`,
        animationFillMode: 'backwards',
      }}
      onClick={onSelect}
      id={`habit-card-${habit._id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">{habit.name}</h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button
            onClick={handleDelete}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              showConfirm
                ? 'bg-red-50 dark:bg-red-500/20 text-red-500 dark:text-red-400'
                : 'text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100'
            }`}
            title={showConfirm ? 'Click again to confirm' : 'Delete habit'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Streak stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{habit.currentStreak || 0}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{habit.longestStreak || 0}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">best</span>
        </div>
      </div>

      {/* Toggle + select */}
      <div className="flex items-center justify-between">
        <button
          id={`toggle-habit-${habit._id}`}
          onClick={handleToggle}
          disabled={toggling}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            habit.completedToday
              ? 'bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/25'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-white'
          } ${toggling ? 'opacity-50 cursor-wait' : ''}`}
        >
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
              habit.completedToday
                ? 'border-violet-500 bg-violet-500'
                : 'border-slate-300 dark:border-slate-500'
            }`}
          >
            {habit.completedToday && <Check className="w-3 h-3 text-white check-animate" />}
          </div>
          {habit.completedToday ? 'Done' : 'Mark Done'}
        </button>

        <div
          className={`flex items-center gap-1 text-xs font-medium transition-colors duration-200 ${
            isSelected ? 'text-violet-500' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400'
          }`}
        >
          <span>Grid</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
