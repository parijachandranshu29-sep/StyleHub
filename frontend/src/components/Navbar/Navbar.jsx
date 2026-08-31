import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search, Heart, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location]);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-serif font-bold text-primary">
              Style<span className="text-accent">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-accent font-medium transition-colors">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-accent font-medium transition-colors">Shop</Link>
            <Link to="/shop?gender=WOMEN" className="text-gray-600 hover:text-accent font-medium transition-colors">Women</Link>
            <Link to="/shop?gender=MEN" className="text-gray-600 hover:text-accent font-medium transition-colors">Men</Link>
            {isAdmin && (
              <Link to="/admin" className="text-accent font-semibold">Admin</Link>
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/shop")} className="p-2 text-gray-600 hover:text-accent transition-colors hidden md:block">
              <Search className="w-5 h-5" />
            </button>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-accent transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link to="/orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent font-medium">My Orders</Link>
                    <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent font-medium">Profile</Link>
                    {isAdmin && <Link to="/admin" className="block px-4 py-2.5 text-sm text-accent hover:bg-gray-50 font-semibold">Admin Panel</Link>}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-1.5 bg-accent text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-accent-light transition-colors">
                <User className="w-4 h-4" /> Login
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {[["Home","/"],["Shop","/shop"],["Women","/shop?gender=WOMEN"],["Men","/shop?gender=MEN"]].map(([label,path]) => (
            <Link key={path} to={path} className="block py-2 text-gray-700 font-medium hover:text-accent">{label}</Link>
          ))}
          {user ? (
            <>
              <Link to="/orders" className="block py-2 text-gray-700 font-medium hover:text-accent">My Orders</Link>
              {isAdmin && <Link to="/admin" className="block py-2 text-accent font-semibold">Admin Panel</Link>}
              <button onClick={handleLogout} className="block py-2 text-red-500 font-medium">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block py-2 text-accent font-semibold">Login / Register</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
