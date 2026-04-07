import { useState } from 'react';
import { X, Smile, SmilePlus, Meh, Frown, HeartCrack } from 'lucide-react';

const MOODS = [
  { value: 'great', icon: SmilePlus, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
  { value: 'good', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { value: 'okay', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { value: 'bad', icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  { value: 'terrible', icon: HeartCrack, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
];

export default function DailyReflectionModal({ onClose, onSave, initialData, unmarkingHabit }) {
  const [mood, setMood] = useState(initialData?.mood || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let finalNotes = notes;
    if (unmarkingHabit && !notes.includes(`Missed ${unmarkingHabit.name}`)) {
       // if we are unmarking and they wrote something, prefix it optionally or let them explain
       // they are typing specifically for this habit. We can just save it.
    }
    
    try {
      await onSave({ mood, notes: finalNotes });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl animate-scale-up border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 pl-8 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {unmarkingHabit ? `Unmarking "${unmarkingHabit.name}"` : 'Daily Reflection'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {unmarkingHabit && (
            <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl text-amber-800 dark:text-amber-200 text-sm">
              You're unmarking this habit. Take a moment to reflect on why you couldn't get to it today.
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              How are you feeling today?
            </label>
            <div className="flex justify-between gap-2">
              {MOODS.map((m) => {
                const isSelected = mood === m.value;
                const Icon = m.icon;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      isSelected 
                        ? `border-slate-400 dark:border-slate-500 ${m.bg}` 
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${m.color} ${isSelected ? 'scale-110' : ''} transition-transform`} />
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${
                      isSelected ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'
                    }`}>
                      {m.value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              {unmarkingHabit ? "Why couldn't you complete it?" : "Any thoughts on today?"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={unmarkingHabit ? "e.g., Too tired after work..." : "What's on your mind?"}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent outline-none transition-all dark:text-white resize-none text-sm placeholder:text-slate-400"
              rows={4}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!mood && !notes)}
              className="flex-1 py-3 px-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-sm"
            >
              {isSubmitting ? 'Saving...' : 'Save Reflection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
