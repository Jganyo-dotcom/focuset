import { useEffect, useMemo } from "react";
import "./ProgressRing.css";

export default function ProgressRing({
  total = 0,
  completed = 0,
  size = 44,
  stroke = 5,
  onComplete,
}) {
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // 🧠 Auto-complete when 100%
  useEffect(() => {
    if (progress === 100 && onComplete) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <div className="progress-ring-wrapper">
      <svg width={size} height={size} className="progress-ring">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        <circle
          className="ring-bg"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        <circle
          className="ring-progress"
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      <span className="ring-label">{progress}%</span>
    </div>
  );
}