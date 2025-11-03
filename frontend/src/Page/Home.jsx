import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import Card from "../Components/Card";
import Footer from "../Components/Footer";
import NavBar from "../Components/NavBar";
import PageTransition from "../Components/PageTransition";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const { loading, products, userData } = useContext(AuthContext);
  

  
  const groupedProducts = useMemo(() => {
    if (!products) return {};
    return products.reduce((acc, product) => {
      const type = product.prodType || "Others";
      if (!acc[type]) acc[type] = [];
      acc[type].push(product);
      return acc;
    }, {});
  }, [products]);

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">Loading products...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <NavBar isAdmin={userData?.isAdmin ?? false} />

        
        <section className="relative bg-blue-600 text-white py-12 px-4 sm:px-8 rounded-2xl m-4 sm:m-6 shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-right from-blue-700 to-blue-500 opacity-40"></div>

          
          <div className="relative z-10 max-w-lg text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl font-bold mb-3 leading-tight">
              Welcome to Sparks 
            </h1>
            <p className="text-base sm:text-lg mb-5">
              Discover the best products at unbeatable prices. Shop your
              favorites today!
            </p>
            <Link
              to="/homecd"
              className="bg-white text-blue-600 font-semibold px-5 py-3 rounded-xl shadow-md hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Shop Now
            </Link>
          </div>

          
          <div className="flex-1 relative z-10 mt-6 md:mt-0">
            <img
              src="https://res.cloudinary.com/deymewscv/image/upload/v1760100221/vivo-mobile-phone_t4g6lp.jpg"
              alt="Hero Banner"
              className="w-full max-w-xs sm:max-w-md mx-auto rounded-2xl shadow-lg transform transition hover:scale-105"
              loading="lazy"
            />
          </div>
        </section>

        
        <main className="p-4 sm:p-6 flex flex-col gap-10">
          {Object.keys(groupedProducts).length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              No products available.
            </p>
          ) : (
            Object.entries(groupedProducts).map(([type, products]) => (
              <section key={type}>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-2xl sm:text-3xl text-stone-600 font-bold">
                    <span className="bg-stone-200 px-3 py-1 rounded-full shadow-sm">
                      {type}
                    </span>
                  </h2>
                </div>

                
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={15}
                  slidesPerView={1.2}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true,
                  }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                  }}
                  className="pb-4 swiper-no-scrollbar"
                >
                  {products.map((product) => (
                    <SwiperSlide key={product._id}>
                      <div className="flex justify-center">
                        <Card value={product} user={userData} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>
            ))
          )}
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;
