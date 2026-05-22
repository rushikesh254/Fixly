import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  if (location.pathname === "/auth") return null; // Don't show footer on auth page

  return <div>Footer</div>;
}

export default Footer;
