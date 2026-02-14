import { useEffect, useState } from "react";
import "../styles/Profile.css";

const STORAGE_KEY = "profile";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      setProfile({
        fullName: stored.fullName || "",
        username: stored.username || "",
        email: stored.email || "",
        phone: stored.phone || "",
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p className="muted">Update your personal information</p>

      <form className="profile-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Full Name</label>
          <input name="fullName" value={profile.fullName} onChange={handleChange} placeholder="Enter full name" required />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input name="username" value={profile.username} onChange={handleChange} placeholder="Enter username" required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Enter email" required />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input name="phone" value={profile.phone} onChange={handleChange} placeholder="+234 801 234 5678" />
        </div>

        <button type="submit" className="primary-btn">Save Changes</button>
        {saved && <p className="success-text">Profile saved successfully</p>}
      </form>
    </div>
  );
}