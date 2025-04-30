import { useState } from "react";
import Navbar from "../header";
import Footer from "../footer";

export default function TransactionPage() {
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    amount: "",
    expiry: "",
    cvc: ""
  });

  const [errors, setErrors] = useState({});

  const eventDetails = {
    title: "ICS AWARDS 2024",
    date: "January 1, 2025",
    category: "Charity",
    description: "Join us for a cause. Help support this year’s ICS Awards Charity Fund!",
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1050&q=80"
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(form.cardNumber)) newErrors.cardNumber = "Invalid card number format.";
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = "Amount must be greater than 0.";
    if (!form.expiry) newErrors.expiry = "Expiry date is required.";
    if (!/^\d{3,4}$/.test(form.cvc)) newErrors.cvc = "CVC must be 3 or 4 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Transaction submitted!");
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col overflow-x-hidden bg-white">
      {/* Navbar */}
      <div className="z-50">
        <Navbar />
      </div>

      {/* Maroon separator */}
      <div className="w-full h-[4px] bg-[#891839]"></div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-grow w-full">
        {/* Left: Event Details */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center text-white"
          style={{
            backgroundImage: `linear-gradient(rgba(14, 66, 33, 0.85), rgba(14, 66, 33, 0.85)), url('/assets/${eventDetails.imageUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            minHeight: "calc(100vh - 88px)"
          }}
        >
          <div className="p-8 max-w-md text-center">
            <h1 className="text-4xl font-bold mb-4">{eventDetails.title}</h1>
            <p className="text-xl mb-2">{eventDetails.date}</p>
            <p className="font-semibold mb-4">{eventDetails.category}</p>
            <p className="text-justify">{eventDetails.description}</p>
          </div>
        </div>

        {/* Right: Transaction Form */}
        <div
          className="w-full md:w-1/2 flex justify-center items-center bg-[#891839] py-10"
          style={{ minHeight: "calc(100vh - 88px)" }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4"
          >
            <h2 className="text-2xl font-bold text-center text-[#891839] mb-6">
              Transaction Details
            </h2>

            {["name", "cardNumber", "amount", "expiry", "cvc"].map((field, i) => (
              <div key={i} className="mb-4">
                <label className="block text-gray-700 capitalize mb-1">
                  {field
                    .replace("cardNumber", "Credit Card Number")
                    .replace("cvc", "CVC / CVV")
                    .replace("expiry", "Expiry Date")}
                </label>
                <input
                  name={field}
                  type={
                    field === "amount"
                      ? "number"
                      : field === "expiry"
                      ? "date"
                      : "text"
                  }
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === "cardNumber" ? "XXXX-XXXX-XXXX-XXXX" : ""}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#891839] ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="bg-[#891839] hover:bg-[#a43249] transition-colors text-white w-full py-2 rounded-lg font-bold"
            >
              Submit
            </button>

            <div className="text-center mt-4 text-gray-600">or pay with</div>
            <div className="flex justify-center space-x-4 mt-4">
              <button type="button" className="hover:scale-105 transition-transform">
                <img src="public/assets/gcash.png" alt="GCash" className="h-10" />
              </button>
              <button type="button" className="hover:scale-105 transition-transform">
                <img src="public/assets/paymaya.png" alt="PayMaya" className="h-10" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
