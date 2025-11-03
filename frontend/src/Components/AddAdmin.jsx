import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const AddAdmin = () => {
  const { allUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(""); // stores selected value
  const [selectedUid, setSelectedUid] = useState(""); // store firebaseUid

  const addAdmin = async () => {
    if (!selectedUid) {
      toast.error("⚠ Please select a valid user from suggestions!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-admin/${selectedUid}`
      );
      toast.success("✅ User updated to admin successfully!");
      setUserName("");
      setSelectedUid("");
    } catch (err) {
      console.error(err);
      toast.error("⚠ Failed to update user to admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (e) => {
    setUserName(e.target.value);
    // find the user that matches the input
    const found = allUser.find(
      (u) => `${u.email} -> ${u.userName}` === e.target.value
    );
    if (found) setSelectedUid(found.firebaseUid);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <label className="block mb-2">
          *Make sure to select a user from the suggestions
        </label>
        <input
          type="text"
          placeholder="Enter email -> username ..."
          list="user-list"
          value={userName}
          onChange={handleSelect}
          className="border p-3 rounded-md mb-3 w-full"
        />
        <datalist id="user-list">
          {allUser.map((user, idx) => (
            <option
              key={idx}
              value={`${user.email} -> ${user.userName}`}
            />
          ))}
        </datalist>

        <button
          onClick={addAdmin}
          disabled={loading}
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update to Admin"}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default AddAdmin;
