// The ui works with 12 hour slot labels ("9:00 AM", see constants/availableSlots)
// while the api stores and expects 24 hour times ("09:00"). These helpers convert
// between the two so neither side has to change.

export const toTime12h = (time24) => {
  if (typeof time24 !== "string" || !time24.includes(":")) return time24 || "";

  const [hours, minutes] = time24.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time24;

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const toTime24h = (time12) => {
  if (typeof time12 !== "string") return "";

  // already a 24 hour value
  if (!/am|pm/i.test(time12)) {
    const [hours = "0", minutes = "0"] = time12.split(":");
    return `${String(Number(hours)).padStart(2, "0")}:${String(Number(minutes)).padStart(2, "0")}`;
  }

  const [clock, period] = time12.trim().split(/\s+/);
  const [hours, minutes = "0"] = clock.split(":").map(Number);

  let hours24 = hours;
  if (/pm/i.test(period) && hours !== 12) hours24 += 12;
  if (/am/i.test(period) && hours === 12) hours24 = 0;

  return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

// Local calendar date as YYYY-MM-DD. toISOString() would shift the day for any
// timezone behind or ahead of UTC, which is what the api validates against.
export const toDateKey = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
