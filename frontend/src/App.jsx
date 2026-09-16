import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import PublicLayout from "./layouts/PublicLayout";
import About from "./pages/Public/About.jsx";
import AuthPage from "./pages/Public/AuthPage.jsx";
import ContactPage from "./pages/Public/ContactPage.jsx";
import HomePage from "./pages/Public/HomePage.jsx";
import NotFound from "./pages/Public/NotFound.jsx";
import ProviderPage from "./pages/Public/ProviderPage.jsx";
import ServicesPage from "./pages/Public/ServicesPage.jsx";
import ViewDetails from "./pages/Public/ViewDetails.jsx";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import SidebarLayout from "./layouts/SidebarLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDash from "./pages/Admin/AdminDash.jsx";
import BookingsPage from "./pages/Admin/BookingsPage.jsx";
import ProvidersPage from "./pages/Admin/ProvidersPage.jsx";
import AdminServicesPage from "./pages/Admin/ServicesPage.jsx";
import UsersPage from "./pages/Admin/UsersPage.jsx";
import MyBookings from "./pages/User/MyBookings.jsx";
import SavedServices from "./pages/User/SavedServices.jsx";
import Account from "./pages/User/Account.jsx";
import ProviderDash from "./pages/Provider/ProviderDash.jsx";
import New from "./pages/Provider/New.jsx";
import Upcoming from "./pages/Provider/Upcoming.jsx";
import History from "./pages/Provider/History.jsx";
import Profile from "./pages/Provider/Profile.jsx";
import Earnings from "./pages/Provider/Earnings.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="join" element={<ProviderPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="services/viewDetails/:id" element={<ViewDetails />} />
        </Route>
        {/* Logged in user */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="mybookings" element={<MyBookings />} />
          <Route path="saved" element={<SavedServices />} />
        </Route>
        {/* Logged in provider */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute role="provider">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ProviderDash />} />
          <Route path="new" element={<New />} />
          <Route path="upcoming" element={<Upcoming />} />
          <Route path="history" element={<History />} />
          <Route path="earnings" element={<Earnings />} />
        </Route>
        <Route
          path="/provider/profile"
          element={
            <ProtectedRoute role="provider">
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
        </Route>
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Account />} />
        </Route>

        {/* Logged in admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDash />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="providers" element={<ProvidersPage />} />
          <Route path="service-catalog" element={<AdminServicesPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        {/* Catch all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
}

export default App;
