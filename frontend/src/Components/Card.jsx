import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "remixicon/fonts/remixicon.css";
import Rating from "./Rating";
import { AuthContext } from "../Context/AuthProvider";
import { Auth } from "../config/firebase";
import axios from "axios";

const Card = ({ value }) => {
  const { setUserData } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!value) return null;

  const addToCart = async () => {
    try {
      const user = Auth.currentUser;
      if (!user) {
        toast.warn("⚠️ Please login to add items to your cart");
        navigate("/");
        return;
      }

      setLoading(true);
      const token = await user.getIdToken();

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: value._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(res.data);
      toast.success("🛒 Added to cart successfully!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err.response?.data?.message || "❌ Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 bg-white border border-gray-100 rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 hover:scale-105">
      
      
      <div className="flex justify-center mb-3">
        <Link to={`/home/${value._id}`}>
          <img
            src={value.prodImg || "/placeholder.png"}
            alt={value.prodName}
            className="w-40 h-40 object-cover rounded-2xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
          />
        </Link>
      </div>

      
      <h2 className="text-lg sm:text-xl font-bold text-center mb-1 text-gray-800 truncate">
        {value.prodName}
      </h2>

      <p className="text-gray-500 text-center text-sm mb-3 line-clamp-2">
        {value.prodDescription || "No description available."}
      </p>

      
      <div className="flex justify-center mb-3">
        <Rating rating={value.rating || 0} review={value.reviews?.length || 0} />
      </div>

      
      {value.cost && (
        <p className="text-center text-lg font-semibold text-red-500 mb-3">
          ₹{value.cost.toLocaleString()}
        </p>
      )}

      <div className="border-t border-gray-200 my-3"></div>

      
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2">
        <button
          onClick={addToCart}
          disabled={loading}
          className={`flex-1 font-semibold px-4 py-2 rounded-2xl text-white transition-all shadow-md hover:shadow-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={() => navigate(`/book/${value._id}`)}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-4 py-2 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Card;
