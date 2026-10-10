import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Create Account</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="text-sm text-slate-600 block mb-1">Full name</label>
          <input value={form.full_name} onChange={update("full_name")} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-600 block mb-1">Username</label>
          <input value={form.username} onChange={update("username")} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm text-slate-600 block mb-1">Email</label>
          <input type="email" value={form.email} onChange={update("email")} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm text-slate-600 block mb-1">Password</label>
          <input type="password" value={form.password} onChange={update("password")} className="w-full border rounded px-3 py-2" required />
        </div>
        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded font-medium">
          Register
        </button>
        <p className="text-sm text-slate-500 text-center">
          Already have an account? <Link to="/login" className="text-emerald-600">Login</Link>
        </p>
      </form>
    </div>
  );
}
