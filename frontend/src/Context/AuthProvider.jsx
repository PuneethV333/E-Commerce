import React, { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Auth, googleAuth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  reload,
  sendEmailVerification,
} from "firebase/auth";

export const AuthContext = createContext();

export const getFriendlyError = (err) => {
  if (!err) return "Something went wrong";
  if (err.code) {
    const firebaseErrors = {
      "auth/user-not-found": "No account found with this email",
      "auth/wrong-password": "Incorrect password",
      "auth/invalid-email": "Invalid email address",
      "auth/email-already-in-use": "Email already in use",
      "auth/weak-password": "Password should be at least 6 characters",
      "auth/popup-closed-by-user": "Popup closed before completing sign-in",
      "auth/cancelled-popup-request": "Popup cancelled, try again",
      "auth/too-many-requests": "Too many attempts, try again later",
      "auth/invalid-continue-uri": "Invalid verification URL configured",
    };
    return firebaseErrors[err.code] || "Something went wrong, please try again";
  } else if (err.response) {
    return (
      err.response.data?.message ||
      err.response.data?.error ||
      "Server error, please try again"
    );
  } else {
    return err.message || "Something went wrong";
  }
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [allUser, setAllUsers] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user,setUser] = useState(null);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/allUsers`);
      setAllUsers(res.data);
    } catch {
      setAllUsers(null);
    }
  };

  const fetchUserData = async (firebaseUser) => {
    if (!firebaseUser) {
      setUserData(null);
      return null;
    }
    try {
      const token = await firebaseUser.getIdToken(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
      return res.data;
    } catch {
      setUserData(null);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);
      if (firebaseUser) {
        await reload(firebaseUser);
        await fetchUserData(firebaseUser);
        setIsLoggedIn(true);
        await fetchAllUsers();
      } else {
        setUserData(null);
        setIsLoggedIn(false);
        setAllUsers(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/prod`);
        setProducts(res.data || []);
      } catch {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const signUpViaEmail = async (email, password, fullname) => {
    try {
      const userCred = await createUserWithEmailAndPassword(Auth, email, password);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/signup`, {
        email,
        firebaseUid: userCred.user.uid,
        displayName: fullname,
      });
      await sendEmailVerification(userCred.user);
      toast.success("🎉 Registered! Verify your email.");
      await fetchUserData(userCred.user);
      setIsLoggedIn(true);
    } catch (err) {
      toast.error(getFriendlyError(err));
      throw err;
    }
  };

  const signInViaEmail = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(Auth, email, password);
      await reload(userCred.user);
      await fetchUserData(userCred.user);
      setIsLoggedIn(true);
      toast.success("✅ Logged in successfully!");
    } catch (err) {
      toast.error(getFriendlyError(err));
      throw err;
    }
  };

  const viaGoogle = async () => {
    try {
      const res = await signInWithPopup(Auth, googleAuth);
      const token = await res.user.getIdToken(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/google`,
        {
          email: res.user.email,
          displayName: res.user.displayName,
          firebaseUid: res.user.uid,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchUserData(res.user);
      setIsLoggedIn(true);
      toast.success("🎉 Logged in with Google!");
    } catch (err) {
      toast.error(getFriendlyError(err));
      throw err;
    }
  };

  const signout = async () => {
    try {
      await firebaseSignOut(Auth);
      setUserData(null);
      setIsLoggedIn(false);
      setAllUsers(null);
      navigate("/");
      toast.info("👋 Signed out successfully!");
    } catch {
      toast.error("Error logging out!");
    }
  };



  return <AuthContext.Provider value={{
      allUser,
      userData,
      products,
      isLoggedIn,
      user,
      loading,
      setUserData,
      setProducts,
      signUpViaEmail,
      signInViaEmail,
      viaGoogle,
      signout,
      fetchUserData,
  }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
