import { useState, useEffect, useCallback, useContext } from 'react';
import { Activity, Plus, Target, Calendar, TrendingUp, Sun, Moon, SmilePlus, LogOut } from 'lucide-react';
import { fetchHabits, createHabit, deleteHabit, toggleHabit, fetchAllLogs, fetchDailyLog, updateDailyLog } from '../api';
import StatsBar from '../components/StatsBar';
import HabitSection from '../components/HabitSection';
import AddHabitModal from '../components/AddHabitModal';
import DailyReflectionModal from '../components/DailyReflectionModal';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [unmarkingHabit, setUnmarkingHabit] = useState(null);
  const [dailyLog, setDailyLog] = useState({ mood: '', notes: '' });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark-body');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark-body');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [habitsData, logsData, dlData] = await Promise.all([
        fetchHabits(),
        fetchAllLogs(),
        fetchDailyLog(),
      ]);
      setHabits(habitsData);
      setAllLogs(logsData);
      setDailyLog(dlData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddHabit = async (data) => {
    try {
      await createHabit(data);
      await loadData();
      setShowModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      await deleteHabit(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id) => {
    const habit = habits.find((h) => h._id === id);
    if (!habit) return;

    // If unchecking, prompt the Reflection Modal instead of toggling immediately
    if (habit.completedToday) {
      setUnmarkingHabit(habit);
      setShowReflection(true);
    } else {
      await executeToggle(id);
    }
  };

  const executeToggle = async (id) => {
    try {
      await toggleHabit(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveReflection = async (data) => {
    try {
      await updateDailyLog(data);
      if (unmarkingHabit) {
        await executeToggle(unmarkingHabit._id);
        setUnmarkingHabit(null);
      }
      setShowReflection(false);
      await loadData(); // refresh daily log data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseReflection = () => {
    if (unmarkingHabit) {
      // User skipped the reflection entirely, but we still proceed with unchecking
      executeToggle(unmarkingHabit._id);
      setUnmarkingHabit(null);
    }
    setShowReflection(false);
  };




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-white rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center bg-white dark:bg-black">
              <Activity strokeWidth={1.5} className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Consistency Tracker</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Build habits that stick</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              id="dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <div
                className={`toggle-switch ${darkMode ? 'active' : ''}`}
                aria-hidden="true"
              />
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              id="add-habit-btn"
              onClick={() => setShowModal(true)}
              className="hover-lift flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-colors duration-200"
            >
              <Plus strokeWidth={2} className="w-4 h-4" />
              <span className="hidden sm:inline">New Habit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* Error banner */}
        {error && (
          <div className="animate-slide-up bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium">
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Bar */}
        <StatsBar habits={habits} />

        {/* Daily Reflection Widget */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                 onClick={() => { setUnmarkingHabit(null); setShowReflection(true); }}>
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${dailyLog.mood ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                <SmilePlus className={`w-6 h-6 ${dailyLog.mood ? 'text-amber-500' : 'text-slate-400'}`} />
             </div>
             <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Daily Reflection
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md line-clamp-1">
                  {dailyLog.mood ? (dailyLog.notes || `Mood: ${dailyLog.mood}`) : 'How are you feeling today? Tap to log.'}
                </p>
             </div>
          </div>
          <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {dailyLog.mood ? 'Edit' : 'Log'}
          </button>
        </section>

        {/* Habits List */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Your Habits</h2>
            <span className="text-xs text-slate-400 ml-1">({habits.length})</span>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 animate-fade-in transition-colors duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center">
                <TrendingUp strokeWidth={1.5} className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">No habits yet</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                Start building consistency by adding your first habit. Track daily progress and watch your streaks grow.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="hover-lift inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-xl transition-colors"
              >
                <Plus strokeWidth={2} className="w-4 h-4" />
                Add Your First Habit
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {habits.map((habit) => {
                const habitLogs = allLogs.filter(
                  (l) => l.habitId?._id === habit._id || l.habitId === habit._id
                );
                return (
                  <HabitSection
                    key={habit._id}
                    habit={habit}
                    logs={habitLogs}
                    onToggle={() => handleToggle(habit._id)}
                    onDelete={() => handleDeleteHabit(habit._id)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <AddHabitModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddHabit}
        />
      )}

      {showReflection && (
        <DailyReflectionModal
          onClose={handleCloseReflection}
          onSave={handleSaveReflection}
          initialData={dailyLog}
          unmarkingHabit={unmarkingHabit}
        />
      )}
    </div>
  );
}
