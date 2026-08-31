import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-serif font-bold text-white">
                Style<span className="text-accent">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover the latest trends in fashion for men and women. Quality clothing, delivered to your door.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Instagram className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Twitter className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Facebook className="w-5 h-5"/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[["Home","/"],["Shop","/shop"],["Women","/shop?gender=WOMEN"],["Men","/shop?gender=MEN"],["My Orders","/orders"]].map(([label,path]) => (
                <li key={path}><Link to={path} className="text-sm text-gray-400 hover:text-accent transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {["Dresses","Shirts","Jeans","Jackets","T-Shirts","Hoodies","Pants"].map(c => (
                <li key={c}><Link to={`/shop?category=${c}`} className="text-sm text-gray-400 hover:text-accent transition-colors">{c}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400"><MapPin className="w-4 h-4 text-accent shrink-0"/>123 Fashion Street, Mumbai, India</li>
              <li className="flex items-center gap-2 text-sm text-gray-400"><Phone className="w-4 h-4 text-accent shrink-0"/>+91 98765 43210</li>
              <li className="flex items-center gap-2 text-sm text-gray-400"><Mail className="w-4 h-4 text-accent shrink-0"/>info@stylehub.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-500">© 2025 StyleHub. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Terms of Service</a>
            <a href="#" className="hover:text-accent">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
