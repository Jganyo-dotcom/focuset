import { useEffect, useState } from "react";
import { getGoals } from "../utils/goalsStorage";
import "../styles/progress.css";

/* ===============================
   DATE HELPERS
   (local dates: toISOString() uses UTC and can be a day off)
=============================== */
const toDateKey = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const addDays = (d, n) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
};

const formatShortDate = (key) => {
  if (!key) return "-";
  const d = new Date(`${key}T00:00:00`);
  return isNaN(d)
    ? key
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/* Builds the list of days for a view, plus how many blank
   cells are needed so day 1 lines up under the right weekday */
const buildRange = (view, goals, today) => {
  let start;
  let end;

  if (view === "Weekly") {
    start = addDays(today, -today.getDay());
    end = addDays(start, 6);
  } else if (view === "Monthly") {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else {
    // All Time: from the earliest goal (max 26 weeks back) to today
    const dates = goals.map((g) => g.date).filter(Boolean).sort();
    let earliest = dates.length
      ? new Date(`${dates[0]}T00:00:00`)
      : addDays(today, -27);
    if (isNaN(earliest)) earliest = addDays(today, -27);
    const cap = addDays(today, -181);
    start = earliest < cap ? cap : earliest;
    end = today;
  }

  const days = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    days.push(toDateKey(d));
  }

  return { offset: start.getDay(), days };
};

export default function Progress() {
  const [goals, setGoals] = useState([]);
  const [view, setView] = useState("Monthly");

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toDateKey(today);

  /* ===============================
     MINUTES + COLOURS
  =============================== */
  const getMinutes = (date) => {
    const goal = goals.find((g) => g.date === date);
    if (!goal) return 0;

    return goal.progress >= 80 ? 60 : goal.progress >= 40 ? 30 : 15;
  };

  const getColor = (minutes) => {
    if (minutes === 0) return "empty";
    if (minutes <= 15) return "low";
    if (minutes <= 30) return "medium";
    return "high";
  };

  /* ===============================
     HEATMAP (depends on selected tab)
  =============================== */
  const { offset, days } = buildRange(view, goals, today);

  const cells = days.map((date) => ({
    date,
    minutes: getMinutes(date),
    isFuture: date > todayKey,
  }));

  const studiedDays = cells.filter((c) => !c.isFuture && c.minutes > 0).length;

  const periodLabel =
    view === "Weekly" ? "This Week" : view === "Monthly" ? "This Month" : "In Total";

  /* ===============================
     STREAK CALCULATION (last 28 days)
  =============================== */
  const last28Days = Array.from({ length: 28 }, (_, i) =>
    toDateKey(addDays(today, i - 27))
  );

  const calculateStreak = () => {
    let streak = 0;

    for (let i = last28Days.length - 1; i >= 0; i--) {
      const goal = goals.find((g) => g.date === last28Days[i]);
      if (goal && goal.progress > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  /* ===============================
     BADGES LOGIC
  =============================== */
  const completedGoals = goals.filter((g) => g.status === "Completed");

  const totalMinutes = goals.reduce((acc, g) => acc + (g.progress || 0), 0);

  const monthDays = buildRange("Monthly", goals, today).days;
  const studiedThisMonth = monthDays.filter(
    (date) => date <= todayKey && getMinutes(date) > 0
  ).length;

  const badges = [
    {
      icon: <FlameIcon />,
      label: "5 Days Streak",
      hint: "Study 5 days in a row",
      condition: currentStreak >= 5,
    },
    {
      icon: <ReaderIcon />,
      label: "Focused Mind",
      hint: "Study for 8 hours in total",
      condition: totalMinutes >= 480,
    },
    {
      icon: <CrownCoinIcon />,
      label: "Monthly Master",
      hint: "Study on 20 days in one month",
      condition: studiedThisMonth >= 20,
    },
    {
      icon: <CalendarIcon />,
      label: "No Days Off",
      hint: "Study 10 days in a row",
      condition: currentStreak >= 10,
    },
    {
      icon: <GoalsBoardIcon />,
      label: "Goals Completed",
      hint: "Complete 10 goals",
      condition: completedGoals.length >= 10,
    },
    {
      icon: <MedalIcon />,
      label: "Mission Complete",
      hint: "Complete all of your goals",
      condition: goals.length > 0 && completedGoals.length === goals.length,
    },
  ];

  /* ===============================
     STUDY HISTORY STATUS
  =============================== */
  const getDisplayStatus = (goal) => {
    if (goal.status !== "Completed" && goal.date && goal.date < todayKey) {
      return "Overdue";
    }
    return goal.status;
  };

  return (
    <div className="progress-page">
      <h2 className="page-title">Progress</h2>
      <p className="subtitle">Track your consistency and growth overtime</p>

      {/* ===============================
          STUDY STREAK
      =============================== */}
      <div className="card streak-card">
        <div className="streak-header">
          <h3>Study Streak</h3>

          <div className="tabs">
            {["Weekly", "Monthly", "All Time"].map((tab) => (
              <button
                key={tab}
                className={view === tab ? "active" : ""}
                aria-pressed={view === tab}
                onClick={() => setView(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="streak-body">
          {/* Calendar */}
          <div className="calendar-section">
            <div className="week-labels">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <span key={i}>{day}</span>
              ))}
            </div>

            <div className="streak-grid">
              {/* blank cells so day 1 sits under the right weekday */}
              {Array.from({ length: offset }).map((_, i) => (
                <div
                  key={`blank-${i}`}
                  className="streak-box blank"
                  aria-hidden="true"
                />
              ))}

              {cells.map((cell) => (
                <div
                  key={cell.date}
                  className={`streak-box ${
                    cell.isFuture ? "future" : getColor(cell.minutes)
                  }`}
                  title={
                    cell.isFuture
                      ? formatShortDate(cell.date)
                      : `${formatShortDate(cell.date)}: ${cell.minutes} minutes`
                  }
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="legend-section">
            <div>
              <span className="legend-box empty"></span> Didn't complete a goal
            </div>
            <div>
              <span className="legend-box high"></span> Completed a goal
            </div>
          </div>
        </div>

        <p className="streak-summary">
          You Studied For {studiedDays} {studiedDays === 1 ? "Day" : "Days"}{" "}
          {periodLabel}.
        </p>
      </div>

      {/* ===============================
          STUDY HISTORY
      =============================== */}
      <div className="card history-card">
        <h3>Study History</h3>

        <table>
          <thead>
            <tr>
              <th>Study Sessions</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {goals.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="3">No study sessions yet</td>
              </tr>
            ) : (
              goals.map((goal) => (
                <tr key={goal.id} title={`${goal.progress || 0} minutes`}>
                  <td>{goal.title}</td>
                  <td>{getDisplayStatus(goal)}</td>
                  <td>{formatShortDate(goal.date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===============================
          BADGES
      =============================== */}
      <div className="card badges-card">
        <h3>Badges</h3>

        <div className="badge-grid">
          {badges.map((badge) => (
            <Badge
              key={badge.label}
              icon={badge.icon}
              label={badge.label}
              hint={badge.hint}
              unlocked={badge.condition}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===============================
   BADGE COMPONENT
================================ */
function Badge({ icon, label, hint, unlocked }) {
  return (
    <div
      className={`badge ${unlocked ? "unlocked" : ""}`}
      title={unlocked ? label : hint}
    >
      <div className="badge-icon">{icon}</div>
      <p>{label}</p>
    </div>
  );
}

/* ===============================
   BADGE ARTWORK (inline SVG, full colour)
================================ */
const FlameIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path
      d="M50 6C54 24 76 34 76 58C76 77 64 92 50 92C36 92 24 77 24 58C24 46 31 40 37 30C39 38 43 41 46 41C46 28 46 18 50 6Z"
      fill="#f0382b"
    />
    <path
      d="M50 38C54 50 66 56 66 69C66 81 58 90 50 90C42 90 34 81 34 69C34 61 41 56 43 49C46 54 48 55 49 54C49 48 48 43 50 38Z"
      fill="#ff8a1f"
    />
    <path
      d="M50 62C53 69 59 72 59 78C59 84 55 89 50 89C45 89 41 84 41 78C41 72 47 69 50 62Z"
      fill="#ffd23f"
    />
  </svg>
);

const ReaderIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M20 96C20 68 33 58 50 58C67 58 80 68 80 96Z" fill="#7b7b84" />
    <circle cx="50" cy="31" r="17" fill="#2a2a30" />
    <circle cx="50" cy="35" r="12" fill="#f2c8a6" />
    <path d="M36 28C40 18 60 18 64 28C58 24 42 24 36 28Z" fill="#2a2a30" />
    <path d="M30 64L51 59L72 64L72 88L51 83L30 88Z" fill="#2f66e8" />
    <path d="M51 59L51 83" stroke="#dfe9ff" strokeWidth="2.5" />
    <path d="M34 67L48 63.5M34 74L48 70.5" stroke="#9db8f5" strokeWidth="2" />
  </svg>
);

const CrownCoinIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="52" r="42" fill="#2f9a34" />
    <circle cx="50" cy="48" r="42" fill="#4fcb4c" />
    <circle cx="50" cy="48" r="33" fill="#63dc5e" stroke="#3aa83b" strokeWidth="2" />
    <path d="M28 36L37 53L50 33L63 53L72 36L69 66L31 66Z" fill="#f4efff" />
    <rect x="31" y="66" width="38" height="8" rx="3" fill="#cdc2f3" />
    <circle cx="28" cy="36" r="3.5" fill="#f4efff" />
    <circle cx="50" cy="33" r="3.5" fill="#f4efff" />
    <circle cx="72" cy="36" r="3.5" fill="#f4efff" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <rect x="13" y="20" width="74" height="66" rx="8" fill="#f1f3ff" stroke="#a9b3f2" strokeWidth="2.5" />
    <path d="M13 28a8 8 0 0 1 8-8h58a8 8 0 0 1 8 8v10H13Z" fill="#a9b3f2" />
    <rect x="28" y="12" width="6" height="14" rx="3" fill="#6f7de0" />
    <rect x="66" y="12" width="6" height="14" rx="3" fill="#6f7de0" />
    <g fill="#c9d0f8">
      <rect x="22" y="46" width="10" height="9" rx="2" />
      <rect x="37" y="46" width="10" height="9" rx="2" />
      <rect x="52" y="46" width="10" height="9" rx="2" />
      <rect x="67" y="46" width="10" height="9" rx="2" />
      <rect x="22" y="60" width="10" height="9" rx="2" />
      <rect x="52" y="60" width="10" height="9" rx="2" />
      <rect x="22" y="74" width="10" height="7" rx="2" />
      <rect x="37" y="74" width="10" height="7" rx="2" />
    </g>
    <rect x="37" y="60" width="10" height="9" rx="2" fill="#6f7de0" />
    <rect x="67" y="60" width="10" height="9" rx="2" fill="#6f7de0" />
  </svg>
);

const GoalsBoardIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M20 18L72 12L80 86L26 92Z" fill="#111111" />
    <path d="M29 27L66 23L72 78L34 82Z" fill="#ffffff" />
    <circle cx="51" cy="50" r="10" fill="none" stroke="#111111" strokeWidth="3" />
    <path
      d="M52 60L55 68L63 66L58 72L64 78L56 77L53 85L50 77L42 79L47 72L41 67L49 68Z"
      fill="#111111"
    />
  </svg>
);

const MedalIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M30 60L18 92L34 86L42 98L52 66Z" fill="#f3dfb2" />
    <path d="M70 60L82 92L66 86L58 98L48 66Z" fill="#e7c987" />
    <circle cx="50" cy="40" r="34" fill="#e3a238" />
    <circle cx="50" cy="40" r="28" fill="#f6c95e" />
    <circle cx="50" cy="40" r="21" fill="#fbe3a0" stroke="#e3a238" strokeWidth="2" />
    <path
      d="M50 26L54.5 35L64 36.3L57 43L58.8 52.5L50 48L41.2 52.5L43 43L36 36.3L45.5 35Z"
      fill="#e3a238"
    />
  </svg>
);