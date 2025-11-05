import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import NavBar from "../Components/NavBar";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import DeliveryCard from "../Components/DeliveryCard";

const Delivered = () => {
  const { loading, userData } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500 text-lg animate-pulse">Loading your deliveries...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBar />

      
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">Your Delivered Products</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {userData?.userName ? `Hello, ${userData.userName}!` : "Welcome!"}
        </p>
      </div>

      
      <div className="flex-1 px-4 sm:px-10 py-10">
        {userData?.deliveredProd?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 place-items-center">
            {userData.deliveredProd.map((item, index) => (
              <DeliveryCard key={index} info={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
            <i className="ri-truck-line text-6xl mb-4"></i>
            <p className="text-lg sm:text-xl mb-2">No deliveries yet</p>
            <p className="text-gray-400 mb-4 text-center">
              Once your orders are delivered, they will appear here.
            </p>
            <Link
              to="/home"
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Delivered;
