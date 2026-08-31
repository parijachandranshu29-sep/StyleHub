import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Heart, ArrowLeft, Check, Truck, Shield, RefreshCw, Loader2, Star, ChevronRight } from "lucide-react";
import { getProductById } from "../api/api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then(r => { setProduct(r.data); if (r.data.sizes) setSelectedSize(r.data.sizes.split(",")[0]); })
      .catch(() => navigate("/shop"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="pt-20 flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );
  if (!product) return null;

  const images = [product.imageUrl1, product.imageUrl2, product.imageUrl3].filter(Boolean);
  const sizes = product.sizes ? product.sizes.split(",").map(s => s.trim()) : [];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    addToCart(product, selectedSize, quantity);
    toast.success(`${product.name} added to cart!`, {
      icon: "🛍️",
      style: { borderRadius: "10px", background: "#1a1a2e", color: "#fff" }
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    addToCart(product, selectedSize, quantity);
    navigate("/cart");
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-accent">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-accent">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"}
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 badge bg-accent text-white text-sm px-3 py-1.5">{discount}% OFF</span>
              )}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-accent" : "border-transparent"}`}
                  >
                    <img src={img} alt={`view ${i+1}`} className="w-full h-full object-cover"
                      onError={e => e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200"}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">{product.category} · {product.gender}</p>
              <h1 className="text-3xl font-serif font-bold text-primary mb-3">{product.name}</h1>
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                <span className="text-sm text-gray-500 ml-2">(128 reviews)</span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-primary">₹{Number(product.price).toLocaleString("en-IN")}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{Number(product.originalPrice).toLocaleString("en-IN")}</span>
                    <span className="badge bg-green-100 text-green-700 text-sm">{discount}% off</span>
                  </>
                )}
              </div>
              {product.color && <p className="text-sm text-gray-500 mt-2">Color: <span className="font-medium text-gray-700">{product.color}</span></p>}
            </div>

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-800">Select Size</p>
                  <button className="text-sm text-accent hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 rounded-lg border-2 text-sm font-semibold transition-all ${
                        selectedSize === s
                          ? "border-accent bg-accent text-white"
                          : "border-gray-200 text-gray-600 hover:border-accent hover:text-accent"
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-accent hover:text-accent transition-colors text-lg font-bold">-</button>
                <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-accent hover:text-accent transition-colors text-lg font-bold">+</button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="flex-1 btn-outline flex items-center justify-center gap-2 py-3">
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4">
              {[[<Truck className="w-5 h-5 text-accent"/>, "Free Delivery", "Orders ₹999+"],
                [<Shield className="w-5 h-5 text-accent"/>, "Authentic", "100% genuine"],
                [<RefreshCw className="w-5 h-5 text-accent"/>, "Easy Return", "30 days"]].map(([icon, title, sub], i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-1">{icon}</div>
                  <p className="text-xs font-semibold text-gray-700">{title}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
