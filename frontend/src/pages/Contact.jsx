import { useState } from "react";
import { api } from "../api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await api.contact(form);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Contact Support</h1>
      {sent && <p className="text-emerald-600 text-sm mb-4">Message sent! We'll get back to you soon.</p>}
      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div>
          <label className="text-sm text-slate-600 block mb-1">Name</label>
          <input value={form.name} onChange={update("name")} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm text-slate-600 block mb-1">Email</label>
          <input type="email" value={form.email} onChange={update("email")} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm text-slate-600 block mb-1">Message</label>
          <textarea value={form.message} onChange={update("message")} className="w-full border rounded px-3 py-2" rows={4} required />
        </div>
        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded font-medium">
          Send
        </button>
      </form>
    </div>
  );
}
