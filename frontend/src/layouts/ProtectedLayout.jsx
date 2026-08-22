import Header from "../components/ui/Header";
import { Outlet } from "react-router-dom";

function ProtectedLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default ProtectedLayout;
