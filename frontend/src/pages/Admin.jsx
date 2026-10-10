import { useEffect, useState } from "react";
import { api } from "../api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.adminUsers().then(setUsers).catch((e) => setError(e.message));
    api.adminStats().then(setStats).catch(() => {});
    api.adminMessages().then(setMessages).catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-400 uppercase">{k.replace(/_/g, " ")}</p>
              <p className="text-xl font-bold text-slate-800">{typeof v === "number" ? v.toFixed(0) : v}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-700 mb-3">Users</h2>
      <div className="bg-white border border-slate-200 rounded-lg divide-y mb-8">
        {users.map((u) => (
          <div key={u.id} className="flex justify-between p-3 text-sm">
            <span>{u.username} ({u.full_name})</span>
            <span className="text-slate-400">{u.email}</span>
            <span className={u.role === "admin" ? "text-amber-500 font-semibold" : "text-slate-400"}>{u.role}</span>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-slate-700 mb-3">Contact Messages</h2>
      <div className="bg-white border border-slate-200 rounded-lg divide-y">
        {messages.map((m) => (
          <div key={m.id} className="p-3 text-sm">
            <p className="font-medium text-slate-700">{m.name} &lt;{m.email}&gt;</p>
            <p className="text-slate-500">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="p-3 text-sm text-slate-400">No messages.</p>}
      </div>
    </div>
  );
}
