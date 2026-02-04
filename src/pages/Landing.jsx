import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

import "../styles/landing.css";
import teroImg from "../assets/images/hero-left.png";
import heroImg from "../assets/images/hero-right.png";
import painImg from "../assets/images/pain.png";
import solutionImg from "../assets/images/solution.png";

const Landing = () => {
  useEffect(() => {
    // Ensure landing page does NOT have sidebar offset
    document.body.classList.remove("has-sidebar");
  }, []);

  return (
    <div className="landing">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <h1>Build consistent learning habits</h1>
        <p>
          FocuSet helps digital learners turn learning goals into daily learning
          habits through simple goal setting, time tracking and gentle
          motivation.
        </p>

        <div className="hero-image">
          <img src={teroImg} alt="Learning illustration" className="hero-img" />
          <Link to="/signup" className="cta-btn">
            Get Started
          </Link>
          <img src={heroImg} alt="Learning illustration" className="hero-img" />
        </div>
      </section>

      {/* PAIN POINTS & SOLUTIONS */}
      <section className="problem-solution">
        <div className="card pain">
          <h2 className="danger">Learners Pain Points ❌</h2>
          <div className="card-content">
            <ul>
              <li>Staying motivated for the first few days</li>
              <li>Setting goals but not following through</li>
              <li>Studying without tracking real progress</li>
            </ul>
            <img src={painImg} alt="Pain points" />
          </div>
        </div>

        <div className="card solution">
          <h2 className="success">Solutions ✅</h2>
          <div className="card-content">
            <ul>
              <li>Set clear, realistic daily goals</li>
              <li>Track time spent studying, not pressure</li>
              <li>Build streaks that encourage consistency</li>
            </ul>
            <img src={solutionImg} alt="Solutions" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature daily">
            <h3>Daily Goal Setting</h3>
            <p>Set simple, achievable study goals that fit your routine</p>
          </div>
          <div className="feature time">
            <h3>Time Tracking</h3>
            <p>See how much time you invest in learning each week</p>
          </div>
          <div className="feature streak">
            <h3>Streak Building</h3>
            <p>Stay motivated by building learning streaks over time</p>
          </div>
          <div className="feature motivate">
            <h3>Gentle Motivation</h3>
            <p>Encouragement that keeps you going, without pressure</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start building a consistent learning habit today</h2>
        <Link to="/signup" className="cta-button">
          Create an account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">FAQ</a>
        </div>
        <p className="footer-text">© 2026 FocusSet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;