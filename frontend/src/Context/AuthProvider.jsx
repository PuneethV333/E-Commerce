// import React, { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { Auth,googleAuth } from "../config/firebase";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   reload,
//   signOut
// } from "firebase/auth";

// export const AuthContext = createContext();

// export const getFriendlyError = (err) => {
//   if (!err) return "Something went wrong";
//   if (err.code) {
//     const firebaseErrors = {
//       "auth/user-not-found": "No account found with this email",
//       "auth/wrong-password": "Incorrect password",
//       "auth/invalid-email": "Invalid email address",
//       "auth/email-already-in-use": "Email already in use",
//       "auth/weak-password": "Password should be at least 6 characters",
//       "auth/popup-closed-by-user": "Popup closed before completing sign-in",
//       "auth/cancelled-popup-request": "Popup cancelled, try again",
//       "auth/too-many-requests": "Too many attempts, try again later",
//       "auth/invalid-continue-uri": "Invalid verification URL configured",
//     };
//     return firebaseErrors[err.code] || "Something went wrong, please try again";
//   } else if (err.response) {
//     return err.response.data?.message || err.response.data?.error || "Server error, please try again";
//   } else {
//     return err.message || "Something went wrong";
//   }
// };

// // // Save Google user: sends token in Authorization header to backend /api/user/google
// // export const saveGoogleUser = async (user, token) => {
// //   try {
// //     const { email, displayName, uid } = user;
// //     // backend endpoint expects Authorization: Bearer <idToken>
// //     const res = await axios.post(
// //       `${import.meta.env.VITE_BACKEND_URL}/api/user/google`,
// //       {
// //         // we include these if backend wants them as fallback, but token header is primary
// //         email,
// //         displayName,
// //         firebaseUid: uid,
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       }
// //     );
// //     // rewritten backend returns object under res.data.data
// //     return res.data?.data || null;
// //   } catch (err) {
// //     console.error("❌ Error saving Google user:", err.response?.data || err.message);
// //     toast.error("⚠ Failed to save Google user to backend");
// //     return null;
// //   }
// // };

// // const AuthProvider = ({ children }) => {
// //   const [loading, setLoading] = useState(true);
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [products, setProducts] = useState([]);
//   // const [allUser, setAllUser] = useState(null);

// //   const googleProvider = new GoogleAuthProvider();

// //   // fetch user data from backend — expects token in Authorization header
// //   const fetchUserData = async (firebaseUser) => {
// //     if (!firebaseUser) {
// //       setUserData(null);
// //       return null;
// //     }

// //     try {
// //       // Always request fresh token for security
// //       const token = await firebaseUser.getIdToken(true);
// //       const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       // rewritten backend puts user in res.data.data
// //       const backendUser = res.data?.data ?? res.data?.user ?? null;

// //       if (backendUser) {
// //         setUserData(backendUser);
// //         if (!backendUser.isVerified && !backendUser.isGoogle) {
// //           toast.info("📧 Please verify your email to activate your account");
// //         }
// //         return backendUser;
// //       } else {
// //         setUserData(null);
// //         return null;
// //       }
// //     } catch (err) {
// //       // If token invalid or expired, backend returns 401 -> handle explicitly
// //       console.warn("⚠ Backend user not found or token invalid:", err.response?.data || err.message);

// //       // if 401, sign the user out of front-end Firebase and clear state
// //       if (err.response?.status === 401) {
// //         try {
// //           await firebaseSignOut(Auth);
// //         } catch (e) {
// //           console.warn("Error signing out after invalid token:", e.message);
// //         }
// //         setUserData(null);
// //         setIsLoggedIn(false);
// //       } else {
// //         setUserData(null);
// //       }

// //       throw err;
// //     }
// //   };

// //   // fetch products
//   // useEffect(() => {
//   //   const fetchProducts = async () => {
//   //     try {
//   //       const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/prod`);
//   //       setProducts(res.data || []);
//   //     } catch (err) {
//   //       console.error("❌ Error fetching products:", err.message || err);
//   //     }
//   //   };
//   //   fetchProducts();
//   // }, []);

// //   // auth state listener
// //   useEffect(() => {
// //     const unsubscribe = Auth.onAuthStateChanged(async (firebaseUser) => {
// //       setLoading(true);
// //       try {
// //         if (firebaseUser) {
// //           // refresh firebase user token/profile
// //           await reload(firebaseUser);

// //           try {
// //             await fetchUserData(firebaseUser);
// //             setIsLoggedIn(true);
// //           } catch (err) {
// //             // if backend user not found and provider is google, try to create/save backend user
// //             if (firebaseUser.providerData?.[0]?.providerId === "google.com") {
// //               try {
// //                 const token = await firebaseUser.getIdToken(true);
// //                 const saved = await saveGoogleUser(firebaseUser, token);
// //                 if (saved) {
// //                   await fetchUserData(firebaseUser);
// //                   setIsLoggedIn(true);
// //                 } else {
// //                   setIsLoggedIn(false);
// //                   setUserData(null);
// //                 }
// //               } catch (saveErr) {
// //                 console.error("Error while saving google user then fetching:", saveErr);
// //                 setIsLoggedIn(false);
// //                 setUserData(null);
// //               }
// //             } else {
// //               setUserData(null);
// //               setIsLoggedIn(false);
// //             }
// //           }
// //         } else {
// //           setUserData(null);
// //           setIsLoggedIn(false);
// //         }
// //       } catch (outerErr) {
// //         console.error("❌ Auth state change error:", outerErr);
// //         setUserData(null);
// //         setIsLoggedIn(false);
// //       } finally {
// //         setLoading(false);
// //       }
// //     });

// //     return () => unsubscribe();
// //   }, []);

