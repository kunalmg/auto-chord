"use client";

import { useEffect, useState } from "react";

type User = { id: number; email: string; username: string; created_at: string };

export default function AdminUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to load users");
      } else {
        setUsers(data.data as User[]);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: number) {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((u) => u.filter((x) => x.id !== id));
    } else {
      alert("Failed to delete");
    }
  }

  async function updateName(id: number, username: string) {
    const name = prompt("New username", username);
    if (!name) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name }),
    });
    if (res.ok) {
      setUsers((u) => u.map((x) => (x.id === id ? { ...x, username: name } : x)));
    } else {
      alert("Failed to update");
    }
  }

  async function resetPassword(id: number) {
    const pwd = prompt("New password");
    if (!pwd) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    if (!res.ok) alert("Failed to update password");
  }

  if (loading) return <div className="text-sm text-white/70">Loading users…</div>;
  if (error) return <div className="text-sm text-red-300">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-white/80">
        <thead>
          <tr className="border-b border-white/10 text-white/60">
            <th className="py-2 pr-3">ID</th>
            <th className="py-2 pr-3">Email</th>
            <th className="py-2 pr-3">Username</th>
            <th className="py-2 pr-3">Created</th>
            <th className="py-2 pr-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-white/10">
              <td className="py-2 pr-3">{u.id}</td>
              <td className="py-2 pr-3">{u.email}</td>
              <td className="py-2 pr-3">{u.username}</td>
              <td className="py-2 pr-3">
                {new Date(u.created_at).toLocaleString()}
              </td>
              <td className="py-2 pr-3">
                <button
                  onClick={() => updateName(u.id, u.username)}
                  className="mr-2 rounded-full border border-white/20 px-3 py-1 text-xs"
                >
                  Rename
                </button>
                <button
                  onClick={() => resetPassword(u.id)}
                  className="mr-2 rounded-full border border-white/20 px-3 py-1 text-xs"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => remove(u.id)}
                  className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

