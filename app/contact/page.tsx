import type { Metadata } from "next";

// Global styles first (header/footer depend on these), same as the about page
import "@/app/cms-public.css";
import "@/app/site.css";
// CSS module last so its classes win where they overlap
import styles from "./contact.module.css";

import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/services/EnquiryForm";
import BranchTabs from "@/components/contact/BranchTabs";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--f-display",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-body",
});

export const metadata: Metadata = {
  title: "Contact SKG Travels | Cab Booking in Mumbai",
  description:
    "Contact SKG Travels for local taxi, airport transfer and outstation cab bookings. Call, WhatsApp, email or send an enquiry for a free quote.",
};

const PHONE = "+91 750-6222-999";
const PHONE_LINK = "+917506222999";
const EMAIL = "skgtravels123@gmail.com";

export default function ContactPage() {
  return (
    <div className={`skg ${styles.page} ${display.variable} ${body.variable}`}>
      <Header />

      <main>
        {/* HERO */}
        <section className={styles.wrap}>
          <div className={styles.hero}>
            <p className={styles.eyebrow}>We&apos;re here to help</p>
            <h1>Contact us</h1>
            <p>SKG Travels provides cab services for local travel and outstation tours.</p>
            <p>
              Choose a vehicle that suits your journey and group size. Share
              your trip details and our team will help with your enquiry.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className={styles.wrap}>
          <div className={styles.grid}>
            {/* LEFT COLUMN */}
            <div className={styles.card}>
              <p className={styles.eyebrowSmall}>Talk to our team</p>
              <h2>Get in touch</h2>
              <p className={styles.muted}>
                Reach us directly for booking help and travel questions.
              </p>

              <div className={styles.quick}>
                <a href={`tel:${PHONE_LINK}`} className={styles.quickItem}>
                  <span className={styles.icon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                    </svg>
                  </span>
                  <span>{PHONE}</span>
                </a>

                <a href={`mailto:${EMAIL}`} className={styles.quickItem}>
                  <span className={styles.icon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>
                  <span>{EMAIL}</span>
                </a>
              </div>

              <hr className={styles.divider} />

              {/* Client component: city tabs + address */}
              <BranchTabs />
            </div>

            {/* RIGHT COLUMN */}
            <div className={styles.right}>
              <div className={styles.helpCard}>
                <p className={styles.eyebrowGreen}>Personal assistance</p>
                <h2>Need expert help?</h2>
                <p>Our travel team is happy to help with your booking.</p>

                <a href={`tel:${PHONE_LINK}`} className={styles.helpPhone}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                  {PHONE}
                </a>

                <a href={`mailto:${EMAIL}`} className={styles.helpMail}>
                  {EMAIL}
                </a>
              </div>

              <div className={`${styles.card} ${styles.formCard}`} id="book">
                <p className={styles.eyebrowSmall}>Start your journey</p>
                <h2>Get a Free Quote</h2>
                <p className={styles.muted}>
                  Share your trip details and we&apos;ll get back to you.
                </p>
                <EnquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}