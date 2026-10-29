import "@/app/cms-public.css";
import "@/app/site.css";
import styles from "./coming-soon.module.css";

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

const PHONE = "+91 750-6222-999";
const PHONE_LINK = "+917506222999";
const WHATSAPP = `https://wa.me/${PHONE_LINK}`;

type Props = {
  name: string; // "Hotels" | "Events"
  title: string;
  description: string;
  icon: "hotel" | "events";
  highlights: string[];
};

function Icon({ type }: { type: Props["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 44,
    height: 44,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (type === "hotel") {
    return (
      <svg {...common}>
        <path d="M3 20V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
        <path d="M15 11h4a2 2 0 0 1 2 2v7" />
        <path d="M2 20h20" />
        <path d="M7 10h4M7 14h4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="m12 13 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" />
    </svg>
  );
}

export default function ComingSoon({
  name,
  title,
  description,
  icon,
  highlights,
}: Props) {
  return (
    <div className={`skg ${styles.page} ${display.variable} ${body.variable}`}>
      <Header />

      <main className={styles.wrap}>
        <section className={styles.hero}>
          <span className={styles.iconBox}>
            <Icon type={icon} />
          </span>

          <p className={styles.badge}>Coming soon</p>
          <h1>{title}</h1>
          <p className={styles.lead}>{description}</p>

          <ul className={styles.highlights}>
            {highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <div className={styles.cta}>
            <Link href="/contact" className={styles.btnPrimary}>
              Book a Taxi Instead
            </Link>
            <a
              href={WHATSAPP}
              className={styles.btnGhost}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask on WhatsApp
            </a>
          </div>

          <p className={styles.note}>
            Need help with {name.toLowerCase()} today? Call us on{" "}
            <a href={`tel:${PHONE_LINK}`}>{PHONE}</a>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}