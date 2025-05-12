import { useState, useEffect } from "react";
import Navbar_landing from "../header_landing";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../../AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Logging in with:", formData);
        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                alert("Login Successful. Redirecting to home page...");

                console.log("User type: ", result.user.user_type);
                if (result.user.user_type === "Admin") {
                    navigate(`/admin_main`);
                } else {
                    navigate(`/home`);
                }
            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Login failed. Please try again.");
        }
    };



    return (
        <>
            <div className="w-screen">
                <Navbar_landing />
            </div>
    
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
    
                    <div className="lg:col-span-2 w-full flex justify-center lg:justify-end px-15 lg:px-4 pt-12 md:pt-12 lg:pr-15 lg:pt-12">
                        <div className="bg-white/60 p-6 sm:p-8 rounded-3xl shadow-lg w-full max-w-md backdrop-blur-sm flex justify-center">
                            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border-3 border-[#3E3939] rounded-md outline-none focus:ring-1"
                                    placeholder="Email"
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 border-3 border-[#3E3939] rounded-md outline-none focus:ring-1"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-[#891839] text-white font-bold p-2 rounded-md hover:bg-red-700 transition focus:!outline-none"
                                >
                                    Login
                                </button>
    
                                <hr className="border-t border-[#085740]" />
    
                                <button
                                    type="button"
                                    className="w-full bg-[#085740] font-bold text-white p-2 rounded-md hover:bg-green-700 transition focus:!outline-none"
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
    );
};

export default Login;