import { Navigate, Outlet } from "react-router";

export default function PrivateRoute() {
    const token = localStorage.getItem("token");

    if(!token) {
        return <Navigate to={"/auth/login"} replace/>
    }

    return <Outlet/>
}