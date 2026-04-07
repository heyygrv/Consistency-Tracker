import { useState, useEffect, useCallback } from 'react';
import { Activity, Plus, Target, Calendar, TrendingUp, Sun, Moon } from 'lucide-react';
import { fetchHabits, createHabit, deleteHabit, toggleHabit, fetchAllLogs } from './api';
import StatsBar from './components/StatsBar';
import HabitCard from './components/HabitCard';
import ContributionGrid from './components/ContributionGrid';
import AddHabitModal from './components/AddHabitModal';

export default function App() {
  const [habits, setHabits] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
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
      const [habitsData, logsData] = await Promise.all([
        fetchHabits(),
        fetchAllLogs(),
      ]);
      setHabits(habitsData);
      setAllLogs(logsData);
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
      if (selectedHabit === id) setSelectedHabit(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleHabit(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const gridLogs = selectedHabit
    ? allLogs.filter((l) => l.habitId?._id === selectedHabit || l.habitId === selectedHabit)
    : allLogs;

  const selectedHabitData = selectedHabit
    ? habits.find((h) => h._id === selectedHabit)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-violet-500 rounded-full animate-spin" />
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
            <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
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
              id="add-habit-btn"
              onClick={() => setShowModal(true)}
              className="hover-lift flex items-center gap-2 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
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

        {/* Contribution Grid Section */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {selectedHabitData ? selectedHabitData.name : 'All Habits'} — {new Date().getFullYear()} Contribution Grid
              </h2>
            </div>
            {selectedHabit && (
              <button
                onClick={() => setSelectedHabit(null)}
                className="text-xs font-medium text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
              >
                Show All
              </button>
            )}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 overflow-x-auto transition-colors duration-300">
            <ContributionGrid
              logs={gridLogs}
              color={selectedHabitData?.color || '#8b5cf6'}
              habitCount={selectedHabit ? 1 : habits.length}
            />
          </div>
        </section>

        {/* Habits Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Your Habits</h2>
            <span className="text-xs text-slate-400 ml-1">({habits.length})</span>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 animate-fade-in transition-colors duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">No habits yet</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                Start building consistency by adding your first habit. Track daily progress and watch your streaks grow.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="hover-lift inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map((habit, i) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  index={i}
                  isSelected={selectedHabit === habit._id}
                  onToggle={() => handleToggle(habit._id)}
                  onDelete={() => handleDeleteHabit(habit._id)}
                  onSelect={() =>
                    setSelectedHabit(selectedHabit === habit._id ? null : habit._id)
                  }
                />
              ))}
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
    </div>
  );
}
