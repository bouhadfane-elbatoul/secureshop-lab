import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.myOrders().then(setOrders);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-slate-400">No orders yet.</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg divide-y">
          {orders.map((o) => (
            <Link to={`/orders/${o.id}`} key={o.id} className="flex justify-between p-4 hover:bg-slate-50">
              <div>
                <p className="font-medium text-slate-800">Order #{o.id}</p>
                <p className="text-sm text-slate-400">{new Date(o.created_at).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-emerald-600">${o.total.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{o.status}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
