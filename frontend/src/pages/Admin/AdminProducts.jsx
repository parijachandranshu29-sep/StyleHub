import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Search } from "lucide-react";
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "../../api/api";
import toast from "react-hot-toast";

const empty = { name: "", description: "", price: "", originalPrice: "", category: "", gender: "WOMEN",
  imageUrl1: "", imageUrl2: "", imageUrl3: "", sizes: "", color: "", available: true, stock: 50, featured: false };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    adminGetProducts().then(r => { setProducts(r.data); setFiltered(r.data); }).catch(() => toast.error("Could not load products")).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
  }, [search, products]);

  const openCreate = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = p => {
    setForm({ name: p.name, description: p.description||"", price: p.price, originalPrice: p.originalPrice||"",
      category: p.category, gender: p.gender, imageUrl1: p.imageUrl1||"", imageUrl2: p.imageUrl2||"",
      imageUrl3: p.imageUrl3||"", sizes: p.sizes||"", color: p.color||"", available: p.available, stock: p.stock, featured: p.featured });
    setEditId(p.id); setShowForm(true);
  };

  const change = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, stock: Number(form.stock) };
    try {
      if (editId) { await adminUpdateProduct(editId, payload); toast.success("Product updated!"); }
      else { await adminCreateProduct(payload); toast.success("Product created!"); }
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Could not save"); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm("Delete this product?")) return;
    try { await adminDeleteProduct(id); toast.success("Deleted!"); load(); }
    catch { toast.error("Could not delete"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-primary">Products <span className="text-gray-400 text-lg font-sans">({products.length})</span></h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" />Add Product</button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 max-w-xs" placeholder="Search products..." />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{["Image","Name","Category","Gender","Price","Stock","Featured","Available",""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <img src={p.imageUrl1} alt={p.name} className="w-10 h-12 object-cover rounded-lg bg-gray-100"
                        onError={e => e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100"} />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[140px]"><p className="line-clamp-1">{p.name}</p></td>
                    <td className="px-4 py-3 text-gray-600">{p.category}</td>
                    <td className="px-4 py-3"><span className={`badge text-xs ${p.gender==="WOMEN"?"bg-pink-100 text-pink-600":p.gender==="MEN"?"bg-blue-100 text-blue-600":"bg-purple-100 text-purple-600"}`}>{p.gender}</span></td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{Number(p.price).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                    <td className="px-4 py-3"><span className={`badge ${p.featured?"bg-yellow-100 text-yellow-700":"bg-gray-100 text-gray-500"}`}>{p.featured?"Yes":"No"}</span></td>
                    <td className="px-4 py-3"><span className={`badge ${p.available?"bg-green-100 text-green-700":"bg-red-100 text-red-500"}`}>{p.available?"Active":"Hidden"}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => del(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 py-6">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-serif font-bold text-primary">{editId ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                  <input name="name" value={form.name} onChange={change} required className="input" placeholder="e.g. Floral Wrap Dress" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                  <select name="category" value={form.category} onChange={change} required className="input">
                    <option value="">Select category</option>
                    {["Dress","Shirt","Jeans","Jacket","T-Shirt","Hoodie","Pants","Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
                  <select name="gender" value={form.gender} onChange={change} className="input">
                    <option value="WOMEN">Women</option>
                    <option value="MEN">Men</option>
                    <option value="UNISEX">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                  <input type="number" name="price" value={form.price} onChange={change} required min={1} className="input" placeholder="1999" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price (₹)</label>
                  <input type="number" name="originalPrice" value={form.originalPrice} onChange={change} className="input" placeholder="2999 (for discount)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sizes (comma separated)</label>
                  <input name="sizes" value={form.sizes} onChange={change} className="input" placeholder="XS,S,M,L,XL,XXL" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
                  <input name="color" value={form.color} onChange={change} className="input" placeholder="e.g. Navy Blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={change} min={0} className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL 1 (Main) *</label>
                  <input name="imageUrl1" value={form.imageUrl1} onChange={change} className="input" placeholder="https://images.unsplash.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL 2</label>
                  <input name="imageUrl2" value={form.imageUrl2} onChange={change} className="input" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL 3</label>
                  <input name="imageUrl3" value={form.imageUrl3} onChange={change} className="input" placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea name="description" value={form.description} onChange={change} rows={3} className="input resize-none" placeholder="Product description..." />
                </div>
                <div className="sm:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="available" checked={form.available} onChange={change} className="accent-red-500 w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Available for purchase</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={change} className="accent-red-500 w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Featured on homepage</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 py-3">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving..." : editId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
