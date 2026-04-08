const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchHabits() {
  const res = await fetch(`${API_BASE}/habits`);
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
}

export async function createHabit(data) {
  const res = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create habit');
  }
  return res.json();
}

export async function deleteHabit(id) {
  const res = await fetch(`${API_BASE}/habits/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete habit');
  return res.json();
}

export async function toggleHabit(id) {
  const res = await fetch(`${API_BASE}/habits/${id}/toggle`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to toggle habit');
  return res.json();
}

export async function fetchHabitLogs(id) {
  const res = await fetch(`${API_BASE}/habits/${id}/logs`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function fetchAllLogs() {
  const res = await fetch(`${API_BASE}/habits/logs/all`);
  if (!res.ok) throw new Error('Failed to fetch all logs');
  return res.json();
}

export async function fetchDailyLog(date) {
  const url = date ? `${API_BASE}/dailyLogs?date=${date}` : `${API_BASE}/dailyLogs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch daily log');
  return res.json();
}

export async function updateDailyLog(data) {
  const res = await fetch(`${API_BASE}/dailyLogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update daily log');
  return res.json();
}
