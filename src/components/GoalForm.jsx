import { useState } from "react";
import { createGoal } from "../services/goal";
import { generateSubscription } from "../utils/notification";
import "./goalform.css";

export default function GoalForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endgoal, setEndgoal] = useState("");
  const [frequency, setfrequency] = useState("Daily");
  const [steps, setSteps] = useState([{ name: "", subscription: null }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Update a step's name and auto-add a new empty step when typing in the last one
  const handleStepChange = (index, value) => {
    setError(null);
    setSuccessMsg(null);
    setSteps((prev) => {
      const updated = prev.map((s, i) =>
        i === index ? { ...s, name: value } : s,
      );
      if (index === prev.length - 1 && value.trim() !== "") {
        updated.push({ name: "", subscription: null });
      }
      while (
        updated.length > 1 &&
        updated[updated.length - 1].name.trim() === "" &&
        updated[updated.length - 2].name.trim() === ""
      ) {
        updated.pop();
      }
      return updated;
    });
  };

  // Generate a single subscription and assign to all non-empty steps
  const handleGenerateSubscriptionForAll = async () => {
    setError(null);
    setSuccessMsg(null);
    const validSteps = steps.filter((s) => s.name.trim() !== "");
    if (validSteps.length === 0) {
      setError("No mini goals to subscribe.");
      return;
    }

    setLoading(true);
    try {
      const sub = await generateSubscription(); // single subscription for all mini-goals
      setSteps((prev) =>
        prev.map((s) =>
          s.name.trim() !== "" ? { ...s, subscription: sub } : s,
        ),
      );
      setSuccessMsg("Subscription generated and applied to all mini goals.");
    } catch (err) {
      console.error(err);
      setError("Failed to generate subscription for mini goals.");
    } finally {
      setLoading(false);
    }
  };

  // Validate before submit
  const validateForm = () => {
    setError(null);
    if (!title.trim()) {
      setError("Primary goal title is required");
      return false;
    }
    if (!description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!startDate || !endgoal) {
      setError("Start and due dates are required");
      return false;
    }
    const validSteps = steps.filter((s) => s.name.trim() !== "");
    if (validSteps.length === 0) {
      setError("At least one mini goal is required");
      return false;
    }
    const unsubscribed = validSteps.some((s) => !s.subscription);
    if (unsubscribed) {
      setError(
        "Please generate subscription for all mini goals before saving.",
      );
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const payload = {
      title: title.trim(),
      startDate: new Date(startDate).toISOString(),
      endgoal: new Date(endgoal).toISOString(),
      status: "active",
      steps: steps
        .filter((s) => s.name.trim() !== "")
        .map((s, i) => ({
          index: i,
          name: s.name.trim(),
          subscription: s.subscription,
          frequency: frequency,
        })),
    };

    try {
      const response = await createGoal(payload);
      setSuccessMsg(response?.message || "Goal created successfully");
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndgoal("");
      setfrequency("Daily");
      setSteps([{ name: "", subscription: null }]);
      console.log("Created goal:", response?.data || response);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Create a New Goal</h2>

      <form className="goal-form" onSubmit={handleSubmit}>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="form-success" role="status">
            {successMsg}
          </div>
        )}

        <label>Primary Goal</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g Complete research course"
        />

        <label>Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
        />

        <div className="date-row">
          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              value={endgoal}
              onChange={(e) => setEndgoal(e.target.value)}
            />
          </div>
        </div>

        <label>Frequency</label>
        <select
          value={frequency}
          onChange={(e) => setfrequency(e.target.value)}
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
        </select>

        <label>Mini Goals</label>
        {steps.map((step, index) => (
          <div key={index} className="step-row">
            <input
              value={step.name}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`Mini goal ${index + 1}`}
            />
            {step.subscription && step.name.trim() !== "" ? (
              <span className="muted">Subscribed ✅</span>
            ) : (
              step.name.trim() !== "" && (
                <span className="muted">Not subscribed</span>
              )
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            type="button"
            onClick={handleGenerateSubscriptionForAll}
            disabled={loading}
          >
            Subscribe
          </button>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating..." : "Save Goal"}
          </button>
        </div>
      </form>
    </section>
  );
}
