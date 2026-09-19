// Combine a booking's calendar date ("2026-10-15") and slot label ("10:00 AM")
// into a local Date. The parts are passed to the Date constructor individually
// because new Date("2026-10-15") is parsed as UTC midnight, which shifts the day
// for anyone not on UTC.
const getBookingDateTime = (booking) => {
  if (!booking?.date) return new Date(NaN);

  const [year, month, day] = String(booking.date).split("-").map(Number);

  const [clock = "12:00", period = ""] = String(booking.time || "").split(" ");
  const [hours = 0, minutes = 0] = clock.split(":").map(Number);

  // Convert to 24-hour format
  let hours24 = hours;
  if (/pm/i.test(period) && hours !== 12) {
    hours24 += 12;
  }

  if (/am/i.test(period) && hours === 12) {
    hours24 = 0;
  }

  return new Date(year, (month || 1) - 1, day || 1, hours24, minutes, 0, 0);
};

export default getBookingDateTime;
