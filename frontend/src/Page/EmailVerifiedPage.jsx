import { useEffect, useState } from "react";
import { getAuth, applyActionCode, reload } from "firebase/auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerifiedPage = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  useEffect(() => {
    const verifyEmail = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        await reload(user);
        if (user.emailVerified) {
          setMessage("✅ Your email is already verified!");
          toast.info("Your email is already verified!");
          setLoading(false);
          setTimeout(() => navigate("/home"), 2500);
          return;
        }
      }

      if (!oobCode || mode !== "verifyEmail") {
        setMessage("⚠ Invalid or expired verification link.");
        setLoading(false);
        return;
      }

      try {
        await applyActionCode(auth, oobCode);

        await reload(auth.currentUser);

        const updatedUser = auth.currentUser;

        if (updatedUser) {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/verify-email/${
              updatedUser.uid
            }`
          );
        }

        setMessage("✅ Your email has been verified successfully!");
        toast.success("Email verified successfully!");
        setLoading(false);
        setTimeout(() => navigate("/home"), 3000);
      } catch (err) {
        console.error("Verification Error:", err);
        setMessage("⚠ Verification failed or expired link.");
        toast.error("Verification failed or expired link.");
        setLoading(false);
      }
    };

    verifyEmail();
  }, [oobCode, mode, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-4">{message}</h2>
        {loading && (
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mt-6"></div>
        )}
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
