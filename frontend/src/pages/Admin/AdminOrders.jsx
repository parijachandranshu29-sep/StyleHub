import React, { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp, MapPin, Phone, Package, Search } from "lucide-react";
import { adminGetOrders, adminUpdateOrderStatus } from "../../api/api";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const STATUS_STYLES = {
  PLACED:           "bg-blue-100 text-blue-700",
  CONFIRMED:        "bg-purple-100 text-purple-700",
  SHIPPED:          "bg-yellow-100 text-yellow-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED:        "bg-green-100 text-green-700",
  CANCELLED:        "bg-red-100 text-red-500",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [trackingInputs, setTrackingInputs] = useState({});

  const load = () => {
    setLoading(true);
    adminGetOrders()
      .then(r => { setOrders(r.data); setFiltered(r.data); })
      .catch(() => toast.error("Could not load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = [...orders];
    if (filterStatus !== "ALL") result = result.filter(o => o.status === filterStatus);
    if (search.trim()) result = result.filter(o =>
      String(o.id).includes(search) ||
      o.shippingName?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [orders, filterStatus, search]);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await adminUpdateOrderStatus(orderId, {
        status,
        trackingId: trackingInputs[orderId]?.trackingId || null,
        estimatedDelivery: trackingInputs[orderId]?.estimatedDelivery || null,
      });
      toast.success("Order status updated!");
      load();
    } catch { toast.error("Could not update status"); }
    finally { setUpdating(null); }
  };

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-primary">
          Orders <span className="text-gray-400 text-lg font-sans">({orders.length})</span>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? "ALL" : s)}
            className={`rounded-xl p-3 text-center border-2 transition-all ${filterStatus === s ? "border-accent bg-accent/5" : "bg-white border-gray-100 hover:border-gray-200"}`}
          >
            <p className="text-xl font-bold text-gray-800">{counts[s] || 0}</p>
            <p className={`text-xs font-medium mt-0.5 ${STATUS_STYLES[s].split(" ")[1]}`}>{s.replace("_", " ")}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" placeholder="Search by ID or name..." />
        </div>
        {filterStatus !== "ALL" && (
          <button onClick={() => setFilterStatus("ALL")} className="text-sm text-accent hover:underline font-medium">
            Clear Filter
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Order Row */}
              <div className="p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-800">#{order.id}</span>
                    <span className={`badge text-xs ${STATUS_STYLES[order.status]}`}>{order.status.replace("_", " ")}</span>
                    <span className="badge bg-gray-100 text-gray-600 text-xs">{order.paymentMethod}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {order.shippingName} · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-bold text-lg text-primary">₹{Number(order.totalAmount).toLocaleString("en-IN")}</p>

                  {/* Status Dropdown */}
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    className="input w-auto text-sm py-1.5"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>

                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    {expanded === order.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                </div>
              </div>

              {/* Expanded */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                  {/* Tracking inputs */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Update Tracking Info</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Tracking ID</label>
                        <input
                          className="input text-sm"
                          placeholder="e.g. DTDC1234567"
                          defaultValue={order.trackingId || ""}
                          onChange={e => setTrackingInputs(prev => ({ ...prev, [order.id]: { ...prev[order.id], trackingId: e.target.value } }))}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Estimated Delivery</label>
                        <input
                          className="input text-sm"
                          placeholder="e.g. 05 Aug 2026"
                          defaultValue={order.estimatedDelivery || ""}
                          onChange={e => setTrackingInputs(prev => ({ ...prev, [order.id]: { ...prev[order.id], estimatedDelivery: e.target.value } }))}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleStatusChange(order.id, order.status)}
                      disabled={updating === order.id}
                      className="btn-primary text-sm px-4 py-2 mt-3 flex items-center gap-2"
                    >
                      {updating === order.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Save Tracking Info
                    </button>
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Items ({order.items?.length})</h4>
                    <div className="space-y-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center bg-gray-50 rounded-xl p-3">
                          <img src={item.product?.imageUrl1} alt={item.product?.name}
                            className="w-12 h-14 object-cover rounded-lg bg-gray-200 shrink-0"
                            onError={e => e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100"} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product?.name}</p>
                            <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-800 shrink-0">
                            ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Shipping Details</h4>
                    <p className="text-sm text-gray-600 font-medium">{order.shippingName}</p>
                    <p className="text-sm text-gray-500 flex items-start gap-1.5 mt-1">
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {order.shippingAddress}
                    </p>
                    {order.shippingPhone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                        <Phone className="w-4 h-4 text-accent" /> {order.shippingPhone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
