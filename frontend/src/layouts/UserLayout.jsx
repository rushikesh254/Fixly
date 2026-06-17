import { Outlet } from "react-router-dom";
import Header from "../components/ui/Header";

function UserLayout() {
  return (
    <div className="relative">
      <Header />
      <Outlet />
    </div>
  );
}

export default UserLayout;
