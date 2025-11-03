import React from "react";
import Rating from "./Rating";

const DeliveryCard = ({ info }) => {
  const formattedDate = info.deliveredProd.expectedDeliveryDate
    ? new Date(info.deliveredProd.expectedDeliveryDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="w-64 bg-white rounded-3xl p-5 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-105 duration-300 border border-gray-100 flex flex-col justify-between">
      
      
      <div className="flex justify-center mb-4 relative">
        <img
          src={info.deliveredProd.prodImg || "/placeholder.png"}
          alt={info.deliveredProd.prodName}
          className="w-40 h-40 object-cover rounded-2xl shadow-sm hover:shadow-md transition duration-300"
        />
      </div>

      
      <div className="text-center flex-1">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 truncate">
          {info.deliveredProd.prodName || "Unknown Product"}
        </h2>
        <p className="text-gray-500 text-sm mb-1 line-clamp-2">
          {info.deliveredProd.prodDescription || "No description available."}
        </p>
        <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
          {info.deliveredProd.prodType || "General"}
        </p>

        <div className="flex justify-center mb-2">
          <Rating rating={info.deliveredProd.rating || 0} review={info.deliveredProd.reviews?.length || 0} />
        </div>

        {info.deliveredProd.cost && (
          <p className="text-red-600 text-lg font-bold mb-2">
            ₹{info.deliveredProd.cost.toLocaleString()}
          </p>
        )}

        
        <div className="text-gray-600 text-sm space-y-1 mb-2">
          <p><span className="font-medium">Delivery Date:</span> {formattedDate}</p>
          <p><span className="font-medium">Location:</span> {info.deliveredProd.deliveryLocation || "N/A"}</p>
          <p><span className="font-medium">Contact:</span> {info.deliveredProd.contactInfo || "N/A"}</p>
        </div>
      </div>

      
      <div className="border-t border-gray-200 my-3"></div>
      <div className="flex justify-center mt-2">
        <span className={`${
          info.orderedProd.isDelivered ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
        } text-sm font-medium px-3 py-1 rounded-full uppercase tracking-wide shadow-sm`}>
          {info.orderedProd.isDelivered ? "Delivered" : "Pending"}
        </span>
      </div>
    </div>
  );
};

export default DeliveryCard;