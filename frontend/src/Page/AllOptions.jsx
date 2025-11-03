import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, PackageCheck, ClipboardList, Info } from "lucide-react";

import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { AuthContext } from "../Context/AuthProvider.jsx";

const AllOptions = () => {

  const options = [
    {
      name: "Cart",
      icon: <ShoppingCart size={40} />,
      to: "/cart",
      bg: "from-indigo-500 to-teal-400",
    },
    {
      name: "Delivered",
      icon: <PackageCheck size={40} />,
      to: "/delivered", 
      bg: "from-green-400 to-emerald-500",
    },
    {
      name: "Orders",
      icon: <ClipboardList size={40} />,
      to: "/order",
      bg: "from-orange-400 to-pink-500",
    },
    {
      name: "Know Us",
      icon: <Info size={40} />,
      to: "/know-us",
      bg: "from-cyan-400 to-blue-500",
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <NavBar />

      <div className="flex-1 flex justify-center items-center py-12">
        <div className="w-11/12 bg-sky-100/70 backdrop-blur-md rounded-3xl flex flex-wrap justify-center gap-10 p-10 shadow-2xl">
          {options.map((opt, i) => (
            <Link key={i} to={opt.to} className="w-full sm:w-[45%]">
              <div
                className={`h-52 rounded-3xl flex flex-col gap-3 items-center justify-center text-white text-2xl font-semibold bg-gradient-to-r ${opt.bg} shadow-md hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer`}
              >
                <div className="bg-white/20 p-4 rounded-full">{opt.icon}</div>
                <p>{opt.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllOptions;
