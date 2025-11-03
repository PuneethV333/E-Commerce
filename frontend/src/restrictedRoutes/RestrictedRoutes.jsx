import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider.jsx";

const RestrictedRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  
  return <Outlet />;
};

export default RestrictedRoutes;
