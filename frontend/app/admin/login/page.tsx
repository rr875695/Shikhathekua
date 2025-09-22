"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "@/app/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authAPI.adminLogin(email, password);
      localStorage.setItem("adminToken", data.token);
      document.cookie = `adminToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
      // Force full navigation so middleware sees the cookie immediately
      if (typeof window !== 'undefined') {
        window.location.assign('/admin/dashboard');
        return;
      }
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Admin Login</h1>
            <p>Welcome back to Thekua Admin!</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                suppressHydrationWarning
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your admin email"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                suppressHydrationWarning
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading} suppressHydrationWarning>
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <Link href="/" className="back-home">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
