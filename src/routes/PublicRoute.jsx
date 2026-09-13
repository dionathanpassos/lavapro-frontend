import { Navigate, Outlet } from "react-router";

export default function PublicRoute() {
    const isAuthenticated = !!localStorage.getItem("token");
    return isAuthenticated ? <Navigate to={"/dashboard"}/> : <Outlet/>
}