import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import PublicLayout from "./layouts/PublicLayout";
import About from "./pages/About.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage";
import ProviderPage from "./pages/ProviderPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ViewDetails from "./pages/ViewDetails.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import SavedServices from "./pages/SavedServices.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

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
        <Route path="/user/" element={<UserLayout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="mybookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="saved"
            element={
              <ProtectedRoute>
                <SavedServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
}

export default App;
