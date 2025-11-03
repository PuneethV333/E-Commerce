import React, { useContext, useState, useEffect } from "react";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import { toast } from "react-toastify";
import axios from "axios";
import Rating from "../Components/Rating";
import { AuthContext } from "../Context/AuthProvider";
import { useParams } from "react-router-dom";
import { Auth } from "../config/firebase";
import Swal from "sweetalert2";

const BookNow = () => {
  const { products } = useContext(AuthContext);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState("");
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (products && id) {
      const prod = products.find((item) => item._id.toString() === id);
      setData(prod);
    }
  }, [products, id]);

  const strLocation = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const address = res.data.address;
      const city = address.city || address.town || address.village || "";
      const state = address.state || "";
      const country = address.country || "";
      return { city, state, country };
    } catch (err) {
      toast.error("Error fetching location");
      return null;
    }
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = await strLocation(latitude, longitude);
        if (loc) {
          setLocation(`${loc.city}, ${loc.state}, ${loc.country}`);
        } else {
          setLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
        }
        setLoadingLoc(false);
      },
      () => {
        toast.error("Please allow location access.");
        setLoadingLoc(false);
      }
    );
  };

const handleForm = async (e) => {
  e.preventDefault();

  if (!data?._id) {
    toast.error("Product not loaded yet.");
    return;
  }

  const currentUser = Auth.currentUser;
  if (!currentUser) {
    toast.error("Please login first.");
    return;
  }

  await currentUser.reload();
  if (!currentUser.emailVerified) {
    toast.error("⚠️ Please verify your email before booking.");
    return;
  }

  if (!number || !location) {
    toast.error("Enter your contact number and location");
    return;
  }

  setBookingLoading(true);

  try {
    


    const token = await currentUser.getIdToken(true);

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/book/${data._id}`,
      {
        loc: location,
        phno: number,
        fullname: currentUser.displayName || "Customer",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const deliveryDate = new Date(res.data.order.expectedDeliveryDate);

    Swal.fire({
      title: "Booking Confirmed!",
      html: `✅ Your product <strong>${data.prodName}</strong> will be delivered on <strong>${deliveryDate.toDateString()}</strong>.<br/><br/>
      ${res.data.smsStatus === "SMS failed to send." ? "⚠️ We couldn't send SMS notification." : "📩 SMS notification sent!"}`,
      icon: "success",
      confirmButtonText: "OK",
    });

    setNumber("");
    setLocation("");
  } catch (err) {
    console.error("Booking error:", err.response || err);
    toast.error(err.response?.data?.message || "Booking failed");
  } finally {
    setBookingLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-stone-100 via-white to-stone-200">
      <NavBar />
      {!data ? (
        <div className="flex-grow flex justify-center items-center text-gray-600 text-lg font-medium">
          Loading product details...
        </div>
      ) : (
        <main className="flex flex-col md:flex-row justify-center items-center gap-10 px-6 md:px-16 py-12">
          <div className="w-full md:w-2/5 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-8 flex flex-col items-center text-gray-800 hover:shadow-2xl transition-all duration-300">
            <img
              src={data?.prodImg}
              alt={data?.prodName || "Product Image"}
              className="w-56 h-56 object-contain mb-6 rounded-xl shadow-md"
            />
            <p className="text-2xl font-bold mb-2 text-gray-800">{data?.prodName}</p>
            <p className="text-lg text-gray-600 mb-3 capitalize">Type: {data?.prodType}</p>
            {data?.rating !== undefined && (
              <Rating rating={data.rating} review={data?.reviews?.length || 0} />
            )}
          </div>

          <div className="w-full md:w-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
              Confirm Your Booking
            </h2>

            <form onSubmit={handleForm} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Your Location</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter or fetch your location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl p-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={loadingLoc}
                    className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200"
                  >
                    {loadingLoc ? "Fetching..." : "Use My Location"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">☎️ Contact Number</label>
                <input
                  type="text"
                  pattern="[6-9]{1}[0-9]{9}"
                  placeholder="Enter your 10-digit number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-green-600 transition-all duration-200 disabled:opacity-60"
                disabled={!number || !location || bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default BookNow;
