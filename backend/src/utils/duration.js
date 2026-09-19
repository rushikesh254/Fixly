// Providers describe a service duration in plain words ("2-3 hours", "90 mins",
// "1-2 days"). Scheduling needs a number of minutes so overlapping bookings can
// be detected, so this converts the label into minutes using the upper bound of
// any range. Falls back to 60 minutes when nothing can be parsed.
const DEFAULT_DURATION = 60;

const UNIT_IN_MINUTES = [
  { pattern: /day/i, minutes: 60 * 8 }, // a working day
  { pattern: /hour|hr/i, minutes: 60 },
  { pattern: /min/i, minutes: 1 },
];

const parseDurationToMinutes = (label) => {
  if (typeof label !== "string" || !label.trim()) return DEFAULT_DURATION;

  const numbers = label.match(/\d+(\.\d+)?/g);
  if (!numbers || numbers.length === 0) return DEFAULT_DURATION;

  // use the upper bound of a range so a booking never gets scheduled too tightly
  const amount = Math.max(...numbers.map(Number));
  if (!Number.isFinite(amount) || amount <= 0) return DEFAULT_DURATION;

  const unit = UNIT_IN_MINUTES.find(({ pattern }) => pattern.test(label));
  const minutes = Math.round(amount * (unit ? unit.minutes : 60));

  return minutes > 0 ? minutes : DEFAULT_DURATION;
};

export { parseDurationToMinutes };
