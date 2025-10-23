"use client";
import React, { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="px-4 py-10 sm:px-6 md:px-10 lg:px-16">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have a question or feedback? Send us a message and we’ll get back to you.
        </p>

        <form
          className="grid grid-cols-1 gap-4"
          role="form"
          aria-label="Contact form"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setSuccess(null);
            setError(null);
            const formEl = e.currentTarget as HTMLFormElement;
            const formData = new FormData(formEl);
            const payload = Object.fromEntries(formData.entries());
            try {
              const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              if (!res.ok) throw new Error("Failed to send message");
              setSuccess("✅ Message sent successfully!");
              formEl.reset();
            } catch (err) {
              setError("❌ Failed to send message. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                id="name"
                name="name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-background"
                placeholder="Your name"
                aria-describedby="name-help"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-background"
                placeholder="you@example.com"
                aria-describedby="email-help"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
            <input
              id="subject"
              name="subject"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-background"
              placeholder="How can we help?"
              aria-describedby="subject-help"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-background"
              placeholder="Write your message..."
              aria-describedby="message-help"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-journey text-journey-foreground rounded-lg px-5 py-2 disabled:opacity-60 hover:opacity-90"
              aria-describedby="submit-help"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {success && <span className="text-green-600 text-sm" role="status" aria-live="polite">{success}</span>}
            {error && <span className="text-red-500 text-sm" role="alert" aria-live="assertive">{error}</span>}
          </div>
        </form>
      </section>
    </main>
  );
}