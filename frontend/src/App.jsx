// ./App.jsx
import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "./Components/Loader";
import RouteTransitionOverlay from "./Components/RouteTransitionOverlay";

import Login from "./Page/Login";
import Signup from "./Page/Sigup";
import EmailVerifiedPage from "./Page/EmailVerifiedPage";
import Home from "./Page/Home";
import Product from "./Page/Product";
import BookNow from "./Page/BookNow";
import AllOptions from "./Page/AllOptions";
import Cart from "./Page/Cart";
import KnowUs from "./Page/KnowUs";
import Orders from "./Page/Orders";
import Delivered from "./Page/Delivered";

import RestrictedRoutes from "./restrictedRoutes/RestrictedRoutes";
import SmoothScroll from "./Page/SmoothScroll";
import { AuthContext } from "./Context/AuthProvider";
import Admin from "./Page/Admin";
import AddProduct from "./Components/AddProduct";
import AddAdmin from "./Components/AddAdmin";


const App = () => {
  const { loading } = useContext(AuthContext);

  setTimeout(() => {}, 3000);

  if (loading) {
    document.body.classList.add("loading");
    return <Loader />;
  } else {
    document.body.classList.remove("loading");
  }

  return (
    <>
      <SmoothScroll>
        <RouteTransitionOverlay />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<EmailVerifiedPage />} />

          <Route element={<RestrictedRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/home/:id" element={<Product />} />
            <Route path="/book/:id" element={<BookNow />} />
            <Route path="/alloptions" element={<AllOptions />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/know-us" element={<KnowUs />} />
            <Route path="/order" element={<Orders />} />
            <Route path="/delivered" element={<Delivered />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/add-prod" element={<AddProduct />} />
            <Route path="/add-admin" element={<AddAdmin />} />
          </Route>
        </Routes>
      </SmoothScroll>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
