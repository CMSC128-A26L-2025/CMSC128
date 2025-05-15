import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5050";

export const AuthProvider = ({ children }) => {
    // initialize state from localStorage or null if not found
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem(ACCESS_TOKEN_KEY));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem(USER_KEY);
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem(USER_KEY); // clear invalid stored user data
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(true);

    // initial auth check
    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);

            if (storedToken) {
                try {
                    setAccessToken(storedToken);
                } catch (e) {
                    console.log("Error in auth: ", e);
                    await logout(); // clear invalid session
                }
            }
            else {
                try {
                    const refreshed = await refreshToken();
                    console.log(refreshed);
                    if (!refreshed) {
                        await logout();
                    }
                } catch (e) {
                    console.log("Error in auth: ", e);
                    await logout();
                }
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, []);

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


    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${apiUrl}/auth/login`, {
                email,
                password
            }, {
                withCredentials: true
            });

            if (res.data.accessToken && res.data.user) {
                setAccessToken(res.data.accessToken);
                setUser(res.data.user);

                return { success: true, user: res.data.user };
            } else {
                logout();
                return { success: false };
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            logout();
            return { success: false, error };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${apiUrl}/auth/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Logout API call error:", error);
        } finally {
             // clear state and localStorage
            setAccessToken(null);
            setUser(null);
        }
        return true;
    };

    const refreshToken = async () => {
        try {
            const res = await axios.get(`${apiUrl}/auth/refresh`, {
                withCredentials: true
            });

            if (res.data.accessToken) {
                 // update state
                setAccessToken(res.data.accessToken);
                return true;
            }
            await logout();
            return false;
        } catch (error) {
            console.error("Refresh token error:", error);
            await logout();
            return false;
        }
    };

    // create axios instance with authorization header
    const authAxios = axios.create({baseURL: '${apiUrl}'} );

    // add token to all requests
    authAxios.interceptors.request.use(
        config => {
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    // handle token expiration
    authAxios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            // check if the error is due to expired token
            if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshed = await refreshToken(); // attempt to refresh
                    if (refreshed) {
                        console.log("Token refreshed successfully. Retrying original request.");
                        return authAxios(originalRequest);
                    } else {
                         // if refresh failed, logout the user
                        console.log("Token refresh failed. Logging out.");
                        // redirect to login page
                        return Promise.reject(error);
                    }
                } catch (refreshError) {
                     console.error("Error during refresh token process:", refreshError);
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
            isLoading,
            login,
            logout,
            authAxios
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