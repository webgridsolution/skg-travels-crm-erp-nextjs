"use client";

import { useState } from "react";
import styles from "@/app/about/about.module.css";

const STEPS = [
  {
    title: "Visit the website",
    text: "Open the SKG Travels booking page and fill in the requested details.",
  },
  {
    title: "Enter your trip",
    text: "Add pickup location, destination, travel date and time, then choose a suitable vehicle. Mention any airport pickup needs.",
  },
  {
    title: "Confirm and pay",
    text: "Review your trip details, pick a payment method and pay. You receive a booking confirmation with your vehicle and driver details.",
  },
];

export function BookingSteps() {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.steps}>
      <div className={styles.stepTabs} role="tablist" aria-label="Booking steps">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={active === i}
            className={`${styles.stepTab} ${active === i ? styles.stepTabOn : ""} ${i < active ? styles.stepDone : ""}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.stepNum}>{i + 1}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>
      <div className={styles.stepPanel} role="tabpanel" key={active}>
        <h3>{STEPS[active].title}</h3>
        <p>{STEPS[active].text}</p>
        <div className={styles.stepNav}>
          <button disabled={active === 0} onClick={() => setActive(active - 1)}>
            Back
          </button>
          <button disabled={active === STEPS.length - 1} onClick={() => setActive(active + 1)}>
            Next step
          </button>
        </div>
      </div>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={styles.faq}>
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q} className={`${styles.faqItem} ${on ? styles.faqOn : ""}`}>
            <button
              className={styles.faqQ}
              aria-expanded={on}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(on ? null : i)}
            >
              <span>{it.q}</span>
              <span className={styles.faqIcon} aria-hidden="true" />
            </button>
            <div id={`faq-${i}`} className={styles.faqA} role="region">
              <div>
                <p>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SERVICES = [
  {
    id: "outstation",
    label: "Outstation trips",
    text: "Well-kept cars for short getaways or longer holidays. Our long-distance taxis give you comfortable, safe travel to wherever you want to go, without the worry.",
    tags: ["One-way & round trip", "Professional drivers", "Clear pricing"],
  },
  {
    id: "city",
    label: "Inside Mumbai",
    text: "Need a cab for a short trip inside the city? Book a ride for the day, for a meeting, or for sightseeing at Marine Drive, Colaba and beyond.",
    tags: ["Local rides", "Sightseeing", "On-time pickup"],
  },
  {
    id: "airport",
    label: "Airport transfers",
    text: "Add airport pickup or drop to your booking. Your driver is there on time, so you can start or end your journey without stress.",
    tags: ["Pickup & drop", "24×7 service", "Driver details shared"],
  },
];

export function ServiceTabs() {
  const [id, setId] = useState(SERVICES[0].id);
  const cur = SERVICES.find((s) => s.id === id)!;
  return (
    <div className={styles.svc}>
      <div className={styles.svcTabs} role="tablist">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={id === s.id}
            className={id === s.id ? styles.svcOn : ""}
            onClick={() => setId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className={styles.svcBody} key={id} role="tabpanel">
        <p>{cur.text}</p>
        <ul>
          {cur.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
