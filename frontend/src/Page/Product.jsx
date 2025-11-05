import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import Footer from "../Components/Footer";
import Rating from "../Components/Rating";
import Review from "../Components/Review";
import AddReview from "../Components/AddReview";
import axios from "axios";
import { Auth } from "../config/firebase";
import { toast } from "react-toastify";
import Navbar from "../Components/NavBar";

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, setProducts } = useContext(AuthContext);
  const [data, setData] = useState(null);

  
 useEffect(() => {
  if (Array.isArray(products) && products.length > 0) {
    const found = products.find((p) => p._id === id);
    setData(found || null);
  } else {
    setData(null); 
  }
}, [id, products]);


  const AddToCart = async () => {
    try {
      const user = Auth.currentUser;
      if (!user) {
        toast.error("Please login first!");
        return;
      }

      const token = await user.getIdToken();
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId: data._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts(res.data.products || products);
      toast.success("✅ Added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error(err.response?.data?.message || "❌ Failed to add to cart");
    }
  };

  
  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700">
        <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
        <Link to="/home" className="text-blue-600 hover:underline font-medium">
          Go back to Home
        </Link>
      </div>
    );

  const formattedDate = data.expectedDeliveryDate
    ? new Date(data.expectedDeliveryDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <Navbar />

      <div className="flex flex-col md:flex-row items-start justify-center min-h-[80vh] p-6 gap-10">
        
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative group">
            <img
              src={data.prodImg}
              alt={data.prodName}
              className="w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] object-cover rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
            />
            {!data.isInStock && (
              <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full shadow-md text-sm font-semibold">
                Out of Stock
              </span>
            )}
            {data.isInStock && formattedDate && (
              <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full shadow-md text-sm font-semibold">
                Delivery by {formattedDate}
              </span>
            )}
          </div>
        </div>

        
        <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left flex flex-col justify-between mt-20">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {data.prodName}
            </h1>
            <p className="text-gray-600 mb-4">
              {data.prodDescription || "No description available."}
            </p>
            <p className="text-3xl font-bold text-green-600 mb-3">
              ₹{data.cost?.toLocaleString()}
            </p>

            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <Rating rating={data.rating || 0} review={data.reviews?.length || 0} />
            </div>

            <p
              className={`text-sm font-medium mb-4 ${
                data.isInStock ? "text-green-600" : "text-red-600"
              }`}
            >
              {data.isInStock ? "In Stock" : "Currently unavailable"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={AddToCart}
                disabled={!data.isInStock}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:scale-105"
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate(`/book/${data._id}`)}
                disabled={!data.isInStock}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:scale-105"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div className="p-5 bg-white shadow-lg rounded-2xl mx-4 md:mx-10 mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Reviews ({data.reviews?.length || 0})
        </h2>

        {!data.reviews || data.reviews.length === 0 ? (
          <p className="text-gray-500 mb-6">No reviews yet for this product.</p>
        ) : (
          <div className="flex flex-col gap-4 max-h-[35vh] overflow-y-auto pr-2 mb-6">
            {data.reviews.map((review, i) => (
              <Review key={i} data={review} />
            ))}
          </div>
        )}

        <AddReview info={data} />
      </div>

      <Footer />
    </div>
  );
};

export default Product;
