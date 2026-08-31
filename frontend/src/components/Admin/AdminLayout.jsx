import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const link = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-accent text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`;

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Admin Panel</p>
                <p className="text-xs text-gray-400">StyleHub</p>
              </div>
            </div>
            <nav className="space-y-1.5">
              <NavLink to="/admin/products" className={link}>
                <Package className="w-4 h-4" /> Products
              </NavLink>
              <NavLink to="/admin/orders" className={link}>
                <ShoppingBag className="w-4 h-4" /> Orders
              </NavLink>
            </nav>
            <div className="border-t border-gray-100 mt-4 pt-4">
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
