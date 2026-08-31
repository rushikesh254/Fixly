import { useState } from "react";
import { Link } from "react-router-dom";
import bookings from "../../data/bookings";
import providers from "../../data/providers";
import EmptyState from "../../components/ui/EmptyState";
import getBookingDateTime from "../../utils/getBookingDateTime";
import {
  FiArrowRight,
  FiCalendar,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiStar,
} from "react-icons/fi";
import { TfiMoney } from "react-icons/tfi";

function ProviderDash() {
  const provider = providers[0];
  const [availableToday, setAvailableToday] = useState(provider.availableToday);

  // Filter bookings for this provider
  const myBookings = bookings.filter((b) => b.providerId === provider.id);
  const today = new Date().toISOString().slice(0, 10);

  const newRequests = myBookings
    .filter(
      (b) => b.status === "Pending" && getBookingDateTime(b) >= new Date(),
    )
    .sort((a, b) => {
      return getBookingDateTime(a) - getBookingDateTime(b);
    });

  const todaySchedule = myBookings.filter(
    (b) => b.status === "Confirmed" && b.date === today,
  );
  const completedBookings = myBookings.filter((b) => b.status === "Completed");

  // Calculate earnings for today
  const todayEarnings = completedBookings
    .filter((b) => b.date === today)
    .reduce((sum, b) => sum + b.price, 0);

  // Calculate earnings for the week and month
  const weekAgoDate = new Date();
  weekAgoDate.setDate(weekAgoDate.getDate() - 7);

  const weekAgoKey = weekAgoDate.toISOString().slice(0, 10);

  const last7daysEarnings = completedBookings
    .filter((b) => b.date >= weekAgoKey)
    .reduce((sum, b) => sum + b.price, 0);

  const monthEarnings = completedBookings
    .filter((b) => b.date.slice(0, 7) === today.slice(0, 7))
    .reduce((sum, b) => sum + b.price, 0);

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statsData = [
    {
      title: "NEW REQUESTS",
      value: newRequests.length,
      icon: <FiCalendar size={22} />,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "TODAY'S BOOKINGS",
      value: todaySchedule.length,
      icon: <FiClock size={22} />,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "TODAY'S EARNINGS",
      value: `₹ ${todayEarnings}`,
      icon: <TfiMoney size={22} />,
      iconClass: "bg-purple-100 text-purple-600",
    },
    {
      title: "AVERAGE RATING",
      value: (
        <span className="flex items-center gap-1">
          <FiStar size={16} className="fill-yellow-400 text-yellow-500" />
          {provider.rating}
        </span>
      ),
      icon: <FiStar size={22} />,
      iconClass: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Header Section */}
      <div className="rounded-2xl bg-blue-600 px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, {provider.provider.name.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-sm text-blue-100">{todayLabel}</p>
        </div>
        <div className="flex items-center gap-3 w-fit rounded-full bg-white/10 px-4 py-2.5">
          <span
            className={`text-sm font-medium ${
              availableToday ? "text-white" : "text-blue-200"
            }`}
          >
            Available Today
          </span>
          <button
            onClick={() => setAvailableToday(!availableToday)}
            className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${
              availableToday ? "bg-emerald-300" : "bg-white/30"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                availableToday ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
            >
              {stat.icon}
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Today's Schedules */}
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-block h-5 w-1 rounded-full bg-blue-600"></span>
              TODAY'S SCHEDULE
            </h2>

            <div className="mt-5 flex flex-col gap-4">
              {todaySchedule.length === 0 ? (
                <EmptyState
                  title="No Bookings Today"
                  description="You have no confirmed bookings scheduled for today."
                  buttonText="Check Requests"
                  buttonLink="provider/new"
                  className="bg-blue-600 hover:bg-blue-700"
                />
              ) : (
                todaySchedule.map((booking) => (
                  <Link
                    key={booking.id}
                    to="/provider/upcoming"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex shrink-0 flex-col items-center rounded-xl bg-blue-50 px-3 py-2">
                        <FiClock size={16} className="text-blue-600" />
                        <p className="mt-1 text-xs font-semibold text-blue-600">
                          {booking.time}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {booking.customerName}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-gray-500">
                          {booking.serviceTitle}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                          <FiMapPin size={12} /> {booking.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {booking.status}
                      </span>
                      <FiChevronRight className="text-gray-400" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
          {/* New Requests */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <span className="inline-block h-5 w-1 rounded-full bg-amber-500"></span>
                NEW REQUESTS
              </h2>
              <Link
                to="/provider/new"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-1 text-sm text-amber-600 hover:underline"
              >
                View All <FiArrowRight />
              </Link>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              {newRequests.length === 0 ? (
                <EmptyState
                  title="No New Requests"
                  description="New booking requests from customers will appear here."
                  buttonText="View Upcoming"
                  buttonLink="provider/upcoming"
                  className="bg-amber-500 hover:bg-amber-600"
                />
              ) : (
                newRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-semibold text-gray-900">
                        {req.customerName}
                      </p>
                      <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Pending
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {req.serviceTitle} · ₹{req.price}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                      <FiCalendar size={12} /> Requested for {req.date} at{" "}
                      {req.time}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* Earnings Section */}
        <div className="lg:col-span-1">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span className=" h-5 w-1 rounded-full bg-purple-500 inline-block"></span>
            EARNINGS
          </h2>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <TfiMoney size={22} />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Today
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹ {todayEarnings}
                </p>
              </div>
            </div>

            <div className="my-5 border-t border-dashed border-gray-200"></div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Last 7 days</p>
              <p className="text-lg font-bold text-gray-900">
                ₹ {last7daysEarnings}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-lg font-bold text-gray-900">
                ₹ {monthEarnings}
              </p>
            </div>

            <Link
              to="/provider/earnings"
              className="mt-6 flex w-full items-center justify-center gap-1 rounded-xl border border-purple-200 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
            >
              View Details <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderDash;
