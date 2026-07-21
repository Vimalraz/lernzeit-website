"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function ContactForm({
  kind = "contact",
  messagePlaceholder = "How can we help?",
  submitLabel = "Send message",
}: {
  kind?: "contact" | "bulk";
  messagePlaceholder?: string;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "/api/contact";
      const isFormspree = endpoint.includes("formspree.io");
      
      const bodyData = isFormspree 
        ? {
            ...data,
            _subject: kind === "bulk" ? "Bulk order request" : `LernZeit contact from ${data.name}`,
          }
        : { ...data, kind };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(bodyData),
      });
      
      if (!res.ok) {
        let errMsg = "Something went wrong.";
        try {
          const json = await res.json();
          errMsg = json.error ?? json.errors?.[0]?.message ?? errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-tile bg-teal-soft p-8 text-center">
        <p className="text-lg font-bold text-teal-deep">Thank you — message received.</p>
        <p className="mt-2 text-[15px] text-ink-soft">
          We read every message and usually reply within two working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-ink-soft">
            Your name
          </span>
          <input
            required
            name="name"
            autoComplete="name"
            placeholder={kind === "bulk" ? "Name" : "Your name"}
            className="mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3 text-[15px] outline-none transition-colors focus:border-teal"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-ink-soft">
            {kind === "bulk" ? "Email address" : "Email"}
          </span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder={kind === "bulk" ? "Work email" : "Your email"}
            className="mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3 text-[15px] outline-none transition-colors focus:border-teal"
          />
        </label>
      </div>
      {kind === "bulk" && (
        <label className="block">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-ink-soft">
            School / Organisation
          </span>
          <input
            name="organisation"
            autoComplete="organization"
            placeholder="School, centre or company name"
            className="mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3 text-[15px] outline-none transition-colors focus:border-teal"
          />
        </label>
      )}
      <label className="block">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-ink-soft">
          Message
        </span>
        <textarea
          required
          name="message"
          rows={4}
          placeholder={messagePlaceholder}
          className="mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3 text-[15px] outline-none transition-colors focus:border-teal"
        />
      </label>
      {status === "error" && (
        <p className="text-[14px] font-medium text-accent-deep" role="alert">
          {error} You can also email us at {site.contactEmail}.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-ink px-8 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-accent disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
