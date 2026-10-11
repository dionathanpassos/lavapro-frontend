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

export function isTokenValid() {
    const token = getToken();

    if(!token) {
        return false;
    }

    try {
        const decoded = jwtDecode(token);

        if(!decoded.exp) {
            return false;
        }

        return decoded.exp * 1000 > Date.now(); 
        
    } catch {
        return false;
        
    }
}