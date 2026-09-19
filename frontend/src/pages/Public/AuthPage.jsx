import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import AuthCard from "../../components/ui/AuthCard";
import { toast } from "sonner";

function AuthPage({ mode = "auth" }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialFlipped =
    mode === "auth" ? location.state?.isFlipped || false : mode === "signup";

  // Remount the card whenever the target side changes (e.g. navigating to
  // /auth with a different location.state) so the flip starts from the right face.
  const cardKey = `${location.pathname}-${
    mode === "auth" ? location.state?.isFlipped : mode
  }`;

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      toast.success("Email verified. Please log in.");
    } else if (verified === "false") {
      toast.error("Verification link invalid or expired.");
    }
  }, [searchParams]);

  return (
    <div>
      <AuthCard key={cardKey} initialFlipped={initialFlipped} />
    </div>
  );
}

export default AuthPage;