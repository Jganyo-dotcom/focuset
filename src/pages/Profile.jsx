// import { useEffect, useState } from "react";
// import "../styles/Profile.css";

// const STORAGE_KEY = "profile";

// export default function Profile() {
//   const [profile, setProfile] = useState({
//     fullName: "",
//     username: "",
//     email: "",
//     phone: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [saved, setSaved] = useState(false);

//   useEffect(() => {
//     try {
//       const storedProfile = JSON.parse(localStorage.getItem(STORAGE_KEY));
//       if (storedProfile) setProfile(storedProfile);
//     } catch (err) {
//       console.error("Failed to load profile:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
//       setSaved(true);
//       setTimeout(() => setSaved(false), 2000);
//     } catch (err) {
//       console.error("Failed to save profile:", err);
//     }
//   };

//   if (loading) return <p style={{ padding: "24px" }}>Loading profile...</p>;

//   return (
//     <div className="profile-page">
//       <h2>Profile</h2>
//       <p className="muted">Update your personal information</p>

//       <form className="profile-form" onSubmit={handleSave}>
//         <div className="form-group">
//           <label>Full Name</label>
//           <input
//             name="fullName"
//             value={profile.fullName}
//             onChange={handleChange}
//             placeholder="Enter full name"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Username</label>
//           <input
//             name="username"
//             value={profile.username}
//             onChange={handleChange}
//             placeholder="Enter username"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={profile.email}
//             onChange={handleChange}
//             placeholder="Enter email"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Phone</label>
//           <input
//             name="phone"
//             value={profile.phone}
//             onChange={handleChange}
//             placeholder="+234 801 234 5678"
//           />
//         </div>

//         <button type="submit" className="primary-btn">
//           Save Changes
//         </button>

//         {saved && <p className="success-text">Profile saved successfully</p>}
//       </form>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { getGoals } from "../utils/goalsStorage";
import "../styles/Profile.css";

const STORAGE_KEY = "profile";
const MAX_PHOTO_BYTES = 400 * 1024; // keeps localStorage from filling up

const DEFAULT_PROFILE = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  bio: "",
  course: "",
  studyGoalMinutes: "60",
  preferredTime: "Evening",
  reminders: true,
  gentleMotivation: true,
  avatar: "",
  joinedAt: "",
};

/* ===============================
   HELPERS
=============================== */
const toDateKey = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getInitials = (name, username) => {
  const source = (name || username || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  return (
    parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0].slice(0, 2)
  ).toUpperCase();
};

