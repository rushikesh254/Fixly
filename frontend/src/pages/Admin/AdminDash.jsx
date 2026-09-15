import { Link } from "react-router-dom";
import {
  CiBoxList,
  CiCalendar,
  CiCircleCheck,
  CiCircleRemove,
  CiLock,
  CiShop,
  CiUser,
} from "react-icons/ci";
import { FiArrowRight } from "react-icons/fi";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import EmptyState from "../../components/ui/EmptyState";
import { adminRecents } from "../../data/adminRecents";
import bookings from "../../data/bookings";
import providers from "../../data/providers";
import services from "../../data/services";
import { users } from "../../data/users";
import formatDate from "../../utils/formatDate";

function AdminDash() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // pending approvals
  const pendingApprovals = providers
    .filter((p) => p.status === "pending")
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 3);

  // data for the last 7 days
  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    weekData.push({
      name: d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      bookings: bookings.filter((b) => b.date === key).length,
    });
  }

  const statsData = [
    {
      title: "TOTAL PROVIDERS",
      value: providers.length,
      icon: <CiShop size={22} />,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "TOTAL USERS",
      value: users.length,
      icon: <CiUser size={22} />,
      iconClass: "bg-purple-100 text-purple-600",
    },
    {
      title: "TODAY'S BOOKINGS",
      value: bookings.filter((b) => b.date === todayKey).length,
      icon: <CiCalendar size={22} />,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "SERVICES LIVE",
      value: services.filter((s) => s.status === "active").length,
      icon: <CiBoxList size={22} />,
      iconClass: "bg-amber-100 text-amber-600",
    },
  ];

  const activityConfig = {
    provider_registered: {
      label: "Provider Registered",
      color: "bg-blue-100 text-blue-600",
      icon: <CiUser size={16} />,
    },
    provider_approved: {
      label: "Provider Approved",
      color: "bg-emerald-100 text-emerald-600",
      icon: <CiCircleCheck size={16} />,
    },
    provider_rejected: {
      label: "Provider Rejected",
      color: "bg-red-100 text-red-600",
      icon: <CiCircleRemove size={16} />,
    },
    provider_blocked: {
      label: "Provider Blocked",
      color: "bg-red-100 text-red-600",
      icon: <CiLock size={16} />,
    },
    user_blocked: {
      label: "User Blocked",
      color: "bg-slate-100 text-slate-600",
      icon: <CiLock size={16} />,
    },
  };

  const quickLinks = [
    {
      label: "Review Providers",
      description: "Approve or reject provider applications",
      to: "/admin/providers",
      iconClass: "bg-blue-100 text-blue-600",
      icon: <CiShop size={22} />,
    },
    {
      label: "Manage Categories",
      description: "Organise service categories",
      to: "/admin/service-catalog",
      iconClass: "bg-purple-100 text-purple-600",
      icon: <CiBoxList size={22} />,
    },
    {
      label: "View All Bookings",
      description: "Monitor all platform bookings",
      to: "/admin/bookings",
      iconClass: "bg-emerald-100 text-emerald-600",
      icon: <CiCalendar size={22} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8 sm:px-8 lg:px-15">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl bg-blue-600 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, Admin</h1>
          <p className="mt-1 text-sm text-blue-100">{todayLabel}</p>
        </div>
        <Link
          to="/admin/providers?tab=pending"
          className="w-fit rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          {pendingApprovals.length} Pending Review
        </Link>
      </div>

      {/*  Stats row */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              {stat.subtitle && (
                <p className="mt-0.5 text-xs font-medium text-amber-600">
                  {stat.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/*  Pending Approvals */}
          <div className="rounded-2xl border-2 border-amber-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <span className="inline-block h-5 w-1 rounded-full bg-amber-500"></span>
                PENDING APPROVALS
              </h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {pendingApprovals.length} pending
              </span>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="mt-5">
                <EmptyState
                  title="No pending approvals right now"
                  description="New provider applications will appear here for review."
                />
              </div>
            ) : (
              <>
                <div className="mt-5 flex flex-col gap-4">
                  {pendingApprovals.map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                          <CiUser size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {provider.providerName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {provider.category}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-medium text-gray-700">
                          {formatDate(provider.appliedAt)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          Applied
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/admin/providers?tab=pending"
                  className="mt-5 flex items-center justify-center gap-1 rounded-xl border border-amber-200 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-50"
                >
                  View All <FiArrowRight />
                </Link>
              </>
            )}
          </div>

          {/* Bookings Overview */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <span className="inline-block h-5 w-1 rounded-full bg-blue-600"></span>
                BOOKINGS OVERVIEW
              </h2>
              <span className="text-xs text-gray-400">Last 7 days</span>
            </div>
            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} barSize={26}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#eff6ff" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      fontSize: 13,
                    }}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="#1E4ED8"
                    radius={[6, 6, 0, 0]}
                    name="Bookings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-block h-5 w-1 rounded-full bg-emerald-500"></span>
            RECENT ACTIVITY
          </h2>

          <div className="mt-5 flex flex-col gap-3">
            {adminRecents.length === 0 ? (
              <EmptyState
                title="No Recent Activity"
                description="Recent platform activity will appear here."
              />
            ) : (
              adminRecents.map((activity, idx) => {
                const cfg =
                  activityConfig[activity.type] ||
                  activityConfig.provider_registered;

                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${cfg.color}`}
                      >
                        {cfg.icon}
                      </div>
                      {idx < adminRecents.length - 1 && (
                        <div className="mt-1 h-full w-px bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {activity.actorName}
                        </p>
                        <span className="shrink-0 text-xs text-gray-400">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {cfg.label}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/*  Quick Links */}
      <div className="mt-8">
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${link.iconClass}`}
              >
                {link.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {link.label}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {link.description}
                </p>
              </div>
              <FiArrowRight className="shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDash;
