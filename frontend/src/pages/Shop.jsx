import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, Loader2, SlidersHorizontal } from "lucide-react";
import { getProducts, getProductsByGender, getProductsByCategory } from "../api/api";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["All", "Dress", "Shirt", "Jeans", "Jacket", "T-Shirt", "Hoodie", "Pants"];
const GENDERS = ["All", "MEN", "WOMEN", "UNISEX"];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState(searchParams.get("gender") || "All");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(r => { setProducts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setGender(searchParams.get("gender") || "All");
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];
    if (gender !== "All") result = result.filter(p => p.gender === gender);
    if (category !== "All") result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (search.trim()) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [products, gender, category, search, sortBy]);

  const clearFilters = () => { setGender("All"); setCategory("All"); setSearch(""); setSortBy("default"); };
  const hasFilters = gender !== "All" || category !== "All" || search || sortBy !== "default";

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">
              {gender !== "All" ? `${gender.charAt(0)+gender.slice(1).toLowerCase()}'s` : "All"} {category !== "All" ? category : "Products"}
            </h1>
            <p className="text-gray-500 mt-1">{filtered.length} items found</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input max-w-xs"
            />
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg hover:border-accent hover:text-accent transition-colors md:hidden">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input w-auto hidden md:block">
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-56 shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24 space-y-6">
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-accent text-sm font-medium hover:underline">
                  <X className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              )}

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Gender</h3>
                <div className="space-y-2">
                  {GENDERS.map(g => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value={g} checked={gender === g} onChange={() => setGender(g)} className="accent-red-500"/>
                      <span className="text-sm text-gray-600">{g === "All" ? "All" : g.charAt(0)+g.slice(1).toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" value={c} checked={category === c} onChange={() => setCategory(c)} className="accent-red-500"/>
                      <span className="text-sm text-gray-600">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input text-sm">
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg mb-3">No products found</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
