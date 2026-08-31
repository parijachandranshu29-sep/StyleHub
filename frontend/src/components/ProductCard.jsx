import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const sizes = product.sizes ? product.sizes.split(",") : [];
  const defaultSize = sizes[0] || "M";

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, defaultSize, 1);
    toast.success(`${product.name} added to cart!`, {
      icon: "🛍️",
      style: { borderRadius: "10px", background: "#1a1a2e", color: "#fff" }
    });
  };

  return (
    <div
      className="card group overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
          <img
            src={hovered && product.imageUrl2 ? product.imageUrl2 : product.imageUrl1}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            onError={e => { e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80"; }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge bg-accent text-white">{discount}% OFF</span>
            )}
            {product.featured && (
              <span className="badge bg-primary text-white">Featured</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={e => { e.preventDefault(); setWishlisted(!wishlisted); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!"); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>

          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-center py-3 text-sm font-semibold translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 w-full">
              <ShoppingBag className="w-4 h-4" /> Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category} · {product.gender}</p>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-accent transition-colors">{product.name}</h3>

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              {sizes.slice(0, 5).map(s => (
                <span key={s} className="text-xs border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">{s}</span>
              ))}
              {sizes.length > 5 && <span className="text-xs text-gray-400">+{sizes.length - 5}</span>}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">₹{Number(product.price).toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{Number(product.originalPrice).toLocaleString("en-IN")}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
