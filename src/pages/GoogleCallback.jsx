import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    const user = JSON.parse(decodeURIComponent(params.get("user")));

    if (token && user) {
      login(user, token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/signin");
    }
  }, []);

  return <p>Signing you in…</p>;
}