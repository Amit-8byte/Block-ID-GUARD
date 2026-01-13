"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export default function SanctionLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // ✅ backend enforces role via middleware
      router.push("/sanctions");
    } catch (err) {
      if (err instanceof AxiosError) {
        const apiError = err.response?.data as ApiErrorResponse;

        if (err.response?.status === 403) {
          setError("Access denied. You are not authorized as a Sanction Manager.");
        } else {
          setError(apiError?.message || "Invalid email or password");
        }
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border-2 border-black rounded-xl p-8">
        <h1 className="text-2xl font-bold text-black text-center mb-6">
          Sanction Manager Login
        </h1>

        {error && (
          <div className="mb-4 border border-red-600 bg-red-50 px-4 py-3 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border-2 border-black px-4 py-2
             text-black placeholder-gray-500
             focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border-2 border-black px-4 py-2
             text-black placeholder-gray-500
             focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
