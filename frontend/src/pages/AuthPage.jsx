import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthCard from "../components/ui/AuthCard";

function AuthPage() {
  const location = useLocation();
  const [isFlipped, setIsFlipped] = useState(
    location.state?.isFlipped || false,
  );

  useEffect(() => {
    if (location.state && location.state.isFlipped !== undefined) {
      setIsFlipped(location.state.isFlipped);
    }
  }, [location.state]);

  return (
    <div>
      <AuthCard isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
    </div>
  );
}

export default AuthPage;
