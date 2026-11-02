"use client";
import { useState } from "react";
import { Logo } from "./site";
export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const fields = new FormData(e.currentTarget);
      const password = fields.get("password");
      const username = fields.get("username");
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { error: string };
      if (!response.ok) throw new Error(result.error);
      window.location.href = "/admin";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <Logo />
        <h1>Admin sign in</h1>
        <p>Sign in to manage services, tour packages and seasonal updates.</p>
        <label>
          Username
          <input
            name="username"
            autoComplete="username"
            defaultValue="admin"
            required
            maxLength={128}
          />
        </label>
        <label>
          Admin password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            maxLength={256}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button wide" disabled={busy}>
          {busy ? "Signing in…" : "Sign in to dashboard"}
        </button>
        <p className="fine-print">
          Protected access for the GosaviOn Group team.
        </p>
        <a href="/" className="text-link">
          Back to website
        </a>
      </form>
    </main>
  );
}
