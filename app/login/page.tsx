"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import "../login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Unable to sign in.");
      router.push("/dashboard");
      router.refresh();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="lg-page">
      {/* ───────── Left: form ───────── */}
      <section className="lg-panel">
        <div className="lg-panel-inner">
          <div className="lg-brand">
            <div className="lg-logo"><Image
                            src="/images/logo.png"
                            alt="SKG Travels Logo"
                            width={55}
                            height={55}
                            priority
                            className="brand-logo"
                        /></div>
            <div>
              <b>SKG TRAVELS</b>
              <small>CRM &amp; Operations</small>
            </div>
          </div>

          <div className="lg-copy">
            <span className="lg-eyebrow">WELCOME BACK</span>
            <h1>
              Run your day, <em>with clarity.</em>
            </h1>
            <p>
              Sign in to manage bookings, fleet, customers and finance in one
              secure workspace.
            </p>
          </div>

          <form onSubmit={submit} className="lg-form" noValidate={false}>
            <div className="lg-field">
              <label htmlFor="lg-email">Email address</label>
              <div className="lg-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
                <input
                  id="lg-email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="lg-field">
              <label htmlFor="lg-password">Password</label>
              <div className="lg-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="10" rx="3" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  id="lg-password"
                  type={show ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="lg-eye"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  aria-pressed={show}
                >
                  {show ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.2 9.5 6a12.5 12.5 0 0 1-2.6 3.2M6.3 7.6A12.6 12.6 0 0 0 2.5 12c1 1.8 4.5 6 9.5 6 1.5 0 2.8-.4 4-1" />
                      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2.5 12C3.5 10.2 7 6 12 6s8.5 4.2 9.5 6c-1 1.8-4.5 6-9.5 6s-8.5-4.2-9.5-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="lg-error" role="alert">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16.5v.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button disabled={busy} type="submit" className="lg-submit">
              {busy ? (
                <>
                  <i className="lg-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in securely
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="lg-foot">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6l-7-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Protected workspace <i /> <a href="https://webgridsolution.com" target="_blank" rel="noopener noreferrer" style={{textDecoration: "none"}}>
              Developed By Webgridsolution
            </a>
          </div>
        </div>
      </section>

      {/* ───────── Right: showcase ───────── */}
      <aside className="lg-art" aria-hidden="true">
        <div className="lg-orb lg-orb-a" />
        <div className="lg-orb lg-orb-b" />
        <div className="lg-grid" />

        <svg className="lg-route" viewBox="0 0 600 420" fill="none">
          <path
            className="lg-route-line"
            d="M40 340C120 340 150 230 240 230S350 330 420 260 520 90 570 70"
          />
          <circle cx="40" cy="340" r="7" className="lg-pin lg-pin-a" />
          <circle cx="240" cy="230" r="6" className="lg-pin" />
          <circle cx="420" cy="260" r="6" className="lg-pin" />
          <circle cx="570" cy="70" r="8" className="lg-pin lg-pin-b" />
        </svg>

        <div className="lg-art-content">
          <span className="lg-eyebrow lg-eyebrow-light">SKG TRAVELS</span>
          <h2>
            From the first enquiry
            <br />
            to the final mile.
          </h2>
          <p>One connected operating system for every journey.</p>

          <div className="lg-cards">
            <div className="lg-glass lg-glass-1">
              <span className="lg-glass-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M5 17h14M6 17l1.5-6h9L18 17M8 17v2M16 17v2M9 11l1-3h4l1 3" />
                </svg>
              </span>
              <div>
                <b>18 vehicles</b>
                <small>on the road today</small>
              </div>
            </div>
            <div className="lg-glass lg-glass-2">
              <span className="lg-glass-icon lg-green">
                <svg viewBox="0 0 24 24">
                  <path d="m5 12 4.5 4.5L19 7" />
                </svg>
              </span>
              <div>
                <b>42 bookings</b>
                <small>confirmed this week</small>
              </div>
            </div>
          </div>

          <div className="lg-stats">
            <div>
              <b>360°</b>
              <small>visibility</small>
            </div>
            <div>
              <b>01</b>
              <small>connected workspace</small>
            </div>
            <div>
              <b>24/7</b>
              <small>trip operations</small>
            </div>
          </div>
        </div>

        <div className="lg-art-footer">TRAVEL WELL. OPERATE SMARTER.</div>
      </aside>
    </main>
  );
}