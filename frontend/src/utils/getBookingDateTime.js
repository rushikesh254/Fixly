const getBookingDateTime = (booking) => {
  const dateTime = new Date(booking.date);

  const [clock, period] = booking.time.split(" ");
  const [hours, minutes] = clock.split(":").map(Number);
  // Convert to 24-hour format
  let hours24 = hours;
  if (period === "PM" && hours !== 12) {
    hours24 += 12;
  }

  if (period === "AM" && hours === 12) {
    hours24 = 0;
  }
  // Set the hours and minutes to the date object
  dateTime.setHours(hours24, minutes, 0, 0);

  return dateTime;
};

export default getBookingDateTime;
