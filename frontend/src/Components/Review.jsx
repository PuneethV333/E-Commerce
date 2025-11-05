import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

const Review = () => {
  const { id } = useParams();
  const { products, allUser } = useContext(AuthContext);
  

  
  const product = products?.find((p) => String(p._id) === String(id));

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <h2>Product not found or still loading...</h2>
      </div>
    );
  }

  
  const getUserName = (userId) => {
    const user = allUser?.find((u) => String(u._id) === String(userId));   
    return user ? user.userName || "Unknown User" : "Unknown User";
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">

      {product.reviews && product.reviews.length > 0 ? (
        <div className="space-y-6">
          {product.reviews.map((review, index) => {
            const reviewerName = getUserName(review.userInfo);

            return (
              <div
                key={review._id || index}
                className="p-6 rounded-xl border w-200 border-zinc-700 hover:border-blue-500 transition-all shadow-md hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-blue-400 font-semibold">
                    {reviewerName}
                  </p>
                </div>

                <p className="text-slate-600 leading-relaxed">{review.review}</p>

                <p className="text-xs text-gray-500 mt-3 text-right">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-400 bg-zinc-800 py-10 rounded-xl border border-zinc-700">
          <p>No reviews yet for this product.</p>
        </div>
      )}
    </div>
  );
};

export default Review;
