"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { AdminTokenList } from "@/components/admin/admin-token-list";
import { TRAVEL_SECTIONS } from "@/content/travel-reveal";
import { cn } from "@/lib/utils";

const SCOPE_KEYS = Object.keys(TRAVEL_SECTIONS);

const inputClasses =
  "h-9 w-full rounded-md bg-white/10 px-3 text-white outline-none transition-colors focus:border-white/50";

export function AdminPanel() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginStatus, setLoginStatus] = useState("idle");

  const [scope, setScope] = useState([]);
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const [issueStatus, setIssueStatus] = useState("idle");
  const [issueError, setIssueError] = useState("");
  const [issuedToken, setIssuedToken] = useState("");
  const [copied, setCopied] = useState(false);

  const [tokens, setTokens] = useState([]);
  const [tokensLoading, setTokensLoading] = useState(false);

  // Checks the session cookie once on load so a page refresh doesn't force
  // re-entering the password within the same 12-hour session.
  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((json) => setAuthed(Boolean(json.authed)))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, []);

  const fetchTokens = useCallback(async () => {
    setTokensLoading(true);
    try {
      const res = await fetch("/api/admin/tokens");
      const json = await res.json();
      setTokens(Array.isArray(json.tokens) ? json.tokens : []);
    } catch {
      setTokens([]);
    } finally {
      setTokensLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    const raf = requestAnimationFrame(() => fetchTokens());
    return () => cancelAnimationFrame(raf);
  }, [authed, fetchTokens]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus("checking");
    setLoginError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError(true);
        setLoginStatus("idle");
        return;
      }
      setAuthed(true);
      setPassword("");
      setLoginStatus("idle");
    } catch {
      setLoginError(true);
      setLoginStatus("idle");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  };

  const toggleScope = (key) =>
    setScope((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const handleIssue = async (e) => {
    e.preventDefault();
    setIssueStatus("issuing");
    setIssueError("");
    setIssuedToken("");
    setCopied(false);
    try {
      const res = await fetch("/api/admin/issue-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, days: Number(days) || 0, hours: Number(hours) || 0, note }),
      });
      const json = await res.json();
      if (!res.ok) {
        setIssueError(json.error || "Failed to issue token");
        setIssueStatus("idle");
        return;
      }
      setIssuedToken(json.token);
      setIssueStatus("idle");
      setNote("");
      fetchTokens();
    } catch {
      setIssueError("Failed to issue token");
      setIssueStatus("idle");
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(issuedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the token is
      // still visible and selectable in the field below.
    }
  };

  const handleRevokeToggle = async (id, revoked) => {
    try {
      const res = await fetch(`/api/admin/tokens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revoked }),
      });
      if (!res.ok) return false;
      fetchTokens();
      return true;
    } catch {
      return false;
    }
  };

  const handleEditSave = async (id, patch) => {
    try {
      const res = await fetch(`/api/admin/tokens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return false;
      fetchTokens();
      return true;
    } catch {
      return false;
    }
  };

  if (checking) return null;

  return (
    <main className="flex min-h-screen w-full justify-center bg-background px-6 py-24">
      {!authed ? (
        <form onSubmit={handleLogin} className="flex h-fit w-full max-w-xs flex-col gap-4 self-center">
          <h1 className="text-center text-white">Admin</h1>
          <input
            type="password"
            autoFocus
            autoComplete="off"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError(false);
            }}
            className={inputClasses}
          />
          {loginError && <p className="text-center text-sm text-red-400">Wrong password.</p>}
          <Button
            variant="solid"
            type="submit"
            disabled={loginStatus === "checking" || !password}
            className="h-11 disabled:opacity-60"
          >
            {loginStatus === "checking" ? "Checking..." : "Log in"}
          </Button>
        </form>
      ) : (
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-white">Issue a Travel Token</h1>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-white/60 underline underline-offset-2 hover:text-white"
            >
              Log out
            </button>
          </div>

          <form onSubmit={handleIssue} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <small className="uppercase text-white/70">Scope</small>
              <div className="flex flex-wrap gap-2">
                {SCOPE_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleScope(key)}
                    aria-pressed={scope.includes(key)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm uppercase transition-colors",
                      scope.includes(key)
                        ? "border-white bg-white text-zinc-950"
                        : "border-white/25 text-white hover:border-white/50"
                    )}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <small className="uppercase text-white/70">Days</small>
                <input
                  type="number"
                  min="0"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <small className="uppercase text-white/70">Hours</small>
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <small className="uppercase text-white/70">Note (optional)</small>
              <input
                type="text"
                placeholder="Who this is for / why"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={inputClasses}
              />
            </div>

            {issueError && <p className="text-sm text-red-400">{issueError}</p>}

            <Button
              variant="solid"
              type="submit"
              disabled={issueStatus === "issuing" || scope.length === 0}
              className="h-11 disabled:opacity-60"
            >
              {issueStatus === "issuing" ? "Issuing..." : "Issue Token"}
            </Button>
          </form>

          {issuedToken && (
            <div className="flex flex-col gap-2 rounded-lg border border-white/15 bg-white/5 p-4">
              <small className="uppercase text-white/60">Token</small>
              <p className="break-all text-sm text-white">{issuedToken}</p>
              <button
                type="button"
                onClick={copyToken}
                className="mt-1 w-fit text-sm text-white/70 underline underline-offset-2 hover:text-white"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <h2 className="text-white">Issued Tokens</h2>
            <AdminTokenList
              tokens={tokens}
              loading={tokensLoading}
              onRevokeToggle={handleRevokeToggle}
              onEditSave={handleEditSave}
            />
          </div>
        </div>
      )}
    </main>
  );
}
