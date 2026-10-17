// src/components/StreakModal.jsx
import { useEffect, useState } from "react";
import "./StreakModal.css"; // CSS provided below
const apiB = "https://capstone-project-9o17.onrender.com/student";
const token = localStorage.getItem("authToken");

export default function StreakModal({
  apiBase = "http://127.0.0.1:45555/student",
  goalId,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  useEffect(() => {
    if (!goalId) return;
    loadStreak(goalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId]);

  async function loadStreak(id) {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${apiB}/streaks/ALL/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const json = await res.json();
      console.log(json);
      if (!res.ok) {
        setError(json?.message || "Failed to load streak");
        setLoading(false);
        return;
      }

      setData({
        currentStreak: json.currentStreak ?? 0,
        longestStreak: json.longestStreak ?? 0,
        completedDates: json.completedDates ?? [],
        completedWeeks: json.completedWeeks ?? [],
      });

      // reset calendar to current month
      setCurrentYear(new Date().getFullYear());
      setCurrentMonth(new Date().getMonth());
    } catch (err) {
      console.log(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (!goalId) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Streak modal"
    >
      <div className="modal">
        <header className="modal-header">
          <h4>Streak</h4>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="modal-body">
          {loading && <div className="muted">Loading streak…</div>}
          {error && <div className="error">{error}</div>}

          {data && (
            <>
              <div id="streakCounts" className="streak-counts">
                <p>
                  Current Streak: <strong>{data.currentStreak}</strong>
                </p>
                <p>
                  Longest Streak: <strong>{data.longestStreak}</strong>
                </p>
              </div>

              <CalendarGrid
                completedDates={data.completedDates}
                completedWeeks={data.completedWeeks}
                currentYear={currentYear}
                currentMonth={currentMonth}
                onMonthChange={(y, m) => {
                  setCurrentYear(y);
                  setCurrentMonth(m);
                }}
              />
            </>
          )}
        </div>

        <footer className="modal-footer">
          <button onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}

/* CalendarGrid is defined below in the same file for convenience */
function CalendarGrid({
  completedDates = [],
  completedWeeks = [],
  currentYear,
  currentMonth,
  onMonthChange,
}) {
  // Helpers using toDateString canonicalization (matches your original code)
  const toDateStringLocal = (d) => new Date(d).toDateString();

  const getWeekStart = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    const dayNum = d.getUTCDay() || 7; // Sunday -> 7
    d.setUTCDate(d.getUTCDate() - dayNum + 1); // move to Monday
    return d;
  };

  // Build sets exactly like your original code
  const completedSet = new Set(
    (completedDates || []).map((d) => toDateStringLocal(d)),
  );
  const weekSet = new Set(
    (completedWeeks || []).map((d) => toDateStringLocal(getWeekStart(d))),
  );

  // Debug logs (remove when satisfied)
  console.log("CalendarGrid completedDates:", completedDates);
  console.log("completedSet sample:", Array.from(completedSet).slice(0, 6));
  console.log("weekSet sample:", Array.from(weekSet).slice(0, 6));
  console.log(
    "example cell date string for 2026-01-22:",
    new Date(2026, 0, 22).toDateString(),
  );

  // Month calculations
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 1 offset (make Monday the first column)
  let startOffset = firstDay.getDay();
  if (startOffset === 0) startOffset = 7;

  const prevMonth = () => {
    let y = currentYear;
    let m = currentMonth - 1;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    onMonthChange(y, m);
  };

  const nextMonth = () => {
    let y = currentYear;
    let m = currentMonth + 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    onMonthChange(y, m);
  };

  // Build cells
  const cells = [];
  for (let i = 1; i < startOffset; i++) cells.push({ empty: true });

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = date.toDateString();
    const weekKey = getWeekStart(date).toDateString();

    const isDaily = completedSet.has(dateStr);
    const isWeekly = weekSet.has(weekKey);
    const completed = isDaily || isWeekly;

    cells.push({ day, completed, dateStr, weekKey });
  }

  // Optional test helper to force today green (remove after verifying)
  // const todayStr = new Date().toDateString();
  // if (!completedSet.has(todayStr)) completedSet.add(todayStr);

  return (
    <div className="calendar-root">
      <div className="calendar-nav">
        <button onClick={prevMonth} aria-label="Previous month">
          &lt;
        </button>
        <div className="calendar-title">
          {firstDay.toLocaleString("default", { month: "long" })} {currentYear}
        </div>
        <button onClick={nextMonth} aria-label="Next month">
          &gt;
        </button>
      </div>

      <div className="calendar-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="calendar-header">
            {d}
          </div>
        ))}

        {cells.map((c, i) =>
          c.empty ? (
            <div key={`e-${i}`} className="calendar-day empty" />
          ) : (
            <div
              key={`d-${i}`}
              className={`calendar-day ${c.completed ? "completed" : "missed"}`}
              data-datestr={c.dateStr}
              data-weekkey={c.weekKey}
            >
              {c.day}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
