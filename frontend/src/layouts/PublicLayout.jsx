import { Outlet } from "react-router-dom";
import Footer from "../components/ui/Footer";
import Header from "../components/ui/Header";

function PublicLayout() {
  return (
    <div className="relative">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PublicLayout;
