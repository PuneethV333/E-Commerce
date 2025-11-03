import React, { useState, useContext } from "react";
import Rating from "./Rating";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { Auth } from "../config/firebase";
import axios from "axios";
import { toast } from "react-toastify";

const CartCard = ({ info }) => {

  const navigate = useNavigate();
  const { setUserData } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(info?.productQuan || 1);
  const [loading, setLoading] = useState(false);

  if (!info) return null;
console.log("Cart Info:", info);
console.log("Product Info:", info.productInfo);


  // ✅ Function to update quantity of the product in the cart
  const updateQuantity = async (newQty) => {
    if (newQty < 1) return; // don't allow 0 or negative quantities

    try {
      setLoading(true);
      const user = Auth.currentUser;
      if (!user) {
        toast.error("Please login first!");
        return;
      }

      const token = await user.getIdToken();

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/update`,
        { productId: info.productInfo._id, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Cart update response:", res.data);
      setUserData(res.data.user || res.data); // ✅ safer update
      setQuantity(newQty);
      toast.success("Quantity updated");
    } catch (err) {
      console.error("Update quantity error:", err);
      toast.error(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to remove a product from the cart
  const removeFromCart = async () => {
    try {
      setLoading(true);
      const user = Auth.currentUser;
      if (!user) {
        toast.error("Please login first!");
        return;
      }

      const token = await user.getIdToken();

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`,
        { productId: info.productInfo._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Cart remove response:", res.data);
      setUserData(res.data.user || res.data); // ✅ ensure correct userData update
      toast.success("Removed from cart");
    } catch (err) {
      console.error("Remove from cart error:", err);
      toast.error(err.response?.data?.message || "Failed to remove from cart");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI
  return (
    <div className="w-64 bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 hover:scale-105 duration-300 border border-gray-200 flex flex-col justify-between">
      <div className="flex justify-center mb-4 relative">
        <img
          src={info.productInfo?.prodImg || "/placeholder.png"}
          alt={info.productInfo?.prodName || "Product"}
          className="w-40 h-40 object-cover rounded-2xl shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-110"
        />
      </div>

      <div className="text-center flex-1">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate">
          {info.productInfo?.prodName || "Unknown Product"}
        </h2>
        <p className="text-gray-500 text-sm mb-1 line-clamp-2">
          {info.productInfo?.prodDescription || "No description available."}
        </p>
        <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
          {info.productInfo?.prodType || "General"}
        </p>

        <div className="flex justify-center mb-3">
          <Rating
            rating={info.productInfo?.rating || 0}
            review={info.productInfo?.reviews?.length || 0}
          />
        </div>

        {info.productInfo?.cost && (
          <p className="text-red-500 text-lg font-semibold mb-3">
            ₹{info.productInfo.cost.toLocaleString()}
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1 || loading}
              className="w-8 h-8 bg-gray-200 rounded-full text-gray-700 font-bold hover:bg-gray-300 transition disabled:opacity-50"
            >
              -
            </button>
            <span className="text-gray-800 font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(quantity + 1)}
              disabled={loading}
              className="w-8 h-8 bg-gray-200 rounded-full text-gray-700 font-bold hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>

          <button
            onClick={removeFromCart}
            disabled={loading}
            className="text-red-500 hover:text-red-700 font-semibold transition"
          >
            <i className="ri-delete-bin-line text-xl"></i>
          </button>
        </div>

        <button
          onClick={() => navigate(`/book/${info.productInfo._id}`)}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-4 py-2 rounded-2xl hover:from-green-600 hover:to-green-700 transition shadow-md hover:shadow-lg"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default CartCard;
