import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const cartCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold tracking-tight text-emerald-400">
        Secure<span className="text-white">Shop</span>
      </Link>
      <div className="flex items-center gap-5 text-sm">
        <Link to="/" className="hover:text-emerald-400">Products</Link>
        <Link to="/contact" className="hover:text-emerald-400">Contact</Link>
        {user ? (
          <>
            <Link to="/orders" className="hover:text-emerald-400">Orders</Link>
            <Link to="/profile" className="hover:text-emerald-400">Profile</Link>
            {user.role === "admin" && (
              <Link to="/admin" className="hover:text-amber-400 font-semibold">Admin</Link>
            )}
            <Link to="/cart" className="relative hover:text-emerald-400">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-emerald-500 text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>
            <span className="text-slate-400">Hi, {user.username}</span>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/cart" className="hover:text-emerald-400">Cart</Link>
            <Link to="/login" className="hover:text-emerald-400">Login</Link>
            <Link to="/register" className="bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 rounded text-slate-900 font-semibold">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
