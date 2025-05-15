import { useState } from "react";
import axios from "axios";

import Navbar_landing from "../header_landing";
import { useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5050";

const Registration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        degree: "",
        graduation_year: ""
    });

    const handleChange = (e) => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // register API call
        try {
            const res = await axios.post(`${apiUrl}/auth/register`, {
                user_id: "TEST01",
                name: formData.username,
                email: formData.email,
                password: formData.password,
                degree: formData.degree,
                graduation_year: formData.graduation_year,
                user_type: 'Alumni'
            });

            console.log("Form submitted:", formData);
            alert("Registration Successful. Redirecting to home page...");
            navigate(-1)
        } catch (err) {
            console.error("Registration error: ", err);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <>
            <div className="w-screen">
                <Navbar_landing></Navbar_landing>
            </div> 
            
            <div className="bg-[url('src/assets/Building.png')] bg-cover bg-center w-full h-full flex flex-col justify-between pb-20 pt-10">
                <div className="grid grid-cols-1 gap-y-5 pt-16">
                    <h1 className=" !text-7xl font-bold text-white ">ARTEMIS</h1>       
                    <div className="flex justify-center">
                        <div className="bg-white/50 py-8 px-6 rounded-2xl shadow-lg w-96 backdrop-blur-sm">
                            <p className="text-xl text-center text-[#00110C] font-light pb-4">Alumni Registration Form</p>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Username */}
                                <div className="">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1 "
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                            
                                {/* Email */}
                                <div>
                                    <input 
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Email"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Password"
                                        required
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        name="degree"
                                        value={formData.degree}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Degree Program"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="graduation_year"
                                        value={formData.graduation_year}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Year Graduated"
                                        required
                                    />
                                </div>
                                <div className="w-full bg-[#3E3939] h-0.5"></div>
                                {/* Register Button */}
                                <button
                                    type="register"
                                    className="font-semibold w-full bg-[#085740] p-2 rounded-md hover:bg-green-600 transition focus:ring-1 focus:ring-green-600 focus:!outline-none cursor-pointer"
                                    
                                >
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                    </div>
            </div>
            
            
        </>
        
    )

};
export default Registration;