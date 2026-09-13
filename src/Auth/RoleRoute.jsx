import { Navigate } from "react-router-dom";
import { getAuthenticatedUser } from "./auth";

export default function RoleRoute({ allowedRoles, children }) {

    const user = getAuthenticatedUser();
   

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return children;
}