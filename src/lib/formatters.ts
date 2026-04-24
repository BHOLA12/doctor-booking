export function formatDisplayTime(time: string) {
  const [hour, min] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h}:${min.toString().padStart(2, "0")} ${ampm}`;
}

export function formatWaitTime(minutes = 0) {
  if (minutes <= 0) return "Starting soon";

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} hr`;
  return `${hours} hr ${remainder} min`;
}