// //   // Signup
// //   const signUpViaEmail = async (email, password, fullname) => {
// //     try {
// //       const userCred = await createUserWithEmailAndPassword(Auth, email, password);
// //       // register to backend — backend signup accepts firebaseUid & email
// //       await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/signup`, {
// //         firebaseUid: userCred.user.uid,
// //         email,
// //         name: fullname,
// //       });
// //       await sendEmailVerification(userCred.user);
// //       toast.success("🎉 User registered! Please verify your email.");
// //       return userCred.user;
// //     } catch (err) {
// //       console.error(err);
// //       toast.error(getFriendlyError(err));
// //       throw err;
// //     }
// //   };

// //   // Sign in email
// //   const signInViaEmail = async (email, password) => {
// //     try {
// //       const userCred = await signInWithEmailAndPassword(Auth, email, password);
// //       if (userCred.user) await reload(userCred.user);
// //       await fetchUserData(userCred.user);
// //       toast.success("✅ Logged in successfully!");
// //     } catch (err) {
// //       console.error(err);
// //       toast.error(getFriendlyError(err));
// //       throw err;
// //     }
// //   };

// //   // Sign in with Google — now sends token in Authorization header to create/save backend user
// //   const viaGoogle = async () => {
// //     try {
// //       const res = await signInWithPopup(Auth, googleProvider);
// //       const firebaseUser = res.user;
// //       const token = await firebaseUser.getIdToken(true);

// //       // call backend /api/user/google with token in Authorization header
// //       await axios.post(
// //         `${import.meta.env.VITE_BACKEND_URL}/api/user/google`,
// //         { /* optional body fallback: backend prefers token header */ },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       // fetch user from backend
// //       await fetchUserData(firebaseUser);
// //       toast.success("🎉 Logged in with Google!");
// //     } catch (err) {
// //       console.error("Google login error:", err.response?.data || err.message);
// //       // If COOP/COEP popup/window warning shows, it's generally a browser security console message and not the actual failure.
// //       toast.error(getFriendlyError(err));
// //       throw err;
// //     }
// //   };

// //   // Sign out
// //   const signout = async () => {
// //     try {
// //       await firebaseSignOut(Auth);
// //       setIsLoggedIn(false);
// //       setUserData(null);
// //       toast.success("👋 Logged out successfully");
// //       navigate("/");
// //     } catch (err) {
// //       console.error("Error logging out:", err);
// //       toast.error("Error logging out");
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         userData,
// //         isLoggedIn,
// //         loading,
// //         products,
// //         allUser,
// //         signUpViaEmail,
// //         signInViaEmail,
// //         viaGoogle,
// //         setUserData,
// //         signout,
// //         fetchUserData,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export default AuthProvider;








// const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [allUser, setAllUsers] = useState(null);
//   const [products, setProducts] = useState(null);



//   const fetchAllUserData = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/users/allUsers`
//       );
//       setAllUsers(res.data);
//     } catch (err) {
//       console.warn("Backend user not found yet:", err.response?.data?.message);
//       setAllUsers(null);
//     }
//   };


//   const fetchUserData = async (firebaseUser) => {
//     if (!firebaseUser) return setUserData(null);
//     try {
//       const token = await firebaseUser.getIdToken(true);
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUserData(res.data);
//     } catch (err) {
//       console.warn("Backend user not found yet:", err.response?.data?.message);
//       setUserData(null);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(Auth, async (crrUser) => {
//       setUser(crrUser);
//       if (crrUser) {
//         await fetchUserData(crrUser);
//         await fetchAllUserData();
//       } else {
//         setUserData(null);
//         setAllUsers(null);
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);


//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/prod`);
//         setProducts(res.data || []);
//       } catch (err) {
//         console.error("❌ Error fetching products:", err.message || err);
//       }
//     };
//     fetchProducts();
//   }, []);

  

//   const viaGoogle = async () => {
//     try {
//       const res = await signInWithPopup(Auth,googleAuth);
//       await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/google`,{
//         email: res.user.email,
//         displayName: res.user.displayName,
//         firebaseUid: res.user.uid,
//       });

//       await fetchUserData(res.user);
//       toast.success("🎉 Logged in with Google!");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Google login failed");
//     }
//   };


//   const signout = async () => {
//     await Auth.signOut();
//     setUserData(null);
//     navigate("/");
//     toast.info("👋 Signed out successfully!");
//   };



// const signUpViaEmail = async (email, password, fullname) => {
//   try {
//     const userCred = await createUserWithEmailAndPassword(Auth, email, password);

//     const { data: newUserData } = await axios.post(
//       `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`,
//       {
//         email,
//         firebaseUid: userCred.user.uid,
//         displayName: fullname,
//       }
//     );

//     toast.success("🎉 User registered successfully!");
//     setUserData(newUserData)
//     return newUserData; 
//   } catch (err) {
//     console.error("Signup error:", err);
//     toast.error(err.response?.data?.message || err.message || "Signup failed");
//   }
// };


//   const signInViaEmail = async (email, password) => {
//     try {
//       const userCred = await signInWithEmailAndPassword(Auth, email, password);
//       await reload(userCred.user);
//       await fetchUserData(userCred.user);
//       toast.success("✅ Logged in successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Signin failed");
//     }
//   };





//   return (
//     <AuthContext.Provider value={{
//       userData,
//       products,
//       allUser,
//       viaGoogle,
//       signInViaEmail,
//       signUpViaEmail,
//       fetchUserData,
//       signout,

//     }}>
//       {children}
      
//     </AuthContext.Provider>
//   )
// }

// export default AuthProvider
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
      const token = await Auth.currentUser?.getIdToken(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/allUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      signUpViaEmail,
      signInViaEmail,
      viaGoogle,
      signout,
      fetchUserData,
  }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
