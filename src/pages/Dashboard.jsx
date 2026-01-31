import { useState } from "react";
import { lazy, Suspense } from "react";

const StudyBarChart = lazy(() => import("../components/StudyBarChart"));
const ProgressDonut = lazy(() => import("../components/ProgressDonut"));
import {
  studyGoals,
  weeklyStudyData,
  progressData,
  todayGoal as goalData,
} from "../data/dashboardData";
import "../styles/dashboard.css";
import heroImg from "../assets/images/hero-card.png";
import studyImg from "../assets/images/study-illustration.png";

export default function Dashboard() {
  const [goal, setGoal] = useState(goalData);
  const markAsDone = () => {
    setGoal((prev) => ({
      ...prev,
      completed: true,
    }));
  };

  const today = new Date();

  const dayLabel = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const monthYear = today.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* HERO */}
      <section className="dashboard-top">
        <div className="hero-card">
          <div className="hero-text">
            <h3>You are building a consistent learning habit.</h3>
            <p>Small steps everyday.</p>
          </div>

          <div className="hero-action">
            <button>Check in for today</button>
            <img src={heroImg} alt="hero image" height={140} />
          </div>
          <p>Checking in helps keep your streak alive.</p>
        </div>
        <div className="calendar-card">
          <h4>{dayLabel}</h4>
          <p>{monthYear} {today.year}</p>
        </div>
      </section>

      {/* STREAK */}
      <section className="streak">
        <h2>🔥 5 days</h2>
        <p>You’ve studied consistently for 5 days.</p>
      </section>

      {/* TODAY GOAL */}
      <section className="today-goal">
        <div>
          <small>Today's Goal</small>
          <h3>{goal.title}</h3>
          <p>{goal.time}</p>
          {!goal.completed ? (
            <button onClick={markAsDone}>Mark as done</button>
          ) : (
            <span className="completed">Completed ✔</span>
          )}
        </div>

        <img src={studyImg} alt="study image" height={140} />
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="chart-card">
          <h4>My statistics</h4>

          <Suspense fallback={<p>Loading chart...</p>}>
            <StudyBarChart data={weeklyStudyData} />
          </Suspense>
        </div>

        <div className="donut-card">
          <Suspense fallback={<p>Loading progress...</p>}>
            <ProgressDonut data={progressData} />
          </Suspense>
        </div>
</section>

      {/* GOALS TABLE */}
      <section className="goals-table">
        <div className="table-header">
          <h4>Study Goals</h4>
          <span className="filter">Last week</span>
        </div>

        <div className="table-card">
          <table>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          
          {/* Mobile stacked cards */}
        <div className="mobile-goals-cards">
          {studyGoals.map((item) => (
            <div key={item.id} className="goal-card">
              <div className="goal-row">
                <span className="goal-label">Goal</span>
                <span className="goal-value">{item.goal}</span>
              </div>
              <div className="goal-row">
                <span className="goal-label">Time</span>
                <span className="goal-value">{item.time}</span>
              </div>
              <div className="goal-row">
                <span className="goal-label">Status</span>
                <span className={`goal-value status ${item.status}`}>
                  {item.status.replace("-", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>

        </table>
        </div>
      </section>
    </>
  );
}
