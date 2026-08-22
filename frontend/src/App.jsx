import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import PublicLayout from "./layouts/PublicLayout";
import About from "./pages/Public/About.jsx";
import AuthPage from "./pages/Public/AuthPage.jsx";
import ContactPage from "./pages/Public/ContactPage.jsx";
import HomePage from "./pages/Public/HomePage.jsx";
import ProviderPage from "./pages/Public/ProviderPage.jsx";
import ServicesPage from "./pages/Public/ServicesPage.jsx";
import ViewDetails from "./pages/Public/ViewDetails.jsx";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import MyBookings from "./pages/User/MyBookings.jsx";
import SavedServices from "./pages/User/SavedServices.jsx";
import ProfilePage from "./pages/User/ProfilePage.jsx";
import ProviderLayout from "./layouts/ProviderLayout.jsx";
import ProviderDash from "./pages/Provider/ProviderDash.jsx";
import New from "./pages/Provider/New.jsx";
import Upcoming from "./pages/Provider/Upcoming.jsx";
import History from "./pages/Provider/History.jsx";
import Support from "./pages/Provider/Support.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="provider" element={<ProviderPage />} />
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
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="mybookings" element={<MyBookings />} />
          <Route path="saved" element={<SavedServices />} />
        </Route>
        {/* Logged in provider */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute role="provider">
              <ProviderLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ProviderDash />} />
          <Route path="new" element={<New />} />
          <Route path="upcoming" element={<Upcoming />} />
          <Route path="history" element={<History />} />
          <Route path="support" element={<Support />} />
        </Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfilePage />} />
        </Route>
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
}

export default App;
