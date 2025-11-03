import React, { useState, useRef } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { toast } from "react-toastify";
import axios from "axios";

const AddProduct = () => {
  const [prodName, setProdName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [prodImg, setProdImg] = useState(null);
  const [uploadMethod, setUploadMethod] = useState("file");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  const validTypes = [
    "Mobile", "Laptop", "Tablet", "Headphones", "Camera",
    "Men's Clothing", "Men's Shoes", "Men's Accessories",
    "Women's Clothing", "Women's Shoes", "Women's Accessories",
    "Kids' Clothing", "Kids' Shoes", "Kids' Accessories",
    "Furniture", "Kitchen Appliances", "Home Decor", "Bedding & Bath",
    "Skincare", "Haircare", "Makeup", "Fragrances",
    "Fitness Equipment", "Sportswear", "Camping & Hiking",
    "Action Figures", "Board Games", "Puzzles",
    "Fiction Books", "Non-Fiction Books", "Stationery",
    "Car Accessories", "Motorbike Accessories",
    "Snacks", "Beverages", "Organic & Health Foods",
    "Medical",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setProdImg(file);
      
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setProdImg(url);
    
    
    if (url && isValidUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleUploadMethodChange = (method) => {
    setUploadMethod(method);
    setProdImg(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!prodName.trim()) {
      toast.error("⚠ Please enter product name");
      return false;
    }

    if (!type) {
      toast.error("⚠ Please select product type");
      return false;
    }

    if (!description.trim()) {
      toast.error("⚠ Please enter product description");
      return false;
    }

    if (!cost || parseFloat(cost) <= 0) {
      toast.error("⚠ Please enter a valid cost (greater than 0)");
      return false;
    }

    if (!prodImg) {
      toast.error("⚠ Please provide an image");
      return false;
    }

    if (uploadMethod === "url" && !isValidUrl(prodImg)) {
      toast.error("⚠ Please enter a valid image URL");
      return false;
    }

    if (!validTypes.includes(type)) {
      toast.error("⚠ Invalid product type");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setProdName("");
    setType("");
    setDescription("");
    setCost("");
    setProdImg(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddProduct = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let imageUrl = prodImg;

      
      if (prodImg instanceof File) {
        const formData = new FormData();
        formData.append("file", prodImg);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const cloudRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        imageUrl = cloudRes.data.secure_url;
      }

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/prod/add`, {
        prodName: prodName.trim(),
        image: imageUrl,
        cost: parseFloat(cost),
        description: description.trim(),
        type,
      });

      toast.success("✅ Product added successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to add product";
      toast.error(`⚠ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddProduct();
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="prodName" className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              id="prodName"
              autoComplete="off"
              type="text"
              placeholder="Enter product name"
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              Product Type *
            </label>
            <input
              id="type"
              type="text"
              placeholder="Select or type product type"
              list="prod-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <datalist id="prod-type">
              {validTypes.map((t, idx) => (
                <option value={t} key={idx} />
              ))}
            </datalist>
          </div>

          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Product Description *
            </label>
            <textarea
              id="description"
              placeholder="Enter detailed product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 rounded-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          
          <div>
            <label htmlFor="cost" className="block text-sm font-medium mb-2">
              Product Cost ($) *
            </label>
            <input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter product cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Image *
            </label>
            <div className="flex gap-4 mb-3">
              <button
                type="button"
                onClick={() => handleUploadMethodChange("file")}
                className={`px-4 py-2 rounded-md transition ${
                  uploadMethod === "file"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                disabled={loading}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => handleUploadMethodChange("url")}
                className={`px-4 py-2 rounded-md transition ${
                  uploadMethod === "url"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                disabled={loading}
              >
                Use URL
              </button>
            </div>

            {uploadMethod === "file" ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
              </div>
            ) : (
              <input
                type="url"
                placeholder="Enter image URL (https://...)"
                value={prodImg || ""}
                onChange={handleUrlChange}
                className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            )}
          </div>

          
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Image Preview
              </label>
              <div className="border rounded-md p-4 bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="max-w-full h-48 object-contain mx-auto"
                  onError={() => {
                    setImagePreview(null);
                    toast.error("⚠ Failed to load image preview");
                  }}
                />
              </div>
            </div>
          )}

          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            aria-busy={loading}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddProduct;