import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "../components/ui/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LuCalendarCheck,
  LuHeadphones,
  LuLayoutDashboard,
  LuUserRound,
  LuUsers,
  LuWrench,
} from "react-icons/lu";

const adminNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LuLayoutDashboard size={20} />,
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: <LuCalendarCheck size={20} />,
  },
  { label: "Providers", path: "/admin/providers", icon: <LuUsers size={20} /> },
  { label: "Users", path: "/admin/users", icon: <LuUserRound size={20} /> },
  {
    label: "Services",
    path: "/admin/service-catalog",
    icon: <LuWrench size={20} />,
  },
  {
    label: "Support",
    path: "/admin/support",
    icon: <LuHeadphones size={20} />,
  },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.error("You are logged out!");
    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen bg-slate-100">
      <Sidebar
        subtitle="Administrator"
        section="manage"
        navItems={adminNavItems}
        user={user}
        onLogout={handleLogout}
      />
      <main className="min-h-screen flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
