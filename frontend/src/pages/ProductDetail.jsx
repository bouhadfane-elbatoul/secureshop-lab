import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  const loadReviews = () => api.reviews(id).then(setReviews);

  useEffect(() => {
    api.product(id).then(setProduct);
    loadReviews();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    await api.createReview({
      product_id: Number(id),
      rating: Number(rating),
      comment,
    });
    setComment("");
    loadReviews();
  };

  if (!product)
    return <p className="text-center py-10 text-slate-400">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex gap-6 flex-col sm:flex-row">
        <div className="h-48 sm:w-64 bg-slate-100 rounded flex items-center justify-center text-slate-300">
          {product.category}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">{product.name}</h1>
          <p className="text-slate-500 mt-2">{product.description}</p>
          <p className="text-2xl font-bold text-emerald-600 mt-4">
            ${product.price?.toFixed(2)}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {product.stock} in stock
          </p>
          <button
            onClick={() => {
              addItem(product, 1);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded font-medium"
          >
            {added ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Reviews</h2>

        {user && (
          <form
            onSubmit={submitReview}
            className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm text-slate-600">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} stars
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts on this product..."
              className="w-full border border-slate-300 rounded px-3 py-2 mb-2"
              rows={3}
              required
            />
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm"
            >
              Post Review
            </button>
          </form>
        )}

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">{r.username}</span>
                <span className="text-amber-500 text-sm">
                  {"★".repeat(r.rating)}
                </span>
              </div>
              <div className="text-slate-600 text-sm mt-1">{r.comment}</div>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-slate-400 text-sm">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
