import { useState, useEffect } from "react";
import Navbar_landing from "../header_landing";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../../AuthContext";
import Building from "/assets/Building.png";

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
                    navigate(`/admin_main/${result.user._id}`);
                } else {
                    navigate(`/home/${result.user._id}`);
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
                <Navbar_landing></Navbar_landing>
            </div>
            <div
                className="bg-cover bg-center w-full h-screen flex flex-col justify-center"
                style={{ backgroundImage: `url(${Building})` }}
            >
                <div className="flex">
                    <div className="grid grid-cols-5 gap-x-5 px-5">
                        <div className="flex flex-col justify-center col-span-3 pl-20">
                            <div className="text-8xl text-left text-white font-extrabold">
                                ARTEMIS
                            </div>
                            <div className="py-2 font-bold flex text-left text-3xl">
                                Alumni Relations, Tracking,
                                <br></br>and Engagement <br></br>
                                Management Integrated System
                            </div>
                            <div className="font-extralight flex text-left text-xl">
                                "Guiding Alumni Connections, Every Step of the Way."
                            </div>
                        </div>
                        <div className="flex flex-col justify-start col-span-2 pr-20">
                            <div className="bg-white/60 p-8 rounded-3xl shadow-lg w-110 backdrop-blur-sm flex justify-center">
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] rounded-md outline-none focus:ring-1 "
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
                                        className="w-full bg-[#891839] text-white font-bold p-2 rounded-md hover:bg-red-700 transition"
                                    >
                                        Login
                                    </button>

                                    <hr className="border-t border-[#085740]" />

                                    <button
                                        type="button"
                                        className="w-full bg-[#085740] font-bold text-white p-2 rounded-md hover:bg-green-700 transition"
                                        onClick={() =>
                                            navigate('/reg')}
                                    >
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>


                </div>


            </div>

        </>
    );
};

export default Login;