"use client";

import { useState } from "react";
import { TRAVEL_SECTIONS } from "@/content/travel-reveal";
import { cn } from "@/lib/utils";

const SCOPE_KEYS = Object.keys(TRAVEL_SECTIONS);

const inputClasses =
  "h-9 w-full rounded-md bg-white/10 px-3 text-white outline-none transition-colors focus:border-white/50";

function tokenStatus(record) {
  if (record.revoked) return "revoked";
  if (Date.now() > record.exp) return "expired";
  return "active";
}

const STATUS_STYLES = {
  active: "border-green-400/40 text-green-300",
  expired: "border-white/20 text-white/50",
  revoked: "border-red-400/40 text-red-300",
};

function EditForm({ record, onCancel, onSave }) {
  const [scope, setScope] = useState(record.scope);
  const [note, setNote] = useState(record.note || "");
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleScope = (key) =>
    setScope((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const handleSave = async () => {
    if (scope.length === 0) {
      setError("Pick at least one location");
      return;
    }
    setSaving(true);
    setError("");

    const patch = { scope, note };
    if (Number(days) > 0 || Number(hours) > 0) {
      patch.days = Number(days) || 0;
      patch.hours = Number(hours) || 0;
    }

    const ok = await onSave(patch);
    setSaving(false);
    if (!ok) setError("Failed to save");
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/15 bg-white/5 p-4">
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
                "rounded-full border px-3 py-1.5 text-xs uppercase transition-colors",
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

      <div className="flex flex-col gap-1.5">
        <small className="uppercase text-white/70">Note</small>
        <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClasses} />
      </div>

      <div className="flex flex-col gap-1.5">
        <small className="uppercase text-white/70">
          New lifetime from now (optional — leave blank to keep current expiry)
        </small>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            placeholder="Days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className={inputClasses}
          />
          <input
            type="number"
            min="0"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 flex-1 rounded-full border border-white/25 text-sm text-white transition-colors hover:border-white/50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="h-9 flex-1 rounded-full bg-white text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

function TokenRow({ record, onRevokeToggle, onEditSave }) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const status = tokenStatus(record);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(record.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — token text is still selectable below.
    }
  };

  const handleRevokeToggle = async () => {
    setBusy(true);
    await onRevokeToggle(record.id, !record.revoked);
    setBusy(false);
  };

  if (editing) {
    return (
      <EditForm
        record={record}
        onCancel={() => setEditing(false)}
        onSave={async (patch) => {
          const ok = await onEditSave(record.id, patch);
          if (ok) setEditing(false);
          return ok;
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/15 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {record.scope.map((key) => (
            <span key={key} className="rounded-full border border-white/25 px-2.5 py-0.5 text-xs uppercase text-white">
              {key}
            </span>
          ))}
        </div>
        <span className={cn("shrink-0 rounded-full border px-2.5 py-0.5 text-xs uppercase", STATUS_STYLES[status])}>
          {status}
        </span>
      </div>

      {record.note && <p className="text-sm text-white/80">{record.note}</p>}

      <p className="text-xs text-white/50">
        Issued {new Date(record.issuedAt).toLocaleString()} · Expires {new Date(record.exp).toLocaleString()}
      </p>

      <p className="break-all text-xs text-white/60">{record.token}</p>

      <div className="mt-1 flex flex-wrap gap-3">
        <button type="button" onClick={copy} className="text-sm text-white/70 underline underline-offset-2 hover:text-white">
          {copied ? "Copied" : "Copy token"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-sm text-white/70 underline underline-offset-2 hover:text-white"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleRevokeToggle}
          disabled={busy}
          className="text-sm text-white/70 underline underline-offset-2 hover:text-white disabled:opacity-60"
        >
          {record.revoked ? "Restore" : "Revoke"}
        </button>
      </div>
    </div>
  );
}

export function AdminTokenList({ tokens, loading, onRevokeToggle, onEditSave }) {
  if (loading) {
    return <p className="text-sm text-white/50">Loading tokens...</p>;
  }

  if (tokens.length === 0) {
    return <p className="text-sm text-white/50">No tokens issued yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {tokens.map((record) => (
        <TokenRow key={record.id} record={record} onRevokeToggle={onRevokeToggle} onEditSave={onEditSave} />
      ))}
    </div>
  );
}
