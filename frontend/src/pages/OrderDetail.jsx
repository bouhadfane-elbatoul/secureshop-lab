import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setOrder(null);
    setError("");
    api.order(id).then(setOrder).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!order) return <p className="text-center py-10 text-slate-400">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Order #{order.id}</h1>
      <p className="text-slate-400 text-sm mb-6">{new Date(order.created_at).toLocaleString()}</p>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <p className="text-sm text-slate-500 mb-1">Shipping to</p>
        <p className="text-slate-800 mb-4">{order.shipping_address}</p>

        <div className="border-t pt-3 space-y-1">
          {order.items.map((it, idx) => (
            <div key={idx} className="flex justify-between text-sm text-slate-600">
              <span>Product #{it.product_id} × {it.quantity}</span>
              <span>${(it.unit_price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold mt-3 pt-3 border-t text-slate-800">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">Status: {order.status}</p>
      </div>
    </div>
  );
}
