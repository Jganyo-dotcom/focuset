export default function ProgressRing({
  total = 0,
  completed = 0,
  size = 42,
  stroke = 5,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total === 0 ? 0 : completed / total;
  const offset = circumference - progress * circumference;

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="#8b5cf6"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize="11"
        fill="#111827"
        fontWeight="600"
      >
        {Math.round(progress * 100)}%
      </text>
    </svg>
  );
}