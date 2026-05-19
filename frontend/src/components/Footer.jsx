import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  if (location.pathname == "/auth") return null;

  return <div>Footer</div>;
}

export default Footer;
