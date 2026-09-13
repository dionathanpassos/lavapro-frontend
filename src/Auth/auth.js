import { jwtDecode } from "jwt-decode";

export function getToken() {
    return localStorage.getItem("token");
}

export function getAuthenticatedUser() {
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return !!getToken();
}