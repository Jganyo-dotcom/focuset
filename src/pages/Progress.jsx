import { useEffect, useState } from "react";
import { getGoals } from "../utils/goalsStorage";
import "../styles/progress.css";

export default function Progress() {
  const [goals, setGoals] = useState([]);
  const [view, setView] = useState("Monthly");

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  // 🔢 CALCULATIONS
  const completedGoals = goals.filter(g => g.status === "Completed");
  const activeGoals = goals.filter(g => g.status !== "Completed");

  const daysStudied = completedGoals.length + activeGoals.length;

  // 🟩 STREAK HEATMAP (last 28 days)
  const streakData = Array.from({ length: 28 }, (_, i) => {
    const goal = goals[i];
    if (!goal) return 0;
    return goal.progress >= 80 ? 60 : goal.progress >= 40 ? 30 : 15;
  });

  const getColor = (minutes) => {
    if (minutes === 0) return "empty";
    if (minutes <= 15) return "low";
    if (minutes <= 30) return "medium";
    return "high";
  };

  return (
    <div className="progress-page">
      <h2>Progress</h2>
      <p className="subtitle">
        Track your consistency and growth over time
      </p>

      {/* STUDY STREAK */}
      <div className="card streak-card">
        <div className="streak-header">
          <h3>Study Streak</h3>
          <div className="tabs">
            {["Weekly", "Monthly", "All Time"].map(tab => (
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

        <div className="streak-grid">
          {streakData.map((minutes, index) => (
            <div
              key={index}
              className={`streak-box ${getColor(minutes)}`}
            />
          ))}
        </div>

        <p className="streak-summary">
          You studied for <strong>{daysStudied} days</strong> this month.
        </p>
      </div>

      {/* STUDY HISTORY */}
      <div className="card">
        <h3>Study History</h3>
        <table>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(goal => (
              <tr key={goal.id}>
                <td>{goal.title}</td>
                <td>{goal.progress}%</td>
                <td>{goal.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BADGES */}
      <div className="card badges">
        <h3>Badges</h3>
        <div className="badge-grid">
          {daysStudied >= 5 && <Badge icon="🔥" label="5 Days Streak" />}
          {completedGoals.length >= 5 && <Badge icon="🏆" label="5 Goals Completed" />}
          {completedGoals.length >= 10 && <Badge icon="🎯" label="10 Goals Completed" />}
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label }) {
  return (
    <div className="badge">
      {icon}
      <p>{label}</p>
    </div>
  );
}
