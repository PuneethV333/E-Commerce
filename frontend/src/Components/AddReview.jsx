import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { Auth } from "../config/firebase";

const AddReview = ({ info }) => {
  const { user, setProducts } = useContext(AuthContext);
  const [review, setReview] = useState("");

  const addReview = async () => {
    try {
      if (!review) {
        toast.error("Please enter a review");
        return;
      }

      const currentUser = Auth.currentUser;
      if (!currentUser) {
        toast.error("Please login first!");
        return;
      }

      const token = await currentUser.getIdToken(true);

      // ✅ Send reviewText (backend expects this)
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/prod/addreview/${info._id}`,
        { reviewText: review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update global product list
      setProducts(res.data.products);

      toast.success("Review added successfully!");
      setReview("");
    } catch (err) {
      console.error(err);
      toast.error("Error adding review");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Enter your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={addReview}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Add Review
      </button>
    </div>
  );
};

export default AddReview;
