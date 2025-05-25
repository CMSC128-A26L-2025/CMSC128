import { useState, useEffect } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Navbar_landing from "../header_landing";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../auth/AuthContext";
import Loading from "../loading";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    const { login, user, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                if (user.user_type === "Admin") {
                    navigate(`/admin_main`);
                } else {
                    navigate(`/home`);
                }
            }
        }
    }, [user, isLoading, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Logging in with:", formData);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                toast.success("Login Successful. Redirecting to home page...");

                console.log("User type: ", result.user.user_type);
                if (result.user.user_type === "Admin") {
                    navigate(`/admin_main`);
                } else {
                    navigate(`/home`);
                }
            } else {
                toast.error("Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Login failed. Please try again.");
        }
    };

    useEffect(() => {
        const img = new Image();
        img.src = "src/assets/Building.png";
        img.onload = () => setIsLoading(false);
        img.onerror = () => {
            console.error("Background image failed to load.");
            setIsLoading(false);
        };
    }, []);

    return (
        <>
            <div className="w-screen">
                <Navbar_landing />
            </div>
    
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="bg-[url('src/assets/Building.png')] bg-cover bg-center min-h-screen w-full flex items-center justify-center">
                        <div className="w-full min-x-screen px-4 sm:px-6 lg:px-25 py-10 grid grid-cols-1 lg:grid-cols-5 items-center">
                            <div className="lg:col-span-3 text-center lg:text-left px-4 space-y-2 lg:space-y-4 pt-12 md:pt-12 lg:pt-8">
                                <div className="text-7xl md:text-7xl lg:text-8xl font-extrabold text-white">
                                    ARTEMIS
                                </div>
                                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                                    Alumni Relations, Tracking, and <br />
                                    Engagement Management Integrated System
                                </div>
                                <div className="text-md md:text-lg lg:text-xl font-extralight text-white">
                                    "Guiding Alumni Connections, Every Step of the Way."
                                </div>
                            </div>
            
                            <div className="lg:col-span-2 w-full flex justify-center lg:justify-end px-15 lg:px-4 pt-12 md:pt-12 lg:pr-15 lg:pt-15">
                                <div className="bg-white/60 p-6 sm:p-8 rounded-3xl shadow-lg w-full max-w-md backdrop-blur-sm flex justify-center">
                                    <form onSubmit={handleSubmit} className="space-y-6 w-full">
                                        <input
                                            type="text"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-2 border-2 border-[#3E3939] rounded-md outline-none focus:ring-1"
                                            placeholder="Email"
                                            required
                                        />
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full p-2 border-2 border-[#3E3939] rounded-md outline-none focus:ring-1 pr-10"
                                                placeholder="Password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-700 focus:outline-none"
                                            >
                                                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                            </button>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-[#891839] text-white font-bold p-2 rounded-md hover:bg-red-700 transition focus:!outline-none cursor-pointer"
                                        >
                                            Login
                                        </button>
            
                                        <hr className="border-t border-[#085740]" />
            
                                        <button
                                            type="button"
                                            className="w-full bg-[#085740] font-bold text-white p-2 rounded-md hover:bg-green-700 transition focus:!outline-none cursor-pointer"
                                            onClick={() => navigate('/reg')}
                                        >
                                            Register
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Login;