import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = () => {
    setLoading(true);
    api.products().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return loadAll();
    setLoading(true);
    try {
      const results = await api.searchProducts(query);
      setProducts(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Welcome to SecureShop</h1>
        <p className="text-slate-500 mt-1">Quality products, honest prices.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-lg mx-auto">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border border-slate-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded font-medium">
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-center text-slate-400">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link
              to={`/products/${p.id}`}
              key={p.id}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="h-32 bg-slate-100 rounded mb-3 flex items-center justify-center text-slate-300 text-xs">
                {p.category}
              </div>
              <h3 className="font-semibold text-slate-800">{p.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mt-1">{p.description}</p>
              <p className="mt-2 font-bold text-emerald-600">${p.price?.toFixed(2)}</p>
            </Link>
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-center text-slate-400">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
