import { createContext, useState, useContext, useEffect } from 'react'; // Import useEffect
import axios from 'axios';

const AuthContext = createContext(null);

// Keys for localStorage
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage or null if not found
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem(ACCESS_TOKEN_KEY));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem(USER_KEY);
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem(USER_KEY); // Clear invalid stored user data
            return null;
        }
    });

    // update localStorage when state changes
    useEffect(() => {
        if (accessToken) {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        } else {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
    }, [accessToken]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_KEY);
        }
    }, [user]);


    const API_URL = import.meta.env.VITE_API_URL || "https://gab-artemis.onrender.com";

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });

            if (res.data.accessToken && res.data.user) {
                setAccessToken(res.data.accessToken);
                setUser(res.data.user);
                return { success: true, user: res.data.user };
            } else {
                logout();
                return { success: false };
            }
        } catch (error) {
            logout();
            return { success: false, error };
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
        } catch (error) {
            console.error("Logout API call error:", error);
        } finally {
            setAccessToken(null);
            setUser(null);
        }
        return true;
    };

    const refreshToken = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true });

            if (res.data.accessToken) {
                setAccessToken(res.data.accessToken);
                return true;
            }
            logout();
            return false;
        } catch (error) {
            logout();
            return false;
        }
    };

    // Create axios instance with authorization header
    const authAxios = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true, // Include cookies in requests
    });

    // Add token to all requests
    authAxios.interceptors.request.use(
        config => {
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    // Handle token expiration
    authAxios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            // Check if the error is due to expired token
            if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshed = await refreshToken(); // Attempt to refresh
                    if (refreshed) {
                        console.log("Token refreshed successfully. Retrying original request.");
                        return authAxios(originalRequest);
                    } else {
                         // If refresh failed, logout the user
                        console.log("Token refresh failed. Logging out.");
                        await logout();
                        // redirect to login page
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }
                } catch (refreshError) {
                     console.error("Error during refresh token process:", refreshError);
                     await logout();
                     window.location.href = '/login';
                     return Promise.reject(error);
                }

            }

            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            login,
            logout,
            authAxios // Provide the configured axios instance
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};