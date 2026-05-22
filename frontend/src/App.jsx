import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import About from "./pages/About.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage";
import ProviderPage from "./pages/ProviderPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<About />} />
        <Route path="providers" element={<ProviderPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="auth" element={<AuthPage />} />
      </Route>
    </Routes>
  );
}

export default App;
