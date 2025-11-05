import React, { useContext } from "react";
import "remixicon/fonts/remixicon.css";
import CartCard from "../Components/CartCard";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { AuthContext } from "../Context/AuthProvider";
import { Link } from "react-router-dom";

const Cart = () => {
  const { loading, userData } = useContext(AuthContext);
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  const totalPrice = userData?.cartProduct?.reduce(
    (sum, item) => sum + (item.cost || 0),
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBar />

      
      <div className="flex flex-col items-center justify-center py-10 bg-white shadow-md mt-10">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Your Shopping Cart</h1>
        <p className="text-gray-600">
          {userData?.userName ? `Hello, ${userData.userName}!` : "Welcome!"}
        </p>
      </div>

      
      <div className="flex-1 px-4 sm:px-10 py-8">
        {userData?.cartProduct?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 place-items-center">
              {userData.cartProduct.map((item, index) => (
                <CartCard key={index} info={item} />
              ))}
            </div>

            
            <div className="mt-10 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-lg">
              <p className="text-lg font-semibold text-gray-700">
                Total: <span className="text-red-500">₹{totalPrice?.toLocaleString()}</span>
              </p>
              <Link
                to="/checkout"
                className="mt-4 sm:mt-0 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition font-semibold"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-600">
            <i className="ri-shopping-cart-line text-6xl mb-4"></i>
            <p className="text-lg mb-2">Your cart is empty</p>
            <Link
              to="/home"
              className="mt-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition font-semibold"
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

export default Cart;
