import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = totalPrice >= 999 ? 0 : 99;
  const finalTotal = totalPrice + deliveryFee;

  if (cart.length === 0) return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center px-4">
      <ShoppingBag className="w-20 h-20 text-gray-200 mb-5" />
      <h2 className="text-2xl font-serif font-bold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
      <Link to="/shop" className="btn-primary flex items-center gap-2">
        <ShoppingBag className="w-4 h-4" /> Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary">Shopping Cart <span className="text-accent">({totalItems})</span></h1>
          <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 hover:underline">
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="card p-4 flex gap-4 items-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-28 object-cover rounded-xl bg-gray-100 shrink-0"
                  onError={e => e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200"}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>Size: <span className="font-medium text-gray-700">{item.size}</span></span>
                    {item.color && <span>Color: <span className="font-medium text-gray-700">{item.color}</span></span>}
                  </div>
                  <p className="text-accent font-bold mt-2 text-lg">₹{Number(item.price).toLocaleString("en-IN")}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.productId, item.size)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="font-bold text-lg text-primary">₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}

            <Link to="/shop" className="flex items-center gap-2 text-accent font-medium hover:underline mt-4">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold text-primary mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : ""}`}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-400 bg-blue-50 px-3 py-2 rounded-lg">
                    Add ₹{(999 - totalPrice).toLocaleString("en-IN")} more for free delivery!
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-primary">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button
                onClick={() => user ? navigate("/checkout") : navigate("/login", { state: { from: "/checkout" } })}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span>Secure Checkout</span>
                <span>•</span>
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
