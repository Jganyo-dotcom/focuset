// import { useEffect, useState } from "react";
// import { getGoals } from "../utils/goalsStorage";
// import "../styles/progress.css";

// export default function Progress() {
//   const [goals, setGoals] = useState([]);
//   const [view, setView] = useState("Monthly");

//   useEffect(() => {
//     setGoals(getGoals());
//   }, []);

//   // 🔢 CALCULATIONS
//   const completedGoals = goals.filter(g => g.status === "Completed");
//   const activeGoals = goals.filter(g => g.status !== "Completed");

//   const daysStudied = completedGoals.length + activeGoals.length;

//   // 🟩 STREAK HEATMAP (last 28 days)
//   const streakData = Array.from({ length: 28 }, (_, i) => {
//     const goal = goals[i];
//     if (!goal) return 0;
//     return goal.progress >= 80 ? 60 : goal.progress >= 40 ? 30 : 15;
//   });

//   const getColor = (minutes) => {
//     if (minutes === 0) return "empty";
//     if (minutes <= 15) return "low";
//     if (minutes <= 30) return "medium";
//     return "high";
//   };

//   return (
//     <>
//       <div className="progress-page">
//         <h2>Progress</h2>
//         <p className="subtitle">
//           Track your consistency and growth over time
//         </p>

//         {/* STUDY STREAK */}
//         <div className="card streak-card">
//           <div className="streak-header">
//             <h3>Study Streak</h3>
//             <div className="tabs">
//               {["Weekly", "Monthly", "All Time"].map(tab => (
//                 <button
//                   key={tab}
//                   className={view === tab ? "active" : ""}
//                   onClick={() => setView(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="streak-grid">
//             {streakData.map((minutes, index) => (
//               <div
//                 key={index}
//                 className={`streak-box ${getColor(minutes)}`}
//               />
//             ))}
//           </div>

//           <p className="streak-summary">
//             You studied for <strong>{daysStudied} days</strong> this month.
//           </p>
//         </div>

//         {/* STUDY HISTORY */}
//         <div className="card">
//           <h3>Study History</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Goal</th>
//                 <th>Progress</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {goals.map(goal => (
//                 <tr key={goal.id}>
//                   <td>{goal.title}</td>
//                   <td>{goal.progress}%</td>
//                   <td>{goal.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* BADGES */}
//         <div className="card badges">
//           <h3>Badges</h3>
//           <div className="badge-grid">
//             {daysStudied >= 5 && <Badge icon="🔥" label="5 Days Streak" />}
//             {completedGoals.length >= 5 && <Badge icon="🏆" label="5 Goals Completed" />}
//             {completedGoals.length >= 10 && <Badge icon="🎯" label="10 Goals Completed" />}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// function Badge({ icon, label }) {
//   return (
//     <div className="badge">
//       {icon}
//       <p>{label}</p>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getGoals } from "../utils/goalsStorage";
import "../styles/progress.css";

export default function Progress() {
  const [goals, setGoals] = useState([]);
  const [view, setView] = useState("Monthly");

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  /* ===============================
     DATE GENERATION (LAST 28 DAYS)
  =============================== */
  const generateLast28Days = () => {
    const days = [];
    for (let i = 27; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const last28Days = generateLast28Days();

  /* ===============================
     HEATMAP DATA
  =============================== */
  const streakData = last28Days.map((date) => {
    const goal = goals.find((g) => g.date === date);
    if (!goal) return 0;

    return goal.progress >= 80
      ? 60
      : goal.progress >= 40
      ? 30
      : 15;
  });

  const getColor = (minutes) => {
    if (minutes === 0) return "empty";
    if (minutes <= 15) return "low";
    if (minutes <= 30) return "medium";
    return "high";
  };

  /* ===============================
     STREAK CALCULATION
  =============================== */
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
  const completedGoals = goals.filter(
    (g) => g.status === "Completed"
  );

  const totalMinutes = goals.reduce(
    (acc, g) => acc + (g.progress || 0),
    0
  );

  const badges = [
    { condition: currentStreak >= 5, icon: "🔥", label: "5 Day Streak" },
    { condition: currentStreak >= 10, icon: "⚡", label: "10 Day Streak" },
    { condition: totalMinutes >= 480, icon: "🛡️", label: "8 Hours Studied" },
    {
      condition: completedGoals.length >= 10,
      icon: "🎯",
      label: "10 Goals Completed",
    },
  ];

  return (
    <div className="progress-page">
      <h2 className="page-title">Progress</h2>
      <p className="subtitle">
        Track your consistency and growth over time
      </p>

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
              {streakData.map((minutes, index) => (
                <div
                  key={index}
                  className={`streak-box ${getColor(minutes)}`}
                  title={`${minutes} minutes`}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="legend-section">
            <div>
              <span className="legend-box empty"></span> 0hr
            </div>
            <div>
              <span className="legend-box low"></span> 15min
            </div>
            <div>
              <span className="legend-box medium"></span> 30min
            </div>
            <div>
              <span className="legend-box high"></span> 1hr+
            </div>
          </div>
        </div>

        <p className="streak-summary">
          🔥 Current streak: <strong>{currentStreak} days</strong>
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
              <th>Study Session</th>
              <th>Minutes</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id}>
                <td>{goal.title}</td>
                <td>{goal.progress || 0}</td>
                <td>{goal.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===============================
          BADGES
      =============================== */}
      <div className="card badges-card">
        <h3>Badges</h3>

        <div className="badge-grid">
          {badges.map((badge, index) =>
            badge.condition ? (
              <Badge
                key={index}
                icon={badge.icon}
                label={badge.label}
                unlocked
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

/* ===============================
   BADGE COMPONENT
================================ */
function Badge({ icon, label, unlocked }) {
  return (
    <div className={`badge ${unlocked ? "unlocked" : ""}`}>
      <div className="badge-icon">{icon}</div>
      <p>{label}</p>
    </div>
  );
}