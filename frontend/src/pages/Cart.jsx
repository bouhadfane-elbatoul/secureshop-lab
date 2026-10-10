import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-slate-400">Your cart is empty. <Link to="/" className="text-emerald-600">Browse products</Link></p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg divide-y">
          {items.map((i) => (
            <div key={i.product.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-slate-800">{i.product.name}</p>
                <p className="text-sm text-slate-400">${i.product.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={i.quantity}
                  onChange={(e) => updateQuantity(i.product.id, Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
                <p className="w-20 text-right font-semibold">${(i.product.price * i.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(i.product.id)} className="text-red-400 hover:text-red-600 text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="p-4 flex justify-between items-center">
            <span className="font-bold text-lg">Total: ${total.toFixed(2)}</span>
            <button
              onClick={() => (user ? navigate("/checkout") : navigate("/login"))}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded font-medium"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
