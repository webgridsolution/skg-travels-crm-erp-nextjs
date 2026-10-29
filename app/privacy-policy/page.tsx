import type { Metadata } from "next";
import type { ReactNode } from "react";

// Global styles first (header/footer depend on these)
import "@/app/cms-public.css";
import "@/app/site.css";
// CSS module last so its classes win where they overlap
import styles from "./privacy.module.css";

import Link from "next/link";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  title: "Privacy Policy | SKG Travels",
  description:
    "Read how SKG Travels collects, uses and protects your personal information when you enquire about or book cab services.",
};

const COMPANY = "SKG Travels";
const PHONE = "+91 750-6222-999";
const PHONE_LINK = "+917506222999";
const EMAIL = "skgtravels123@gmail.com";
const ADDRESS =
  "Office No. 170, 1st Floor, Evershine Mall, Link Road, Chincholi Bunder, Malad (W), Mumbai 400 064";
const LAST_UPDATED = "29 October 2026";

type Section = { id: string; title: string; content: ReactNode };

const SECTIONS: Section[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>
          {COMPANY} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides
          local taxi, airport transfer and outstation cab services. This
          Privacy Policy explains what personal information we collect, how we
          use it and the choices you have when you visit our website or contact
          us to enquire about a booking.
        </p>
        <p>
          By using our website or submitting an enquiry, you agree to the
          practices described in this policy.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information we collect",
    content: (
      <>
        <p>We may collect the following information:</p>
        <ul>
          <li>
            <strong>Details you give us:</strong> your name, mobile number,
            email address, pickup and drop locations, travel date, passenger
            count and any notes you add to an enquiry.
          </li>
          <li>
            <strong>Communication records:</strong> messages sent by email,
            phone or WhatsApp when you contact our team.
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, device
            information, pages visited and the time spent on them, collected
            through cookies and similar technologies.
          </li>
        </ul>
        <p>
          We do not ask for payment card details through our enquiry forms.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "3. How we use your information",
    content: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>respond to enquiries and provide quotes;</li>
          <li>confirm, manage and support your bookings;</li>
          <li>share trip details with the assigned driver;</li>
          <li>send service updates and booking-related messages;</li>
          <li>improve our website, services and customer support;</li>
          <li>prevent fraud and meet legal obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. Sharing your information",
    content: (
      <>
        <p>We do not sell your personal information. We may share it with:</p>
        <ul>
          <li>
            <strong>Drivers and travel partners</strong> who need your name,
            contact number and trip details to complete your journey.
          </li>
          <li>
            <strong>Service providers</strong> that help us run our website,
            send messages or analyse site usage, under appropriate
            confidentiality terms.
          </li>
          <li>
            <strong>Authorities</strong> when required by law, court order or
            to protect rights and safety.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies",
    content: (
      <p>
        Our website uses cookies to remember preferences and understand how
        visitors use the site. You can block or delete cookies in your browser
        settings, but some features may not work as expected if you do.
      </p>
    ),
  },
  {
    id: "retention",
    title: "6. Data retention",
    content: (
      <p>
        We keep your information only as long as needed for the purposes in
        this policy, including booking records, accounting and legal
        requirements. After that, we delete or anonymise it.
      </p>
    ),
  },
  {
    id: "security",
    title: "7. Data security",
    content: (
      <p>
        We use reasonable technical and organisational measures to protect your
        information from unauthorised access, loss or misuse. No method of
        transmission or storage is completely secure, so we cannot guarantee
        absolute security.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your choices and rights",
    content: (
      <>
        <p>You may ask us to:</p>
        <ul>
          <li>tell you what personal information we hold about you;</li>
          <li>correct information that is inaccurate or incomplete;</li>
          <li>delete your information, where we are not required to keep it;</li>
          <li>stop sending you promotional messages.</li>
        </ul>
        <p>
          To make a request, contact us using the details in section 11.
        </p>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "9. Third-party links",
    content: (
      <p>
        Our website may link to third-party sites such as WhatsApp or social
        media pages. We are not responsible for their privacy practices, so
        please read their policies before sharing information.
      </p>
    ),
  },
  {
    id: "children",
    title: "10. Children’s privacy",
    content: (
      <p>
        Our services are intended for adults. We do not knowingly collect
        personal information from children under 18 without a parent or
        guardian.
      </p>
    ),
  },
  {
    id: "contact",
    title: "11. Contact us",
    content: (
      <>
        <p>For questions about this policy or your information, contact:</p>
        <address className={styles.address}>
          <strong>{COMPANY}</strong>
          <span>{ADDRESS}</span>
          <a href={`tel:${PHONE_LINK}`}>{PHONE}</a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </address>
      </>
    ),
  },
  {
    id: "changes",
    title: "12. Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. The latest version will
        always be on this page with the updated date at the top.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className={`skg ${styles.page} ${display.variable} ${body.variable}`}>
      <Header />

      <main>
        {/* HERO */}
        <section className={styles.wrap}>
          <div className={styles.hero}>
            <p className={styles.crumb}>
              <Link href="/">Home</Link> / Privacy Policy
            </p>
            <h1>Privacy Policy</h1>
            <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        {/* CONTENT */}
        <section className={styles.wrap}>
          <div className={styles.layout}>
            <nav className={styles.toc} aria-label="On this page">
              <p>On this page</p>
              <ol>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.title.replace(/^\d+\.\s*/, "")}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className={styles.card}>
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} className={styles.section}>
                  <h2>{s.title}</h2>
                  {s.content}
                </section>
              ))}
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
