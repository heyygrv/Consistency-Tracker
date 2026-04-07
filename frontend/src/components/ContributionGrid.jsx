import { useMemo } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export default function ContributionGrid({ logs, color = '#8b5cf6', habitCount = 1 }) {
  const { weeks, monthLabels, maxCount } = useMemo(() => {
    // Build log count map
    const logMap = {};
    logs.forEach((log) => {
      const dateStr = new Date(log.date).toISOString().split('T')[0];
      logMap[dateStr] = (logMap[dateStr] || 0) + 1;
    });

    // Start from January 1st of the current year
    const currentYear = new Date().getFullYear();
    const startDay = new Date(currentYear, 0, 1); // Jan 1
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // End at Dec 31 or today, whichever is earlier
    const endDay = new Date(Math.min(
      new Date(currentYear, 11, 31).getTime(),
      today.getTime()
    ));

    const weeks = [];
    const monthLabels = [];
    let currentWeek = [];
    let lastMonth = -1;

    // Align Jan 1 — figure out what day of week it is (Mon=0 based)
    const jan1DayOfWeek = startDay.getDay(); // 0=Sun, 1=Mon...
    const jan1Row = jan1DayOfWeek === 0 ? 6 : jan1DayOfWeek - 1; // Convert to Mon=0

    // Fill empty cells before Jan 1 in the first week
    for (let i = 0; i < jan1Row; i++) {
      currentWeek.push(null);
    }

    const cursor = new Date(startDay);
    while (cursor <= endDay) {
      const dayOfWeek = cursor.getDay();
      const rowIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0, Sun=6

      // If it's Monday and we have items, push the week
      if (rowIndex === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      const dateStr = cursor.toISOString().split('T')[0];
      const count = logMap[dateStr] || 0;

      currentWeek.push({
        date: new Date(cursor),
        dateStr,
        count,
      });

      // Track month labels
      const month = cursor.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          label: MONTHS[month],
          weekIndex: weeks.length,
        });
        lastMonth = month;
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    // Push the last partial week
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    const maxCount = Math.max(habitCount, 1);

    return { weeks, monthLabels, maxCount };
  }, [logs, habitCount]);

  const { r, g, b } = hexToRgb(color);

  function getCellColor(count, isDark) {
    if (count === 0) {
      return isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
    }
    const ratio = Math.min(count / maxCount, 1);
    if (ratio <= 0.25) return `rgba(${r}, ${g}, ${b}, 0.3)`;
    if (ratio <= 0.5) return `rgba(${r}, ${g}, ${b}, 0.5)`;
    if (ratio <= 0.75) return `rgba(${r}, ${g}, ${b}, 0.75)`;
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const cellSize = 12;
  const cellGap = 3;
  const labelWidth = 32;
  const headerHeight = 20;
  const svgWidth = labelWidth + weeks.length * (cellSize + cellGap) + 10;
  const svgHeight = headerHeight + 7 * (cellSize + cellGap);

  // Detect dark mode from parent
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <div>
      <svg
        width="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="block"
        style={{ maxWidth: svgWidth }}
      >
        {/* Month labels */}
        {monthLabels.map((m, i) => (
          <text
            key={i}
            x={labelWidth + m.weekIndex * (cellSize + cellGap)}
            y={12}
            className="fill-slate-400 dark:fill-slate-500"
            fontSize="9"
            fontFamily="Inter, sans-serif"
          >
            {m.label}
          </text>
        ))}

        {/* Day labels — all 7 days */}
        {DAYS.map((day, i) => (
          <text
            key={i}
            x={0}
            y={headerHeight + i * (cellSize + cellGap) + cellSize - 2}
            className="fill-slate-400 dark:fill-slate-500"
            fontSize="8"
            fontFamily="Inter, sans-serif"
          >
            {day}
          </text>
        ))}

        {/* Grid cells */}
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
                rx={2}
                ry={2}
                fill={getCellColor(day.count, isDark)}
                className="grid-cell"
              >
                <title>
                  {`${formatDate(day.date)}: ${day.count} completion${day.count !== 1 ? 's' : ''}`}
                </title>
              </rect>
            );
          })
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-slate-400 dark:text-slate-500">
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((level, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor:
                level === 0
                  ? (isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)')
                  : `rgba(${r}, ${g}, ${b}, ${level === 0.25 ? 0.3 : level === 0.5 ? 0.5 : level === 0.75 ? 0.75 : 1})`,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
