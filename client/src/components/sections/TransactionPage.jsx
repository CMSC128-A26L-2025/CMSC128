import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../header";
import Footer from "../footer";
import gcash_icon from "../../assets/GCash-Logo.png"
import paymaya_icon from "../../assets/1200px-PayMaya_Logo.png"
import Sidebar from "../Sidebar";
import { useAuth } from "../../auth/AuthContext";
import { ScrollToTop } from "../../utils/helper";

export default function TransactionPage() {
  const { id } = useParams();
  const { authAxios, user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    amount: "",
    expiry: "",
    cvc: ""
  });

  const [errors, setErrors] = useState({});


  useEffect(() => {

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await authAxios.get(`/events/find-event/${id}`);

        setEvent(response.data);
        console.log("Fetched Event:", response.data);
        setIsLoading(false);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Token invalid/expired. Attempting refresh...");

          try {
            const refreshResponse = await axios.get("/auth/refresh", { withCredentials: true });

            if (refreshResponse.data.accessToken) {
              const newToken = refreshResponse.data.accessToken;
              localStorage.setItem("accessToken", newToken);

              console.log("Retrying event fetch with new token...");
              const retryResponse = await axios.get(`/events/find-event/${id}`, {
                headers: { Authorization: `Bearer ${newToken}` },
                withCredentials: true
              });

              setEvent(retryResponse.data);

            } else {
              navigate("/login");
            }
            setIsLoading(false);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            navigate("/login");
            setIsLoading(false);
          }
        } else {
          console.error("Error fetching event:", error);
          setIsLoading(false);
        }
      }
    }

    fetchEvent(); // <-- Correct way to fetch event data
    ScrollToTop();
  }, [id]);

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

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert("User not found or not logged in.");
      return;
    }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      const payload = {
        event: id,
        donor: user._id,
        amount: Number(form.amount)
      };


      const response = await authAxios.post(
        `/events/donate/${id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Transaction response:", response.data);
      alert("Transaction successful!");
      navigate(`/event-details/${id}`);
      navigate
    } catch (e) {
      console.error("Transaction error:", e?.response?.data || e);
      alert("Transaction failed. Please check your input and try again.");
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col overflow-x-hidden bg-white">
      {/* Navbar */}
      <div className="z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar />
      </div>
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="w-full h-[4px] bg-[#891839]"></div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center min-h-[calc(100vh-88px)]">
            <span className="text-[#891839] text-xl font-bold">Loading event...</span>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-grow w-full">
            {/* Left: Event Details */}
            <div
              className="w-full md:w-1/2 flex items-center justify-center text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(14, 66, 33, 0.85), rgba(14, 66, 33, 0.85)), url(${event && event.files && event.files[0] && event.files[0].serverFilename
                  ? `http://localhost:5050/uploads/${event.files[0].serverFilename}`
                  : "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1050&q=80"
                  })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                minHeight: "calc(100vh - 88px)"
              }}
            >
              <div className="p-8 max-w-md text-center">
                <h1 className="text-4xl font-bold mb-4">{event.event_name}</h1>
                <p className="text-xl mb-2">{new Date(event.event_date).toLocaleDateString('en-US', {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
                <p className="font-semibold mb-4">Charity</p>
                <p className="text-justify">{event.event_description}</p>
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
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#891839] ${errors[field] ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors[field] && (
                      <p className="text-red-500 text-sm">{errors[field]}</p>
                    )}
                  </div>
                ))}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-[#145C44] transition-colors text-white flex-1 py-2 rounded-lg font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#891839] transition-colors text-white flex-1 py-2 rounded-lg font-bold cursor-pointer"
                  >
                    Submit
                  </button>
                </div>

                <div className="text-center mt-4 text-gray-600">or pay with</div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button type="button" className="hover:scale-105 transition-transform">
                    <img src={gcash_icon} alt="GCash" className="h-10" />
                  </button>
                  <button type="button" className="hover:scale-105 transition-transform">
                    <img src={paymaya_icon} alt="PayMaya" className="h-10" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}