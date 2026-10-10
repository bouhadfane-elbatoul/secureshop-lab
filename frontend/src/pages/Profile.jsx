import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  if (!user) return null;

  const saveProfile = async (e) => {
    e.preventDefault();
    await api.updateMe({ full_name: fullName, address });
    setStatus("Profile updated.");
    setTimeout(() => setStatus(""), 2000);
  };

  const uploadAvatar = async (e) => {
    e.preventDefault();
    if (!file) return;
    const res = await api.uploadAvatar(file);
    setUser({ ...user, avatar_path: res.avatar_path });
    setStatus("Avatar uploaded.");
    setTimeout(() => setStatus(""), 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>

      {status && <p className="text-emerald-600 text-sm mb-4">{status}</p>}

      <form onSubmit={saveProfile} className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 mb-6">
        <div>
          <label className="text-sm text-slate-600 block mb-1">Username</label>
          <input value={user.username} disabled className="w-full border rounded px-3 py-2 bg-slate-50 text-slate-400" />
        </div>
        <div>
          <label className="text-sm text-slate-600 block mb-1">Email</label>
          <input value={user.email} disabled className="w-full border rounded px-3 py-2 bg-slate-50 text-slate-400" />
        </div>
        <div>
          <label className="text-sm text-slate-600 block mb-1">Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-600 block mb-1">Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-3 py-2" rows={2} />
        </div>
        <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm">
          Save Profile
        </button>
      </form>

      <form onSubmit={uploadAvatar} className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
        <label className="text-sm text-slate-600 block">Profile picture</label>
        {user.avatar_path && (
          <img src={`${api.BASE_URL}${user.avatar_path}`} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
        )}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm">
          Upload
        </button>
      </form>
    </div>
  );
}
