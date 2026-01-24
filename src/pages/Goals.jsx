// src/pages/Goals.jsx
import { useEffect, useState } from "react";
import GoalForm from "../components/GoalForm";
import GoalMiniModal from "../components/GoalMiniModal";
import StreakModal from "../components/StreakModal";
import "../styles/goals.css";
import { getGoals } from "../services/goal";

export default function Goals() {
  const [activeGoals, setActiveGoals] = useState([]);
  const [archivedGoals, setArchivedGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null); // modal target for mini goals
  const [openStreakGoalId, setOpenStreakGoalId] = useState(null); // modal target for streak
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals(); // backend returns { message, goals: [...] }
        const allGoals = data.goals || [];

        // Split into active vs archived/completed
        const active = allGoals.filter((g) => g.status === "active");
        const archived = allGoals.filter((g) => g.status === "completed");

        setActiveGoals(active);
        setArchivedGoals(archived);
      } catch (err) {
        setError(err.message || "Failed to load goals");
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  // update a single goal in state after changes from modal
  const updateGoalInState = (updatedGoal) => {
    setActiveGoals((prev) =>
      prev.map((g) => (g._id === updatedGoal._id ? updatedGoal : g)),
    );
    setArchivedGoals((prev) =>
      prev.map((g) => (g._id === updatedGoal._id ? updatedGoal : g)),
    );
  };

  // Helper to open mini-goal modal
  const openGoal = (goal) => {
    console.log("Opening goal modal:", goal._id);
    setSelectedGoal(goal);
    console.log("openGoal:", goal._id, goal.steps);
  };

  // Helper to open streak modal for a goal id
  const openStreak = (goalId) => {
    setOpenStreakGoalId(goalId);
  };

  // Replace with your actual API base or keep empty if you use a proxy
  const apiBase = ""; // e.g., "http://localhost:5000"

  return (
    <div className="app-layout">
      <div className="main-content">
        <div className="goals-grid">
          {/* LEFT COLUMN */}
          <div className="left-column">
            <GoalForm />

            {/* ACTIVE GOALS */}
            <section className="card">
              <h3>Active Goals</h3>
              <p className="muted">Here's what you're currently working on.</p>

              {loading ? (
                <p>Loading goals...</p>
              ) : (
                <table className="goals-table">
                  <thead>
                    <tr>
                      <th>Goal Name</th>
                      <th>Start Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeGoals.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="muted center">
                          No active goals
                        </td>
                      </tr>
                    ) : (
                      activeGoals.map((goal) => (
                        <tr key={goal._id} className="clickable-row">
                          <td>
                            <button
                              type="button"
                              className="row-btn"
                              onClick={() => openGoal(goal)}
                              aria-label={`Open ${goal.title} mini goals`}
                              style={{
                                all: "unset",
                                display: "block",
                                width: "100%",
                                cursor: "pointer",
                              }}
                            >
                              {goal.title}
                            </button>
                          </td>

                          <td>{goal.startDate?.slice(0, 10)}</td>
                          <td>{goal.endDate?.slice(0, 10)}</td>
                          <td className={`status ${goal.status}`}>
                            {goal.status}
                          </td>

                         

                          <td>
                            <button
                              className="streak-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openStreak(goal._id);
                              }}
                            >
                              Streak
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </section>

            {/* GOAL ARCHIVE */}
            <section className="card">
              <h3>Goal Archive</h3>
              <p className="muted">View completed or old goals</p>

              {loading ? (
                <p>Loading archive...</p>
              ) : (
                <table className="goals-table">
                  <thead>
                    <tr>
                      <th>Goal Name</th>
                      <th>Completed On</th>
                      <th>Notes</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedGoals.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="muted center">
                          No archived goals
                        </td>
                      </tr>
                    ) : (
                      archivedGoals.map((goal) => (
                        <tr key={goal._id} className="clickable-row">
                          <td>
                            <button
                              type="button"
                              className="row-btn"
                              onClick={() => openGoal(goal)}
                              aria-label={`Open ${goal.title} mini goals`}
                              style={{
                                all: "unset",
                                display: "block",
                                width: "100%",
                                cursor: "pointer",
                              }}
                            >
                              {goal.title}
                            </button>
                          </td>
                          <td>{goal.endDate?.slice(0, 10)}</td>
                          <td>{goal.notes || "-"}</td>
                          <td>
                            <button
                              className="edit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openGoal(goal);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            <section className="card summary-card">
              <h3>Goal Summary</h3>
              <div className="summary-item">
                <span className="dot blue" /> Active Goals{" "}
                <b>{activeGoals.length}</b>
              </div>
              <div className="summary-item">
                <span className="dot green" /> Completed Goals{" "}
                <b>{archivedGoals.length}</b>
              </div>
              <div className="summary-item">
                <span className="dot red" /> Overdue Goals{" "}
                <b>
                  {
                    activeGoals.filter(
                      (g) =>
                        new Date(g.endDate) < new Date() &&
                        g.status !== "completed",
                    ).length
                  }
                </b>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Mini-goal modal */}
      {selectedGoal && (
        <GoalMiniModal
          apiBase={apiBase}
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onGoalUpdated={updateGoalInState}
        />
      )}

      {/* Streak modal (single instance) */}
      {openStreakGoalId && (
        <StreakModal
          apiBase={apiBase}
          goalId={openStreakGoalId}
          onClose={() => setOpenStreakGoalId(null)}
        />
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}
