import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { signUpViaEmail, viaGoogle, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { email, password, displayName } = formData;

    if (!email || !password || !displayName) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await signUpViaEmail(email, password, displayName);
      toast.success("🎉 Signup successful!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Signup failed");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      await viaGoogle();
      toast.success("🎉 Signed up with Google!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign up with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-200 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 transform hover:scale-105 transition-transform duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://res.cloudinary.com/deymewscv/image/upload/v1760354941/BCO.89aab991-d4de-47da-956e-72b68e0475d4_ka1y1l.png"
            alt="Logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-700 mb-6 text-center">
          Create Account
        </h2>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <input
            type="text"
            name="displayName"
            placeholder="Full Name"
            value={formData.displayName}
            onChange={handleChange}
            className="border p-3 rounded-2xl focus:ring-2 focus:ring-red-400 focus:outline-none shadow-sm transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 rounded-2xl focus:ring-2 focus:ring-red-400 focus:outline-none shadow-sm transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-3 rounded-2xl focus:ring-2 focus:ring-red-400 focus:outline-none shadow-sm transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-2xl shadow-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="border-b w-1/4 border-gray-300"></span>
          <span className="mx-2 text-gray-400">OR</span>
          <span className="border-b w-1/4 border-gray-300"></span>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-2xl hover:bg-gray-100 transition duration-300 shadow-sm"
        >
          <img
            src="https://res.cloudinary.com/deymewscv/image/upload/v1760518991/google-logo-png-icon-free-download-SUF63j_l4nq2t.png"
            alt="Google"
            className="w-6 h-6"
          />
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* Redirect to Login */}
        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link to="/" className="text-red-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
