import Header from "../components/ui/Header.jsx";
import { Outlet } from "react-router-dom";

function ProviderLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default ProviderLayout;
