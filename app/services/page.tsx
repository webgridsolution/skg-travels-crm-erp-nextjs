import type { Metadata } from "next";
import "../site.css";
import "../cms-public.css";
import "./mumbai-taxi.css";

import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Fleet from "@/components/services/Fleet";
import Faq from "@/components/services/Faq";
import EnquiryForm from "@/components/services/EnquiryForm";

import {
  PHONE,
  EMAIL,
  intro,
  sections,
  whyIntro,
  why,
  steps,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Best Car Rental & Outstation Cab Service in Mumbai | SKG Travels",
  description:
    "SKG Travels offers local cabs, outstation taxis and airport drop in Mumbai at transparent fares starting Rs.11 per KM. Book 24x7.",
};

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ICON_PATHS = {
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6",
  plane: "m2 14 8-2-3-8h2l6 7 5-1.5a1.5 1.5 0 0 1 .8 2.9L14 15l-1 6h-2l-1-6-8-1Z",
  phone: "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1l-2.2 2.23Z",
  mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
  shield: "M12 3 4 6v6c0 4.5 3.3 8 8 9 4.7-1 8-4.5 8-9V6l-8-3Zm-1 12-3-3 1.2-1.2L11 12.6l4-4L16.2 10 11 15Z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5h-2v6l5 3 1-1.7-4-2.3V7Z",
  tag: "M3 12V4h8l10 10-8 8L3 12Zm5-5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
  user: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5Z",
} as const;

type IconName = keyof typeof ICON_PATHS;

const Icon = ({ name }: { name: IconName }) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={ICON_PATHS[name]} />
  </svg>
);

const stats: { icon: IconName; v: string; l: string }[] = [
  { icon: "tag", v: "Rs.11", l: "Fares from / KM" },
  { icon: "clock", v: "24x7", l: "Open 365 days" },
  { icon: "user", v: "Pro", l: "Licensed drivers" },
  { icon: "shield", v: "Safe", l: "Clean, serviced cars" },
];

const TEL = `tel:${PHONE.replace(/[^+\d]/g, "")}`;

export default function MumbaiTaxiPage() {
  return (
    <div className={`skg mt-page ${font.className}`}>
      <Header />

      <main>
        {/* HERO */}
        <section className="mt-hero">
          <div className="mt-container">
            <nav className="mt-crumbs" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/cities">Cities</a>
              <span>/</span>
              <b>Mumbai</b>
            </nav>

            <span className="mt-eyebrow mt-eyebrow-light">
              Car Rental • Outstation • Airport Drop
            </span>

            <h1>
              SKG Travels: The Leading and Reliable{" "}
              <em>Car Rental Company</em> in Mumbai
            </h1>

            <p className="mt-hero-sub">
              Clean cars, professional drivers and clear fares for local,
              outstation and airport trips.
            </p>

            <div className="mt-hero-cta">
              <a href="#quote" className="mt-btn">
                Get a Free Quote
              </a>
              <a href={TEL} className="mt-btn mt-btn-ghost">
                <Icon name="phone" /> {PHONE}
              </a>
            </div>

            <ul className="mt-stats">
              {stats.map((s) => (
                <li key={s.l}>
                  <span className="mt-stat-icon">
                    <Icon name={s.icon} />
                  </span>
                  <div>
                    <strong>{s.v}</strong>
                    <small>{s.l}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-container mt-layout">
          {/* MAIN CONTENT */}
          <div className="mt-main">
            <section className="mt-card mt-intro">
              {intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>

            <div className="mt-services">
              {sections.map((s) => (
                <article key={s.title} className="mt-card mt-service">
                  <span className="mt-service-icon">
                    <Icon name={s.icon as IconName} />
                  </span>
                  <h2>{s.title}</h2>
                  <p>{s.text}</p>
                  <a href="#quote" className="mt-link">
                    Book now →
                  </a>
                </article>
              ))}
            </div>

            <Fleet />

            {/* WHY CHOOSE US */}
            <section className="mt-why">
              <header className="mt-section-head mt-left">
                <span className="mt-eyebrow">Why choose us</span>
                <h2>
                  Why SKG Travels is the best outstation cab service in Mumbai
                </h2>
                <p>{whyIntro}</p>
              </header>

              <div className="mt-why-grid">
                {why.map((w, i) => (
                  <article key={w.t} className="mt-why-card">
                    <span className="mt-why-num">{i + 1}</span>
                    <h3>{w.t}</h3>
                    <p>{w.d}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* HOW TO BOOK */}
            <section className="mt-how">
              <header className="mt-section-head mt-left">
                <span className="mt-eyebrow">Simple process</span>
                <h2>How to book cheapest taxi service in Mumbai</h2>
                <p>
                  For hiring car rental services in Mumbai, take a small review
                  and then follow the given steps for booking:
                </p>
              </header>

              <ol className="mt-steps">
                {steps.map((s, i) => (
                  <li key={s.t}>
                    <span className="mt-step-dot">{i + 1}</span>
                    <div>
                      <h3>{s.t}</h3>
                      <p>{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <Faq />
          </div>

          {/* SIDEBAR */}
          <aside className="mt-side">
            <div className="mt-card mt-quote" id="quote">
              <span className="mt-eyebrow">Start your journey</span>
              <h3>Get a Free Quote</h3>
              <p>Share your trip details and we&apos;ll get back to you.</p>
              <EnquiryForm />
            </div>

            <div className="mt-card mt-help">
              <h4>Need Experts Help?</h4>
              <small>WE WOULD BE HAPPY TO HELP YOU!</small>
              <a href={TEL}>
                <Icon name="phone" /> {PHONE}
              </a>
              <a href={`mailto:${EMAIL}`} className="mt-help-mail">
                <Icon name="mail" /> {EMAIL}
              </a>
            </div>

            <div className="mt-promo">
              <span className="mt-promo-tag">Limited time offer</span>
              <div className="mt-promo-big">
                <sup>₹</sup>100 <span>OFF</span>
              </div>
              <p className="mt-promo-on">ON</p>
              <h4>OUTSTATION</h4>
              <p>Car Rental</p>
              <a href="#quote" className="mt-btn mt-btn-dark">
                BOOK NOW
              </a>
            </div>
          </aside>
        </div>

        {/* MOBILE STICKY CTA */}
        <div className="mt-sticky-cta">
          <a href={TEL} className="mt-btn mt-btn-ghost-dark">
            Call Now
          </a>
          <a href="#quote" className="mt-btn">
            Get Quote
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
