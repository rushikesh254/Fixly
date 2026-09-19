import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCallback, useMemo } from "react";
import { getMyBookings } from "../../api/bookings";
import EmptyState from "../../components/ui/EmptyState";
import Loader, { ErrorState } from "../../components/ui/Loader";
import { useFetch } from "../../hooks/useFetch";
import { normalizeBooking } from "../../utils/normalize";
import { toDateKey } from "../../utils/time";
import { FiCalendar, FiClock, FiMapPin, FiTrendingUp } from "react-icons/fi";
import { TfiMoney } from "react-icons/tfi";

function Earnings() {
  const fetchBookings = useCallback(
    () =>
      getMyBookings().then((res) => res.data.bookings.map(normalizeBooking)),
    [],
  );

  const { data: myBookings, loading, error, refetch } = useFetch(fetchBookings, {
    initialData: [],
  });

  const completedBookings = useMemo(
    () =>
      (myBookings || [])
        .filter((b) => b.status === "Completed")
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [myBookings],
  );

  // Calculate earnings ( local calendar dates so "today" matches the provider )
  const today = toDateKey(new Date());

  const todayEarnings = completedBookings
    .filter((b) => b.date === today)
    .reduce((sum, b) => sum + b.price, 0);

  const weekAgoDate = new Date();
  weekAgoDate.setDate(weekAgoDate.getDate() - 6);

  const weekAgoKey = toDateKey(weekAgoDate);

  const last7daysEarnings = completedBookings
    .filter((b) => b.date >= weekAgoKey && b.date <= today)
    .reduce((sum, b) => sum + b.price, 0);

  const monthEarnings = completedBookings
    .filter((b) => b.date.slice(0, 7) === today.slice(0, 7))
    .reduce((sum, b) => sum + b.price, 0);

  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.price, 0);

  // Summary cards data
  const summaryCards = [
    {
      title: "Today's Earnings",
      value: `₹${todayEarnings}`,
      icon: <FiClock size={22} />,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Last 7 Day's Earnings",
      value: `₹${last7daysEarnings}`,
      icon: <TfiMoney size={22} />,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "This Month's Earnings",
      value: `₹${monthEarnings}`,
      icon: <FiCalendar size={22} />,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Total Earnings",
      value: `₹${totalEarnings}`,
      icon: <FiTrendingUp size={22} />,
      iconClass: "bg-purple-100 text-purple-600",
    },
  ];

  //  data for the last 7 days bar chart
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const key = toDateKey(date);

    const earnings = completedBookings
      .filter((booking) => booking.date === key)
      .reduce((sum, booking) => sum + booking.price, 0);

    last7Days.push({
      day: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      earnings,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
          Earnings
        </h1>
        <p className="text-gray-500 text-[13px] sm:text-sm mt-0.5">
          Track how much you&apos;ve earned from completed jobs.
        </p>
      </div>

      {loading && <Loader label="Loading earnings..." className="mt-8" />}

      {!loading && error && (
        <ErrorState message={error} onRetry={refetch} className="mt-8" />
      )}

      {!loading && !error && completedBookings.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No earnings yet"
            description="Once your completed bookings are recorded, your earnings and history will appear here."
            buttonText="Go to Upcoming"
            buttonLink="provider/upcoming"
            className="bg-blue-600 hover:bg-blue-700"
          />
        </div>
      ) : (
        !loading &&
        !error && (
        <>
          {/* Summary cards */}
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  {card.icon}
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-block h-5 w-1 rounded-full bg-blue-600"></span>
              LAST 7 DAYS EARNINGS
            </h2>
            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={last7Days}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, "Earnings"]}
                    cursor={{ fill: "#eff6ff" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      fontSize: 13,
                    }}
                  />
                  <Bar
                    dataKey="earnings"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Earnings history */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-block h-5 w-1 rounded-full bg-purple-500"></span>
              EARNINGS HISTORY
            </h2>

            <div className="mt-5 flex flex-col gap-4">
              {completedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 transition hover:border-blue-300 hover:shadow-sm"
                >
                  {/* customer + service + amount */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {booking.customerName}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {booking.serviceTitle}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <p className="font-bold text-gray-900">
                        ₹{booking.price}
                      </p>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* schedule + area */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={12} />
                      {booking.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin size={12} /> {booking.address.split(",")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
        )
      )}
    </div>
  );
}

export default Earnings;
