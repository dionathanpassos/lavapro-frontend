import { Navigate, Outlet, useLocation } from "react-router";
import { isTokenValid } from "./auth";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function PrivateRoute() {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(isTokenValid());

  useEffect(() => {
    const valid = isTokenValid();

    setAuthenticated(valid);
    if(!valid) {
        toast.error("Sessão expirada, efetue login novamente.", {
        id: "session-expired-toast",
      });
        localStorage.removeItem("token");
    }
    
  }, [location.pathname]);

  if (!authenticated) {
    return <Navigate to="/auth/login" replace />;
  }



  return <Outlet />;
}
