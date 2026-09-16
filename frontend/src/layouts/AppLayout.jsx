import { Outlet } from "react-router-dom";
import Header from "../components/ui/Header";

function AppLayout() {
  return (
    <div className="relative">
      <Header />
      <Outlet />
    </div>
  );
}

export default AppLayout;