import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "react-scroll-to-top";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import { Login, Register } from "./pages/Auth";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const router = createBrowserRouter([
  { path: "/",            element: <Layout><Home /></Layout> },
  { path: "/shop",        element: <Layout><Shop /></Layout> },
  { path: "/product/:id", element: <Layout><ProductDetail /></Layout> },
  { path: "/cart",        element: <Layout><Cart /></Layout> },
  { path: "/login",       element: <Layout><Login /></Layout> },
  { path: "/register",    element: <Layout><Register /></Layout> },
  {
    path: "/checkout",
    element: <Layout><ProtectedRoute><Checkout /></ProtectedRoute></Layout>
  },
  {
    path: "/orders",
    element: <Layout><ProtectedRoute><Orders /></ProtectedRoute></Layout>
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true,       element: <Navigate to="/admin/products" replace /> },
      { path: "products",  element: <AdminProducts /> },
      { path: "orders",    element: <AdminOrders /> },
    ]
  },
  { path: "*", element: <Layout><div className="pt-32 text-center"><h1 className="text-4xl font-serif font-bold text-primary mb-4">404 - Page Not Found</h1><a href="/" className="text-accent hover:underline">Go Home</a></div></Layout> }
]);

const App = () => (
  <AuthProvider>
    <CartProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
      <ScrollToTop
        smooth
        color="white"
        style={{ backgroundColor: "#e94560", display: "flex", alignItems: "center", justifyContent: "center" }}
      />
    </CartProvider>
  </AuthProvider>
);

export default App;
