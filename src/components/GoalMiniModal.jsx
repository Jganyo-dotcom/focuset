// services/goalsService.js
// const BASE_URL = "https://capstone-project-9o17.onrender.com/api/goals";
const BASE_URL = "https://capstone-project-9o17.onrender.com/student";
const token = localStorage.getItem("authToken");

// src/components/GoalMiniModal.jsx
import { useEffect, useState } from "react";
import "./GoalMiniModal.css";
import { getGoals } from "../services/goal";

export default function GoalMiniModal({
  apiBase = "http://127.0.0.1:45555/student/",
  goal,
  onClose,
  onGoalUpdated,
}) {
  // initialize from goal.steps (fallback to miniGoals)
  const [miniGoals, setMiniGoals] = useState(
    goal?.steps ?? goal?.miniGoals ?? [],
  );
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [error, setError] = useState(null);

  // reset local state when the selected goal changes
  useEffect(() => {
    setMiniGoals(goal?.steps ?? goal?.miniGoals ?? []);
    setEditingIndex(null);
    setEditText("");
    setError(null);
  }, [goal]);

  // helper: PATCH step at index with partial body
  async function patchMiniGoal(index, body) {
    setLoadingIndex(index);
    setError(null);
    try {
      // Adjust "steps" vs "minigoals" to match your backend route
      const res = await fetch(`${BASE_URL}/create/goals/${goal._id}/${index}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      getGoals();
      // Redirect to the goals page
      alert("updated");

      if (!res.ok) {
        const text = await res.json();
        alert(text.message);
        throw new Error(text.message || "Failed to update step");
      }
      const updatedGoal = await res.json(); // expect updated goal or updated steps
      const updatedSteps = updatedGoal?.steps ?? updatedGoal?.miniGoals ?? null;
      if (updatedSteps) {
        setMiniGoals(updatedSteps);
        onGoalUpdated && onGoalUpdated(updatedGoal);
      } else {
        // fallback: merge partial change locally
        setMiniGoals((prev) =>
          prev.map((m, i) => (i === index ? { ...m, ...body } : m)),
        );
      }
    } catch (err) {
      console.error("patchMiniGoal error:", err);
      setError(err.message || "Network error");
    } finally {
      setLoadingIndex(null);
    }
  }

  // helper: call a specific backend route for a mini-goal action
  async function markMiniGoalDone(index) {
    setLoadingIndex(index);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/goal/${goal._id}/step/${index}/done`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      const data = await res.json();
      // Redirect to the goals page
      alert(data.message || "ticked");
      if (!res.ok) {
        throw new Error(data.message || "Failed to update mini-goal");
      }

      // update local state immediately
      if (data?.steps) {
        alert("there");
        setMiniGoals(data.steps);
        onGoalUpdated?.(data);
      }

      // optionally refresh all goals if you want global consistency
      await getGoals();

      alert(data.message);

      return { ok: true, updatedGoal: data };
    } catch (err) {
      console.error("markMiniGoalDone error:", err);
      setError(err.message || "Network error");
      return { ok: false, error: err };
    } finally {
      setLoadingIndex(null);
    }
  }

  // mark done
  const handleMarkDone = async (index) => {
    setMiniGoals((prev) =>
      prev.map((m, i) =>
        i === index ? { ...m, completed: true, done: true } : m,
      ),
    );
    await markMiniGoalDone(index, { completed: true, done: true });
  };

  // undo done
  const handleUndo = async (index) => {
    setMiniGoals((prev) =>
      prev.map((m, i) =>
        i === index ? { ...m, completed: false, done: false } : m,
      ),
    );
    await patchMiniGoal(index, { completed: false, done: false });
  };

  // start editing
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditText(miniGoals[index]?.name ?? miniGoals[index]?.title ?? "");
  };

  // save edit
  const saveEdit = async (index) => {
    if (!editText.trim()) {
      setError("Mini-goal text cannot be empty");
      return;
    }
    setMiniGoals((prev) =>
      prev.map((m, i) =>
        i === index ? { ...m, name: editText, title: editText } : m,
      ),
    );
    setEditingIndex(null);
    await patchMiniGoal(index, { name: editText, title: editText });
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Mini goals for ${goal.title}`}
    >
      <div className="modal">
        <header className="modal-header">
          <h4>{goal.title} — Mini Goals</h4>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="modal-body">
          {miniGoals.length === 0 ? (
            <p className="muted">No mini-goals for this goal.</p>
          ) : (
            <table className="mini-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mini Goal</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {miniGoals.map((m, i) => {
                  const done = m.completed === true || m.done === true;
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        {editingIndex === i ? (
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(i);
                            }}
                          />
                        ) : (
                          <span className={done ? "done" : ""}>
                            {m.name ?? m.title}
                          </span>
                        )}
                      </td>
                      <td>{done ? "Done" : "Pending"}</td>
                      <td>
                        {editingIndex === i ? (
                          <>
                            <button
                              onClick={() => saveEdit(i)}
                              disabled={loadingIndex === i}
                            >
                              Save
                            </button>
                            <button onClick={() => setEditingIndex(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {!done ? (
                              <button
                                onClick={() => handleMarkDone(i)}
                                disabled={loadingIndex === i}
                              >
                                Mark as done
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUndo(i)}
                                disabled={loadingIndex === i}
                              >
                                Undo
                              </button>
                            )}
                            <button
                              onClick={() => startEdit(i)}
                              disabled={loadingIndex === i}
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {error && <div className="error">{error}</div>}
        </div>

        <footer className="modal-footer">
          <button onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}
