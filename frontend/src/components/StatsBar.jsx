import { Flame, Trophy, CheckCircle2, BarChart3 } from 'lucide-react';

export default function StatsBar({ habits }) {
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.completedToday).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0);
  const totalStreaks = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);

  const stats = [
    {
      label: 'Active Habits',
      value: totalHabits,
      icon: BarChart3,
      bgColor: 'bg-violet-500',
    },
    {
      label: 'Done Today',
      value: `${completedToday}/${totalHabits}`,
      icon: CheckCircle2,
      bgColor: 'bg-emerald-500',
    },
    {
      label: 'Best Streak',
      value: `${bestStreak}d`,
      icon: Trophy,
      bgColor: 'bg-amber-500',
    },
    {
      label: 'Active Streaks',
      value: `${totalStreaks}d`,
      icon: Flame,
      bgColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-slide-up">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 hover-lift cursor-default group transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
