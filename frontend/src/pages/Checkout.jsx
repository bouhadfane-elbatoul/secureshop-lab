import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const placeOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setError("");
    try {
      const payload = {
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          unit_price: i.product.price,
        })),
        total,
        shipping_address: address,
      };
      const res = await api.checkout(payload);
      clear();
      navigate(`/orders/${res.order_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <p className="text-center py-10 text-slate-400">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Checkout</h1>
      <form onSubmit={placeOrder} className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="text-sm text-slate-600 block mb-1">Shipping address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} required />
        </div>
        <div className="border-t pt-3">
          {items.map((i) => (
            <div key={i.product.id} className="flex justify-between text-sm text-slate-600">
              <span>{i.product.name} × {i.quantity}</span>
              <span>${(i.product.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-2 text-slate-800">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button disabled={placing} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded font-medium disabled:opacity-50">
          {placing ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
