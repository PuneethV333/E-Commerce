import React from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const team = [
  {
    name: "Tejas U L",
    role: "Frontend Developer",
    img: "https://res.cloudinary.com/dicvsdbow/image/upload/v1760620496/WhatsApp_Image_2025-10-15_at_15.59.52_71ca0d53_ck2iod.jpg",
    desc: "Designed and developed the main frontend components, handled responsive layouts, and contributed to UI optimization.",
    github: "https://github.com/TejasUL",
    linkedin: "https://www.linkedin.com/in/tejas-u-laxmeshwarmath-28417738b/",
    email: " tejasulaxmeshwarmath@gmail.com",
  },
  {
    name: "Siddhu Shirasagi",
    role: "Frontend Developer",
    img: "https://res.cloudinary.com/dtcvp7swh/image/upload/v1760504591/IMG-20250909-WA0010_mkmtsf.jpg",
    desc: "Worked on frontend structure, navigation design, and performance improvements using React and TailwindCSS.",
    github: "https://github.com/sidducs",
    linkedin: "https://www.linkedin.com/in/siddu-shirasagi",
    email: "siddushirasagi2233@gmail.com",
  },
  {
    name: "Puneeth V",
    role: "GSAP, Backend & Authentication",
    img: "https://res.cloudinary.com/deymewscv/image/upload/v1760331535/330508531_2133176596868192_3699010080291970708_n_eopkih.jpg",
    desc: "Built the backend, authentication flow, and interactive animations using GSAP. Ensured smooth user experience and API integration.",
    github: "https://github.com/PuneethV333",
    linkedin: "https://www.linkedin.com/in/puneeth-v-78a394336/",
    email: "mamathapreetham817@gmail.com",
  },
];

const KnowUs = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow bg-gray-50 flex flex-col items-center py-16 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-gray-900 text-center">
          Meet the Team
        </h1>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={40}
          slidesPerView={1}
          loop={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="w-full max-w-4xl"
        >
          {team.map((member, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col sm:flex-row items-center bg-white rounded-3xl shadow-xl p-8 sm:p-12 gap-8">
                {/* Image */}
                <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-md border-4 border-red-500 flex-shrink-0">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h2>
                  <p className="text-red-500 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-700 mb-5">{member.desc}</p>

                  {/* Social Links */}
                  <div className="flex justify-center sm:justify-start gap-6 mt-2">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold transition"
                      >
                        <FaGithub size={20} /> GitHub
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold transition"
                      >
                        <FaLinkedin size={20} /> LinkedIn
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition"
                      >
                        <FaEnvelope size={20} /> Email
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Footer Tagline */}
        <p className="mt-10 text-gray-500 text-sm text-center max-w-md">
          “Teamwork makes the dream work.” — united by code, driven by
          creativity.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default KnowUs;
