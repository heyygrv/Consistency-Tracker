import { useState } from 'react';
import {
  X, Sparkles, Target, Dumbbell, Book, Code, Flame,
  Droplets, Brain, Coffee, Music, Heart
} from 'lucide-react';

const PRESET_COLORS = [
  '#ec4899', '#ef4444', '#f97316', '#f59e0b',
  '#84cc16', '#22c55e', '#14b8a6', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef',
];

const PRESET_ICONS = [
  { name: 'Target', Icon: Target },
  { name: 'Dumbbell', Icon: Dumbbell },
  { name: 'Book', Icon: Book },
  { name: 'Code', Icon: Code },
  { name: 'Flame', Icon: Flame },
  { name: 'Droplets', Icon: Droplets },
  { name: 'Brain', Icon: Brain },
  { name: 'Coffee', Icon: Coffee },
  { name: 'Music', Icon: Music },
  { name: 'Heart', Icon: Heart },
];

export default function AddHabitModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [icon, setIcon] = useState('Target');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a habit name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onAdd({ name: name.trim(), color, icon });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 animate-scale-in shadow-xl border border-slate-200 dark:border-slate-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <Sparkles strokeWidth={1.5} className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Habit</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Start tracking something new</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name input */}
          <div>
            <label htmlFor="habit-name" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Habit Name
            </label>
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Exercise, Reading, Meditation..."
              maxLength={50}
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-all text-sm"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 ${
                    color === c
                      ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110'
                      : ''
                  }`}
                  style={{
                     backgroundColor: c,
                    '--tw-ring-color': c,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ICONS.map(({ name: iconName, Icon }) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    icon === iconName
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                      : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon strokeWidth={1.5} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-habit-btn"
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-all duration-200 ${
                loading ? 'opacity-50 cursor-wait' : 'hover:bg-slate-800 dark:hover:bg-slate-100'
              }`}
            >
              {loading ? 'Adding...' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
