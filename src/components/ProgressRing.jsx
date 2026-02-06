// src/components/ProgressRing.jsx
import "../styles/progress-ring.css";

export default function ProgressRing({ percent }) {
  const radius = 44;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="progress-ring">
      <svg width="120" height="120">
        <circle
          className="bg"
          strokeWidth={stroke}
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="progress"
          strokeWidth={stroke}
          r={radius}
          cx="60"
          cy="60"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="center">
        <strong>{percent}%</strong>
        <span>Progress</span>
      </div>
    </div>
  );
}