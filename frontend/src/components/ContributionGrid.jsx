import { useMemo } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ContributionGrid({ logs }) {
  const { weeks, monthName } = useMemo(() => {
    const logMap = {};
    logs.forEach((log) => {
      const dateStr = new Date(log.date).toISOString().split('T')[0];
      logMap[dateStr] = (logMap[dateStr] || 0) + 1;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const startDay = new Date(currentYear, currentMonth, 1);
    const endDay = new Date(currentYear, currentMonth + 1, 0);

    const weeks = [];
    let currentWeek = [];

    const jan1DayOfWeek = startDay.getDay(); 
    const startRow = jan1DayOfWeek === 0 ? 6 : jan1DayOfWeek - 1; // Mon=0

    for (let i = 0; i < startRow; i++) {
      currentWeek.push(null);
    }

    const cursor = new Date(startDay);
    while (cursor <= endDay) {
      const dayOfWeek = cursor.getDay();
      const rowIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      if (rowIndex === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      const dateStr = cursor.toISOString().split('T')[0];
      const count = logMap[dateStr] || 0;
      const isPastOrToday = cursor.getTime() <= today.getTime();

      currentWeek.push({
        date: new Date(cursor),
        dateStr,
        count,
        isPastOrToday,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return { 
      weeks, 
      monthName: startDay.toLocaleString('default', { month: 'long', year: 'numeric' }) 
    };
  }, [logs]);

  function getCellColor(day, isDark) {
    if (day.count > 0) return '#22c55e'; // Green done
    if (day.isPastOrToday) return '#ef4444'; // Red missed
    return isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'; // Gray future
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  }

  const cellSize = 14;
  const cellGap = 4;
  const labelWidth = 32;
  const headerHeight = 10;
  const svgWidth = labelWidth + weeks.length * (cellSize + cellGap) + 10;
  const svgHeight = headerHeight + 7 * (cellSize + cellGap);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-3">
        <span>{monthName} Tracking</span>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#22c55e]"></div> Done</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#ef4444]"></div> Missed</div>
        </div>
      </div>
      
      <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="block" style={{ maxWidth: svgWidth }}>
        {DAYS.map((day, i) => (
          <text key={i} x={0} y={headerHeight + i * (cellSize + cellGap) + cellSize - 2} className="fill-slate-400 dark:fill-slate-500" fontSize="10" fontFamily="Inter, sans-serif">
            {day}
          </text>
        ))}

        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (!day) return null;
            return (
              <rect
                key={`${wi}-${di}`}
                x={labelWidth + wi * (cellSize + cellGap)}
                y={headerHeight + di * (cellSize + cellGap)}
                width={cellSize}
                height={cellSize}
                rx={3}
                ry={3}
                fill={getCellColor(day, isDark)}
                className="grid-cell"
              >
                <title>{`${formatDate(day.date)}: ${day.count > 0 ? 'Done' : day.isPastOrToday ? 'Missed' : 'Not yet'}`}</title>
              </rect>
            );
          })
        )}
      </svg>
    </div>
  );
}
