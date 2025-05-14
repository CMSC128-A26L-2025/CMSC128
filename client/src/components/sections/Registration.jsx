import { useState } from "react";
import axios from "axios";
import Navbar_landing from "../header_landing";
import { useNavigate } from 'react-router-dom'

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

    // Add errors state
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
        setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
    };

    // Validate fields and set errors
    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        if (!formData.password) newErrors.password = "Password is required.";
        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        if (!formData.degree.trim()) newErrors.degree = "Degree Program is required.";
        if (!formData.graduation_year.trim()) newErrors.graduation_year = "Year Graduated is required.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // register API call
        try {
            const res = await axios.post("http://localhost:5050/auth/register", {
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
            
            <div className="bg-[url('src/assets/Building.png')] bg-cover bg-center w-full h-full flex flex-col justify-between pb-20">
                <div className="grid grid-cols-1 gap-y-5 pt-16">
                    <h1 className=" !text-7xl font-bold text-white ">ARTEMIS</h1>       
                    <div className="flex justify-center">
                        <div className="bg-white/50 py-8 px-6 rounded-2xl shadow-lg w-96 backdrop-blur-sm">
                            <p className="text-xl text-center text-[#00110C] font-light pb-4">Alumni Registration Form</p>
                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                                {/* Username */}
                                <div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1 "
                                        placeholder="Name"
                                    />
                                    {errors.username && <p className="text-red-700 text-sm">{errors.username}</p>}
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
                                    />
                                    {errors.email && <p className="text-red-700 text-sm">{errors.email}</p>}
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
                                    />
                                    {errors.password && <p className="text-red-700 text-sm">{errors.password}</p>}
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
                                    />
                                    {errors.confirmPassword && <p className="text-red-700 text-sm">{errors.confirmPassword}</p>}
                                </div>

                                {/* Degree */}
                                <div>
                                    <input
                                        type="text"
                                        name="degree"
                                        value={formData.degree}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Degree Program"
                                    />
                                    {errors.degree && <p className="text-red-700 text-sm">{errors.degree}</p>}
                                </div>
                                
                                {/* Graduation Year */}
                                <div>
                                    <input
                                        type="text"
                                        name="graduation_year"
                                        value={formData.graduation_year}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Year Graduated"
                                    />
                                    {errors.graduation_year && <p className="text-red-700 text-sm">{errors.graduation_year}</p>}
                                </div>
                                
                                <div className="w-full bg-[#3E3939] h-0.5"></div>
                                {/* Register Button */}
                                <button
                                    type="submit"
                                    className="font-semibold w-full bg-[#085740] p-2 rounded-md hover:bg-green-600 transition focus:ring-1 focus:ring-green-600 focus:!outline-none"
                                >
                                    Register
                                </button>

                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    className="font-semibold w-full bg-[#9b2c2c] p-2 rounded-md hover:bg-red-600 transition focus:ring-1 focus:ring-red-600 focus:!outline-none"
                                    onClick={() => {
                                        navigate("/");
                                    }}                                  
                                >
                                    Cancel
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
