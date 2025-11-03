import React from "react";
import "remixicon/fonts/remixicon.css";

const Rating = ( props ) => {
  const intPart = Math.floor(props.rating);
  const hasHalf = props.rating - intPart >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex items-center justify-center space-x-1 mt-1">
     
      {[...Array(intPart)].map((_, i) => (
        <i key={i} className="ri-star-s-fill text-yellow-400 text-lg"></i>
      ))}

      {hasHalf && <i className="ri-star-half-s-line text-yellow-400 text-lg"></i>}

      {[...Array(totalStars - intPart - (hasHalf ? 1 : 0))].map((_, i) => (
        <i key={i + intPart + 1} className="ri-star-s-line text-yellow-400 text-lg"></i>
      ))}

     
      <span className="text-gray-500 text-sm ml-2">
        {props.review}
      </span>
    </div>
  );
};

export default Rating;
