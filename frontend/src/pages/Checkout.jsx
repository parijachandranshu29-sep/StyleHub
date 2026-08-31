import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CreditCard, Truck, CheckCircle2, MapPin, Phone, User } from "lucide-react";
import { placeOrder, verifyPayment } from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shippingName: user?.name || "",
    shippingPhone: "",
    shippingAddress: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=success
  const [orderId, setOrderId] = useState(null);

  const deliveryFee = totalPrice >= 999 ? 0 : 99;
  const finalTotal = totalPrice + deliveryFee;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (!form.shippingName || !form.shippingPhone || !form.shippingAddress) {
      toast.error("Please fill all address fields"); return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(i => ({ productId: i.productId, quantity: i.quantity, size: i.size })),
        shippingName: form.shippingName,
        shippingPhone: form.shippingPhone,
        shippingAddress: form.shippingAddress,
        paymentMethod,
      };

      const orderRes = await placeOrder(orderData);
      const order = orderRes.data;
      setOrderId(order.id);

      if (paymentMethod === "COD") {
        clearCart();
        setStep(3);
      } else {
        // Razorpay flow
        const loaded = await loadRazorpayScript();
        if (!loaded) { toast.error("Payment gateway unavailable"); setLoading(false); return; }

        const rzp = new window.Razorpay({
          key: order.razorpayKeyId || "rzp_test_placeholder",
          amount: finalTotal * 100,
          currency: "INR",
          name: "StyleHub",
          description: "Fashion Order",
          order_id: order.razorpayOrderId,
          handler: async (response) => {
            try {
              await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              clearCart();
              setStep(3);
            } catch { toast.error("Payment verification failed"); }
          },
          modal: { ondismiss: () => setLoading(false) },
          prefill: { name: user.name, email: user.email, contact: form.shippingPhone },
          theme: { color: "#e94560" },
        });
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-primary mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-2">Your order has been confirmed successfully.</p>
        <p className="text-gray-500 mb-8">Order #{orderId} — {paymentMethod === "COD" ? "Pay on Delivery" : "Paid Online"}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/orders")} className="btn-primary">Track Order</button>
          <button onClick={() => navigate("/shop")} className="btn-outline">Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-serif font-bold text-primary mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[["1", "Delivery Address"], ["2", "Payment"]].map(([num, label], i) => (
            <React.Fragment key={num}>
              <div className={`flex items-center gap-2 ${step >= Number(num) ? "text-accent" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= Number(num) ? "border-accent bg-accent text-white" : "border-gray-200"}`}>{num}</div>
                <span className="font-medium hidden sm:block">{label}</span>
              </div>
              {i < 1 && <div className={`flex-1 h-0.5 ${step > 1 ? "bg-accent" : "bg-gray-200"}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            {step === 1 && (
              <div className="card p-6 space-y-5">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><MapPin className="w-5 h-5 text-accent" />Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="shippingName" value={form.shippingName} onChange={handleChange} className="input pl-9" placeholder="Your full name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input name="shippingPhone" value={form.shippingPhone} onChange={handleChange} className="input pl-9" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
                  <textarea name="shippingAddress" value={form.shippingAddress} onChange={handleChange} rows={3}
                    className="input resize-none" placeholder="House No., Street, City, State, PIN Code" />
                </div>
                <button onClick={() => { if (!form.shippingName || !form.shippingPhone || !form.shippingAddress) { toast.error("Fill all fields"); return; } setStep(2); }}
                  className="btn-primary w-full py-3">Continue to Payment</button>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6 space-y-5">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><CreditCard className="w-5 h-5 text-accent" />Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: "COD", icon: <Truck className="w-5 h-5" />, label: "Cash on Delivery", desc: "Pay when your order arrives" },
                    { value: "RAZORPAY", icon: <CreditCard className="w-5 h-5" />, label: "Pay Online", desc: "UPI, Cards, Net Banking via Razorpay" },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === opt.value ? "border-accent bg-accent/5" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} className="hidden" />
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === opt.value ? "bg-accent text-white" : "bg-gray-100 text-gray-500"}`}>{opt.icon}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{opt.label}</p>
                        <p className="text-sm text-gray-500">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === opt.value ? "border-accent" : "border-gray-300"}`}>
                        {paymentMethod === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Order Summary ({cart.length} items)</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-14 object-cover rounded-lg bg-gray-100 shrink-0"
                      onError={e => e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 shrink-0">₹{(Number(item.price)*item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{totalPrice.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Delivery</span><span className={deliveryFee===0?"text-green-600 font-medium":""}>{deliveryFee===0?"FREE":`₹${deliveryFee}`}</span></div>
                <div className="flex justify-between font-bold text-primary text-base border-t border-gray-100 pt-2"><span>Total</span><span>₹{finalTotal.toLocaleString("en-IN")}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
