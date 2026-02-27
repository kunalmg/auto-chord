"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    if (!name || !email || !message) {
      setResult({ ok: false, msg: "Please fill all fields" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setResult({
          ok: false,
          msg: data.error || "Failed to send. Try again later.",
        });
      } else {
        setResult({ ok: true, msg: "Message sent via Telegram" });
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch {
      setResult({ ok: false, msg: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm text-white/70">Name</label>
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Email</label>
        <input
          type="email"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Message</label>
        <textarea
          rows={5}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          placeholder="How can we help?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-lime-300 via-cyan-300 to-white px-6 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_25px_rgba(76,231,255,0.45)] disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
      {result ? (
        <div
          className={
            result.ok
              ? "rounded-xl border border-white/10 bg-white/10 p-3 text-center text-xs text-white/80"
              : "rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-xs text-red-200"
          }
        >
          {result.msg}
        </div>
      ) : null}
    </form>
  );
}