const formatMemberSince = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d)
    ? ""
    : d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export default function Profile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [stats, setStats] = useState({ streak: 0, completed: 0, hours: 0 });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const savedTimer = useRef(null);
  const fileInput = useRef(null);

  /* ===============================
     LOAD PROFILE + LEARNING STATS
  =============================== */
  useEffect(() => {
    try {
      const storedProfile = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (storedProfile) {
        setProfile({ ...DEFAULT_PROFILE, ...storedProfile });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }

    try {
      const goals = getGoals() || [];

      const completed = goals.filter((g) => g.status === "Completed").length;
      const minutes = goals.reduce((acc, g) => acc + (g.progress || 0), 0);

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 0; i < 28; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const goal = goals.find((g) => g.date === toDateKey(d));
        if (goal && goal.progress > 0) streak++;
        else break;
      }

      setStats({
        streak,
        completed,
        hours: Math.round((minutes / 60) * 10) / 10,
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }

    return () => clearTimeout(savedTimer.current);
  }, []);

  /* ===============================
     HANDLERS
  =============================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Image is too large. Please choose one under 400KB.");
      return;
    }

    setPhotoError("");
    const reader = new FileReader();
    reader.onload = () =>
      setProfile((prev) => ({ ...prev, avatar: String(reader.result) }));
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removePhoto = () => {
    setPhotoError("");
    setProfile((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      const toSave = {
        ...profile,
        joinedAt: profile.joinedAt || new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setProfile(toSave);
      setSaved(true);
      clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setPhotoError("Could not save. Try a smaller photo.");
    }
  };

  if (loading) return <p style={{ padding: "24px" }}>Loading profile...</p>;

  /* ===============================
     PROFILE COMPLETENESS
  =============================== */
  const trackedFields = [
    profile.fullName,
    profile.username,
    profile.email,
    profile.phone,
    profile.bio,
    profile.course,
    profile.avatar,
  ];
  const completion = Math.round(
    (trackedFields.filter((v) => String(v || "").trim()).length /
      trackedFields.length) *
      100
  );

  const memberSince = formatMemberSince(profile.joinedAt);

  return (
    <div className="profile-page">
      <h2 className="profile-title">Profile</h2>
      <p className="profile-subtitle">Update your personal information</p>

      {/* ===============================
          IDENTITY CARD
      =============================== */}
      <section className="profile-hero">
        <div className="profile-banner" />

        <div className="profile-hero-body">
          <div className="profile-avatar-wrap">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Your profile"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar profile-avatar-initials">
                {getInitials(profile.fullName, profile.username)}
              </div>
            )}

            <button
              type="button"
              className="avatar-edit"
              aria-label="Change profile photo"
              onClick={() => fileInput.current?.click()}
            >
              📷
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              hidden
            />
          </div>

          <div className="profile-identity">
            <h3>{profile.fullName || "Your name"}</h3>
            <p className="profile-handle">
              {profile.username ? `@${profile.username}` : "@username"}
            </p>
            {profile.course && (
              <span className="profile-chip">🎓 {profile.course}</span>
            )}
            {memberSince && (
              <p className="profile-since">Learning with FocuSet since {memberSince}</p>
            )}
          </div>

          {profile.avatar && (
            <button type="button" className="link-btn" onClick={removePhoto}>
              Remove photo
            </button>
          )}
        </div>

        {photoError && <p className="profile-error">{photoError}</p>}

        <div className="profile-completion">
          <div className="completion-top">
            <span>Profile completeness</span>
            <strong>{completion}%</strong>
          </div>
          <div
            className="completion-bar"
            role="progressbar"
            aria-valuenow={completion}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="completion-fill" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </section>

      {/* ===============================
          LEARNING STATS (read-only, from your goals)
      =============================== */}
      <section className="profile-stats">
        <div className="stat-tile">
          <span className="stat-icon">🔥</span>
          <strong>{stats.streak}</strong>
          <small>Day streak</small>
        </div>
        <div className="stat-tile">
          <span className="stat-icon">🎯</span>
          <strong>{stats.completed}</strong>
          <small>Goals completed</small>
        </div>
        <div className="stat-tile">
          <span className="stat-icon">⏱️</span>
          <strong>{stats.hours}</strong>
          <small>Hours studied</small>
        </div>
      </section>

      {/* ===============================
          FORM
      =============================== */}
      <form className="profile-form" onSubmit={handleSave}>
        {/* PERSONAL INFO */}
        <fieldset className="form-section">
          <legend>👤 Personal information</legend>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+234 801 234 5678"
              />
            </div>

            <div className="form-group full">
              <label htmlFor="bio">
                About you <span className="optional">(optional)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                maxLength={160}
                value={profile.bio}
                onChange={handleChange}
                placeholder="What are you learning and why?"
              />
              <span className="char-count">{profile.bio.length}/160</span>
            </div>
          </div>
        </fieldset>

        {/* LEARNING PREFERENCES */}
        <fieldset className="form-section">
          <legend>📚 Learning preferences</legend>

          <div className="form-grid">
            <div className="form-group full">
              <label htmlFor="course">Course or learning focus</label>
              <input
                id="course"
                name="course"
                value={profile.course}
                onChange={handleChange}
                placeholder="e.g. Software Engineering"
              />
            </div>

            <div className="form-group">
              <label htmlFor="studyGoalMinutes">Daily study goal</label>
              <select
                id="studyGoalMinutes"
                name="studyGoalMinutes"
                value={profile.studyGoalMinutes}
                onChange={handleChange}
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1 hour 30 minutes</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preferredTime">Best time to study</label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={profile.preferredTime}
                onChange={handleChange}
              >
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* NOTIFICATIONS */}
        <fieldset className="form-section">
          <legend>🔔 Reminders</legend>

          <label className="switch-row" htmlFor="reminders">
            <span>
              <strong>Daily study reminder</strong>
              <small>A nudge at your best study time</small>
            </span>
            <span className="switch">
              <input
                id="reminders"
                type="checkbox"
                name="reminders"
                checked={profile.reminders}
                onChange={handleChange}
              />
              <span className="slider" />
            </span>
          </label>

          <label className="switch-row" htmlFor="gentleMotivation">
            <span>
              <strong>Gentle motivation</strong>
              <small>Encouragement that keeps you going, without pressure</small>
            </span>
            <span className="switch">
              <input
                id="gentleMotivation"
                type="checkbox"
                name="gentleMotivation"
                checked={profile.gentleMotivation}
                onChange={handleChange}
              />
              <span className="slider" />
            </span>
          </label>
        </fieldset>

        <button type="submit" className="save-btn">
          Save Changes
        </button>

        {saved && (
          <p className="success-text" role="status">
            ✓ Profile saved successfully
          </p>
        )}
      </form>
    </div>
  );
}