import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Loader2 } from "lucide-react";
import { getFeaturedProducts } from "../api/api";
import ProductCard from "../components/ProductCard";

const HERO_SLIDES = [
  {
    title: "New Season",
    subtitle: "Women's Collection",
    desc: "Discover effortless elegance with our curated women's fashion — from flowing dresses to tailored essentials.",
    cta: "Shop Women",
    link: "/shop?gender=WOMEN",
    bg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85",
    color: "from-black/60"
  },
  {
    title: "Sharp & Modern",
    subtitle: "Men's Collection",
    desc: "Elevate your wardrobe with premium men's clothing designed for the modern gentleman.",
    cta: "Shop Men",
    link: "/shop?gender=MEN",
    bg: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=1400&q=85",
    color: "from-black/70"
  }
];

const FEATURES = [
  { icon: <Truck className="w-6 h-6 text-accent" />, title: "Free Delivery", desc: "On orders above ₹999" },
  { icon: <Shield className="w-6 h-6 text-accent" />, title: "Secure Payment", desc: "100% safe transactions" },
  { icon: <RefreshCw className="w-6 h-6 text-accent" />, title: "Easy Returns", desc: "30-day return policy" },
  { icon: <Headphones className="w-6 h-6 text-accent" />, title: "24/7 Support", desc: "Dedicated customer care" },
];

const CATEGORIES = [
  { name: "Dresses", img: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80", link: "/shop?category=Dress" },
  { name: "Shirts", img: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&q=80", link: "/shop?category=Shirt" },
  { name: "Jackets", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80", link: "/shop?category=Jacket" },
  { name: "Jeans", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80", link: "/shop?category=Jeans" },
];

const Home = () => {
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedProducts().then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
    const timer = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const s = HERO_SLIDES[slide];

  return (
    <div className="pt-16">
      {/* Hero Slider */}
      <section className="relative h-[85vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${s.bg})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${s.color} to-transparent`} />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-xl text-white">
              <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3 animate-pulse">{s.subtitle}</p>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 leading-tight">{s.title}</h1>
              <p className="text-gray-200 text-lg mb-8 leading-relaxed">{s.desc}</p>
              <div className="flex gap-4 flex-wrap">
                <Link to={s.link} className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                  {s.cta} <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/shop" className="btn-outline text-white border-white hover:bg-white hover:text-primary text-base px-8 py-3">
                  Browse All
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Slider dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === slide ? "bg-accent w-6" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-xl">{f.icon}</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">Shop by Category</h2>
            <p className="text-gray-500">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((c, i) => (
              <Link key={i} to={c.link} className="group relative overflow-hidden rounded-2xl aspect-square">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={e => e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-serif font-bold text-xl">{c.name}</p>
                  <p className="text-gray-300 text-sm flex items-center gap-1 mt-1">Shop Now <ArrowRight className="w-3 h-3" /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-1">Featured Picks</h2>
              <p className="text-gray-500">Handpicked styles for you</p>
            </div>
            <Link to="/shop" className="btn-outline hidden md:flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">View All Products <ArrowRight className="w-4 h-4"/></Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Limited Time Offer</p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Get 30% Off Your First Order</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">Sign up today and enjoy exclusive discounts, early access to new collections, and free delivery on your first purchase.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-3 inline-flex items-center gap-2">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
