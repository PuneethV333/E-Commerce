import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Stark
          </h2>
          <p className="text-sm leading-relaxed">
            Your one-stop shop for quality products at unbeatable prices. 
            Trusted by customers since 2025.
          </p>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/home" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/home" className="hover:text-white transition">Products</Link></li>
            <li><Link to="/order" className="hover:text-white transition">My Orders</Link></li>
            <li><Link to="/know-us" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 123 MG Road, Bengaluru, India</li>
            <li>📞 +91 91106 21698</li>
            <li>📧 support@sparks.com</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition"><FaInstagram /></a>
            <a href="https://wa.me/919110621698" target="_blank" rel="noreferrer" className="hover:text-white transition"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Starks. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
