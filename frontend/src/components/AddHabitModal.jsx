import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

const PRESET_COLORS = [
  '#8b5cf6', '#3b82f6', '#a855f7', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#14b8a6',
  '#f97316', '#22c55e', '#64748b', '#84cc16',
];

export default function AddHabitModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#8b5cf6');
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
      await onAdd({ name: name.trim(), color });
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
          <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
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
              className="w-full px-4 py-3 bg-white dark:bg-black border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-sm"
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
                  className={`w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 ${
                    color === c
                      ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-110'
                      : ''
                  }`}
                  style={{
                    backgroundColor: c,
                    ...(color === c ? { '--tw-ring-color': c } : {}),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-habit-btn"
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition-colors duration-200 ${
                loading ? 'opacity-50 cursor-wait' : 'hover-lift'
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
