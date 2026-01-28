export function getToday() {
  const today = new Date();

  return {
    day: today.toLocaleDateString("en-US", { weekday: "short" }),
    date: today.getDate(),
    month: today.toLocaleDateString("en-US", { month: "long" }),
    year: today.getFullYear(),
  };
}