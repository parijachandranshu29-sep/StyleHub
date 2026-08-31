import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Loader2, ChevronDown, ChevronUp, MapPin, Phone, CheckCircle, Clock, Truck, Home, XCircle } from "lucide-react";
import { getMyOrders } from "../api/api";

const STATUS_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

const STATUS_CONFIG = {
  PLACED:           { label: "Order Placed",       icon: <Package className="w-4 h-4" />,     color: "text-blue-500",   bg: "bg-blue-50",   dot: "bg-blue-500" },
  CONFIRMED:        { label: "Confirmed",           icon: <CheckCircle className="w-4 h-4" />,  color: "text-purple-500", bg: "bg-purple-50", dot: "bg-purple-500" },
  SHIPPED:          { label: "Shipped",             icon: <Truck className="w-4 h-4" />,        color: "text-yellow-600", bg: "bg-yellow-50", dot: "bg-yellow-500" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery",   icon: <Truck className="w-4 h-4" />,        color: "text-orange-500", bg: "bg-orange-50", dot: "bg-orange-500" },
  DELIVERED:        { label: "Delivered",           icon: <Home className="w-4 h-4" />,         color: "text-green-600",  bg: "bg-green-50",  dot: "bg-green-500" },
  CANCELLED:        { label: "Cancelled",           icon: <XCircle className="w-4 h-4" />,      color: "text-red-500",    bg: "bg-red-50",    dot: "bg-red-500" },
};

const TrackingBar = ({ status }) => {
  const currentIndex = STATUS_STEPS.indexOf(status);
  if (currentIndex === -1) return null;

  return (
    <div className="py-4">
      <div className="flex items-center">
        {STATUS_STEPS.map((s, i) => {
          const done = i <= currentIndex;
          const cfg = STATUS_CONFIG[s];
          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? `${cfg.dot} border-transparent text-white` : "bg-white border-gray-200 text-gray-300"}`}>
                  {done ? cfg.icon : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                </div>
                <span className={`text-xs mt-1 font-medium text-center w-16 ${done ? cfg.color : "text-gray-400"}`}>{cfg.label}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${i < currentIndex ? "bg-accent" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PLACED;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-bold text-gray-800">Order #{order.id}</span>
            <span className={`badge ${cfg.bg} ${cfg.color} flex items-center gap-1`}>
              {cfg.icon} {cfg.label}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          {order.estimatedDelivery && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
            <p className="text-sm text-green-600 font-medium flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> Est. Delivery: {order.estimatedDelivery}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"}</p>
            <p className="font-bold text-primary text-lg">₹{Number(order.totalAmount).toLocaleString("en-IN")}</p>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5">
          {/* Tracking Bar */}
          {order.status !== "CANCELLED" && (
            <div className="overflow-x-auto">
              <TrackingBar status={order.status} />
            </div>
          )}

          {order.trackingId && (
            <div className="bg-blue-50 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700 font-medium">Tracking ID: {order.trackingId}</span>
            </div>
          )}

          {/* Items */}
          <div className="space-y-3 mt-4">
            <h4 className="font-semibold text-gray-700">Items Ordered</h4>
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-3 items-center bg-gray-50 rounded-xl p-3">
                <img
                  src={item.product?.imageUrl1}
                  alt={item.product?.name}
                  className="w-14 h-16 object-cover rounded-lg bg-gray-200 shrink-0"
                  onError={e => e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100"}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 line-clamp-1">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-accent">₹{Number(item.price).toLocaleString("en-IN")} each</p>
                </div>
                <p className="font-bold text-gray-800 shrink-0">₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-700 mb-2">Delivery Address</h4>
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              {order.shippingAddress}
            </p>
            {order.shippingPhone && (
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1.5">
                <Phone className="w-4 h-4 text-accent" /> {order.shippingPhone}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then(r => setOrders(r.data))
      .catch(() => setError("Could not load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-serif font-bold text-primary mb-8">My Orders</h1>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {error && <div className="text-center text-red-500 py-10">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here!</p>
            <Link to="/shop" className="btn-primary">Browse Products</Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      </div>
    </div>
  );
};

export default Orders;
