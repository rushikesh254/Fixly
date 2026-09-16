import { Outlet } from "react-router-dom";

function SidebarLayout() {
  return (
    <div className="relative">
      <Outlet />
    </div>
  );
}

export default SidebarLayout;