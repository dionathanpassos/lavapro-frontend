import { Navigate } from "react-router-dom";
import { getAuthenticatedUser } from "../Auth/auth";
import { ROLES } from "../Auth/roles";

export default function HomeRedirect() {
    const user = getAuthenticatedUser();
    console.log("USER:", user);
    console.log("ROLE:", user?.role);

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    switch (user.role) {
        case ROLES.OWNER:
        case ROLES.MANAGER:
        case ROLES.ADMIN:
            return <Navigate to="/dashboard" replace />;

        case ROLES.EMPLOYEE:
            return <Navigate to="/start" replace />;

        default:
            return <Navigate to="/403" replace />;
    }
}