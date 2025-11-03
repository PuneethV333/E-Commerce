import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Auth } from "../config/firebase";
import { AuthContext } from "../Context/AuthProvider";

const NavBar = ({ isAdmin = false }) => {
  const { signout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Track current Firebase user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Use context signout (not direct Firebase signOut)
  const handleLogout = async () => {
    try {
      await signout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg rounded-2xl p-5 text-center">
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 relative z-50">
      {/* Left: Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start w-full sm:w-auto gap-3 sm:gap-6">
        <h2 className="font-bold text-gray-700 text-base sm:text-lg text-center sm:text-left">
          Hello,{" "}
          <span className="text-red-500 font-semibold">
            {user?.displayName || user?.email || "Guest"}
          </span>
        </h2>
      </div>

      {/* Center: Logo */}
      <div className="flex justify-center sm:flex-1 sm:justify-center order-first sm:order-none">
        <Link
          to={user ? "/home" : "/"}
          className="relative group flex items-center justify-center"
        >
          <img
            src="https://res.cloudinary.com/deymewscv/image/upload/v1760354941/BCO.89aab991-d4de-47da-956e-72b68e0475d4_ka1y1l.png"
            alt="Spark"
            className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-110 drop-shadow-lg"
          />
        </Link>
      </div>

      {/* Right: Menu + Logout */}
      <div className="flex justify-center sm:justify-end items-center gap-3 sm:gap-5">
        {user ? (
          <>
            {/* Menu Icon */}
            <Link
              to="/alloptions"
              className="text-gray-800 text-2xl sm:text-3xl hover:text-red-500 transition transform hover:scale-110"
            >
              <i className="ri-menu-line"></i>
            </Link>

            {/* Admin Icon (only visible if isAdmin=true) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-800 text-2xl sm:text-3xl hover:text-red-500 transition transform hover:scale-110"
              >
                <i className="ri-shield-user-line"></i>
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition shadow-md hover:shadow-lg"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition shadow-md hover:shadow-lg"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
