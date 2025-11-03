import React from "react";
import Rating from "./Rating";



const Review = ({ data }) => {
  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        
        <h3 className="text-gray-800 font-semibold">
          {data.name || "Anonymous"}
        </h3>

        {data.rating && <Rating rating={data.rating} />}
      </div>

      
      <p className="text-gray-600">{data.text || data}</p>

      
      {data.date && (
        <p className="text-gray-400 text-sm mt-2">
          {new Date(data.date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default Review;
